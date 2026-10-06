// ─── AI (direct Anthropic API with the user's own key) ───────────────────────
const VOICE_LANG = {pt:"pt-BR",en:"en-US",de:"de-DE",es:"es-ES",fr:"fr-FR",tr:"tr-TR",it:"it-IT"};
const LS = {
  get:(k)=>{ try{ return localStorage.getItem(k)||""; }catch{ return ""; } },
  set:(k,v)=>{ try{ v?localStorage.setItem(k,v):localStorage.removeItem(k); }catch{} },
};
const KEY_LS = "echefe_api_key";
const MODEL_LS = "echefe_model";
const MODELS = ["claude-sonnet-4-5","claude-sonnet-5-5","claude-haiku-4-5-20251001"];

const shrinkImage = (file)=>new Promise((res,rej)=>{
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = ()=>{
    const max = 1280, sc = Math.min(1, max/Math.max(img.width,img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width*sc); c.height = Math.round(img.height*sc);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    URL.revokeObjectURL(url);
    res(c.toDataURL("image/jpeg",0.82).split(",")[1]);
  };
  img.onerror = ()=>{ URL.revokeObjectURL(url); rej({code:"image_rejected"}); };
  img.src = url;
});

const mergeTurns = (turns)=>{
  const out=[];
  for(const t of turns){
    const last=out[out.length-1];
    if(last&&last.role===t.role) last.content += "\n\n"+t.content;
    else out.push({role:t.role,content:t.content});
  }
  if(out.length&&out[0].role!=="user") out.shift();
  return out;
};

async function callModel(model, key, messages, maxTokens){
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      "x-api-key":key,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true",
    },
    body:JSON.stringify({model,max_tokens:maxTokens,messages}),
  });
  let data=null; try{ data=await res.json(); }catch{}
  return {status:res.status,data};
}

async function askAI(input, opts, asJson){
  opts = opts||{};
  const key = LS.get(KEY_LS).trim();
  if(!key) throw {code:"no_key"};
  const messages = typeof input==="string" ? [{role:"user",content:input}] : mergeTurns(input);
  if(opts.images){
    const b64 = await shrinkImage(opts.images);
    const last = messages[messages.length-1];
    last.content = [{type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},{type:"text",text:last.content}];
  }
  const saved = LS.get(MODEL_LS);
  const order = saved ? [saved,...MODELS.filter(m=>m!==saved)] : MODELS;
  let r;
  try{
    for(const model of order){
      r = await callModel(model, key, messages, asJson?1200:900);
      const t = r.data&&r.data.error&&r.data.error.type;
      if(r.status===404 || t==="not_found_error" || (r.status===400 && /model/i.test((r.data&&r.data.error&&r.data.error.message)||""))) continue;
      if(r.status===200) LS.set(MODEL_LS, model);
      break;
    }
  }catch{ throw {code:"offline"}; }
  if(!r||r.status!==200){
    const msg = (r&&r.data&&r.data.error&&r.data.error.message)||"";
    if(r&&r.status===401) throw {code:"bad_key"};
    if(r&&r.status===403) throw {code:"bad_key"};
    if(/credit balance/i.test(msg)) throw {code:"no_credit"};
    if(r&&r.status===429) throw {code:"rate_limited"};
    throw {code:"upstream_error"};
  }
  const text = (r.data.content||[]).map(b=>b.text||"").join("").trim();
  if(!text) throw {code:"empty"};
  if(!asJson){ opts.onText&&opts.onText({text,delta:text}); return {text,truncated:r.data.stop_reason==="max_tokens"}; }
  const clean = text.replace(/```json|```/g,"");
  const a = Math.min(...["{","["].map(c=>{const i=clean.indexOf(c);return i<0?1e9:i;}));
  const b = Math.max(clean.lastIndexOf("}"),clean.lastIndexOf("]"));
  try{ return JSON.parse(clean.slice(a,b+1)); }catch{ throw {code:"invalid_json"}; }
}

const AI_ERR = (code)=>({
  no_key:"Para eu responder, cole a sua chave da API na aba 👤 Perfil (é só uma vez). 🔑",
  bad_key:"A chave da API não foi aceita. Confira na aba 👤 Perfil. 🔑",
  no_credit:"Sua conta da Anthropic está sem crédito. Adicione crédito em console.anthropic.com → Billing. 💳",
  rate_limited:"Muitas perguntas seguidas — espere um pouquinho e tente de novo. ⏳",
  offline:"Sem internet no momento. Confira a conexão. 📶",
  image_rejected:"Não consegui ler essa foto. Tente outra. 📷",
  invalid_json:"Não entendi bem a foto. Tire outra, por favor! 📸",
}[code]||"Ops! Tive um problema. Tente de novo. 🙏");

// ─── VOICE ENGINE: always listening for "Ei Chef" ─────────────────────────────
const WAKE_RE = /\b(ei|ey|hey|hei|oi|e aí|aí|ai|ê|é)[\s,!.]*(chef|chefe|chefs|xefe|chefi|shef|shefe)\b[\s,!.:?]*/i;

function useVoiceEngine(lang, onCommand){
  const SR = typeof window!=="undefined" && (window.SpeechRecognition||window.webkitSpeechRecognition);
  const [state, setState] = useState(SR?"starting":"unsupported"); // starting|listening|need_tap|blocked|unsupported|off
  const [awaiting, setAwaiting] = useState(false);
  const [heard, setHeard] = useState("");
  const wantOn = useRef(true), speaking = useRef(false), recog = useRef(null);
  const awaitUntil = useRef(0), wakeLock = useRef(null), cmdRef = useRef(onCommand), langRef = useRef(lang);
  const restartTimer = useRef(null), startedOk = useRef(false);
  cmdRef.current = onCommand; langRef.current = lang;

  const setAwait = (ms)=>{ awaitUntil.current = ms?Date.now()+ms:0; setAwaiting(!!ms); };

  const lockScreen = async()=>{
    try{ if(navigator.wakeLock&&!wakeLock.current){ wakeLock.current = await navigator.wakeLock.request("screen"); wakeLock.current.addEventListener("release",()=>{wakeLock.current=null;}); } }catch{}
  };

  const handleFinal = (said)=>{
    said = said.trim(); if(!said) return;
    const m = said.match(WAKE_RE);
    if(m){
      const rest = said.slice(m.index+m[0].length).trim();
      if(rest.length>2){ setAwait(0); cmdRef.current(rest); }
      else { setAwait(9000); cmdRef.current(null); }
      return;
    }
    if(Date.now()<awaitUntil.current){ setAwait(0); cmdRef.current(said); }
  };

  const start = ()=>{
    if(!SR) { setState("unsupported"); return; }
    if(speaking.current || recog.current) return;
    clearTimeout(restartTimer.current);
    const r = new SR();
    r.lang = VOICE_LANG[langRef.current]||"pt-BR";
    r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
    r.onstart = ()=>{ startedOk.current=true; setState("listening"); lockScreen(); };
    r.onresult = (ev)=>{
      let interim="";
      for(let i=ev.resultIndex;i<ev.results.length;i++){
        const res = ev.results[i];
        if(res.isFinal){ setHeard(""); handleFinal(res[0].transcript); }
        else interim += res[0].transcript;
      }
      if(interim) setHeard(interim);
    };
    r.onerror = (ev)=>{
      if(ev.error==="not-allowed"||ev.error==="service-not-allowed"){
        // Chrome blocks auto-start without a tap on some phones: ask for one tap.
        wantOn.current = startedOk.current ? false : true;
        setState(startedOk.current?"blocked":"need_tap");
      }
    };
    r.onend = ()=>{
      recog.current = null;
      if(wantOn.current && !speaking.current && document.visibilityState==="visible"){
        restartTimer.current = setTimeout(start, 250);
      } else if(!wantOn.current) setState(s=>s==="blocked"||s==="need_tap"?s:"off");
    };
    try{ r.start(); recog.current = r; }
    catch{ recog.current=null; setState("need_tap"); }
  };

  const stopRecog = ()=>{ clearTimeout(restartTimer.current); try{ recog.current&&recog.current.abort(); }catch{} recog.current=null; };

  const enable = ()=>{ wantOn.current=true; setState("starting"); stopRecog(); start(); };
  const disable = ()=>{ wantOn.current=false; stopRecog(); setAwait(0); setState("off"); try{wakeLock.current&&wakeLock.current.release();}catch{} };

  const pickVoice = (lc)=>{
    try{ const vs = window.speechSynthesis.getVoices(); return vs.find(v=>v.lang===lc) || vs.find(v=>v.lang&&v.lang.slice(0,2)===lc.slice(0,2)) || null; }catch{ return null; }
  };

  const speak = (text, thenListen)=>{
    if(!window.speechSynthesis){ if(thenListen) setAwait(9000); return; }
    const clean = String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}*#_`>|]/gu,"").replace(/\s+/g," ").trim().slice(0,900);
    if(!clean) return;
    speaking.current = true; stopRecog();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const lc = VOICE_LANG[langRef.current]||"pt-BR";
    u.lang = lc; const v = pickVoice(lc); if(v) u.voice = v;
    u.rate = 1.03;
    const after = ()=>{ speaking.current=false; if(thenListen) setAwait(9000); if(wantOn.current) start(); };
    u.onend = after; u.onerror = after;
    window.speechSynthesis.speak(u);
  };

  // talk-now button: skip the wake word once
  const askNow = ()=>{
    if(state==="need_tap"||state==="blocked"||state==="off"){ enable(); setAwait(12000); return; }
    setAwait(12000);
  };

  useEffect(()=>{
    if(!SR) return;
    start();
    const vis = ()=>{ if(document.visibilityState==="visible"&&wantOn.current){ lockScreen(); if(!recog.current&&!speaking.current) start(); } };
    document.addEventListener("visibilitychange",vis);
    // a first tap anywhere unlocks auto-start on phones that require it
    const firstTap = ()=>{ if(wantOn.current && !recog.current && !speaking.current) start(); };
    document.addEventListener("pointerdown",firstTap);
    try{ window.speechSynthesis&&window.speechSynthesis.getVoices(); }catch{}
    return ()=>{ document.removeEventListener("visibilitychange",vis); document.removeEventListener("pointerdown",firstTap); stopRecog(); };
  },[]);

  useEffect(()=>{ if(recog.current){ stopRecog(); if(wantOn.current) start(); } },[lang]);

  return {state, awaiting, heard, speak, enable, disable, askNow, supported:!!SR};
}

function VoiceBar({ v, chefName }){
  let label, color="#8A6A40", bg="rgba(20,14,0,.92)", pulse=false;
  if(v.state==="unsupported"){ label="🎙️ Voz indisponível neste navegador — abra no Google Chrome"; }
  else if(v.state==="need_tap"){ label="🎙️ Toque aqui para ligar o “Ei Chef”"; color="#fff"; bg="#FF6B00"; pulse=true; }
  else if(v.state==="blocked"){ label="🎙️ Microfone bloqueado — toque no 🔒 da barra do Chrome → Permissões → Microfone"; color="#FFB800"; }
  else if(v.state==="off"){ label="🔇 “Ei Chef” desligado — toque para ligar"; }
  else if(v.awaiting){ label = v.heard?`🗣️ ${v.heard}`:`👂 ${chefName} está ouvindo… fale agora`; color="#fff"; bg="#27AE60"; pulse=true; }
  else if(v.state==="listening"){ label = v.heard?`🗣️ ${v.heard}`:"🎙️ Diga “Ei Chef…” a qualquer momento"; color="#FFF5E0"; }
  else { label="🎙️ Ligando o microfone…"; }
  const tap = ()=>{
    if(v.state==="need_tap"||v.state==="off"||v.state==="blocked") v.enable();
    else if(v.state==="listening") v.askNow();
  };
  return (
    <button onClick={tap} style={{flexShrink:0,width:"100%",border:"none",borderBottom:"1px solid #3D2800",background:bg,color,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,padding:"8px 14px",paddingTop:"calc(8px + env(safe-area-inset-top))",textAlign:"center",cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",zIndex:120,animation:pulse?"cookPulse 1.4s infinite":"none"}}>
      {label}
    </button>
  );
}

