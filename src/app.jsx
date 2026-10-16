
const { useState, useRef, useEffect, useCallback } = React;

const T = {
  bg:"#0F0A00", card:"#1E1400", border:"#3D2800",
  accent:"#FF6B00", gold:"#FFB800", cream:"#FFF5E0",
  muted:"#8A6A40", textSub:"#C4965A", green:"#00C864",
};

const LANGS = {
  pt:{ flag:"🇧🇷", name:"Português",
    recipes:"Receitas", home:"Início", chat:"Chef IA", week:"Semana", shop:"Compras", profile:"Perfil",
    heroTitle:"Ei, Chef! O que vamos cozinhar?", heroSub:"Texto, foto ou voz — estou aqui!",
    quickSug:"Sugestões rápidas", sendPhoto:"📷 Enviar foto",
    typeMsg:"Escreva para o Chef...", shopList:"Lista de Compras",
    weekPlan:"Cardápio da Semana", lunch:"Almoço", dinner:"Jantar",
    addItem:"Adicionar item...", clearDone:"Limpar concluídos",
    generate:"🔄 Gerar cardápio com IA", shopGen:"🛒 Gerar lista de compras",
    langSelect:"Idioma do App", chefSelect:"Estilo do Chef",
    save:"✅ Salvar", cuisine:"Culinária da semana", diet:"Dieta",
    level:"Nível", appliance:"Equipamento principal", seeAll:"Ver tudo",
    cookMode:"🍳 Modo Cozinha", exitCook:"← Sair",
    snapBtn:"📸 Tirar Foto Agora", analyzing:"⏳ Analisando...",
    ingredientsBtn:"🥕 Analisar ingredientes", analyzePhoto:"📷 Analisando ingredientes",
    days:["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"],
    greeting:"Meu truta, o que vamos cozinhar hoje? 👨‍🍳\n\nMe mostra os ingredientes que você tem aí (📷 foto ou é só falar) e vamos preparar uma comida caprichada!",
    chips:["O que fazer com frango?","Receita rápida 30 min","Como usar airfryer?","Cardápio da semana"],
    system:`Você é o eChefe, um chef assistente ESPECIALIZADO em culinária e APENAS culinária.
REGRAS: Responda APENAS sobre receitas, ingredientes, técnicas, equipamentos (fogão, forno, airfryer, churrasqueira, etc), planejamento de refeições, lista de compras. Se perguntarem outro assunto, redirecione de forma divertida para culinária. Seja divertido, encorajador e apaixonado por comida. Adapte instruções do iniciante ao profissional. Responda sempre em Português do Brasil.`},

  en:{ flag:"🇬🇧", name:"English",
    recipes:"Recipes", home:"Home", chat:"AI Chef", week:"Week", shop:"Shopping", profile:"Profile",
    heroTitle:"Hey Chef! What shall we cook?", heroSub:"Text, photo or voice — I'm here!",
    quickSug:"Quick suggestions", sendPhoto:"📷 Send photo",
    typeMsg:"Write to the Chef...", shopList:"Shopping List",
    weekPlan:"Weekly Menu", lunch:"Lunch", dinner:"Dinner",
    addItem:"Add item...", clearDone:"Clear completed",
    generate:"🔄 Generate menu with AI", shopGen:"🛒 Generate shopping list",
    langSelect:"App Language", chefSelect:"Chef Style",
    save:"✅ Save", cuisine:"Weekly cuisine", diet:"Diet",
    level:"Level", appliance:"Main appliance", seeAll:"See all",
    cookMode:"🍳 Cooking Mode", exitCook:"← Exit",
    snapBtn:"📸 Take Photo Now", analyzing:"⏳ Analyzing...",
    ingredientsBtn:"🥕 Analyze ingredients", analyzePhoto:"📷 Analyzing ingredients",
    days:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    greeting:"Hello! I'm eChefe, your personal chef companion! 👨‍🍳\n\nTell me what you have, send a photo of ingredients, or ask me anything about cooking.\n\nReady to cook? Tap 🍳 Cooking Mode for step-by-step guidance!",
    chips:["What to do with chicken?","Quick 30 min recipe","How to use airfryer?","Week meal plan"],
    system:`You are eChefe, a chef assistant specialized EXCLUSIVELY in culinary arts. RULES: Answer ONLY about recipes, ingredients, cooking techniques, kitchen appliances (stove, oven, airfryer, BBQ, etc), meal planning, shopping lists. If asked about anything else, redirect to cooking in a fun way. Be fun, encouraging and passionate about food. Always answer in English.`},

  de:{ flag:"🇩🇪", name:"Deutsch",
    recipes:"Rezepte", home:"Start", chat:"KI-Koch", week:"Woche", shop:"Einkauf", profile:"Profil",
    heroTitle:"Hey Chef! Was kochen wir?", heroSub:"Text, Foto oder Stimme — ich bin hier!",
    quickSug:"Schnelle Vorschläge", sendPhoto:"📷 Foto senden",
    typeMsg:"An den Koch schreiben...", shopList:"Einkaufsliste",
    weekPlan:"Wochenspeiseplan", lunch:"Mittagessen", dinner:"Abendessen",
    addItem:"Artikel hinzufügen...", clearDone:"Erledigte löschen",
    generate:"🔄 Menü mit KI erstellen", shopGen:"🛒 Einkaufsliste erstellen",
    langSelect:"App-Sprache", chefSelect:"Koch-Stil",
    save:"✅ Speichern", cuisine:"Wochenküche", diet:"Diät",
    level:"Level", appliance:"Hauptgerät", seeAll:"Alle sehen",
    cookMode:"🍳 Koch-Modus", exitCook:"← Zurück",
    snapBtn:"📸 Foto aufnehmen", analyzing:"⏳ Analysiere...",
    ingredientsBtn:"🥕 Zutaten analysieren", analyzePhoto:"📷 Zutaten werden analysiert",
    days:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    greeting:"Hallo! Ich bin eChefe, dein persönlicher Koch-Assistent! 👨‍🍳\n\nSag mir was du hast, schick ein Foto der Zutaten, oder frag mich alles über Kochen.\n\nBereit zum Kochen? Tippe auf 🍳 Koch-Modus für Schritt-für-Schritt Anleitung!",
    chips:["Was mit Hähnchen machen?","Schnelles 30-Min Rezept","Wie Airfryer benutzen?","Wochenmenü"],
    system:`Sie sind eChefe, ein Koch-Assistent spezialisiert AUSSCHLIESSLICH auf Kulinarik. REGELN: Antworten Sie NUR über Rezepte, Zutaten, Kochtechniken, Küchengeräte. Bei anderen Themen zurück zur Küche leiten. Immer auf Deutsch antworten.`},

  es:{ flag:"🇪🇸", name:"Español",
    recipes:"Recetas", home:"Inicio", chat:"Chef IA", week:"Semana", shop:"Compras", profile:"Perfil",
    heroTitle:"¡Ei Chef! ¿Qué cocinamos?", heroSub:"¡Texto, foto o voz — aquí estoy!",
    quickSug:"Sugerencias rápidas", sendPhoto:"📷 Enviar foto",
    typeMsg:"Escribe al Chef...", shopList:"Lista de Compras",
    weekPlan:"Menú Semanal", lunch:"Almuerzo", dinner:"Cena",
    addItem:"Agregar elemento...", clearDone:"Borrar completados",
    generate:"🔄 Generar menú con IA", shopGen:"🛒 Generar lista de compras",
    langSelect:"Idioma de la App", chefSelect:"Estilo del Chef",
    save:"✅ Guardar", cuisine:"Cocina semanal", diet:"Dieta",
    level:"Nivel", appliance:"Aparato principal", seeAll:"Ver todo",
    cookMode:"🍳 Modo Cocina", exitCook:"← Salir",
    snapBtn:"📸 Tomar Foto Ahora", analyzing:"⏳ Analizando...",
    ingredientsBtn:"🥕 Analizar ingredientes", analyzePhoto:"📷 Analizando ingredientes",
    days:["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],
    greeting:"¡Hola! Soy eChefe, ¡tu chef compañero! 👨‍🍳\n\nDime qué tienes, envía una foto de los ingredientes, o pregúntame cualquier cosa sobre cocina.\n\n¿Listo para cocinar? ¡Toca 🍳 Modo Cocina para guía paso a paso!",
    chips:["¿Qué hacer con pollo?","Receta rápida 30 min","¿Cómo usar airfryer?","Menú de la semana"],
    system:`Eres eChefe, un asistente de chef especializado EXCLUSIVAMENTE en artes culinarias. REGLAS: Responde SOLO sobre recetas, ingredientes, técnicas, electrodomésticos, planificación. Responde siempre en Español.`},

  fr:{ flag:"🇫🇷", name:"Français",
    recipes:"Recettes", home:"Accueil", chat:"Chef IA", week:"Semaine", shop:"Courses", profile:"Profil",
    heroTitle:"Eh Chef! Que cuisinons-nous?", heroSub:"Texte, photo ou voix — je suis là!",
    quickSug:"Suggestions rapides", sendPhoto:"📷 Envoyer photo",
    typeMsg:"Écrire au Chef...", shopList:"Liste de Courses",
    weekPlan:"Menu Hebdomadaire", lunch:"Déjeuner", dinner:"Dîner",
    addItem:"Ajouter un article...", clearDone:"Effacer terminés",
    generate:"🔄 Générer menu avec IA", shopGen:"🛒 Générer liste de courses",
    langSelect:"Langue de l'App", chefSelect:"Style du Chef",
    save:"✅ Sauvegarder", cuisine:"Cuisine de la semaine", diet:"Régime",
    level:"Niveau", appliance:"Appareil principal", seeAll:"Voir tout",
    cookMode:"🍳 Mode Cuisine", exitCook:"← Sortir",
    snapBtn:"📸 Prendre Photo", analyzing:"⏳ Analyse...",
    ingredientsBtn:"🥕 Analyser ingrédients", analyzePhoto:"📷 Analyse des ingrédients",
    days:["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
    greeting:"Bonjour! Je suis eChefe, votre compagnon chef personnel! 👨‍🍳\n\nDites-moi ce que vous avez, envoyez une photo ou demandez-moi n'importe quoi sur la cuisine.\n\nPrêt à cuisiner? Appuyez sur 🍳 Mode Cuisine!",
    chips:["Que faire avec du poulet?","Recette rapide 30 min","Comment utiliser airfryer?","Menu de la semaine"],
    system:`Vous êtes eChefe, un assistant chef spécialisé EXCLUSIVEMENT dans les arts culinaires. RÈGLES: Répondez UNIQUEMENT sur recettes, ingrédients, techniques, appareils. Répondez toujours en Français.`},

  tr:{ flag:"🇹🇷", name:"Türkçe",
    recipes:"Tarifler", home:"Ana Sayfa", chat:"Şef YZ", week:"Hafta", shop:"Alışveriş", profile:"Profil",
    heroTitle:"Ei Şef! Ne pişirelim?", heroSub:"Metin, fotoğraf veya ses — buradayım!",
    quickSug:"Hızlı öneriler", sendPhoto:"📷 Fotoğraf gönder",
    typeMsg:"Şefe yaz...", shopList:"Alışveriş Listesi",
    weekPlan:"Haftalık Menü", lunch:"Öğle", dinner:"Akşam",
    addItem:"Öğe ekle...", clearDone:"Tamamlananları sil",
    generate:"🔄 YZ ile menü oluştur", shopGen:"🛒 Alışveriş listesi oluştur",
    langSelect:"Uygulama Dili", chefSelect:"Şef Stili",
    save:"✅ Kaydet", cuisine:"Haftalık mutfak", diet:"Diyet",
    level:"Seviye", appliance:"Ana cihaz", seeAll:"Tümünü gör",
    cookMode:"🍳 Pişirme Modu", exitCook:"← Çıkış",
    snapBtn:"📸 Şimdi Fotoğraf Çek", analyzing:"⏳ Analiz ediliyor...",
    ingredientsBtn:"🥕 Malzemeleri analiz et", analyzePhoto:"📷 Malzemeler analiz ediliyor",
    days:["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],
    greeting:"Merhaba! Ben eChefe, kişisel şef arkadaşınız! 👨‍🍳\n\nNe olduğunu söyleyin, malzeme fotoğrafı gönderin veya yemek pişirme hakkında her şeyi sorun.\n\nPişirmeye hazır mısınız? 🍳 Pişirme Modu'na dokunun!",
    chips:["Tavukla ne yapılır?","30 dk hızlı tarif","Airfryer nasıl kullanılır?","Haftalık menü"],
    system:`Siz eChefe'siniz, YALNIZCA mutfak sanatlarında uzmanlaşmış bir şef asistanısınız. KURALLAR: SADECE tarifler, malzemeler, pişirme teknikleri, mutfak aletleri hakkında yanıt verin. Her zaman Türkçe yanıt verin.`},

  it:{ flag:"🇮🇹", name:"Italiano",
    recipes:"Ricette", home:"Inizio", chat:"Chef IA", week:"Settimana", shop:"Spesa", profile:"Profilo",
    heroTitle:"Ehi Chef! Cosa cuciniamo?", heroSub:"Testo, foto o voce — sono qui!",
    quickSug:"Suggerimenti veloci", sendPhoto:"📷 Invia foto",
    typeMsg:"Scrivi al Chef...", shopList:"Lista della Spesa",
    weekPlan:"Menu Settimanale", lunch:"Pranzo", dinner:"Cena",
    addItem:"Aggiungi elemento...", clearDone:"Cancella completati",
    generate:"🔄 Genera menu con IA", shopGen:"🛒 Genera lista spesa",
    langSelect:"Lingua dell'App", chefSelect:"Stile Chef",
    save:"✅ Salva", cuisine:"Cucina della settimana", diet:"Dieta",
    level:"Livello", appliance:"Dispositivo principale", seeAll:"Vedi tutto",
    cookMode:"🍳 Modalità Cucina", exitCook:"← Esci",
    snapBtn:"📸 Scatta Foto Ora", analyzing:"⏳ Analizzando...",
    ingredientsBtn:"🥕 Analizza ingredienti", analyzePhoto:"📷 Analisi ingredienti",
    days:["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"],
    greeting:"Ciao! Sono eChefe, il tuo chef compagno personale! 👨‍🍳\n\nDimmi cosa hai, invia una foto degli ingredienti o chiedimi qualsiasi cosa sulla cucina.\n\nPronto a cucinare? Tocca 🍳 Modalità Cucina!",
    chips:["Cosa fare con il pollo?","Ricetta veloce 30 min","Come usare airfryer?","Menu della settimana"],
    system:`Sei eChefe, un assistente chef specializzato ESCLUSIVAMENTE nelle arti culinarie. REGOLE: Rispondi SOLO su ricette, ingredienti, tecniche, elettrodomestici. Rispondi sempre in Italiano.`},
};

const CUISINES = [
  {f:"🇧🇷",n:"Brasileira"},{f:"🇮🇹",n:"Italiana"},{f:"🇩🇪",n:"Alemã"},
  {f:"🇪🇸",n:"Espanhola"},{f:"🇫🇷",n:"Francesa"},{f:"🇯🇵",n:"Japonesa"},
  {f:"🇨🇳",n:"Chinesa"},{f:"🇹🇭",n:"Tailandesa"},{f:"🇻🇳",n:"Vietnamita"},
  {f:"🇲🇽",n:"Mexicana"},{f:"🇮🇳",n:"Indiana"},{f:"🇹🇷",n:"Turca"},
  {f:"🇲🇦",n:"Árabe"},{f:"🇬🇧",n:"Inglesa"},{f:"🇺🇸",n:"Americana"},
  {f:"🇵🇹",n:"Portuguesa"},{f:"🌍",n:"Mista"},
];
const APPLIANCES = ["🔥 Fogão a gás","⚡ Fogão elétrico","🌡️ Forno a gás","⚡ Forno elétrico","💨 Airfryer","🔥 Churrasqueira","🫕 Panela de pressão","🍳 Frigideira","🌡️ Micro-ondas"];
const DIETS = ["Sem restrição","Vegano","Vegetariano","Fitness","Low carb","Sem glúten","Sem lactose"];
const LEVELS = ["🌱 Iniciante","👨‍🍳 Intermediário","⭐ Avançado","🏆 Profissional"];
const CHEFS = {
  mario:{ emoji:"🇮🇹", name:"Chef Mario", label:"Italiano", color:"#27AE60", bg:"linear-gradient(135deg,#27AE60,#1E8449)",
    personality:"Responda com sotaque italiano encantador: 'Mamma mia!', 'Bellissimo!', 'Perfetto!'. Seja expressivo!" },
  pierre:{ emoji:"🇫🇷", name:"Chef Pierre", label:"Francês", color:"#2980B9", bg:"linear-gradient(135deg,#2980B9,#1A5276)",
    personality:"Responda com sotaque francês: 'Voilà!', 'Magnifique!', 'Mon ami!'. Seja sofisticado!" },
  brasil:{ emoji:"🇧🇷", name:"Chef Zé", label:"Brasileiro", color:"#FF6B00", bg:"linear-gradient(135deg,#FF6B00,#FF3D00)",
    personality:"Responda como chef brasileiro: 'Que delícia!', 'Arrasou!', 'Capricha!'. Seja caloroso!" },
};
const RECIPES = [
  {emoji:"🍳",name:"Ovos mexidos cremosos",time:"10 min",cuisine:"Clássico",cal:"220 kcal",appliance:"Fogão"},
  {emoji:"🍗",name:"Frango na airfryer",time:"25 min",cuisine:"Brasileira",cal:"380 kcal",appliance:"Airfryer"},
  {emoji:"🥘",name:"Arroz frito com legumes",time:"25 min",cuisine:"Chinesa",cal:"420 kcal",appliance:"Fogão"},
  {emoji:"🍝",name:"Espaguete alho e óleo",time:"20 min",cuisine:"Italiana",cal:"490 kcal",appliance:"Fogão"},
  {emoji:"🥩",name:"Picanha na churrasqueira",time:"40 min",cuisine:"Brasileira",cal:"520 kcal",appliance:"Churrasqueira"},
  {emoji:"🥗",name:"Salada vietnamita",time:"15 min",cuisine:"Vietnamita",cal:"180 kcal",appliance:"Nenhum"},
];


// ─── CHEF RULES (personal chef cooking together in real time) ────────────────
const CHEF_RULES = `COMO VOCÊ TRABALHA — você é o chef particular do usuário e cozinha JUNTO com ele, em tempo real:
- Seja amigável, paciente, comunicativo e extremamente competente. Converse de forma natural, como um amigo chef.
- Você domina gastronomia brasileira, italiana, francesa, alemã e internacional. O objetivo é comida caseira com sabor, qualidade e técnica de restaurante. Ensine o usuário a cozinhar MELHOR, não só a seguir receitas.
- QUANDO O USUÁRIO DISSER QUE VAI PREPARAR UM PRATO: (1) se ele ainda não disse, pergunte quais ingredientes tem e para quantas pessoas vai cozinhar; (2) sugira a melhor forma de preparar; (3) apresente os ingredientes com quantidades e a sequência geral em poucas linhas; (4) depois guie APENAS uma ou duas etapas por vez; (5) termine cada etapa perguntando se pode seguir e ESPERE a confirmação dele; (6) adapte as instruções ao que está acontecendo na cozinha. NUNCA despeje dez etapas de uma vez durante o preparo.
- CONTROLE DO PREPARO: diga a intensidade do fogo também na escala de 1 a 9 do fogão (ex.: "fogo médio-alto, 7 de 9"), tempos de cozimento, temperaturas em °C, como usar forno convencional e air fryer, o momento certo de cada tempero e as técnicas (selar, refogar, reduzir, finalizar). Explique em uma frase POR QUE a técnica melhora o resultado.
- AJUSTES: se algo der errado (molho ácido, comida salgada, carne soltando água, fogo forte demais, etc.), ajude a corrigir sem precisar recomeçar.
- Considere SEMPRE tudo o que já foi para a panela nesta conversa. Nunca peça para adicionar um ingrediente que já foi usado. Se o usuário mudar de ideia, adapte a partir do que já foi feito.
- Respostas curtas enquanto ele executa uma tarefa; explique com mais detalhes só quando ele pedir.
- Não invente o que não sabe. Para ponto e segurança de carnes, recomende termômetro culinário e diga a temperatura interna em °C.
- FOTOS: quando o usuário mandar uma ou mais fotos, analise só o que dá para ver nelas e responda ao comentário dele. Se forem ingredientes, identifique-os e sugira o que fazer (se ele pedir uma receita, mande o cartão de receita). Se for o preparo, avalie douramento, líquido, molho, cor, textura, caramelizado/queimado e diga o que corrigir e o próximo passo. Se forem várias fotos, considere todas juntas.`;
const DEFAULT_TASTE = "Gosto de comida muito saborosa, bem temperada, com equilíbrio entre os ingredientes e aparência bonita. Prefiro receitas práticas, mas uso técnicas profissionais quando realmente melhoram o resultado. Atenção especial a carnes, massas, molhos, assados, culinária brasileira e refeições familiares.";

// ─── FIRE BACKGROUND ──────────────────────────────────────────────────────────
function FireBG() {
  const ref = useRef(null), raf = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext("2d");
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    class Ember {
      constructor() { this.r(true); }
      r(init) { this.x=Math.random()*cv.width; this.y=init?Math.random()*cv.height:cv.height+10; this.sz=Math.random()*3.5+1; this.vy=-(Math.random()*1.2+.4); this.vx=(Math.random()-.5)*.8; this.life=1; this.decay=Math.random()*.008+.003; this.hue=Math.random()*40+10; this.fl=Math.random()*Math.PI*2; }
      tick() { this.fl+=.08; this.x+=this.vx+Math.sin(this.fl*.7)*.4; this.y+=this.vy; this.life-=this.decay; if(this.life<=0||this.y<-20)this.r(); }
      draw() { const a=this.life*.9,f=.8+Math.sin(this.fl)*.2; cx.save(); cx.globalAlpha=a*f; const g=cx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.sz*2.5); g.addColorStop(0,`hsl(${this.hue+40},100%,90%)`); g.addColorStop(.4,`hsl(${this.hue},100%,65%)`); g.addColorStop(1,`hsla(${this.hue-10},90%,30%,0)`); cx.fillStyle=g; cx.beginPath(); cx.arc(this.x,this.y,this.sz*f,0,Math.PI*2); cx.fill(); cx.restore(); }
    }
    class Flame {
      constructor(x) { this.x=x; this.ps=Array.from({length:10},()=>this.np(true)); }
      np(init) { const h=cv.height*(.25+Math.random()*.35); return {x:this.x+(Math.random()-.5)*32,y:init?cv.height-Math.random()*h:cv.height,th:h,sp:Math.random()*1.8+.9,sz:Math.random()*20+10,life:init?Math.random():0,hue:Math.random()*35+5,fl:Math.random()*Math.PI*2,dr:(Math.random()-.5)*.6}; }
      tick() { this.ps.forEach(p=>{p.fl+=.06;p.x+=p.dr+Math.sin(p.fl*.9)*.7;p.y-=p.sp;p.life+=p.sp/p.th;p.sz*=.993;if(p.life>=1||p.sz<2){Object.assign(p,this.np());p.x=this.x+(Math.random()-.5)*20;}}); }
      draw() { this.ps.forEach(p=>{const a=Math.sin(p.life*Math.PI)*.5;if(a<=0)return;const f=.85+Math.sin(p.fl)*.15,sz=p.sz*f;cx.save();cx.globalAlpha=a;const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y+sz*.3,sz);g.addColorStop(0,`hsl(${p.hue+50},100%,95%)`);g.addColorStop(.2,`hsl(${p.hue+20},100%,70%)`);g.addColorStop(.6,`hsl(${p.hue},95%,45%)`);g.addColorStop(1,`hsla(${p.hue-5},80%,15%,0)`);cx.fillStyle=g;cx.beginPath();cx.ellipse(p.x,p.y,sz*.55,sz*.85,0,0,Math.PI*2);cx.fill();cx.restore();}); }
    }
    const drawGrill=()=>{const n=7,gap=cv.width/(n+1);for(let i=1;i<=n;i++){const x=gap*i;const g=cx.createLinearGradient(x-5,0,x+5,0);g.addColorStop(0,"rgba(20,10,0,.9)");g.addColorStop(.5,"rgba(100,50,5,.6)");g.addColorStop(1,"rgba(20,10,0,.9)");cx.fillStyle=g;cx.fillRect(x-5,0,10,cv.height);cx.fillStyle="rgba(255,120,0,.06)";cx.fillRect(x-2,cv.height*.6,4,cv.height*.4);}};
    let ht=0;
    const drawHaze=()=>{ht+=.012;cx.save();cx.globalAlpha=.03;for(let i=0;i<4;i++){const x=(Math.sin(ht+i*1.4)*.3+.5)*cv.width;const g=cx.createRadialGradient(x,cv.height*.5,0,x,cv.height*.5,160);g.addColorStop(0,"rgba(255,120,30,1)");g.addColorStop(1,"rgba(255,60,0,0)");cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);}cx.restore();};
    const cols=Array.from({length:6},(_,i)=>new Flame(((i+.5)/6)*cv.width));
    const embs=Array.from({length:36},()=>new Ember());
    let last=0;
    const tick=(t=0)=>{raf.current=requestAnimationFrame(tick);if(document.hidden||t-last<33)return;last=t;cx.clearRect(0,0,cv.width,cv.height);const bg=cx.createLinearGradient(0,0,0,cv.height);bg.addColorStop(0,"#0A0500");bg.addColorStop(.5,"#0F0800");bg.addColorStop(1,"#1A0A00");cx.fillStyle=bg;cx.fillRect(0,0,cv.width,cv.height);drawHaze();drawGrill();cols.forEach(c=>{c.tick();c.draw();});embs.forEach(e=>{e.tick();e.draw();});cx.save();cx.globalAlpha=.4;const bot=cx.createLinearGradient(0,cv.height*.7,0,cv.height);bot.addColorStop(0,"transparent");bot.addColorStop(1,"rgba(255,60,0,.35)");cx.fillStyle=bot;cx.fillRect(0,0,cv.width,cv.height);cx.restore();cx.save();const top=cx.createLinearGradient(0,0,0,cv.height*.45);top.addColorStop(0,"rgba(8,4,0,.92)");top.addColorStop(1,"transparent");cx.fillStyle=top;cx.fillRect(0,0,cv.width,cv.height);cx.restore();};
    tick();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IC = {
  home:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  chat:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  cal:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  shop:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  user:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  send:<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>,
  cam:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  check:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
  star:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><polygon points="12,2 15.1,8.6 22,9.3 16.8,14 18.2,21 12,17.3 5.8,21 7.2,14 2,9.3 8.9,8.6"/></svg>,
  trash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
};

// ─── COOK FEEDBACK CARD ───────────────────────────────────────────────────────
function CookFeedback({ score, comment, fix, nextStep, chefColor, emoji }) {
  const stars = Math.min(5, Math.max(1, Math.round((score/10)*5)));
  return (
    <div style={{background:`linear-gradient(135deg,${chefColor}18,${chefColor}08)`,border:`1px solid ${chefColor}44`,borderRadius:14,padding:14,margin:"4px 0",animation:"slideUp .4s ease",maxWidth:"88%",alignSelf:"flex-start"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{fontSize:20}}>{emoji}</div>
        <div>
          <div style={{display:"flex",gap:2,marginBottom:2}}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} style={{fontSize:14,color:s<=stars?"#FFB800":"#3D2800"}}>★</span>
            ))}
          </div>
          <div style={{fontSize:10,color:T.muted}}>{score}/10</div>
        </div>
        <span style={{fontSize:9,color:T.accent,background:"rgba(255,107,0,.15)",padding:"2px 7px",borderRadius:8,fontWeight:700,marginLeft:"auto"}}>📸 AO VIVO</span>
      </div>
      {comment&&<div style={{fontSize:13,color:T.cream,lineHeight:1.5,marginBottom:nextStep?8:0}}>{comment}</div>}
      {fix&&(
        <div style={{background:"rgba(255,184,0,.10)",border:"1px solid rgba(255,184,0,.3)",borderRadius:10,padding:"8px 12px",marginTop:6}}>
          <div style={{fontSize:10,color:T.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>⚠ Corrigir</div>
          <div style={{fontSize:13,color:T.cream,lineHeight:1.4}}>{fix}</div>
        </div>
      )}
      {nextStep&&(
        <div style={{background:"rgba(255,107,0,.12)",border:"1px solid rgba(255,107,0,.25)",borderRadius:10,padding:"8px 12px",marginTop:6}}>
          <div style={{fontSize:10,color:T.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>▶ Próximo passo</div>
          <div style={{fontSize:13,color:T.cream,lineHeight:1.4}}>{nextStep}</div>
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({ go, chef, lang, onFeedback }) {
  const p = CHEFS[chef], L = LANGS[lang];
  return (
    <div className="screen">
      <div className="hdr">
        <div className="logo">e<span>Chef</span>e</div>
        <div className="sub">{p.name} · {L.name}</div>
      </div>
      <button className="hero" onClick={()=>go("chat")}>
        <div className="hero-t">{p.emoji} {L.heroTitle}</div>
        <div className="hero-s">{L.heroSub}</div>
      </button>
      <div className="qg">
        {[["📷","Foto","Analise ingredientes","chat"],["📅",L.week,"Cardápio completo","week"],["🛒",L.shop,"Lista de compras","shop"],["⭐",L.recipes||"Receitas","Minhas receitas salvas","recipes"]].map(([e,t,s,sc])=>(
          <button key={sc} className="qb" onClick={()=>go(sc)}>
            <span className="qi">{e}</span><div className="qt">{t}</div><div className="qs">{s}</div>
          </button>
        ))}
      </div>
      {inviteCode()&&workerURL()&&<button onClick={onFeedback} style={{display:"flex",alignItems:"center",gap:10,width:"calc(100% - 32px)",margin:"0 16px 14px",padding:"12px 14px",background:"rgba(255,184,0,.08)",border:"1px solid rgba(255,184,0,.3)",borderRadius:14,color:T.cream,fontSize:14,textAlign:"left",cursor:"pointer",fontFamily:"inherit"}}><span style={{fontSize:22}}>💬</span><span><b>Você é testador!</b><br/><span style={{fontSize:12,color:T.textSub}}>Toque aqui para mandar sua opinião ou dica</span></span></button>}
      <div className="sh"><div className="st">{L.quickSug}</div><div className="sl">{L.seeAll}</div></div>
      <div className="rrow">
        {RECIPES.map((r,i)=>(
          <div key={i} className="rc">
            <div className="ri" style={{background:"linear-gradient(135deg,rgba(255,107,0,.1),rgba(255,60,0,.05))"}}>{r.emoji}</div>
            <div className="rb">
              <div className="rn">{r.name}</div>
              <div className="rm">{r.time} · {r.cal}</div>
              <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                <div className="rtag">{r.cuisine}</div>
                <div className="rtag" style={{background:"rgba(255,184,0,.1)",color:T.gold}}>{r.appliance}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

// ─── AI (direct Anthropic API with the user's own key) ───────────────────────
const VOICE_LANG = {pt:"pt-BR",en:"en-US",de:"de-DE",es:"es-ES",fr:"fr-FR",tr:"tr-TR",it:"it-IT"};
const LS = {
  get:(k)=>{ try{ return localStorage.getItem(k)||""; }catch{ return ""; } },
  set:(k,v)=>{ try{ v?localStorage.setItem(k,v):localStorage.removeItem(k); }catch{} },
};
const KEY_LS = "echefe_api_key";
// ─── TESTER MODE: invite code + "porteiro" server (keys stay on the server) ──
const DEFAULT_WORKER = "";   // e.g. https://echefe.<conta>.workers.dev (also accepted via ?w= in the invite link)
const WORKER_LS = "echefe_worker", INVITE_LS = "echefe_invite", INVITE_NAME_LS = "echefe_invite_name";
(()=>{ try{
  const q = new URLSearchParams(location.search);
  const w = q.get("w"), c = q.get("c");
  if(w && /^https:\/\/[\w.-]+(:\d+)?\/?$/.test(w)) localStorage.setItem(WORKER_LS, w.replace(/\/+$/,""));
  if(c) localStorage.setItem("echefe_invite_pending", c.trim().toUpperCase());
  if(w||c) history.replaceState(null,"",location.pathname);
}catch{} })();
const workerURL = ()=>(LS.get(WORKER_LS)||DEFAULT_WORKER).replace(/\/+$/,"");
const inviteCode = ()=>LS.get(INVITE_LS).trim();
const viaWorker = ()=>!!(inviteCode() && workerURL());
const workerPost = (path, body, code)=>fetch(workerURL()+path,{method:"POST",headers:{"content-type":"application/json","x-echefe-code":code||inviteCode()},body:JSON.stringify(body||{})});
async function checkInvite(code){
  if(!workerURL()) return {ok:false,error:"no_server"};
  try{ const r = await workerPost("/api/check",{},code); const d = await r.json().catch(()=>({})); return r.ok?{ok:true,...d}:{ok:false,error:d.error||"bad_code"}; }
  catch{ return {ok:false,error:"offline"}; }
}
async function sendFeedback(text, rating){
  try{ const r = await workerPost("/api/feedback",{text,rating}); return r.ok; }catch{ return false; }
}
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
  const useW = viaWorker();
  if(!useW && !key) throw {code:"no_key"};
  const messages = typeof input==="string" ? [{role:"user",content:input}] : mergeTurns(input);
  if(opts.images){
    const list = Array.isArray(opts.images) ? opts.images : [opts.images];
    const blocks = [];
    for(const f of list.slice(0,4)){ const b64 = await shrinkImage(f); blocks.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}}); }
    const last = messages[messages.length-1];
    last.content = [...blocks,{type:"text",text:last.content}];
  }
  const saved = LS.get(MODEL_LS);
  const order = saved ? [saved,...MODELS.filter(m=>m!==saved)] : MODELS;
  let r;
  if(useW){
    try{
      const res = await workerPost("/api/claude",{messages, max_tokens:opts.maxTokens||(asJson?1200:900)});
      let data=null; try{ data=await res.json(); }catch{}
      r = {status:res.status,data};
    }catch{ throw {code:"offline"}; }
    if(r.status===429) throw {code:"limit"};
    if(r.status===403) throw {code:"bad_invite"};
    if(r.status!==200) throw {code:"server"};
  }
  else try{
    for(const model of order){
      r = await callModel(model, key, messages, opts.maxTokens|| (asJson?1200:900));
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
  if(r.data.stop_reason==="max_tokens") throw {code:"invalid_json"};
  const clean = text.replace(/```json|```/g,"");
  const a = Math.min(...["{","["].map(c=>{const i=clean.indexOf(c);return i<0?1e9:i;}));
  const b = Math.max(clean.lastIndexOf("}"),clean.lastIndexOf("]"));
  try{ return JSON.parse(clean.slice(a,b+1)); }catch{ throw {code:"invalid_json"}; }
}

const AI_ERR = (code)=>({
  no_key:"Para eu responder, coloque o seu código de convite na aba 👤 Perfil (é só uma vez). 🎟️",
  limit:"Você chegou ao limite de uso de hoje do teste. Amanhã libera de novo! 🙏",
  bad_invite:"Seu código de convite não está ativo. Fale com quem te convidou. 🎟️",
  server:"O chef está em manutenção rapidinho. Tente de novo em alguns minutos. 🔧",
  bad_key:"A chave da API não foi aceita. Confira na aba 👤 Perfil. 🔑",
  no_credit:"Sua conta da Anthropic está sem crédito. Adicione crédito em console.anthropic.com → Billing. 💳",
  rate_limited:"Muitas perguntas seguidas — espere um pouquinho e tente de novo. ⏳",
  offline:"Sem internet no momento. Confira a conexão. 📶",
  image_rejected:"Não consegui ler essa foto. Tente outra. 📷",
  invalid_json:"Não entendi bem a foto. Tire outra, por favor! 📸",
}[code]||"Ops! Tive um problema. Tente de novo. 🙏");


// ─── LOCAL STORAGE: recipes + chat ───────────────────────────────────────────
const RECIPES_LS = "echefe_recipes", CHAT_LS = "echefe_chat";
const loadJSON = (k, d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; } };
const saveJSON = (k, v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch{ return false; } };
const loadRecipes = ()=>loadJSON(RECIPES_LS, []);
const saveRecipes = (list)=>{
  if(saveJSON(RECIPES_LS, list)) return true;
  // storage full: drop photos of the oldest recipes until it fits
  const copy = list.map(r=>({...r}));
  for(let i=copy.length-1;i>=0;i--){ if(copy[i].photo){ copy[i].photo=null; if(saveJSON(RECIPES_LS, copy)) return true; } }
  return false;
};
const makeThumb = (file, max)=>new Promise((res)=>{
  const url = URL.createObjectURL(file); const img = new Image();
  img.onload = ()=>{ const sc=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc); c.getContext("2d").drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg",0.72)); };
  img.onerror = ()=>{ URL.revokeObjectURL(url); res(null); };
  img.src = url;
});
const fmtDate = (ts)=>{ try{ return new Date(ts).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}); }catch{ return ""; } };

// ─── AI VOICE (OpenAI TTS with accent per chef) ──────────────────────────────
const OAI_LS = "echefe_openai_key";
const LANG_NAME = {pt:"português do Brasil",en:"English",de:"Deutsch",es:"español",fr:"français",tr:"Türkçe",it:"italiano"};
const CHEF_VOICE = {
  mario:{voice:"ash", accent:"um forte e charmoso sotaque italiano, como um chef italiano expressivo, caloroso e animado, que gesticula enquanto fala"},
  pierre:{voice:"fable", accent:"um elegante sotaque francês, como um chef parisiense refinado, charmoso e um pouco dramático"},
  brasil:{voice:"onyx", accent:"um sotaque brasileiro caloroso e descontraído, como um cozinheiro de família alegre e acolhedor"},
};
let _audio=null;
const audioEl = ()=>{ if(!_audio){ _audio=new Audio(); _audio.preload="auto"; } return _audio; };
let _unlocked=false;
const unlockAudio = ()=>{ if(_unlocked) return; _unlocked=true; try{ audioEl().load(); }catch{} };
async function speakAI(text, chef, lang){
  const key = LS.get(OAI_LS).trim(); const useW = viaWorker();
  if(!key && !useW) return false;
  const cv = CHEF_VOICE[chef]||CHEF_VOICE.mario;
  const ln = LANG_NAME[lang]||LANG_NAME.pt;
  const instructions = `Fale em ${ln}, com ${cv.accent}. Tom animado, natural e encorajador, como quem está cozinhando junto com o usuário. Pronuncie as palavras em ${ln} de forma clara, mantendo o sotaque.`;
  try{
    const r = useW
      ? await workerPost("/api/tts",{input:text,voice:cv.voice,instructions})
      : await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
          body:JSON.stringify({model:"gpt-4o-mini-tts",voice:cv.voice,input:text,response_format:"mp3",instructions})});
    if(!r.ok) return false;
    const blob = await r.blob();
    const a = audioEl();
    try{ if(a.src&&a.src.startsWith("blob:")) URL.revokeObjectURL(a.src); }catch{}
    a.src = URL.createObjectURL(blob);
    await a.play();
    return true;
  }catch{ return false; }
}

// ─── RECIPE CARD (interactive: ingredient checklist, steps with photos) ──────
const CARD_RULE = `FORMATO DE RECEITA: quando o usuário pedir uma receita ou disser que quer fazer um prato (e você ainda não mandou o cartão desse prato nesta conversa), responda com um CARTÃO DE RECEITA completo, como visão geral, dentro das tags <recipe> e </recipe>, contendo APENAS JSON válido neste formato:
<recipe>{"title":"Macarrão cremoso com camarão","emoji":"🍤","intro":"1-2 frases animadas apresentando o prato","servings":"4 pessoas","time":"35-40 min","tags":["Cremosidade intensa"],"ingredients":[{"name":"500 g de macarrão","note":"tagliatelle ou fettuccine"}],"steps":[{"title":"Tempere os camarões","text":"instrução clara com fogo de 1 a 9, tempo e °C quando fizer sentido","minutes":0,"img":"short English description of a realistic food photo for this step"}],"tips":[{"title":"A água do macarrão é indispensável","text":"por quê, em 1-2 frases"}],"question":"pergunta final ao usuário (ex.: se tem os ingredientes, quantas pessoas, tipo de macarrão)"}</recipe>
Regras do cartão: em cada passo, "minutes" = tempo em minutos que precisa ser cronometrado (cozinhar, assar, reduzir, descansar, marinar), ou 0 se não tiver; 4 a 8 passos; ingredientes com quantidades; adapte à dieta, ao equipamento e ao gosto do usuário; use nomes de ingredientes do país do usuário quando souber. MANDE UM NOVO CARTÃO COMPLETO (com tudo recalculado e a lista de ingredientes nova) sempre que o usuário: informar um número de pessoas diferente do cartão, pedir para ajustar quantidades, trocar ingredientes ou mudar a receita (ex.: deixar mais cremoso), ou pedir para repassar/rever/mostrar de novo a receita OU a lista de ingredientes (ex.: "vamos repassar a lista de ingredientes"). Nesse caso o cartão novo vem com a lista inteira para ele marcar de novo, e o "intro" diz que é a lista repassada. Escreva no "intro" o que mudou. Durante o preparo (depois que ele começou a cozinhar), guie uma ou duas etapas por vez, em texto normal. Para conversas que não são pedido de receita, responda em texto normal, sem tags.`;

const parseCard = (text)=>{
  const m = String(text).match(/<recipe>([\s\S]*?)<\/recipe>/i);
  if(!m) return null;
  try{
    const raw = m[1].replace(/```json|```/g,"");
    const c = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}")+1));
    if(!c||!c.title||!Array.isArray(c.steps)) return null;
    return {
      id: Date.now()+Math.floor(Math.random()*1000),
      title:String(c.title), emoji:String(c.emoji||"🍽️"), intro:String(c.intro||""), servings:String(c.servings||""), time:String(c.time||""),
      tags:(c.tags||[]).map(String).slice(0,4),
      ingredients:(c.ingredients||[]).map(x=>typeof x==="string"?{name:x,note:""}:{name:String(x.name||""),note:String(x.note||"")}).filter(x=>x.name),
      steps:(c.steps||[]).map(x=>({title:String(x.title||""),text:String(x.text||""),img:String(x.img||x.title||""),minutes:Math.min(600,Math.max(0,parseFloat(x.minutes)||0))})),
      tips:(c.tips||[]).map(x=>typeof x==="string"?{title:x,text:""}:{title:String(x.title||""),text:String(x.text||"")}),
      question:String(c.question||""),
      have:[], done:[], photos:{}, hero:null,
      before: String(text).slice(0, m.index).trim(), after: String(text).slice(m.index+m[0].length).trim(),
    };
  }catch{ return null; }
};
const cardAsText = (c)=>`[Cartão de receita enviado] ${c.title} (${c.servings}, ${c.time}). Ingredientes: ${c.ingredients.map(i=>i.name).join("; ")}. Passos: ${c.steps.map((s,i)=>`${i+1}. ${s.title}: ${s.text}`).join(" ")} Pergunta: ${c.question}`;

// AI step photos (OpenAI images, same key as the voice). Returns a small JPEG data URL or null.
const IMG_MODELS = ["gpt-image-1-mini","gpt-image-1","dall-e-3"];
const IMG_MODEL_LS = "echefe_img_model";
const toThumbFromB64 = (b64, max)=>new Promise(res=>{
  const img=new Image();
  img.onload=()=>{ const sc=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc); c.getContext("2d").drawImage(img,0,0,c.width,c.height); res(c.toDataURL("image/jpeg",0.7)); };
  img.onerror=()=>res(null);
  img.src="data:image/png;base64,"+b64;
});
const canImages = ()=>viaWorker() || !!LS.get(OAI_LS);
async function genImage(desc){
  const prompt = `Realistic professional food photography, home kitchen, natural light, appetizing, close-up: ${desc}. No text, no logos, no faces.`;
  if(viaWorker()){
    try{
      const r = await workerPost("/api/image",{prompt});
      if(!r.ok) return null;
      const d = await r.json();
      return d&&d.b64 ? await toThumbFromB64(d.b64, 420) : null;
    }catch{ return null; }
  }
  const key = LS.get(OAI_LS).trim(); if(!key) return null;
  const saved = LS.get(IMG_MODEL_LS);
  const order = saved ? [saved,...IMG_MODELS.filter(m=>m!==saved)] : IMG_MODELS;
  for(const model of order){
    const body = model==="dall-e-3"
      ? {model, prompt, n:1, size:"1024x1024", quality:"standard", response_format:"b64_json"}
      : {model, prompt, n:1, size:"1024x1024", quality:"low"};
    try{
      const r = await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify(body)});
      if(r.status===401||r.status===429) return null;
      if(!r.ok) continue;                     // model not available for this account → try next
      const d = await r.json();
      const b64 = d&&d.data&&d.data[0]&&d.data[0].b64_json;
      if(!b64) continue;
      LS.set(IMG_MODEL_LS, model);
      return await toThumbFromB64(b64, 420);
    }catch{ return null; }
  }
  return null;
}

function RecipeCard({ card, color, onToggleHave, onToggleDone, onStart, onServings, onReview, onTimer, hasImgKey }){
  const total = card.ingredients.length, have = card.have.length;
  const ph = (src, emoji, h)=> src
    ? <img src={src} alt="" style={{width:"100%",height:h,objectFit:"cover",borderRadius:12,display:"block"}}/>
    : <div style={{width:"100%",height:h,borderRadius:12,background:"linear-gradient(135deg,rgba(255,107,0,.18),rgba(255,184,0,.08))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:h>120?54:30}}>{hasImgKey?<div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>:emoji}</div>;
  const box = {width:24,height:24,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:".2s"};
  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",width:"100%",animation:"slideUp .4s ease"}}>
      {ph(card.hero, card.emoji, 170)}
      <div style={{padding:14}}>
        {card.intro&&<div style={{fontSize:14,color:T.cream,lineHeight:1.5,marginBottom:10}}>{card.intro}</div>}
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:T.cream,lineHeight:1.25}}>{card.emoji} {card.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
          {card.servings&&<span className="rtag" style={{fontSize:12}}>👥 {card.servings}</span>}
          {card.time&&<span className="rtag" style={{fontSize:12}}>⏱ {card.time}</span>}
          {card.tags.map((t,i)=><span key={i} className="rtag" style={{fontSize:12,background:"rgba(255,184,0,.1)",color:T.gold}}>{t}</span>)}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:12,flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:T.muted}}>👥 Ajustar para:</span>
          {[2,4,6,8,10].map(n=><button key={n} onClick={()=>onServings(n)} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:16,padding:"4px 11px",color:T.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{n}</button>)}
        </div>

        {/* INGREDIENTS CHECKLIST */}
        <div style={{marginTop:16,border:`1px solid ${T.border}`,borderRadius:14,padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:T.cream}}>🧺 Ingredientes</div>
            <div style={{fontSize:12,color:T.muted}}>{have} de {total}</div>
          </div>
          <div style={{background:T.border,borderRadius:6,height:5,overflow:"hidden",margin:"8px 0 6px"}}><div style={{width:`${total?have/total*100:0}%`,height:"100%",background:`linear-gradient(90deg,${T.accent},${T.gold})`,transition:"width .3s"}}/></div>
          {card.ingredients.map((x,i)=>{ const on=card.have.includes(i); return (
            <div key={i} onClick={()=>onToggleHave(i)} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 0",borderBottom:i<total-1?"1px solid rgba(61,40,0,.5)":"none",cursor:"pointer"}}>
              <div style={{...box,border:`2px solid ${on?T.green:T.muted}`,background:on?T.green:"transparent",marginTop:1}}>{on&&<div style={{width:14,height:14,color:"#fff"}}>{IC.check}</div>}</div>
              <div>
                <div style={{fontSize:14,color:on?T.muted:T.cream,textDecoration:on?"line-through":"none"}}>{x.name}</div>
                {x.note&&<div style={{fontSize:12,color:T.muted,marginTop:2}}>{x.note}</div>}
              </div>
            </div>);})}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,gap:8}}>
            <div style={{fontSize:11,color:T.muted}}>Toque no que você já tem ✓</div>
            <button onClick={onReview} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:16,padding:"5px 12px",color:T.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>🔄 Repassar a lista</button>
          </div>
        </div>

        {/* STEPS */}
        <div style={{fontSize:15,fontWeight:700,color:T.cream,margin:"18px 0 10px"}}>👨‍🍳 Modo de preparo</div>
        {card.steps.map((st,i)=>{ const on=card.done.includes(i); return (
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderTop:i?`1px solid ${T.border}`:"none",opacity:on?.55:1}}>
            <div style={{width:112,flexShrink:0}}>{ph(card.photos[i], card.emoji, 112)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:T.cream,lineHeight:1.3}}>Passo {i+1} — {st.title}</div>
              <div style={{fontSize:13,color:T.cream,lineHeight:1.5,marginTop:4,opacity:.9}}>{st.text}</div>
              {st.minutes>0&&<button onClick={()=>onTimer({minutes:st.minutes,label:st.title})} style={{marginTop:8,marginRight:6,background:"rgba(255,184,0,.12)",border:`1px solid ${T.gold}66`,borderRadius:20,padding:"4px 12px",color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>⏱ {minLabel(st.minutes)}</button>}
              <button onClick={()=>onToggleDone(i)} style={{marginTop:8,background:on?T.green:"transparent",border:`1px solid ${on?T.green:T.border}`,borderRadius:20,padding:"4px 12px",color:on?"#fff":T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{on?"✓ Feito":"Marcar como feito"}</button>
            </div>
          </div>);})}

        {/* TIPS */}
        {card.tips.length>0&&<>
          <div style={{fontSize:15,fontWeight:700,color:T.cream,margin:"16px 0 8px"}}>⭐ Dicas para ficar espetacular</div>
          {card.tips.map((t,i)=><div key={i} style={{fontSize:13,color:T.cream,lineHeight:1.5,marginBottom:8}}><b style={{color:T.gold}}>{i+1}. {t.title}</b>{t.text?" "+t.text:""}</div>)}
        </>}
        {card.question&&<div style={{fontSize:14,color:T.cream,lineHeight:1.5,marginTop:12,padding:12,background:"rgba(255,107,0,.08)",border:"1px solid rgba(255,107,0,.25)",borderRadius:12}}>{card.question}</div>}
        <button className="bp" onClick={onStart} style={{width:"100%",margin:"14px 0 0",background:`linear-gradient(135deg,${color},${color}cc)`}}>▶ Cozinhar comigo, passo a passo</button>
        {!hasImgKey&&<div style={{fontSize:11,color:T.muted,marginTop:8,textAlign:"center"}}>📷 Para ver fotos de cada passo, coloque a chave da OpenAI no 👤 Perfil.</div>}
      </div>
    </div>
  );
}

// ─── VOICE ENGINE: always listening for "Ei Chef" ─────────────────────────────
// Modes: idle (waiting for the wake word) → capture (collecting the whole question
// until the person pauses) → speaking (chef talks; only "para"/"Ei Chef" interrupt).
const WAKE_RE = /\b(ei|ey|hey|hei|oi|e aí|aí|ai|ê|é)[\s,!.]*(chef|chefe|chefs|xefe|chefi|shef|shefe)\b[\s,!.:?]*/i;
const STOP_RE = /^(para|pare|parar|chega|silêncio|silencio|stop|espera|espere|já chega|ok para|tá bom|ta bom|obrigado|obrigada|halt|stopp|basta|arrête|arrete|dur)[\s!.,]*$/i;
const SILENCE_MS = 2600;      // pause that ends the question
// On Android the microphone steals the audio focus every time it restarts → the chef's voice gets choppy.
// There we pause listening while the chef talks (tap the red bar to interrupt).
const MIC_PAUSES_WHILE_TALKING = /Android/i.test(navigator.userAgent||"");
const FIRST_WORD_MS = 9000;   // how long to wait for the question to start

let _actx=null;
const beep = (freq=880, ms=120)=>{
  try{
    if(!_actx) _actx = new (window.AudioContext||window.webkitAudioContext)();
    if(_actx.state==="suspended") _actx.resume();
    const o=_actx.createOscillator(), g=_actx.createGain();
    o.frequency.value=freq; o.type="sine";
    g.gain.setValueAtTime(0.0001,_actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25,_actx.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,_actx.currentTime+ms/1000);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime+ms/1000+0.05);
  }catch{}
};
const stripWake = (t)=>{ const m=t.match(WAKE_RE); return m? t.slice(m.index+m[0].length) : t; };
// Joins speech chunks without repeating words. Android sends "seria", "seria uma", "seria uma boa"...
const normOne = (w)=>w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,"");
const normW = (t)=>t.split(/\s+/).filter(Boolean).map(normOne);
const mergeSpeech = (prev, next)=>{
  prev=(prev||"").trim(); next=(next||"").trim();
  if(!prev) return next; if(!next) return prev;
  const pw=prev.split(/\s+/), nw=next.split(/\s+/);
  const P=pw.map(normOne), N=nw.map(normOne), ps=P.join(" "), ns=N.join(" ");
  if(!ns.trim()) return prev;
  if(ns.startsWith(ps)) return next;                                   // next extends everything said so far
  if(ps.endsWith(ns) || (" "+ps+" ").includes(" "+ns+" ")) return prev; // already have it
  // the phone re-sent the current phrase with a corrected word ("…boa como" → "…boa com molho")
  for(let i=0;i<P.length;i++){
    if(P[i]!==N[0]) continue;
    let c=0; while(i+c<P.length && c<N.length && P[i+c]===N[c]) c++;
    if(c>=2 && c>=(P.length-i)*0.5) return [...pw.slice(0,i),...nw].join(" ");
  }
  for(let k=Math.min(P.length,N.length);k>0;k--){                      // overlap: end of prev == start of next
    if(P.slice(P.length-k).join(" ")===N.slice(0,k).join(" ")) return [...pw,...nw.slice(k)].join(" ");
  }
  return prev+" "+next;
};

function useVoiceEngine(lang, onCommand, chef){
  const SR = typeof window!=="undefined" && (window.SpeechRecognition||window.webkitSpeechRecognition);
  const [state, setState] = useState(!SR?"unsupported":((LS.get("echefe_listen_mode") || (MIC_PAUSES_WHILE_TALKING?"tap":"always"))==="tap"?"tap":"starting")); // starting|listening|need_tap|blocked|unsupported|off
  const [mode, setModeS] = useState("idle"); // idle|capture|speaking
  const [heard, setHeard] = useState("");
  // "tap": mic only when the person taps (default on Android — the system beeps every time the mic restarts)
  // "always": always listening for "Ei Chef"
  const [listenMode, setListenModeS] = useState(()=>LS.get("echefe_listen_mode") || (MIC_PAUSES_WHILE_TALKING?"tap":"always"));
  const listenRef = useRef(listenMode);
  const wantOn = useRef(listenMode==="always"), recog = useRef(null), modeRef = useRef("idle");
  const wakeLock = useRef(null), cmdRef = useRef(onCommand), langRef = useRef(lang), chefRef = useRef(chef);
  const restartTimer = useRef(null), startedOk = useRef(false), needTap = useRef(false), firstLang = useRef(true);
  const buf = useRef(""), interimRef = useRef(""), silenceT = useRef(null), firstT = useRef(null), speakDone = useRef(null);
  cmdRef.current = onCommand; langRef.current = lang; chefRef.current = chef;

  const setMode = (m)=>{ modeRef.current=m; setModeS(m); };

  const lockScreen = async()=>{
    try{ if(navigator.wakeLock&&!wakeLock.current){ wakeLock.current = await navigator.wakeLock.request("screen"); wakeLock.current.addEventListener("release",()=>{wakeLock.current=null;}); } }catch{}
  };

  // tap mode: switch the mic off when the short listening window is over
  const endTapSession = ()=>{
    if(listenRef.current!=="tap") return;
    wantOn.current=false; clearTimeout(restartTimer.current);
    try{ recog.current&&recog.current.abort(); }catch{} recog.current=null;
    setState(s=>s==="blocked"||s==="need_tap"||s==="unsupported"?s:"tap");
  };

  // ── capture: collect the whole question ──
  const finishCapture = ()=>{
    clearTimeout(silenceT.current); clearTimeout(firstT.current);
    const text = mergeSpeech(buf.current, stripWake(interimRef.current)).replace(/\s+/g," ").trim();
    buf.current=""; interimRef.current=""; setHeard("");
    setMode("idle");
    endTapSession();
    if(text.length>1) cmdRef.current(text);
  };
  const startCapture = (initial, withBeep)=>{
    clearTimeout(silenceT.current); clearTimeout(firstT.current);
    buf.current = (initial||"").trim(); interimRef.current="";
    setMode("capture");
    if(withBeep) beep(880,110);
    if(buf.current) silenceT.current = setTimeout(finishCapture, SILENCE_MS);
    firstT.current = setTimeout(()=>{ if(modeRef.current==="capture" && !buf.current && !interimRef.current){ setMode("idle"); setHeard(""); endTapSession(); } }, FIRST_WORD_MS);
  };
  const bumpSilence = ()=>{ clearTimeout(silenceT.current); silenceT.current = setTimeout(finishCapture, SILENCE_MS); };

  // ── speaking ──
  const stopSpeaking = ()=>{
    try{ window.speechSynthesis&&window.speechSynthesis.cancel(); }catch{}
    try{ const a=audioEl(); a.pause(); a.currentTime=0; }catch{}
    const d=speakDone.current; speakDone.current=null; if(d) d(true);
    if(MIC_PAUSES_WHILE_TALKING && wantOn.current && !recog.current) setTimeout(()=>{ if(!recog.current&&wantOn.current&&modeRef.current!=="speaking") start(); },200);
  };

  const onSpeech = (finalText, interimText)=>{
    const all = (finalText+" "+interimText).trim();
    const m = modeRef.current;
    if(m==="speaking"){
      // ignore the chef's own voice; obey only short stop words or the wake word
      const last = (finalText||interimText).trim();
      if(STOP_RE.test(last) || (last.split(/\s+/).length<=3 && /^(para|pare|chega|stop)\b/i.test(last))){ stopSpeaking(); setMode("idle"); beep(520,90); return; }
      if(WAKE_RE.test(all)){ stopSpeaking(); startCapture(stripWake(finalText), true); return; }
      return;
    }
    if(m==="idle"){
      if(!WAKE_RE.test(all)) { setHeard(""); return; }
      startCapture(finalText?stripWake(finalText):"", true);
      if(!finalText){ interimRef.current = interimText; setHeard(stripWake(interimText)); bumpSilence(); }
      return;
    }
    // capture
    if(finalText){ buf.current = mergeSpeech(buf.current, stripWake(finalText)); interimRef.current=""; }
    else interimRef.current = interimText;
    setHeard(mergeSpeech(buf.current, stripWake(interimRef.current)));
    if(all) bumpSilence();
  };

  const start = ()=>{
    if(!SR) { setState("unsupported"); return; }
    if(recog.current) return;
    clearTimeout(restartTimer.current);
    const r = new SR();
    r.lang = VOICE_LANG[langRef.current]||"pt-BR";
    r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
    r.onstart = ()=>{ startedOk.current=true; setState("listening"); lockScreen(); };
    r.onresult = (ev)=>{
      let fin="", interim="";
      for(let i=ev.resultIndex;i<ev.results.length;i++){
        const res = ev.results[i];
        if(res.isFinal) fin = mergeSpeech(fin, res[0].transcript); else interim = mergeSpeech(interim, res[0].transcript);
      }
      onSpeech(fin.trim(), interim.trim());
    };
    r.onerror = (ev)=>{
      if(ev.error==="not-allowed"||ev.error==="service-not-allowed"){
        wantOn.current = false;
        needTap.current = !startedOk.current;
        setState(needTap.current?"need_tap":"blocked");
      }
    };
    r.onend = ()=>{
      recog.current = null;
      // keep any half-heard words of the question; the next session continues it
      if(modeRef.current==="capture" && interimRef.current){ buf.current=mergeSpeech(buf.current, stripWake(interimRef.current)); interimRef.current=""; }
      if(wantOn.current && document.visibilityState==="visible" && !(MIC_PAUSES_WHILE_TALKING && modeRef.current==="speaking")){
        restartTimer.current = setTimeout(start, 150);
      } else if(!wantOn.current) setState(s=>s==="blocked"||s==="need_tap"?s:(listenRef.current==="tap"?"tap":"off"));
    };
    try{ r.start(); recog.current = r; }
    catch{ recog.current=null; wantOn.current=false; needTap.current=true; setState("need_tap"); }
  };

  const stopRecog = ()=>{ clearTimeout(restartTimer.current); try{ recog.current&&recog.current.abort(); }catch{} recog.current=null; };

  const enable = ()=>{ needTap.current=false; wantOn.current=true; setState("starting"); stopRecog(); start(); };
  const disable = ()=>{ wantOn.current=false; stopRecog(); stopSpeaking(); setMode("idle"); setState("off"); try{wakeLock.current&&wakeLock.current.release();}catch{} };

  const pickVoice = (lc)=>{
    try{ const vs = window.speechSynthesis.getVoices(); return vs.find(v=>v.lang===lc) || vs.find(v=>v.lang&&v.lang.slice(0,2)===lc.slice(0,2)) || null; }catch{ return null; }
  };

  const speakDevice = (clean, after)=>{
    if(!window.speechSynthesis){ after(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const lc = VOICE_LANG[langRef.current]||"pt-BR";
    u.lang = lc; const v = pickVoice(lc); if(v) u.voice = v;
    u.rate = 1.03;
    u.onend = ()=>after(); u.onerror = ()=>after();
    window.speechSynthesis.speak(u);
  };

  // speak a reply; afterwards listen for a follow-up without the wake word
  const speak = (text, thenListen)=>{
    const clean = String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}*#_`>|]/gu,"").replace(/\s+/g," ").trim().slice(0,1500);
    stopSpeaking();
    if(!clean){ if(thenListen && wantOn.current) startCapture("",true); return; }
    clearTimeout(silenceT.current); clearTimeout(firstT.current);
    setMode("speaking");
    let done=false;
    const after = (interrupted)=>{ if(done) return; done=true; speakDone.current=null;
      if(modeRef.current!=="speaking") return;      // already moved on (barge-in)
      setMode("idle");
      if(listenRef.current==="tap"){
        if(!interrupted && thenListen){ wantOn.current=true; if(!recog.current) start(); startCapture("",true); }
        else endTapSession();
        return;
      }
      if(MIC_PAUSES_WHILE_TALKING && wantOn.current && !recog.current) start();
      if(!interrupted && thenListen && wantOn.current) startCapture("",true);
    };
    speakDone.current = after;
    speakAI(clean, chefRef.current, langRef.current).then(ok=>{
      if(done) { try{audioEl().pause();}catch{} return; }
      if(!ok) speakDevice(clean, ()=>after(false));
      else { const a=audioEl(); a.onended=()=>after(false); a.onerror=()=>after(false); }
    });
    if(MIC_PAUSES_WHILE_TALKING) stopRecog();
    else if(!recog.current && wantOn.current) start();
  };

  // tap-to-talk: skip the wake word once
  const askNow = ()=>{
    if(modeRef.current==="speaking"){ stopSpeaking(); setMode("idle"); return; }
    if(modeRef.current==="capture" && (buf.current||interimRef.current)){ finishCapture(); return; }
    if(listenRef.current==="tap"){ needTap.current=false; wantOn.current=true; if(!recog.current) start(); startCapture("",true); return; }
    if(state==="need_tap"||state==="blocked"||state==="off") enable();
    startCapture("",true);
  };
  const setListenMode = (m)=>{
    LS.set("echefe_listen_mode", m); listenRef.current=m; setListenModeS(m);
    if(m==="always"){ enable(); }
    else { setMode("idle"); clearTimeout(silenceT.current); clearTimeout(firstT.current); endTapSession(); }
  };

  useEffect(()=>{
    if(!SR) return;
    if(listenRef.current==="always") start();
    const vis = ()=>{ if(document.visibilityState==="visible"&&wantOn.current){ lockScreen(); if(!recog.current) start(); } };
    document.addEventListener("visibilitychange",vis);
    const firstTap = ()=>{ unlockAudio(); try{ if(!_actx) _actx=new (window.AudioContext||window.webkitAudioContext)(); _actx.resume(); }catch{} if(needTap.current && listenRef.current==="always"){ needTap.current=false; wantOn.current=true; setState("starting"); start(); } };
    document.addEventListener("pointerdown",firstTap);
    try{ window.speechSynthesis&&window.speechSynthesis.getVoices(); }catch{}
    return ()=>{ document.removeEventListener("visibilitychange",vis); document.removeEventListener("pointerdown",firstTap); stopRecog(); };
  },[]);

  useEffect(()=>{ if(firstLang.current){ firstLang.current=false; return; } if(recog.current){ stopRecog(); if(wantOn.current) start(); } },[lang]);

  return {state, mode, awaiting:mode==="capture", speaking:mode==="speaking", heard, speak, stopSpeaking:()=>{stopSpeaking(); setMode("idle"); endTapSession();}, enable, disable, askNow, listenMode, setListenMode, supported:!!SR};
}

function VoiceBar({ v, chefName }){
  let label, color="#8A6A40", bg="rgba(20,14,0,.92)", pulse=false;
  if(v.state==="unsupported"){ label="🎙️ Voz indisponível neste navegador — abra no Google Chrome"; }
  else if(v.state==="need_tap"){ label="🎙️ Toque aqui para ligar o “Ei Chef”"; color="#fff"; bg="#FF6B00"; pulse=true; }
  else if(v.state==="blocked"){ label="🎙️ Microfone bloqueado — toque no 🔒 da barra do Chrome → Permissões → Microfone"; color="#FFB800"; }
  else if(v.state==="off"){ label="🔇 “Ei Chef” desligado — toque para ligar"; }
  else if(v.state==="tap" && !v.awaiting && !v.speaking){ label="🎙️ Toque aqui para falar com o chef"; color="#FFF5E0"; }
  else if(v.speaking){ label=MIC_PAUSES_WHILE_TALKING?`⏹  ${chefName} falando — toque aqui para parar`:`⏹  ${chefName} falando — toque aqui ou diga “para”`; color="#fff"; bg="#C0392B"; }
  else if(v.awaiting){ label = v.heard?`🗣️ ${v.heard}`:`👂 ${chefName} está ouvindo… pode falar`; color="#fff"; bg="#27AE60"; pulse=true; }
  else if(v.state==="listening"){ label = "🎙️ Diga “Ei Chef…” a qualquer momento"; color="#FFF5E0"; }
  else { label="🎙️ Ligando o microfone…"; }
  const tap = ()=>{
    if(v.speaking){ v.stopSpeaking(); return; }
    if(v.listenMode==="tap"||v.state==="tap") { v.askNow(); return; }
    if(v.state==="need_tap"||v.state==="off"||v.state==="blocked") v.enable();
    else if(v.state==="listening") v.askNow();
  };
  if(v.awaiting&&v.heard) label = `🗣️ ${v.heard}   ·  toque para enviar`;
  return (
    <button onClick={tap} style={{flexShrink:0,width:"100%",border:"none",borderBottom:"1px solid #3D2800",background:bg,color,fontFamily:"'DM Sans',sans-serif",fontSize:v.speaking?14:12,fontWeight:700,padding:v.speaking?"12px 14px":"8px 14px",paddingTop:`calc(${v.speaking?12:8}px + env(safe-area-inset-top))`,textAlign:"center",cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",zIndex:120,animation:pulse?"cookPulse 1.4s infinite":"none"}}>
      {label}
    </button>
  );
}

// ─── COOKING TIMERS ──────────────────────────────────────────────────────────
const TIMER_RULE = `TIMERS: sempre que você der um tempo de cozimento, forno, descanso ou fervura (ex.: "deixe no fogo 4 por 25 minutos"), coloque no FIM da mensagem uma tag por tempo, assim: <timer minutes="25" label="Molho no fogo 4" stir="5"/>  — "label" curto (2-4 palavras); "stir" (opcional) = de quantos em quantos minutos lembrar de mexer, só quando precisar mexer de vez em quando. Se o usuário PEDIR para marcar/iniciar/ligar um timer, use auto="1" na tag (ex.: <timer minutes="25" label="Molho" auto="1"/>) e confirme em uma frase curta. Não escreva a tag dentro do cartão de receita: nele, use o campo "minutes" de cada passo.`;

const TIMER_RE = /<timer\b([^>]*)\/?>(?:<\/timer>)?/gi;
const parseTimers = (text)=>{
  const out=[];
  String(text).replace(TIMER_RE,(m,attrs)=>{
    const get=(k)=>{ const r=attrs.match(new RegExp(k+'\\s*=\\s*"([^"]*)"','i')); return r?r[1]:""; };
    const minutes=parseFloat(get("minutes").replace(",","."));
    if(minutes>0 && minutes<=600) out.push({minutes, label:get("label")||"Timer", stir:parseFloat(get("stir"))||0, auto:get("auto")==="1"});
    return "";
  });
  return out;
};
const stripTimers = (text)=>String(text).replace(TIMER_RE,"").replace(/[ \t]+\n/g,"\n").trim();

const fmtTime = (ms)=>{
  const s=Math.max(0,Math.ceil(ms/1000)), h=Math.floor(s/3600), m=Math.floor((s%3600)/60), ss=s%60;
  return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(ss).padStart(2,"0");
};
const minLabel = (min)=> min<1 ? `${Math.round(min*60)} s` : (min%1? `${min.toString().replace(".",",")} min` : `${min} min`);

let _alarmIv=null;
const alarmStart = ()=>{ if(_alarmIv) return; const ring=()=>{ beep(988,180); setTimeout(()=>beep(784,180),220); setTimeout(()=>beep(988,240),440); try{navigator.vibrate&&navigator.vibrate([300,150,300]);}catch{} }; ring(); _alarmIv=setInterval(ring,1600); };
const alarmStop = ()=>{ clearInterval(_alarmIv); _alarmIv=null; try{navigator.vibrate&&navigator.vibrate(0);}catch{} };

const notify = (title, body)=>{
  try{
    if(!("Notification" in window) || Notification.permission!=="granted") return;
    if(navigator.serviceWorker&&navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,icon:"icon-192.png",vibrate:[300,150,300],tag:"echefe-timer",renotify:true})).catch(()=>{ try{ new Notification(title,{body}); }catch{} });
    else new Notification(title,{body});
  }catch{}
};

function useTimers(speak){
  const [timers, setTimers] = useState(()=>loadJSON("echefe_timers",[]).filter(t=>!t.fired||Date.now()-t.endAt<30*60000));
  const [now, setNow] = useState(Date.now());
  const speakRef = useRef(speak); speakRef.current = speak;
  const wakeRef = useRef(null);
  useEffect(()=>{ saveJSON("echefe_timers",timers); },[timers]);
  useEffect(()=>{
    if(!timers.length){ try{ wakeRef.current&&wakeRef.current.release(); }catch{} wakeRef.current=null; return; }
    (async()=>{ try{ if(navigator.wakeLock&&!wakeRef.current){ wakeRef.current=await navigator.wakeLock.request("screen"); wakeRef.current.addEventListener("release",()=>{wakeRef.current=null;}); } }catch{} })();
    const iv=setInterval(()=>setNow(Date.now()),500);
    const vis=()=>{ if(document.visibilityState==="visible") setNow(Date.now()); };
    document.addEventListener("visibilitychange",vis);
    return ()=>{ clearInterval(iv); document.removeEventListener("visibilitychange",vis); };
  },[timers.length]);
  // fire alarms and stir reminders
  useEffect(()=>{
    let changed=false;
    const next = timers.map(t=>{
      if(!t.fired && now>=t.endAt){
        changed=true;
        alarmStart();
        notify("⏰ eChefe", `${t.label}: o tempo acabou!`);
        setTimeout(()=>speakRef.current&&speakRef.current(`${t.label}: o tempo acabou!`),1200);
        return {...t,fired:true};
      }
      if(!t.fired && t.stir>0 && now>=t.lastStir+t.stir*60000 && t.endAt-now>40000){
        changed=true;
        beep(660,150); setTimeout(()=>beep(660,150),250);
        notify("🥄 eChefe", `Hora de mexer: ${t.label}`);
        speakRef.current&&speakRef.current(`Hora de dar uma mexida: ${t.label}.`);
        return {...t,lastStir:now};
      }
      return t;
    });
    if(changed) setTimers(next);
    if(!next.some(t=>t.fired)) alarmStop();
  },[now]);

  const add = ({minutes,label,stir})=>{
    try{ if(!_actx) _actx=new (window.AudioContext||window.webkitAudioContext)(); _actx.resume(); }catch{}
    try{ if("Notification" in window && Notification.permission==="default") Notification.requestPermission(); }catch{}
    const t={id:Date.now()+Math.random(), label:String(label||"Timer").slice(0,40), total:minutes*60000, endAt:Date.now()+minutes*60000, stir:stir||0, lastStir:Date.now(), fired:false};
    setTimers(ts=>[...ts,t]); setNow(Date.now());
    return t;
  };
  const remove = (id)=>setTimers(ts=>{ const n=ts.filter(t=>t.id!==id); if(!n.some(t=>t.fired)) alarmStop(); return n; });
  const plus = (id, min=1)=>setTimers(ts=>ts.map(t=>t.id===id?(t.fired?{...t,fired:false,endAt:Date.now()+min*60000,total:min*60000}:{...t,endAt:t.endAt+min*60000,total:t.total+min*60000}):t));
  return {timers, now, add, remove, plus};
}

function TimerDock({ tm }){
  if(!tm.timers.length) return null;
  return (
    <div style={{flexShrink:0,background:"#140E00",borderTop:"1px solid #3D2800",padding:"6px 10px",display:"flex",flexDirection:"column",gap:6,maxHeight:170,overflowY:"auto",zIndex:110}}>
      {tm.timers.map(t=>{
        const left=t.endAt-tm.now, pct=Math.min(100,Math.max(0,100-left/t.total*100));
        const nextStir = t.stir>0&&!t.fired ? Math.max(0,t.lastStir+t.stir*60000-tm.now) : 0;
        return (
          <div key={t.id} onClick={t.fired?()=>tm.remove(t.id):undefined} style={{position:"relative",overflow:"hidden",borderRadius:12,border:`1px solid ${t.fired?"#E74C3C":"#3D2800"}`,background:t.fired?"#C0392B":"#1E1400",animation:t.fired?"cookPulse 1s infinite":"none",cursor:t.fired?"pointer":"default"}}>
            {!t.fired&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:pct+"%",background:"linear-gradient(90deg,rgba(255,107,0,.25),rgba(255,184,0,.18))",transition:"width .5s linear"}}/>}
            <div style={{position:"relative",display:"flex",alignItems:"center",gap:8,padding:"7px 10px"}}>
              <span style={{fontSize:18}}>{t.fired?"⏰":"⏱"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#FFF5E0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.label}</div>
                {t.fired?<div style={{fontSize:11,color:"#fff"}}>Pronto! Toque para parar o alarme</div>
                  :nextStir>0&&<div style={{fontSize:11,color:"#8A6A40"}}>🥄 mexer em {fmtTime(nextStir)}</div>}
              </div>
              {!t.fired&&<div style={{fontFamily:"'DM Sans',sans-serif",fontVariantNumeric:"tabular-nums",fontSize:20,fontWeight:700,color:"#FFB800",minWidth:62,textAlign:"right"}}>{fmtTime(left)}</div>}
              <button onClick={(e)=>{e.stopPropagation(); tm.plus(t.id,1);}} style={{background:"transparent",border:"1px solid #3D2800",borderRadius:10,color:"#FFF5E0",fontSize:12,fontWeight:700,padding:"5px 8px",cursor:"pointer"}}>+1</button>
              <button onClick={(e)=>{e.stopPropagation(); tm.remove(t.id);}} style={{background:"transparent",border:"none",color:t.fired?"#fff":"#8A6A40",fontSize:18,cursor:"pointer",padding:"0 4px"}}>✕</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimerPicker({ onStart, onClose }){
  const [label, setLabel] = useState("");
  const [custom, setCustom] = useState("");
  const go = (min)=>{ if(min>0){ onStart({minutes:min,label:label.trim()||`Timer ${minLabel(min)}`}); onClose(); } };
  return (
    <div style={{padding:"10px 14px",background:"rgba(10,6,0,.97)",borderTop:"1px solid #3D2800"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:13,fontWeight:700,color:"#FFF5E0"}}>⏱ Novo timer</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#8A6A40",fontSize:18,cursor:"pointer"}}>✕</button>
      </div>
      <input className="ci" style={{width:"100%",borderRadius:12,marginBottom:8}} placeholder="Para quê? (ex.: Molho, Massa, Forno)" value={label} onChange={e=>setLabel(e.target.value)}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {[1,3,5,8,10,12,15,20,25,30,45,60].map(m=>(
          <button key={m} onClick={()=>go(m)} style={{background:"#1E1400",border:"1px solid #3D2800",borderRadius:14,padding:"7px 11px",color:"#FFF5E0",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{m} min</button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <input className="ci" style={{borderRadius:12,minWidth:0}} inputMode="decimal" placeholder="Outro tempo (min)" value={custom} onChange={e=>setCustom(e.target.value)}/>
        <button className="sb" style={{width:"auto",borderRadius:12,padding:"0 14px",color:"#fff",fontWeight:700}} onClick={()=>go(parseFloat(String(custom).replace(",",".")))}>Iniciar</button>
      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function Chat({ chef, lang, prefs, voice, voiceCmd, seed, go, startTimer }) {
  const p = CHEFS[chef], L = LANGS[lang];
  const sysExtra = `\n\n${CHEF_RULES}\n\nPersonalidade: ${p.personality}\nNível do usuário: ${prefs.level}. Equipamento preferido: ${prefs.appliance}. Dieta: ${prefs.diet}.\nGosto pessoal do usuário: ${prefs.taste||DEFAULT_TASTE}`;

  const saved0 = useRef(loadJSON(CHAT_LS, null)).current;
  const [msgs, setMsgs] = useState(()=> saved0&&Array.isArray(saved0.msgs)&&saved0.msgs.length ? saved0.msgs : [{role:"chef",text:L.greeting}]);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState(()=> saved0&&Array.isArray(saved0.hist) ? saved0.hist : []);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pending, setPending] = useState([]);           // photos waiting to be sent with a comment
  const pendingRef = useRef([]);
  const [showPick, setShowPick] = useState(false);
  const camRef = useRef(null), galRef = useRef(null);
  useEffect(()=>{ pendingRef.current = pending; },[pending]);
  const addPhotos = async(e)=>{
    const files = [...(e.target.files||[])]; e.target.value=""; setShowPick(false);
    if(!files.length) return;
    const room = 4 - pendingRef.current.length;
    const take = files.slice(0, Math.max(0,room));
    const items = [];
    for(const f of take){ items.push({file:f, thumb: await makeThumb(f,320)}); }
    setPending(p=>[...p,...items].slice(0,4));
  };
  const [photoB64, setPhotoB64] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cookMode, setCookMode] = useState(false);
  const [cookAnalyzing, setCookAnalyzing] = useState(false);
  const [flashAnim, setFlashAnim] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const endRef = useRef(null);
  const fileRef = useRef(null);
  const cookFileRef = useRef(null);
  const busyRef = useRef(false);
  const histRef = useRef(saved0&&Array.isArray(saved0.hist) ? saved0.hist : []);
  const lastPhotoRef = useRef(null);

  useEffect(()=>{ histRef.current = hist; },[hist]);
  // keep the conversation even if the app is closed
  useEffect(()=>{
    if(busy) return;
    const base = msgs.slice(-80).map(m=>m.img&&!String(m.img).startsWith("data:")?{...m,img:null}:m);
    const h = hist.slice(-60);
    if(saveJSON(CHAT_LS,{msgs:base,hist:h})) return;
    // too big for the phone storage: drop photos of older cards, then all photos
    let lastCard=-1; base.forEach((m,i)=>{ if(m.card) lastCard=i; });
    const noOld = base.map((m,i)=>m.card&&i!==lastCard?{...m,card:{...m.card,hero:null,photos:{}}}:m);
    if(saveJSON(CHAT_LS,{msgs:noOld,hist:h})) return;
    saveJSON(CHAT_LS,{msgs:noOld.map(m=>m.card?{...m,card:{...m.card,hero:null,photos:{}}}:{...m,img:null,imgs:undefined}),hist:h});
  },[msgs,hist,busy]);
  const lastLen = useRef(0), firstScroll = useRef(true);
  useEffect(()=>{
    const grew = msgs.length > lastLen.current; lastLen.current = msgs.length;
    if(!grew && !busy) return;                       // ticking a box etc. → don't move the screen
    const behavior = firstScroll.current ? "auto" : "smooth"; firstScroll.current=false;
    const last = msgs[msgs.length-1];
    if(grew && last && last.card){ const el=document.getElementById("msg-"+(msgs.length-1)); if(el){ el.scrollIntoView({behavior,block:"start"}); return; } }
    endRef.current?.scrollIntoView({behavior});
  },[msgs.length,busy]);

  const voiceOn = voice.state==="listening";
  const speak = voice.speak;

  const handlePhoto = async(e)=>{
    const file = e.target.files?.[0]; if(!file) return;
    setPhotoPreview(await makeThumb(file,320) || URL.createObjectURL(file));
    setPhotoB64(file);
    e.target.value="";
  };

  const handleCookPhoto = async(e)=>{
    const file = e.target.files?.[0]; if(!file) return;
    setFlashAnim(true);
    setTimeout(()=>setFlashAnim(false),700);
    const url = await makeThumb(file,320) || URL.createObjectURL(file);
    makeThumb(file,560).then(t=>{ if(t) lastPhotoRef.current=t; });
    e.target.value="";
    setPhotoCount(n=>n+1);
    analyzeCookPhoto(file, url);
  };

  const rulesTurn = ()=>({role:"user",content:`${L.system}${sysExtra}\n\n${CARD_RULE}\n\n${TIMER_RULE}\n\n(Estas são suas instruções permanentes como chef. Responda à próxima mensagem do usuário seguindo-as. Seja conciso e prático, sem markdown pesado.)`});
  const recentHist = ()=>{ const h=histRef.current.slice(-40); let total=0, out=[]; for(let i=h.length-1;i>=0;i--){ total+=h[i].content.length; if(total>30000) break; out.unshift(h[i]); } if(out.length&&out[0].role!=="user") out.shift(); return out; };
  const addChef = (text)=>setMsgs(m=>[...m,{role:"chef",text}]);
  const done = ()=>{ busyRef.current=false; setBusy(false); setAnalyzing(false); setCookAnalyzing(false); };

  const analyzePhoto = async()=>{
    if(!photoB64||busyRef.current) return;
    setAnalyzing(true); busyRef.current=true; setBusy(true);
    setMsgs(m=>[...m,{role:"user",text:L.analyzePhoto||"📷 Analisando ingredientes",img:photoPreview}]);
    const file = photoB64;
    setPhotoPreview(null); setPhotoB64(null);
    const prompt = `${L.system}${sysExtra}\n\nA imagem anexada é uma foto dos ingredientes que o usuário tem em casa. Liste só os ingredientes que dá para identificar com segurança na foto (não invente). Sugira 3 pratos saborosos e práticos com eles, cada um com nome, tempo, dificuldade e equipamento ideal. No fim, pergunte para quantas pessoas ele vai cozinhar e qual prato quer fazer.`;
    try{
      const {text} = await askAI(prompt,{images:file,cache:false});
      addChef(text);
      setHist(h=>[...h,{role:"user",content:"[Enviei uma foto dos meus ingredientes]"},{role:"assistant",content:text}]);
      if(voiceOn) speak(text,true);
    }catch(e){ addChef(AI_ERR(e&&e.code)); }
    done();
  };

  const analyzeCookPhoto = async(file, previewUrl)=>{
    if(busyRef.current) return;
    busyRef.current=true; setBusy(true); setCookAnalyzing(true);
    setMsgs(m=>[...m,{role:"user",text:"📸 Olha como está ficando!",img:previewUrl,isCook:true}]);
    const ctx = recentHist().map(t=>`${t.role==="user"?"Usuário":"Chef"}: ${t.content}`).join("\n").slice(-8000);
    const prompt = `${L.system}${sysExtra}

${ctx?`Conversa até agora:\n${ctx}\n\n`:""}A imagem anexada mostra um alimento sendo PREPARADO/COZIDO agora (não ingredientes crus).
Analise com cuidado só o que é VISÍVEL na foto: douramento da carne, quantidade de líquido na panela, consistência e redução do molho, coloração dos ingredientes, textura das massas, sinais de caramelização ou de queimado, e o estado geral do preparo. Não invente detalhes que a imagem não mostra. Se for preciso saber a temperatura interna (carnes), recomende termômetro culinário com a temperatura em °C. Leve em conta a conversa acima (o que já foi para a panela).
Responda APENAS com um objeto JSON, sem texto extra:
{"score":8,"comment":"o que você observa na foto, em 1-2 frases","fix":"o que corrigir agora (ou vazio se está tudo certo)","nextStep":"próximo passo concreto agora"}`;
    try{
      const parsed = await askAI(prompt,{images:file,cache:false},true);
      const score = Math.min(10,Math.max(1,Number(parsed&&parsed.score)||7));
      const comment = String((parsed&&parsed.comment)||"Está indo muito bem!");
      const nextStep = parsed&&parsed.nextStep?String(parsed.nextStep):null;
      const fix = parsed&&parsed.fix?String(parsed.fix).trim():"";
      setMsgs(m=>[...m,{role:"chef",text:"",isCookFeedback:true,score,comment,fix,nextStep}]);
      setHist(h=>[...h,{role:"user",content:"[Enviei uma foto do preparo]"},{role:"assistant",content:`Nota ${score}/10. ${comment}${fix?" Corrigir: "+fix:""}${nextStep?" Próximo passo: "+nextStep:""}`}]);
      if(voiceOn) speak(`${comment}. ${fix?fix+". ":""}${nextStep?"Próximo passo: "+nextStep:""}`,true);
    }catch(e){ addChef(AI_ERR(e&&e.code)); }
    done();
  };

  const sendText = async(override, viaVoice)=>{
    const photos = pendingRef.current;
    const msg=(typeof override==="string"?override:input).trim(); if((!msg&&!photos.length)||busyRef.current) return;
    if(typeof override!=="string") setInput("");
    busyRef.current=true; setBusy(true);
    if(photos.length){ setPending([]); pendingRef.current=[]; }
    setMsgs(m=>[...m,{role:"user",text:msg?(viaVoice?`🎙️ ${msg}`:msg):"",imgs:photos.length?photos.map(x=>x.thumb).filter(Boolean):undefined}]);
    const VOICE_RULE = "\n\n(Esta mensagem foi FALADA na cozinha. Se for um pedido de receita, mande o cartão de receita normalmente: só a introdução e a pergunta final serão lidas em voz alta. Em qualquer outro caso, responda como numa conversa: no máximo 2 ou 3 frases curtas, sem listas, uma etapa por vez. Se a fala parecer cortada ou sem sentido, peça para repetir.)";
    const n = photos.length;
    const photoNote = n?`(Enviei ${n} foto${n>1?"s":""} junto com esta mensagem.)\n`:"";
    const userText = photoNote + (msg || "O que você vê nessas fotos? O que dá para fazer / como está?");
    const turns=[rulesTurn(),...recentHist(),{role:"user",content:viaVoice?userText+VOICE_RULE:userText}];
    try{
      const {text} = await askAI(turns,{cache:false,maxTokens:3500,images:n?photos.map(x=>x.file):undefined});
      const card = parseCard(text);
      if(card){
        setMsgs(m=>[...m,...(card.before?[{role:"chef",text:card.before}]:[]),{role:"chef",text:"",card},...(card.after?[{role:"chef",text:card.after}]:[])]);
        setHist(h=>[...h,{role:"user",content:(n?`[Enviei ${n} foto${n>1?"s":""}] `:"")+(msg||"")},{role:"assistant",content:cardAsText(card)}]);
        if(viaVoice||voiceOn) speak(`${card.intro} ${card.question}`,true);
        fillPhotos(card);
      } else {
        const tms = parseTimers(text);
        const clean = stripTimers(text.replace(/<\/?recipe>/gi,""));
        const timers = tms.map(t=>{ if(t.auto&&startTimer){ startTimer(t); return {...t,started:true}; } return t; });
        setMsgs(m=>[...m,{role:"chef",text:clean,timers:timers.length?timers:undefined}]);
        setHist(h=>[...h,{role:"user",content:(n?`[Enviei ${n} foto${n>1?"s":""}] `:"")+(msg||"")},{role:"assistant",content:clean+(timers.length?`\n(${timers.map(t=>`${t.started?"Timer iniciado":"Timer sugerido"}: ${t.label} ${t.minutes} min`).join("; ")})`:"")}]);
        if(viaVoice) speak(clean,true);
      }
    }catch(e){ addChef(AI_ERR(e&&e.code)); }
    done();
  };

  // ─── RECIPE CARD STATE ───
  const updateCard = (id, fn)=>setMsgs(ms=>ms.map(x=>x.card&&x.card.id===id?{...x,card:fn(x.card)}:x));
  const toggleIn = (arr,i)=>arr.includes(i)?arr.filter(x=>x!==i):[...arr,i];
  const fillPhotos = async(c)=>{
    if(!canImages()) return;
    const hero = await genImage(`${c.title}, finished dish beautifully plated`);
    if(!hero) return;                                   // no image access → keep icons
    updateCard(c.id, x=>({...x,hero}));
    for(let i=0;i<c.steps.length;i++){
      const img = await genImage(c.steps[i].img||c.steps[i].title);
      if(!img) break;
      updateCard(c.id, x=>({...x,photos:{...x.photos,[i]:img}}));
    }
  };
  const lastCardHero = ()=>{ for(let i=msgs.length-1;i>=0;i--){ if(msgs[i].card&&msgs[i].card.hero) return msgs[i].card.hero; } return null; };

  // ─── SAVE RECIPE (favorites with my adjustments) ───
  const lastCard = ()=>{ for(let i=msgs.length-1;i>=0;i--){ if(msgs[i].card) return msgs[i].card; } return null; };
  const saveRecipe = async()=>{
    if(savingRecipe||busyRef.current) return;
    const convo = histRef.current.map(t=>`${t.role==="user"?"Usuário":"Chef"}: ${t.content}`).join("\n").slice(-20000);
    const card = lastCard();
    if(convo.length<40 && !card){ addChef("Ainda não cozinhamos nada nesta conversa. Quando terminarmos um prato, toque em ⭐ Salvar receita! 😉"); return; }
    setSavingRecipe(true);
    const finish = (rec, note)=>{
      const ok = saveRecipes([rec,...loadRecipes()]);
      addChef(ok?`⭐ Receita salva: ${rec.title}!\n\nEstá na aba ⭐ Receitas${note||", com os seus ajustes"}${rec.photo?" e a foto":""}. Quando quiser repetir do seu jeito, é só abrir e tocar em 🔁 Cozinhar de novo.`:"Não consegui salvar: a memória do celular para o app está cheia. Apague alguma receita antiga em ⭐ Receitas.");
      if(voiceOn&&ok) speak(`Receita salva: ${rec.title}!`);
    };
    const base = {id:Date.now(), photo:lastPhotoRef.current||lastCardHero()||null, notes:"", chef, createdAt:Date.now(), cooked:[Date.now()]};
    try{
      const r = await askAI(`Abaixo está uma conversa de cozinha entre o usuário e o chef. Escreva a receita EXATAMENTE como o usuário fez, incluindo as mudanças e adaptações dele (número de pessoas, quantidades, tempos, intensidade do fogo de 1 a 9, temperaturas em °C). Escreva em ${LANG_NAME[lang]||"português do Brasil"}. Seja objetivo: cada passo em 1-3 frases, no máximo 10 passos.
Responda APENAS com JSON:
{"title":"nome do prato","emoji":"🍝","servings":"4 pessoas","time":"45 min","ingredients":["500 g de ...", "..."],"steps":["passo 1 ...","passo 2 ..."],"adjustments":["o que o usuário mudou ou o que deu certo, ex.: usei 2 dentes de alho a mais","fogo 6 de 9 por 12 min deixou no ponto"],"tips":["dica do chef para a próxima vez"]}

CONVERSA:
${convo}`,{cache:false,maxTokens:6000},true);
      if(!r||!r.title||!Array.isArray(r.ingredients)) throw {code:"invalid_json"};
      finish({...base, title:String(r.title), emoji:String(r.emoji||"🍽️"), servings:String(r.servings||""), time:String(r.time||""),
        ingredients:r.ingredients.map(String), steps:(r.steps||[]).map(String), adjustments:(r.adjustments||[]).map(String), tips:(r.tips||[]).map(String)});
    }catch(e){
      if(card){
        // the AI summary failed: save straight from the recipe card in the chat
        finish({...base, title:card.title, emoji:card.emoji, servings:card.servings, time:card.time,
          ingredients:card.ingredients.map(x=>x.note?`${x.name} (${x.note})`:x.name), steps:card.steps.map(x=>x.title?`${x.title}: ${x.text}`:x.text),
          adjustments:[], tips:card.tips.map(x=>x.text?`${x.title} ${x.text}`:x.title)}, " (copiada do cartão de receita — os ajustes da conversa não entraram; escreva-os em 🗒️ Minhas anotações)");
      } else addChef(e&&e.code==="invalid_json"?"Não consegui montar a receita agora. Toque em ⭐ Salvar receita de novo, por favor. 🙏":AI_ERR(e&&e.code));
    }
    setSavingRecipe(false);
  };
  const newChat = ()=>{
    if(msgs.length>1 && !window.confirm("Começar uma conversa nova? A conversa atual será apagada (receitas salvas continuam em ⭐ Receitas).")) return;
    setMsgs([{role:"chef",text:L.greeting}]); setHist([]); histRef.current=[]; lastPhotoRef.current=null; setCookMode(false); setPhotoCount(0);
  };
  useEffect(()=>{ if(seed&&seed.text){ sendText(seed.text); } },[seed]);

  // ─── VOICE (engine lives in App) ───
  useEffect(()=>{
    if(!voiceCmd) return;
    if(!voiceCmd.text) return;
    if(busyRef.current){ speak("Um momento, ainda estou pensando!"); return; }
    sendText(voiceCmd.text,true);
  },[voiceCmd]);
  const tapMic = ()=>{ voice.askNow(); };
  const listening = voice.awaiting;

  const enterCookMode = () => {
    setCookMode(true);
    setMsgs(m=>[...m,{role:"chef",text:`${p.emoji} Modo Cozinha ativado! Estou do seu lado.\n\nTire fotos a qualquer momento durante o preparo — vou analisar a cor, o ponto e a textura e te dizer exatamente o próximo passo!\n\n🗣️ Mãos ocupadas? É só dizer \"Ei Chef\" e a sua pergunta.\n\n🔥 Pode começar!`}]);
  };

  return (
    <div className="screen" style={{display:"flex",flexDirection:"column",paddingBottom:0,overflow:"hidden"}}>
      {flashAnim&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"white",zIndex:999,animation:"snapFlash .6s ease-out forwards",pointerEvents:"none"}}/>}

      {/* HEADER */}
      <div style={{padding:"16px 16px 12px",background:"rgba(10,6,0,.9)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:5}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:44,height:44,background:p.bg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:`0 4px 20px ${p.color}55`}}>{p.emoji}</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:T.cream}}>{p.name}</div>
              <div style={{fontSize:11,color:cookMode?T.accent:T.green,display:"flex",alignItems:"center",gap:4}}>
                {cookMode
                  ?<><span style={{width:6,height:6,background:T.accent,borderRadius:"50%",display:"inline-block",animation:"cookPulse 1.2s infinite"}}/>🍳 Modo Cozinha</>
                  :<>● Online · {L.name}</>
                }
              </div>
            </div>
          </div>
          {cookMode?(
            <button onClick={()=>{setCookMode(false);setPhotoCount(0);}} style={{background:"rgba(255,107,0,.15)",border:`1px solid ${T.accent}`,borderRadius:20,padding:"6px 12px",color:T.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {L.exitCook}
            </button>
          ):(
            <button onClick={enterCookMode} style={{background:`linear-gradient(135deg,${p.color},${p.color}bb)`,border:"none",borderRadius:20,padding:"8px 14px",color:"white",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 4px 14px ${p.color}44`}}>
              {L.cookMode}
            </button>
          )}
        </div>

        {/* COOKING MODE SNAP BUTTON */}
        {cookMode&&(
          <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center"}}>
            <input ref={cookFileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={handleCookPhoto}/>
            <button
              onClick={()=>cookFileRef.current?.click()}
              disabled={cookAnalyzing}
              style={{flex:1,background:cookAnalyzing?"#1E1400":`linear-gradient(135deg,${p.color},${p.color}cc)`,border:`2px solid ${cookAnalyzing?T.border:p.color}`,borderRadius:14,padding:"12px",color:"white",fontSize:14,fontWeight:700,cursor:cookAnalyzing?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:".2s"}}
            >
              <span>{cookAnalyzing?(L.analyzing):(L.snapBtn)}</span>
            </button>
            {photoCount>0&&<div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 10px",fontSize:11,color:T.muted,textAlign:"center",minWidth:46}}>
              <div style={{fontSize:16}}>📷</div>
              <div style={{fontWeight:700,color:T.cream,fontSize:13}}>{photoCount}</div>
            </div>}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      {(
        <div style={{display:"flex",gap:8,padding:"8px 16px",borderBottom:`1px solid ${T.border}`,background:"rgba(10,6,0,.85)",position:"relative",zIndex:4}}>
          <button onClick={()=>setShowTimer(v=>!v)} style={{background:showTimer?"rgba(255,107,0,.15)":T.card,border:`1px solid ${showTimer?T.accent:T.border}`,borderRadius:12,padding:"8px 12px",color:T.cream,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>⏱ Timer</button>
          {msgs.length>1&&<button onClick={saveRecipe} disabled={savingRecipe||busy} style={{flex:1,background:"rgba(255,184,0,.12)",border:`1px solid ${T.gold}55`,borderRadius:12,padding:"8px 10px",color:T.gold,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{savingRecipe?"⏳ Salvando...":"⭐ Salvar"}</button>}
          {msgs.length>1&&<button onClick={newChat} disabled={busy} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 12px",color:T.cream,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🗒️ Nova conversa</button>}
        </div>
      )}
      {showTimer&&<TimerPicker onStart={(t)=>startTimer&&startTimer(t)} onClose={()=>setShowTimer(false)}/>}

      {/* MESSAGES */}
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12,padding:16}}>
          {msgs.map((m,i)=>(
            <div key={i} id={"msg-"+i} style={{scrollMarginTop:8,alignSelf:m.role==="chef"?"flex-start":"flex-end",maxWidth:m.card?"100%":"88%",display:"flex",flexDirection:"column",width:m.card?"100%":m.isCookFeedback?"90%":"auto"}}>
              {m.role==="chef"&&(
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <div style={{width:22,height:22,background:p.bg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{p.emoji}</div>
                  <span style={{fontSize:11,color:T.muted}}>{p.name}</span>
                </div>
              )}
              {m.imgs&&m.imgs.length>0&&(
                <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end",marginBottom:6}}>
                  {m.imgs.map((src,k)=><img key={k} src={src} alt="" style={{width:m.imgs.length>1?96:160,height:m.imgs.length>1?96:120,borderRadius:12,objectFit:"cover",border:`2px solid ${T.border}`}}/>)}
                </div>
              )}
              {m.img&&(
                <div style={{position:"relative",marginBottom:6,alignSelf:m.role==="chef"?"flex-start":"flex-end"}}>
                  <img src={m.img} alt="" style={{width:m.isCook?160:120,height:m.isCook?120:90,borderRadius:12,objectFit:"cover",border:`2px solid ${m.isCook?p.color:T.border}`}}/>
                  {m.isCook&&<div style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.7)",borderRadius:8,padding:"2px 7px",fontSize:10,color:"white",fontWeight:700}}>📸 AO VIVO</div>}
                </div>
              )}
              {m.card?(
                <RecipeCard card={m.card} color={p.color} hasImgKey={canImages()}
                  onToggleHave={(k)=>updateCard(m.card.id,c=>({...c,have:toggleIn(c.have,k)}))}
                  onToggleDone={(k)=>updateCard(m.card.id,c=>({...c,done:toggleIn(c.done,k)}))}
                  onTimer={(t)=>startTimer&&startTimer(t)}
                  onReview={()=>sendText(`Chef, vamos repassar a lista de todos os ingredientes de "${m.card.title}" antes de começar. Me mande o cartão completo de novo, com a lista para eu marcar.`)}
                  onServings={(n)=>sendText(`Ajuste a receita "${m.card.title}" para ${n} pessoas e me mande o cartão completo de novo, com as quantidades recalculadas.`)}
                  onStart={()=>sendText(`Vamos começar a fazer ${m.card.title}!${m.card.have.length<m.card.ingredients.length?` Dos ingredientes, eu tenho: ${m.card.have.map(k=>m.card.ingredients[k].name).join(", ")||"(ainda não marquei)"}.`:" Tenho todos os ingredientes."} Me guie a partir do passo 1, uma ou duas etapas por vez.`)}/>
              ):m.isCookFeedback?(
                <CookFeedback score={m.score} comment={m.comment} fix={m.fix} nextStep={m.nextStep} chefColor={p.color} emoji={p.emoji}/>
              ):(
                <>{m.text&&<div className={`cbbl ${m.role}`} style={{whiteSpace:"pre-wrap"}}>{String(m.text).split(/\*\*(.+?)\*\*/g).map((part,k)=>k%2?<b key={k}>{part}</b>:part)}</div>}
                {m.timers&&m.timers.map((t,k)=>(
                  <button key={k} disabled={t.started} onClick={()=>{ startTimer&&startTimer(t); setMsgs(ms=>ms.map((x,j)=>j===i?{...x,timers:x.timers.map((y,q)=>q===k?{...y,started:true}:y)}:x)); }}
                    style={{marginTop:6,alignSelf:"flex-start",background:t.started?"transparent":"rgba(255,184,0,.14)",border:`1px solid ${t.started?T.border:T.gold+"88"}`,borderRadius:20,padding:"7px 14px",color:t.started?T.muted:T.gold,fontSize:13,fontWeight:700,cursor:t.started?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    {t.started?"✓ Timer iniciado":"⏱ Iniciar"} {minLabel(t.minutes)} — {t.label}{t.stir>0?` · mexer a cada ${minLabel(t.stir)}`:""}
                  </button>))}</>
              )}
            </div>
          ))}
          {busy&&(
            <div style={{alignSelf:"flex-start"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <div style={{width:22,height:22,background:p.bg,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{p.emoji}</div>
                <span style={{fontSize:11,color:T.muted}}>{p.name}</span>
                {cookAnalyzing&&<span style={{fontSize:9,color:T.accent,fontWeight:700}}>📸 analisando foto...</span>}
              </div>
              <div className="cbbl chef"><div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
        {msgs.length===1&&(
          <div style={{padding:"0 16px 8px"}}>
            {L.chips.map((s,i)=><button key={i} className="chip" onClick={()=>sendText(s)}>{s}</button>)}
          </div>
        )}
      </div>

      {/* PHOTO TRAY (up to 4 photos + one comment) */}
      <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={addPhotos}/>
      <input ref={galRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={addPhotos}/>
      {showPick&&(
        <div style={{display:"flex",gap:8,padding:"8px 14px",background:"rgba(10,6,0,.97)",borderTop:`1px solid ${T.border}`}}>
          <button className="bs" style={{flex:1,margin:0,padding:"10px"}} onClick={()=>camRef.current?.click()}>📷 Tirar foto</button>
          <button className="bs" style={{flex:1,margin:0,padding:"10px"}} onClick={()=>galRef.current?.click()}>🖼️ Galeria</button>
          <button className="bs" style={{width:"auto",margin:0,padding:"10px 14px"}} onClick={()=>setShowPick(false)}>✕</button>
        </div>
      )}
      {pending.length>0&&(
        <div style={{padding:"10px 14px 4px",background:"rgba(10,6,0,.97)",borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center",overflowX:"auto",padding:"8px 8px 2px 2px"}}>
            {pending.map((x,k)=>(
              <div key={k} style={{position:"relative",flexShrink:0}}>
                <img src={x.thumb} alt="" style={{width:64,height:64,borderRadius:10,objectFit:"cover",border:`2px solid ${p.color}`}}/>
                <button onClick={()=>setPending(ps=>ps.filter((_,j)=>j!==k))} style={{position:"absolute",top:-7,right:-7,width:22,height:22,borderRadius:"50%",border:"none",background:"#000c",color:"#fff",fontSize:13,cursor:"pointer",lineHeight:"22px",padding:0}}>×</button>
              </div>))}
            {pending.length<4&&<>
              <button onClick={()=>camRef.current?.click()} style={{width:64,height:64,flexShrink:0,borderRadius:10,border:`2px dashed ${T.border}`,background:"transparent",color:T.cream,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>＋📷<br/>Foto</button>
              <button onClick={()=>galRef.current?.click()} style={{width:64,height:64,flexShrink:0,borderRadius:10,border:`2px dashed ${T.border}`,background:"transparent",color:T.cream,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🖼️<br/>Galeria</button>
            </>}
          </div>
          <div style={{fontSize:11,color:T.muted,marginTop:6}}>{pending.length} de 4 fotos · escreva ou fale seu comentário e envie</div>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="cir">
        <button className="pbtn" onClick={()=>pending.length?camRef.current?.click():setShowPick(s=>!s)} title={L.sendPhoto} style={pending.length?{borderColor:p.color}:{}}>
          <div style={{width:20,height:20,color:pending.length?p.color:T.muted}}>{IC.cam}</div>
        </button>
        <button className="pbtn" onClick={tapMic} title="Falar com o Chef" style={listening?{background:T.accent,borderColor:T.accent,animation:"cookPulse 1.2s infinite"}:{}}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={listening?"white":T.muted} strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/></svg>
        </button>
        <input className="ci" style={{minWidth:0}} placeholder={listening?"Ouvindo… fale agora":pending.length?"Comentário sobre as fotos…":cookMode?"Pergunte ao chef enquanto cozinha...":(L.typeMsg)} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendText()}/>
        <button className="sb" onClick={()=>sendText()} disabled={(!input.trim()&&!pending.length)||busy}>
          <div style={{width:16,height:16,color:"white"}}>{IC.send}</div>
        </button>
      </div>
    </div>
  );
}

// ─── WEEK ─────────────────────────────────────────────────────────────────────
function Week({ lang, prefs }) {
  const L = LANGS[lang];
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const generate = async()=>{
    setLoading(true);
    try{
      const parsed=await askAI(L.system+"\n\n"+`Crie um cardápio semanal completo (segunda a domingo) com almoço e jantar para cada dia. Culinária: ${prefs.cuisine}. Dieta: ${prefs.diet}. Equipamento: ${prefs.appliance}. Nível: ${prefs.level}. Responda APENAS em JSON válido: {"days":[{"day":"Segunda","lunch":{"name":"Nome","time":"30 min","cal":"400 kcal"},"dinner":{"name":"Nome","time":"20 min","cal":"300 kcal"}}]}`,{cache:false},true);
      if(Array.isArray(parsed&&parsed.days)&&parsed.days.length) { setPlan(parsed.days); setErr(""); }
      else setErr(AI_ERR("invalid_json"));
    }catch(e){ setErr(AI_ERR(e&&e.code)); }
    setLoading(false);
  };
  const FALLBACK=[
    {day:L.days[0],lunch:{name:"Frango grelhado com arroz",time:"35 min",cal:"480 kcal"},dinner:{name:"Sopa de legumes",time:"25 min",cal:"280 kcal"}},
    {day:L.days[1],lunch:{name:"Macarrão ao molho",time:"30 min",cal:"520 kcal"},dinner:{name:"Salada com atum",time:"10 min",cal:"240 kcal"}},
    {day:L.days[2],lunch:{name:"Arroz frito na airfryer",time:"25 min",cal:"420 kcal"},dinner:{name:"Omelete de legumes",time:"15 min",cal:"290 kcal"}},
    {day:L.days[3],lunch:{name:"Feijão com couve",time:"40 min",cal:"510 kcal"},dinner:{name:"Frango ao forno",time:"35 min",cal:"380 kcal"}},
    {day:L.days[4],lunch:{name:"Risoto especial",time:"45 min",cal:"540 kcal"},dinner:{name:"Salmão grelhado",time:"20 min",cal:"420 kcal"}},
    {day:L.days[5],lunch:{name:"Churrasco na grelha",time:"60 min",cal:"620 kcal"},dinner:{name:"Sanduíche especial",time:"15 min",cal:"380 kcal"}},
    {day:L.days[6],lunch:{name:"Feijoada completa",time:"90 min",cal:"680 kcal"},dinner:{name:"Caldo verde",time:"30 min",cal:"310 kcal"}},
  ];
  const data = plan||FALLBACK;
  return (
    <div className="screen">
      <div className="hdr"><div className="logo" style={{fontSize:22}}>{L.weekPlan}</div><div className="sub">{prefs.cuisine} · {prefs.diet}</div></div>
      {data.map((d,i)=>(
        <div key={i} className="dc">
          <div className="dh"><div style={{fontWeight:600,fontSize:14,color:T.cream}}>{d.day}</div><div style={{fontSize:10,color:T.accent,background:"rgba(255,107,0,.15)",padding:"2px 8px",borderRadius:10}}>{prefs.cuisine}</div></div>
          <div className="mr"><div style={{fontSize:11,color:T.muted,minWidth:52,paddingTop:2}}>☀️ {L.lunch}</div><div><div style={{fontSize:13,color:T.cream,fontWeight:500}}>{d.lunch.name}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{d.lunch.time} · {d.lunch.cal}</div></div></div>
          <div className="mr"><div style={{fontSize:11,color:T.muted,minWidth:52,paddingTop:2}}>🌙 {L.dinner}</div><div><div style={{fontSize:13,color:T.cream,fontWeight:500}}>{d.dinner.name}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{d.dinner.time} · {d.dinner.cal}</div></div></div>
        </div>
      ))}
      {err&&<div className="card" style={{fontSize:13,color:T.gold}}>{err}</div>}
      <button className="bp" onClick={generate} disabled={loading}>{loading?"⏳ Gerando...":L.generate}</button>
      <div style={{height:8}}/>
    </div>
  );
}

// ─── SHOP ─────────────────────────────────────────────────────────────────────
function Shop({ lang, prefs }) {
  const L = LANGS[lang];
  const [items, setItems] = useState([
    {id:1,text:"Frango (1kg)",done:false,cat:"🥩 Carnes"},
    {id:2,text:"Arroz (2kg)",done:false,cat:"🌾 Grãos"},
    {id:3,text:"Brócolis",done:true,cat:"🥦 Vegetais"},
    {id:4,text:"Ovos (12 un)",done:false,cat:"🥚 Laticínios"},
    {id:5,text:"Azeite",done:false,cat:"🫙 Temperos"},
    {id:6,text:"Alho",done:false,cat:"🫙 Temperos"},
    {id:7,text:"Tomate",done:false,cat:"🥦 Vegetais"},
  ]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const toggle=(id)=>setItems(p=>p.map(x=>x.id===id?{...x,done:!x.done}:x));
  const remove=(id)=>setItems(p=>p.filter(x=>x.id!==id));
  const add=()=>{ if(!newItem.trim())return; setItems(p=>[...p,{id:Date.now(),text:newItem.trim(),done:false,cat:"📦 Outros"}]); setNewItem(""); };
  const clearDone=()=>setItems(p=>p.filter(x=>!x.done));
  const generateList=async()=>{
    setLoading(true);
    try{
      const parsed=await askAI(L.system+"\n\n"+`Gere uma lista de compras para uma semana. Culinária: ${prefs.cuisine}. Dieta: ${prefs.diet}. Responda APENAS em JSON: {"items":[{"text":"Frango (1kg)","cat":"🥩 Carnes"}]}`,{cache:false},true);
      if(Array.isArray(parsed&&parsed.items)&&parsed.items.length){ setItems(parsed.items.map((x,i)=>({id:i+1,text:String(x.text),done:false,cat:String(x.cat||"📦 Outros")}))); setErr(""); }
      else setErr(AI_ERR("invalid_json"));
    }catch(e){ setErr(AI_ERR(e&&e.code)); }
    setLoading(false);
  };
  const cats=[...new Set(items.map(x=>x.cat))];
  const done=items.filter(x=>x.done).length;
  return (
    <div className="screen">
      <div className="hdr"><div className="logo" style={{fontSize:22}}>{L.shopList}</div><div className="sub">{done}/{items.length} itens</div></div>
      <div style={{margin:"0 16px 12px"}}><div style={{background:T.border,borderRadius:10,height:6,overflow:"hidden"}}><div style={{width:`${items.length>0?(done/items.length)*100:0}%`,height:"100%",background:`linear-gradient(90deg,${T.accent},${T.gold})`,borderRadius:10,transition:"width .3s"}}/></div></div>
      <div style={{display:"flex",gap:8,margin:"0 16px 16px"}}>
        <input className="ci" style={{borderRadius:12}} placeholder={L.addItem} value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
        <button onClick={add} style={{background:T.accent,border:"none",borderRadius:12,padding:"0 16px",color:"white",cursor:"pointer",fontSize:20,fontWeight:300}}>+</button>
      </div>
      {cats.map(cat=>(
        <div key={cat} className="card" style={{paddingBottom:4}}>
          <div style={{fontSize:12,fontWeight:600,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{cat}</div>
          {items.filter(x=>x.cat===cat).map(item=>(
            <div key={item.id} className="sli">
              <button onClick={()=>toggle(item.id)} style={{width:24,height:24,borderRadius:8,border:`2px solid ${item.done?T.accent:T.border}`,background:item.done?T.accent:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:".2s"}}>
                {item.done&&<div style={{width:14,height:14,color:"white"}}>{IC.check}</div>}
              </button>
              <div style={{flex:1,fontSize:14,color:item.done?T.muted:T.cream,textDecoration:item.done?"line-through":"none",transition:".2s"}}>{item.text}</div>
              <button onClick={()=>remove(item.id)} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,opacity:.6}}><div style={{width:16,height:16}}>{IC.trash}</div></button>
            </div>
          ))}
        </div>
      ))}
      {done>0&&<button className="bs" onClick={clearDone}>{L.clearDone} ({done})</button>}
      {err&&<div className="card" style={{fontSize:13,color:T.gold}}>{err}</div>}
      <button className="bp" onClick={generateList} disabled={loading}>{loading?"⏳ Gerando...":L.shopGen}</button>
      <div style={{height:8}}/>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ chef, setChef, lang, setLang, prefs, setPrefs, voice, onFeedback }) {
  const L = LANGS[lang];
  const [local, setLocal] = useState({...prefs});
  return (
    <div className="screen">
      <div className="hdr"><div className="logo" style={{fontSize:22}}>{L.profile}</div></div>
      <InviteCard/>
      {inviteCode()&&workerURL() && <button className="bp" style={{width:"100%",margin:"0 0 12px"}} onClick={onFeedback}>💬 Enviar feedback / sugestão</button>}
      {inviteCode() ? (
        <details className="card"><summary style={{fontSize:12,color:T.muted,textTransform:"uppercase",letterSpacing:1,cursor:"pointer"}}>⚙️ Avançado: chaves próprias</summary>
          <div style={{marginTop:10}}><ApiKeyCard/><VoiceKeyCard chef={chef} lang={lang}/></div>
        </details>
      ) : <><ApiKeyCard/><VoiceKeyCard chef={chef} lang={lang}/></>}
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>🎙️ Ei Chef (voz)</div>
        <div style={{fontSize:13,color:T.cream,lineHeight:1.5,marginBottom:10}}>
          {voice.listenMode==="tap"&&voice.supported?"Toque no 🎙️ (ou na faixa do topo), espere o bip e fale. Depois da resposta do chef, ele escuta mais uma vez para você continuar."
           :voice.state==="listening"?"Ligado: o microfone fica ouvindo enquanto o app está aberto. Diga “Ei Chef” e a pergunta."
           :voice.state==="unsupported"?"Este navegador não tem reconhecimento de voz. Abra o eChefe no Google Chrome."
           :voice.state==="starting"?"Ligando o microfone… (se o Chrome perguntar, toque em Permitir)."
           :voice.state==="need_tap"?"Toque em “Ligar” para o Chrome pedir o microfone."
           :voice.state==="blocked"?"Microfone bloqueado. No Chrome: toque no 🔒 ao lado do endereço → Permissões → Microfone → Permitir."
           :"Desligado."}
        </div>
        {voice.supported&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["tap","👆 Toque para falar","O microfone só liga quando você toca no 🎙️ ou na faixa do topo. Sem bips à toa. Recomendado no Android."],
            ["always","👂 Sempre ouvindo “Ei Chef”","Fica ouvindo o tempo todo. No Android o celular apita toda vez que o microfone reinicia."]].map(([k,t,d])=>(
            <button key={k} onClick={()=>voice.setListenMode(k)} style={{textAlign:"left",background:voice.listenMode===k?"rgba(255,107,0,.12)":T.card,border:`1px solid ${voice.listenMode===k?T.accent:T.border}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              <div style={{fontSize:14,fontWeight:700,color:voice.listenMode===k?T.accent:T.cream}}>{voice.listenMode===k?"● ":"○ "}{t}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:3,lineHeight:1.4}}>{d}</div>
            </button>))}
        </div>}
        <button className="bs" style={{width:"100%",margin:"8px 0 0"}} onClick={()=>voice.speak("Olá! Eu sou o seu chef. Vamos cozinhar?")}>🔊 Testar voz do chef</button>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.langSelect}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {Object.entries(LANGS).map(([k,v])=>(
            <button key={k} onClick={()=>setLang(k)} style={{padding:"8px 12px",borderRadius:20,border:`1px solid ${lang===k?T.accent:T.border}`,background:lang===k?"rgba(255,107,0,.12)":T.card,color:lang===k?T.accent:T.muted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <span>{v.flag}</span><span>{v.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.chefSelect}</div>
        <div style={{display:"flex",gap:10}}>
          {Object.entries(CHEFS).map(([k,c])=>(
            <button key={k} onClick={()=>setChef(k)} style={{flex:1,padding:"14px 8px",background:chef===k?`${c.color}22`:T.card,border:`2px solid ${chef===k?c.color:T.border}`,borderRadius:14,cursor:"pointer",textAlign:"center",transition:".2s"}}>
              <div style={{fontSize:28,marginBottom:4}}>{c.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color:chef===k?c.color:T.cream}}>{c.name}</div>
              <div style={{fontSize:10,color:T.muted}}>{c.label}</div>
              {chef===k&&<div style={{marginTop:6,background:c.color,borderRadius:8,padding:"2px 6px",display:"inline-block"}}><span style={{fontSize:9,color:"white",fontWeight:700}}>✓ Ativo</span></div>}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.cuisine}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {CUISINES.map(c=>(
            <button key={c.n} className={`cub${local.cuisine===c.n?" on":""}`} onClick={()=>setLocal(p=>({...p,cuisine:c.n}))}>
              <div style={{fontSize:20,marginBottom:4}}>{c.f}</div>
              <div style={{fontSize:11,color:T.cream,fontWeight:500}}>{c.n}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.diet}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {DIETS.map(d=>(<button key={d} onClick={()=>setLocal(p=>({...p,diet:d}))} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${local.diet===d?T.accent:T.border}`,background:local.diet===d?"rgba(255,107,0,.12)":T.card,color:local.diet===d?T.accent:T.muted,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{d}</button>))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.level}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {LEVELS.map(l=>(<button key={l} onClick={()=>setLocal(p=>({...p,level:l}))} style={{padding:"8px 14px",borderRadius:20,border:`1px solid ${local.level===l?T.accent:T.border}`,background:local.level===l?"rgba(255,107,0,.12)":T.card,color:local.level===l?T.accent:T.muted,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{l}</button>))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{L.appliance}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {APPLIANCES.map(a=>(<button key={a} onClick={()=>setLocal(p=>({...p,appliance:a}))} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${local.appliance===a?T.accent:T.border}`,background:local.appliance===a?"rgba(255,107,0,.12)":T.card,color:local.appliance===a?T.accent:T.muted,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{a}</button>))}
        </div>
      </div>
      <div className="card">
        <div style={{fontSize:12,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>😋 Meu gosto</div>
        <div style={{fontSize:12,color:T.textSub,marginBottom:8}}>O chef leva isso em conta em todas as receitas.</div>
        <textarea className="ci" value={local.taste??DEFAULT_TASTE} onChange={e=>setLocal(p=>({...p,taste:e.target.value}))} style={{width:"100%",minHeight:110,borderRadius:12,resize:"vertical",lineHeight:1.5}}/>
      </div>
      <button className="bp" onClick={()=>setPrefs(local)}>{L.save}</button>
      <div style={{height:8}}/>
    </div>
  );
}

// ─── AI VOICE KEY CARD ────────────────────────────────────────────────────────
function VoiceKeyCard({ chef, lang }){
  const [key, setKey] = useState(()=>LS.get(OAI_LS));
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(()=>LS.get(OAI_LS)?"saved":"");
  const [testing, setTesting] = useState(false);
  const save = async()=>{
    const k = key.trim(); LS.set(OAI_LS,k); setKey(k);
    if(!k){ setStatus(""); return; }
    setTesting(true); setStatus("");
    unlockAudio();
    const ok = await speakAI(`Olá! Eu sou o ${CHEFS[chef].name}. Vamos cozinhar juntos?`, chef, lang);
    setStatus(ok?"ok":"err"); setTesting(false);
  };
  const msg = {ok:"✅ Voz de IA funcionando! Ouviu o sotaque?",saved:"🔑 Chave de voz salva neste celular.",err:"❌ Não funcionou. Confira a chave e se há crédito em platform.openai.com → Billing."}[status]||"";
  return (
    <div className="card">
      <div style={{fontSize:12,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🗣️ Voz de IA com sotaque (OpenAI)</div>
      <div style={{fontSize:12,color:T.textSub,lineHeight:1.5,marginBottom:10}}>Opcional. Crie em <b style={{color:T.cream}}>platform.openai.com → API keys</b>. Sem ela, o chef usa a voz do celular.</div>
      <div style={{display:"flex",gap:8}}>
        <input className="ci" style={{borderRadius:12,minWidth:0}} type={show?"text":"password"} placeholder="sk-..." value={key} onChange={e=>setKey(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false}/>
        <button onClick={()=>setShow(s=>!s)} className="pbtn" style={{borderRadius:12}}>{show?"🙈":"👁️"}</button>
      </div>
      <button className="bp" style={{width:"100%",margin:"10px 0 0"}} onClick={save} disabled={testing}>{testing?"⏳ Testando a voz...":"Salvar e ouvir"}</button>
      {msg&&<div style={{fontSize:13,color:status==="ok"?T.green:T.gold,marginTop:10}}>{msg}</div>}
    </div>
  );
}


// ─── INVITE (tester) + FEEDBACK ──────────────────────────────────────────────
const INV_ERR = {bad_code:"Código não encontrado ou desativado. Confira com quem te convidou.",offline:"Sem internet agora. Confira a conexão. 📶",no_server:"Abra o app pelo link do convite que você recebeu (ele já traz o endereço do chef)."};
function useInviteForm(onDone){
  const [code, setCode] = useState(()=>LS.get("echefe_invite_pending")||"");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const submit = async(c)=>{
    const v = String(c!=null?c:code).trim().toUpperCase(); if(!v) return;
    setBusy(true); setErr("");
    const r = await checkInvite(v);
    setBusy(false);
    if(r.ok){ LS.set(INVITE_LS,v); LS.set(INVITE_NAME_LS,r.name||""); LS.set("echefe_invite_pending",""); onDone&&onDone(r); }
    else setErr(INV_ERR[r.error]||INV_ERR.bad_code);
  };
  return {code,setCode,busy,err,submit};
}

function Welcome({ onDone, onOwnKey }){
  const [hello, setHello] = useState("");
  const f = useInviteForm((r)=>{ setHello(r.name||""); setTimeout(onDone,1800); });
  useEffect(()=>{ if(f.code && workerURL()) f.submit(f.code); },[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(10,6,0,.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{width:"100%",maxWidth:380,textAlign:"center"}}>
        <div className="logo" style={{fontSize:34}}>e<span>Chef</span>e</div>
        {hello!=="" ? <>
          <div style={{fontSize:54,margin:"18px 0 6px"}}>👨‍🍳</div>
          <div style={{fontSize:20,fontWeight:700,color:T.cream}}>Bem-vindo{hello?`, ${hello}`:""}!</div>
          <div style={{fontSize:14,color:T.textSub,marginTop:6}}>Seu chef está pronto. Bora cozinhar!</div>
        </> : <>
          <div style={{fontSize:15,color:T.cream,lineHeight:1.5,margin:"14px 0 18px"}}>Você foi convidado para testar o eChefe, seu chef particular com IA. 🎉<br/>Digite o seu <b>código de convite</b>:</div>
          <input className="ci" style={{width:"100%",borderRadius:14,textAlign:"center",fontSize:18,letterSpacing:1,textTransform:"uppercase"}} placeholder="EX.: MARIA-1234" value={f.code} onChange={e=>f.setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&f.submit()} autoCapitalize="characters" autoComplete="off" spellCheck={false}/>
          <button className="bp" style={{width:"100%",margin:"12px 0 0"}} onClick={()=>f.submit()} disabled={f.busy}>{f.busy?"⏳ Conferindo...":"Entrar"}</button>
          {f.err&&<div style={{fontSize:13,color:T.gold,marginTop:10,lineHeight:1.4}}>{f.err}</div>}
          <button onClick={onOwnKey} style={{background:"none",border:"none",color:T.muted,fontSize:12,marginTop:22,cursor:"pointer",textDecoration:"underline"}}>Tenho minha própria chave da IA</button>
        </>}
      </div>
    </div>
  );
}

function InviteCard(){
  const [cur, setCur] = useState(inviteCode());
  const [editing, setEditing] = useState(!inviteCode());
  const f = useInviteForm(()=>{ setCur(inviteCode()); setEditing(false); });
  const name = LS.get(INVITE_NAME_LS);
  return (
    <div className="card">
      <div style={{fontSize:12,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🎟️ Código de convite</div>
      {cur&&!editing ? <>
        <div style={{fontSize:14,color:T.cream}}>{name?<>Olá, <b>{name}</b>! </>:null}Você está usando o código <b style={{color:T.gold}}>{cur}</b>. ✅</div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button className="pbtn" style={{borderRadius:12,flex:1}} onClick={()=>setEditing(true)}>Trocar código</button>
          <button className="pbtn" style={{borderRadius:12,flex:1}} onClick={()=>{ LS.set(INVITE_LS,""); LS.set(INVITE_NAME_LS,""); setCur(""); setEditing(true); }}>Sair</button>
        </div>
      </> : <>
        <div style={{fontSize:12,color:T.textSub,lineHeight:1.5,marginBottom:10}}>Recebeu um convite para testar? Digite o código aqui.</div>
        <div style={{display:"flex",gap:8}}>
          <input className="ci" style={{borderRadius:12,minWidth:0,textTransform:"uppercase"}} placeholder="MARIA-1234" value={f.code} onChange={e=>f.setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" spellCheck={false}/>
          <button className="pbtn" style={{borderRadius:12}} onClick={()=>f.submit()} disabled={f.busy}>{f.busy?"⏳":"OK"}</button>
        </div>
        {f.err&&<div style={{fontSize:13,color:T.gold,marginTop:8}}>{f.err}</div>}
      </>}
    </div>
  );
}

function FeedbackSheet({ onClose }){
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [state, setState] = useState("");
  const send = async()=>{
    if(!text.trim() && !rating) return;
    setState("sending");
    const ok = await sendFeedback(text.trim(), rating);
    setState(ok?"ok":"err");
    if(ok) setTimeout(onClose,1600);
  };
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"#140E00",borderTop:`1px solid ${T.border}`,borderRadius:"20px 20px 0 0",padding:"16px 16px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:16,fontWeight:700,color:T.cream}}>💬 Enviar feedback</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.muted,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        {state==="ok" ? <div style={{fontSize:15,color:T.green,padding:"24px 0",textAlign:"center"}}>✅ Obrigado! Sua opinião vai deixar o eChefe melhor. 🙏</div> : <>
          <div style={{fontSize:13,color:T.textSub,margin:"8px 0 10px"}}>O que achou? O que pode melhorar? Deu algum erro?</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:10}}>
            {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} style={{background:"none",border:"none",fontSize:30,cursor:"pointer",outline:"none",WebkitTapHighlightColor:"transparent",filter:n<=rating?"none":"grayscale(1) opacity(.4)"}}>⭐</button>)}
          </div>
          <textarea className="ci" style={{width:"100%",borderRadius:12,minHeight:110,resize:"vertical",fontFamily:"inherit"}} placeholder="Escreva aqui sua dica, sugestão ou problema..." value={text} onChange={e=>setText(e.target.value)} maxLength={2000}/>
          <button className="bp" style={{width:"100%",margin:"10px 0 0"}} onClick={send} disabled={state==="sending"}>{state==="sending"?"⏳ Enviando...":"Enviar"}</button>
          {state==="err"&&<div style={{fontSize:13,color:T.gold,marginTop:8}}>Não consegui enviar agora. Confira a internet e tente de novo.</div>}
        </>}
      </div>
    </div>
  );
}

// ─── API KEY CARD ─────────────────────────────────────────────────────────────
function ApiKeyCard(){
  const [key, setKey] = useState(()=>LS.get(KEY_LS));
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(()=>LS.get(KEY_LS)?"saved":"");
  const [testing, setTesting] = useState(false);
  const save = async()=>{
    const k = key.trim(); LS.set(KEY_LS,k); setKey(k);
    if(!k){ setStatus(""); return; }
    setTesting(true); setStatus("");
    try{ await askAI("Responda apenas: OK",{}); setStatus("ok"); }
    catch(e){ setStatus(e.code||"err"); }
    setTesting(false);
  };
  const msg = {ok:"✅ Chave funcionando! O chef está pronto.",saved:"🔑 Chave salva neste celular.",bad_key:"❌ Chave recusada. Confira se copiou inteira.",no_credit:"💳 Chave certa, mas sem crédito. Adicione em console.anthropic.com → Billing.",offline:"📶 Sem internet para testar."}[status] || (status?"⚠️ Não consegui testar agora. Tente de novo.":"");
  return (
    <div className="card" style={{borderColor:status==="ok"||status==="saved"?T.border:T.accent}}>
      <div style={{fontSize:12,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>🔑 Chave da IA (Anthropic)</div>
      <div style={{fontSize:12,color:T.textSub,lineHeight:1.5,marginBottom:10}}>Crie em <b style={{color:T.cream}}>console.anthropic.com → API Keys</b> e cole aqui. Fica salva só neste celular.</div>
      <div style={{display:"flex",gap:8}}>
        <input className="ci" style={{borderRadius:12,minWidth:0}} type={show?"text":"password"} placeholder="sk-ant-..." value={key} onChange={e=>setKey(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false}/>
        <button onClick={()=>setShow(s=>!s)} className="pbtn" style={{borderRadius:12}}>{show?"🙈":"👁️"}</button>
      </div>
      <button className="bp" style={{width:"100%",margin:"10px 0 0"}} onClick={save} disabled={testing}>{testing?"⏳ Testando...":"Salvar e testar"}</button>
      {msg&&<div style={{fontSize:13,color:status==="ok"?T.green:T.gold,marginTop:10}}>{msg}</div>}
    </div>
  );
}

// ─── MY RECIPES (favorites, adjustments, history, result photos) ─────────────
function Recipes({ lang, onCookAgain }){
  const L = LANGS[lang];
  const [list, setList] = useState(loadRecipes);
  const [openId, setOpenId] = useState(null);
  const [msg, setMsg] = useState("");
  const photoRef = useRef(null);
  const update = (id, patch)=>{ const nl=list.map(r=>r.id===id?{...r,...patch}:r); setList(nl); if(!saveRecipes(nl)) setMsg("Memória cheia — a foto não coube. Apague uma receita antiga."); };
  const remove = (id)=>{ if(!window.confirm("Apagar esta receita?")) return; const nl=list.filter(r=>r.id!==id); setList(nl); saveRecipes(nl); setOpenId(null); };
  const r = list.find(x=>x.id===openId);
  const sec = (t)=><div style={{fontSize:12,color:T.muted,margin:"14px 0 8px",textTransform:"uppercase",letterSpacing:1}}>{t}</div>;

  if(r){
    const addPhoto = async(e)=>{ const f=e.target.files?.[0]; e.target.value=""; if(!f) return; const t=await makeThumb(f,560); if(t) update(r.id,{photo:t}); };
    return (
      <div className="screen">
        <div style={{padding:"16px 16px 0"}}><button onClick={()=>setOpenId(null)} className="bs" style={{width:"auto",margin:0,padding:"8px 14px"}}>← Minhas receitas</button></div>
        <div className="card" style={{marginTop:12}}>
          {r.photo?<img src={r.photo} alt="" style={{width:"100%",maxHeight:240,objectFit:"cover",borderRadius:12,marginBottom:12}}/>:<div style={{fontSize:56,textAlign:"center",marginBottom:6}}>{r.emoji}</div>}
          <input ref={photoRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={addPhoto}/>
          <button className="bs" style={{width:"100%",margin:"0 0 12px"}} onClick={()=>photoRef.current?.click()}>📷 {r.photo?"Trocar foto do resultado":"Adicionar foto do resultado"}</button>
          <div className="logo" style={{fontSize:22,fontStyle:"normal"}}>{r.emoji} {r.title}</div>
          <div style={{fontSize:12,color:T.textSub,marginTop:6}}>{[r.servings,r.time].filter(Boolean).join(" · ")}</div>
          <div style={{fontSize:11,color:T.muted,marginTop:4}}>Salva em {fmtDate(r.createdAt)} · feita {(r.cooked||[]).length}x{(r.cooked||[]).length>1?` · última em ${fmtDate(r.cooked[r.cooked.length-1])}`:""}</div>
          <button className="bp" style={{width:"100%",margin:"14px 0 0"}} onClick={()=>{ update(r.id,{cooked:[...(r.cooked||[]),Date.now()]}); onCookAgain(r); }}>🔁 Cozinhar de novo do meu jeito</button>
          {r.adjustments&&r.adjustments.length>0&&<>{sec("✍️ Meus ajustes — o que deu certo")}
            {r.adjustments.map((a,i)=><div key={i} style={{fontSize:13,color:T.gold,lineHeight:1.5,marginBottom:6}}>• {a}</div>)}</>}
          {sec("🧺 Ingredientes")}
          {r.ingredients.map((a,i)=><div key={i} style={{fontSize:14,color:T.cream,lineHeight:1.5,marginBottom:4}}>• {a}</div>)}
          {sec("👨‍🍳 Modo de preparo")}
          {r.steps.map((a,i)=><div key={i} style={{display:"flex",gap:10,fontSize:14,color:T.cream,lineHeight:1.5,marginBottom:10}}><span style={{color:T.accent,fontWeight:700,minWidth:18}}>{i+1}.</span><span>{a}</span></div>)}
          {r.tips&&r.tips.length>0&&<>{sec("💡 Dicas do chef")}{r.tips.map((a,i)=><div key={i} style={{fontSize:13,color:T.textSub,lineHeight:1.5,marginBottom:6}}>• {a}</div>)}</>}
          {sec("🗒️ Minhas anotações")}
          <textarea className="ci" defaultValue={r.notes||""} onBlur={e=>update(r.id,{notes:e.target.value})} placeholder="Ex.: da próxima vez, menos sal; meu filho adorou..." style={{width:"100%",minHeight:80,borderRadius:12,resize:"vertical"}}/>
          {msg&&<div style={{fontSize:12,color:T.gold,marginTop:8}}>{msg}</div>}
          <button className="bs" style={{width:"100%",margin:"14px 0 0",color:"#E74C3C"}} onClick={()=>remove(r.id)}>🗑 Apagar receita</button>
        </div>
        <div style={{height:8}}/>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="hdr"><div className="logo" style={{fontSize:22}}>⭐ {L.recipes||"Receitas"}</div><div className="sub">{list.length} {list.length===1?"receita salva":"receitas salvas"}</div></div>
      {list.length===0&&(
        <div className="card" style={{fontSize:14,color:T.cream,lineHeight:1.6}}>
          Ainda não há receitas salvas.<br/><br/>Cozinhe com o chef e, no final, toque em <b style={{color:T.gold}}>⭐ Salvar receita</b> no chat. Ela fica guardada aqui com os seus ajustes, os tempos que deram certo e a foto do resultado.
        </div>
      )}
      {list.map(x=>(
        <button key={x.id} onClick={()=>setOpenId(x.id)} className="card" style={{display:"flex",gap:12,alignItems:"center",width:"calc(100% - 32px)",textAlign:"left",cursor:"pointer"}}>
          {x.photo?<img src={x.photo} alt="" style={{width:64,height:64,borderRadius:12,objectFit:"cover",flexShrink:0}}/>:<div style={{width:64,height:64,borderRadius:12,background:"rgba(255,107,0,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0}}>{x.emoji}</div>}
          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:600,color:T.cream,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{x.title}</div>
            <div style={{fontSize:12,color:T.textSub,marginTop:3}}>{[x.servings,x.time].filter(Boolean).join(" · ")}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:3}}>{fmtDate(x.createdAt)} · feita {(x.cooked||[]).length}x</div>
          </div>
        </button>
      ))}
      <div style={{height:8}}/>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState("home");
  const [chef, setChef] = useState(()=>LS.get("echefe_chef")||"mario");
  const [lang, setLang] = useState(()=>LS.get("echefe_lang")||"pt");
  const [prefs, setPrefs] = useState(()=>{ const d={cuisine:"Brasileira",diet:"Sem restrição",level:"🌱 Iniciante",appliance:"🔥 Fogão a gás"}; try{ return JSON.parse(LS.get("echefe_prefs"))||d; }catch{ return d; } });
  const [voiceCmd, setVoiceCmd] = useState(null);
  const [seed, setSeed] = useState(null);
  const [fbOpen, setFbOpen] = useState(false);
  const [welcome, setWelcome] = useState(()=>!inviteCode() && !LS.get(KEY_LS));
  const cookAgain = (r)=>{
    const txt = `Quero fazer de novo a minha receita "${r.title}", do meu jeito, com os mesmos ajustes. Guie um passo de cada vez.\n\nRECEITA SALVA:\nRende: ${r.servings} · Tempo: ${r.time}\nIngredientes: ${r.ingredients.join("; ")}\nPreparo: ${r.steps.map((x,i)=>(i+1)+". "+x).join(" ")}\nMeus ajustes: ${(r.adjustments||[]).join("; ")}${r.notes?"\nMinhas anotações: "+r.notes:""}`;
    setScreen("chat"); setSeed({text:txt,id:Date.now()});
  };
  useEffect(()=>{ LS.set("echefe_chef",chef); },[chef]);
  useEffect(()=>{ LS.set("echefe_lang",lang); },[lang]);
  useEffect(()=>{ LS.set("echefe_prefs",JSON.stringify(prefs)); },[prefs]);
  const voice = useVoiceEngine(lang, (text)=>{ setScreen("chat"); setVoiceCmd({text,id:Date.now()}); }, chef);
  const tm = useTimers((t)=>voice.speak(t));
  const L = LANGS[lang];
  const nav = [
    {id:"home",label:L.home,icon:IC.home},
    {id:"chat",label:L.chat,icon:IC.chat},
    {id:"recipes",label:L.recipes||"Receitas",icon:IC.star},
    {id:"week",label:L.week,icon:IC.cal},
    {id:"shop",label:L.shop,icon:IC.shop},
    {id:"profile",label:L.profile,icon:IC.user},
  ];
  return (
    <div className="root">
      <VoiceBar v={voice} chefName={CHEFS[chef].name}/>
      <div className="main">
      <FireBG/>
      {screen==="home"   &&<Home go={setScreen} chef={chef} lang={lang} onFeedback={()=>setFbOpen(true)}/>}
      <div style={{display:screen==="chat"?"block":"none"}}><Chat key={chef+lang} chef={chef} lang={lang} prefs={prefs} voice={voice} voiceCmd={voiceCmd} seed={seed} go={setScreen} startTimer={tm.add}/></div>
      {screen==="recipes"&&<Recipes lang={lang} onCookAgain={cookAgain}/>}
      {screen==="week"   &&<Week lang={lang} prefs={prefs}/>}
      {screen==="shop"   &&<Shop lang={lang} prefs={prefs}/>}
      {screen==="profile"&&<Profile chef={chef} setChef={setChef} lang={lang} setLang={setLang} prefs={prefs} setPrefs={setPrefs} voice={voice} onFeedback={()=>setFbOpen(true)}/>}
      </div>
      <TimerDock tm={tm}/>
      {fbOpen&&<FeedbackSheet onClose={()=>setFbOpen(false)}/>}
      {welcome&&<Welcome onDone={()=>{ setWelcome(false); setScreen("home"); }} onOwnKey={()=>{ setWelcome(false); setScreen("profile"); }}/>}
      <nav className="bnav">
        {nav.map(x=>(
          <button key={x.id} className={`nb${screen===x.id?" on":""}`} onClick={()=>setScreen(x.id)}>
            {x.icon}<span>{x.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
