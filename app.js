/* ---------- icons ---------- */
const I = {
  refresh:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>',
  plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  pencil:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  trash:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
  x:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  logout:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  print:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  up:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  down:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
};

/* ---------- constants ---------- */
const CATEGORIES = ["Documenten","Gezondheid & verzorging","Apparatuur","Onderweg / auto","Huisje & keuken","Buiten & ontspanning"];
const LOCS = ["", "Beveren", "Göteborg"];

const SEED_INPAK = {
  "Documenten":["Paspoort","Rijbewijs","Papieren auto (huur en verzekering)","Papieren huisje","Europese ziekteverzekeringskaart"],
  "Gezondheid & verzorging":["Paracetamol","Ibuprofen","Zonnecreme","Aftersun","Lippenbalsem","Pleisters","Voltarengel","Sport tape","Q viva (gewoon & sport)","Muggenspray","Tekentang","Haardroger"],
  "Apparatuur":["Oplader telefoon","Powerbank en oplader","Camera en oplader","Laptop en oplader","Verlengkabel / stekkerdoos"],
  "Onderweg / auto":["Vuilniszakje (auto)","Startkabels","Veiligheidshesjes","Afspeellijst","Podcast","Luisterboek"],
  "Huisje & keuken":["Vuilniszakken","Toiletpapier","Handzeep","Afwasmiddel","Keukenhanddoeken","Keukenrol","Spons","Afwasborstel","Zilverpapier","Bakpapier","French press","Gourmet (stel + pannetjes)","Vochtige (kuis)doekjes","Wasstrips","Kaasrasp","Snijplank & mes","Kurkentrekker","Lucifers","Zakdoeken","Kleine zakdoekjes","Linnengoed","Handdoeken","Kussen","Koffie","Thee"],
  "Buiten & ontspanning":["BBQ","BBQ tang","Olieborstel","Lapjes zitten / picknickkleed","Gezelschapspelletjes","Boeken","Drinkfles","Rugzak","Zonnebril","Wandelschoenen","Verrekijker","Koelbox / koeltas"],
};
const SEED_BAKKER = ["Pistolets","Stokbrood","Croissants","Chocoladekoeken","Koffiekoeken","Kanelbullar"];

/* ---------- state ---------- */
let sb = null;
let items = [];
const state = {
  view:"inpak", inpakFilter:"meenemen", groupBy:"categorie",
  showDone:false, editingId:null, adding:false, draft:{},
};
let busyInput = false;
let pendingSync = false;

/* ---------- helpers ---------- */
const $app = document.getElementById("app");
const $addbar = document.getElementById("addbar");
const $print = document.getElementById("printview");
const esc = (s)=>String(s==null?"":s).replace(/[&<>"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cfgOk = () => window.INPAKLIJST_CONFIG &&
  window.INPAKLIJST_CONFIG.SUPABASE_URL && !window.INPAKLIJST_CONFIG.SUPABASE_URL.startsWith("VUL_") &&
  window.INPAKLIJST_CONFIG.SUPABASE_ANON_KEY && !window.INPAKLIJST_CONFIG.SUPABASE_ANON_KEY.startsWith("VUL_");

/* ---------- data ---------- */
async function fetchAll(){
  const { data, error } = await sb.from("items").select("*").order("position",{ascending:true}).order("created_at",{ascending:true});
  if(error){ console.error(error); return; }
  items = data || [];
  render();
}
async function addItem(fields){
  const max = items.reduce((m,i)=>Math.max(m,i.position||0),0);
  const { error } = await sb.from("items").insert([{ position:max+1, ...fields }]);
  if(error) console.error(error);
}
async function patch(id, fields){
  items = items.map(i=> i.id===id ? {...i, ...fields} : i);
  render();
  const { error } = await sb.from("items").update(fields).eq("id", id);
  if(error) console.error(error);
}
async function patchMany(updates){ // [{id, fields}]
  for(const u of updates) items = items.map(i=> i.id===u.id ? {...i, ...u.fields} : i);
  render();
  for(const u of updates){
    const { error } = await sb.from("items").update(u.fields).eq("id", u.id);
    if(error) console.error(error);
  }
}
async function remove(id){
  items = items.filter(i=>i.id!==id); render();
  const { error } = await sb.from("items").delete().eq("id", id);
  if(error) console.error(error);
}
async function seedInpak(){
  const rows=[]; let p=0;
  for(const cat of CATEGORIES) for(const name of SEED_INPAK[cat])
    rows.push({list:"inpak",name,category:cat,loc:"",source:"meenemen",qty:1,done:false,position:p++});
  await sb.from("items").insert(rows);
}
async function seedBakker(){
  const rows = SEED_BAKKER.map((name,i)=>({list:"bakker",name,category:"",loc:"",source:"meenemen",qty:1,done:false,position:i}));
  await sb.from("items").insert(rows);
}
async function newBakkerRound(){
  const ids = items.filter(i=>i.list==="bakker" && i.done).map(i=>i.id);
  if(!ids.length) return;
  items = items.map(i=> i.list==="bakker" ? {...i,done:false} : i); render();
  await sb.from("items").update({done:false}).in("id", ids);
}

/* verplaatsen: wissel positie met buur in dezelfde groep */
function moveItem(id, dir){
  const it = items.find(x=>x.id===id); if(!it) return;
  const sibs = items
    .filter(x=> x.list===it.list && (it.list==="bakker" || x.category===it.category))
    .sort((a,b)=>(a.position||0)-(b.position||0));
  const idx = sibs.findIndex(x=>x.id===id);
  const j = dir==="up" ? idx-1 : idx+1;
  if(j<0 || j>=sibs.length) return;
  const other = sibs[j];
  patchMany([
    { id: it.id, fields:{ position: other.position||0 } },
    { id: other.id, fields:{ position: it.position||0 } },
  ]);
}

/* ---------- render ---------- */
const FILTERS = [
  { id:"meenemen", label:"Meenemen" },
  { id:"kopen", label:"Kopen" },
  { id:"alles", label:"Alles" },
];

function render(){
  if(!cfgOk()){ renderSetup(); return; }
  if(!authedReady){ return; }       // wacht tot we de sessie kennen
  if(!session){ renderLogin(); return; }
  renderHeaderTabs();
  if(state.view==="inpak") renderInpak(); else renderBakker();
  renderAddBar();
}

function renderHeaderTabs(){
  const eyebrow = state.view==="inpak" ? "Zomer · huisje Zweden" : "Ontbijt halen";
  const title = state.view==="inpak" ? "Inpaklijst" : "Bakker";
  $app.innerHTML = `
    <header>
      <div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div>
      <div style="display:flex;gap:7px">
        <button class="icon-btn" data-act="print" aria-label="Afdrukken">${I.print}</button>
        <button class="icon-btn" data-act="refresh" aria-label="Ververs">${I.refresh}</button>
        <button class="icon-btn" data-act="logout" aria-label="Afmelden">${I.logout}</button>
      </div>
    </header>
    <div class="tabs">
      <button class="${state.view==="inpak"?"on":""}" data-tab="inpak">Inpakken</button>
      <button class="${state.view==="bakker"?"on":""}" data-tab="bakker">Bakker</button>
    </div>
    <div id="content"></div>`;
}

function renderInpak(){
  const all = items.filter(i=>i.list==="inpak");
  const mee = all.filter(i=>i.source==="meenemen");
  const koop = all.filter(i=>i.source==="kopen");
  const meeOpen = mee.filter(i=>!i.done).length;
  const koopOpen = koop.filter(i=>!i.done).length;
  const klaar = all.filter(i=>i.done).length;

  let pool = state.inpakFilter==="meenemen" ? mee : state.inpakFilter==="kopen" ? koop : all;
  if(!state.showDone) pool = pool.filter(i=>!i.done);

  const keys = state.groupBy==="locatie" ? ["Beveren","Göteborg",""] : CATEGORIES;
  const keyLabel = (k)=> state.groupBy==="locatie" ? (k||"Nog geen locatie") : k;
  const keyOf = (i)=> state.groupBy==="locatie" ? i.loc : i.category;
  const groups = keys.map(k=>({k,label:keyLabel(k),rows:pool.filter(i=>keyOf(i)===k)})).filter(g=>g.rows.length);

  const c = document.getElementById("content");
  c.innerHTML = `
    <div class="summary">
      <div class="stat hero"><div class="big">${meeOpen}</div><div class="lab">Nog mee te nemen</div></div>
      <div class="stat"><div class="big" style="color:var(--lake)">${koopOpen}</div><div class="lab">Te kopen</div></div>
      <div class="stat"><div class="big" style="color:var(--leaf)">${klaar}</div><div class="lab">Ingepakt</div></div>
    </div>
    <div class="controls">
      <div class="seg">${FILTERS.map(f=>`<button class="${state.inpakFilter===f.id?"on":""}" data-filt="${f.id}">${f.label}</button>`).join("")}</div>
      <div class="spacer"></div>
      <div class="seg">
        <button class="${state.groupBy==="categorie"?"on":""}" data-grp="categorie">Categorie</button>
        <button class="${state.groupBy==="locatie"?"on":""}" data-grp="locatie">Locatie</button>
      </div>
    </div>
    <div class="controls" style="margin-top:-3px">
      <label class="togglemini"><input type="checkbox" data-act="showdone" ${state.showDone?"checked":""}/> Toon ingepakt</label>
    </div>
    <div id="list"></div>`;

  const list = document.getElementById("list");
  if(!all.length){ list.innerHTML = emptyInpak(); return; }
  if(!groups.length){ list.innerHTML = `<div class="empty">Niets in deze weergave. Alles hier is al gedaan, of wissel van filter.</div>`; return; }
  list.innerHTML = groups.map(g=>`
    <section class="grp">
      <div class="grphead"><h2>${esc(g.label)}</h2><span class="n">${g.rows.length}</span></div>
      <div class="rows">${g.rows.map(inpakRow).join("")}</div>
    </section>`).join("");
}

function inpakRow(it){
  if(state.editingId===it.id) return editRow(it,true);
  const locClass = it.loc==="Beveren"?"loc-Beveren":it.loc==="Göteborg"?"loc-Göteborg":"loc-none";
  return `<div class="row ${it.done?"done":""}" data-id="${it.id}">
    <button class="check ${it.done?"on":""}" data-act="done">${it.done?I.check:""}</button>
    <div class="body">
      <div class="name">${esc(it.name)}</div>
      <div class="meta">
        <button class="tag ${locClass}" data-act="loc">${it.loc||"+ locatie"}</button>
        <button class="tag src-${it.source}" data-act="source">${it.source==="kopen"?"Kopen in Zweden":"Meenemen"}</button>
      </div>
    </div>
    <button class="pencil" data-act="edit" aria-label="Bewerk">${I.pencil}</button>
  </div>`;
}

function renderBakker(){
  const all = items.filter(i=>i.list==="bakker");
  const open = all.filter(i=>!i.done);
  const totaal = open.reduce((s,i)=>s+(i.qty||1),0);
  const gehaald = all.filter(i=>i.done).length;

  const c = document.getElementById("content");
  c.innerHTML = `
    <div class="summary">
      <div class="stat hero"><div class="big">${totaal}</div><div class="lab">Stuks te halen</div></div>
      <div class="stat"><div class="big">${open.length}</div><div class="lab">Soorten</div></div>
      <div class="stat"><div class="big" style="color:var(--leaf)">${gehaald}</div><div class="lab">Gehaald</div></div>
    </div>
    <div class="controls">
      <label class="togglemini"><input type="checkbox" data-act="showdone" ${state.showDone?"checked":""}/> Toon gehaald</label>
      <div class="spacer"></div>
      ${gehaald?`<button class="chip" data-act="newround">Nieuwe ronde</button>`:""}
    </div>
    <div id="list"></div>`;

  let pool = state.showDone ? all : open;
  pool = pool.slice().sort((a,b)=>(a.position||0)-(b.position||0));
  const list = document.getElementById("list");
  if(!all.length){ list.innerHTML = emptyBakker(); return; }
  if(!pool.length){ list.innerHTML = `<div class="empty">Alles gehaald! Tik op <b>Nieuwe ronde</b> voor de volgende ochtend.</div>`; return; }
  list.innerHTML = `<div class="rows">${pool.map(bakkerRow).join("")}</div>`;
}

function bakkerRow(it){
  if(state.editingId===it.id) return editRow(it,false);
  return `<div class="row ${it.done?"done":""}" data-id="${it.id}">
    <button class="check ${it.done?"on":""}" data-act="done">${it.done?I.check:""}</button>
    <div class="body"><div class="name">${esc(it.name)}</div></div>
    <div class="qty">
      <button data-act="minus" aria-label="Minder">−</button>
      <span>${it.qty||1}</span>
      <button data-act="plus" aria-label="Meer">+</button>
    </div>
    <button class="pencil" data-act="edit" aria-label="Bewerk">${I.pencil}</button>
  </div>`;
}

function editRow(it, withCat){
  return `<div class="row" data-id="${it.id}">
    <div class="edit">
      <input data-field="name" value="${esc(it.name)}" placeholder="Naam" />
      ${withCat?`<select data-field="category">${CATEGORIES.map(cc=>`<option ${cc===it.category?"selected":""}>${cc}</option>`).join("")}</select>`:""}
      <div class="erow">
        <button class="btn move" data-act="moveup">${I.up} Omhoog</button>
        <button class="btn move" data-act="movedown">${I.down} Omlaag</button>
      </div>
      <div class="erow">
        <button class="btn dark" data-act="save">${I.check} Bewaren</button>
        <button class="btn ghost" data-act="canceledit">${I.x}</button>
        <button class="btn del" data-act="del">${I.trash}</button>
      </div>
    </div>
  </div>`;
}

function emptyInpak(){
  return `<div class="empty">Nog geen items.<br><span class="muted">Begin met de standaard-inpaklijst.</span>
    <button class="btn" data-act="seedinpak">${I.plus} Standaardlijst laden</button></div>`;
}
function emptyBakker(){
  return `<div class="empty">Nog geen bakkeritems.<br><span class="muted">Laad een paar klassiekers om te starten.</span>
    <button class="btn" data-act="seedbakker">${I.plus} Voorbeelden laden</button></div>`;
}

function renderAddBar(){
  const koop = state.view==="inpak" && state.inpakFilter==="kopen";
  const ph = state.view==="bakker" ? "Welk broodje of gebak?" : koop ? "Toevoegen aan boodschappen in Zweden…" : "Wat wil je toevoegen?";
  if(!state.adding){
    const label = state.view==="bakker" ? "Bakkeritem toevoegen" : koop ? "Toevoegen aan kopen in Zweden" : "Item toevoegen";
    $addbar.innerHTML = `<div class="inner"><button class="add-btn" data-act="openadd">${I.plus} ${label}</button></div>`;
    return;
  }
  const catSel = state.view==="inpak"
    ? `<select id="add-cat">${CATEGORIES.map(cc=>`<option ${cc===(state.draft.cat||CATEGORIES[4])?"selected":""}>${cc}</option>`).join("")}</select>` : "";
  $addbar.innerHTML = `<div class="inner"><div class="form">
    <input id="add-name" placeholder="${ph}" value="${esc(state.draft.name||"")}" />
    <div class="frow">${catSel}
      <button class="go" data-act="doadd">Voeg toe</button>
      <button class="x" data-act="closeadd">${I.x}</button>
    </div>
  </div></div>`;
  const inp = document.getElementById("add-name");
  inp.focus();
  inp.addEventListener("input", ()=>{ busyInput=true; state.draft.name=inp.value; });
  inp.addEventListener("keydown",(e)=>{ if(e.key==="Enter") doAdd(); });
}

function renderSetup(){
  $addbar.innerHTML="";
  $app.innerHTML = `
    <header><div><div class="eyebrow">Eenmalige setup</div><h1>Bijna klaar</h1></div></header>
    <div class="setup"><p>De app heeft je Supabase-gegevens nodig in <code>config.js</code>.</p></div>`;
}

/* ---------- afdrukken ---------- */
function printList(){
  let html = "";
  if(state.view==="bakker"){
    const rows = items.filter(i=>i.list==="bakker").sort((a,b)=>(a.position||0)-(b.position||0));
    html = `<h1>Bakker — bestelling</h1><div class="pmeta">${new Date().toLocaleDateString("nl-BE")}</div>`;
    html += rows.map(i=>`<div class="pitem"><span class="pbox"></span><span>${esc(i.name)}</span><span class="ptag">${i.qty||1} st</span></div>`).join("");
  } else {
    html = `<h1>Inpaklijst — Zweden</h1><div class="pmeta">${new Date().toLocaleDateString("nl-BE")}</div>`;
    for(const cat of CATEGORIES){
      const rows = items.filter(i=>i.list==="inpak" && i.category===cat).sort((a,b)=>(a.position||0)-(b.position||0));
      if(!rows.length) continue;
      html += `<h2>${esc(cat)}</h2>`;
      html += rows.map(i=>{
        const bits = [i.loc, i.source==="kopen"?"Kopen in Zweden":"Meenemen"].filter(Boolean).join(" · ");
        return `<div class="pitem"><span class="pbox"></span><span>${esc(i.name)}</span><span class="ptag">${esc(bits)}</span></div>`;
      }).join("");
    }
  }
  $print.innerHTML = html;
  window.print();
}

/* ---------- acties ---------- */
function doAdd(){
  const name = (document.getElementById("add-name")?.value||"").trim();
  if(!name) return;
  let fields;
  if(state.view==="bakker"){
    fields = { list:"bakker", name, category:"", loc:"", source:"meenemen", qty:1, done:false };
  } else {
    const src = state.inpakFilter==="kopen" ? "kopen" : "meenemen";  // direct in juiste lijst
    fields = { list:"inpak", name, category:(document.getElementById("add-cat")?.value||CATEGORIES[4]), loc:"", source:src, qty:1, done:false };
  }
  addItem(fields);
  state.adding=false; state.draft={}; busyInput=false;
  renderAddBar();
}

function saveEdit(id){
  const row = $app.querySelector(`.row[data-id="${id}"]`);
  const name = (row.querySelector('[data-field="name"]')?.value||"").trim();
  const catEl = row.querySelector('[data-field="category"]');
  const fields = {}; if(name) fields.name=name; if(catEl) fields.category=catEl.value;
  state.editingId=null; busyInput=false;
  if(Object.keys(fields).length) patch(id, fields); else render();
}

/* ---------- events ---------- */
document.addEventListener("click",(e)=>{
  const t = e.target.closest("[data-act],[data-tab],[data-filt],[data-grp]");
  if(!t) return;
  const row = e.target.closest(".row");
  const id = row?.dataset.id;
  const it = id ? items.find(x=>x.id===id) : null;

  if(t.dataset.tab){ state.view=t.dataset.tab; state.editingId=null; state.adding=false; state.showDone=false; render(); return; }
  if(t.dataset.filt){ state.inpakFilter=t.dataset.filt; state.adding=false; render(); renderAddBar(); return; }
  if(t.dataset.grp){ state.groupBy=t.dataset.grp; render(); return; }

  switch(t.dataset.act){
    case "refresh": fetchAll(); break;
    case "print": printList(); break;
    case "openadd": state.adding=true; renderAddBar(); break;
    case "closeadd": state.adding=false; state.draft={}; busyInput=false; renderAddBar(); break;
    case "doadd": doAdd(); break;
    case "seedinpak": seedInpak(); break;
    case "seedbakker": seedBakker(); break;
    case "newround": newBakkerRound(); break;
    case "done": if(it) patch(id,{done:!it.done}); break;
    case "loc": if(it){ const n=LOCS[(LOCS.indexOf(it.loc)+1)%LOCS.length]; patch(id,{loc:n}); } break;
    case "source": if(it) patch(id,{source: it.source==="kopen"?"meenemen":"kopen"}); break;
    case "minus": if(it) patch(id,{qty:Math.max(1,(it.qty||1)-1)}); break;
    case "plus": if(it) patch(id,{qty:(it.qty||1)+1}); break;
    case "edit": state.editingId=id; busyInput=true; render(); break;
    case "canceledit": state.editingId=null; busyInput=false; render(); break;
    case "save": saveEdit(id); break;
    case "moveup": if(id) moveItem(id,"up"); break;
    case "movedown": if(id) moveItem(id,"down"); break;
    case "del": if(id) remove(id); break;
    case "login": doLogin(); break;
    case "logout": doLogout(); break;
  }
});
document.addEventListener("change",(e)=>{
  if(e.target.matches('[data-act="showdone"]')){ state.showDone=e.target.checked; render(); }
});

/* ---------- auth ---------- */
let authedReady = false;
let session = null;
let started = false;
let rtChannel = null;

function renderLogin(err){
  $addbar.innerHTML = "";
  $app.innerHTML = `
    <header><div><div class="eyebrow">Zomer · huisje Zweden</div><h1>Inpaklijst</h1></div></header>
    <div class="setup">
      <p>Meld je aan om de gedeelde lijst te openen.</p>
      <div style="display:flex;flex-direction:column;gap:9px;max-width:360px">
        <input id="lg-email" type="email" placeholder="E-mail" autocomplete="username"
          style="font-size:15px;padding:11px 12px;border-radius:10px;border:1px solid var(--border);outline:none;color:var(--ink)"/>
        <input id="lg-pass" type="password" placeholder="Wachtwoord" autocomplete="current-password"
          style="font-size:15px;padding:11px 12px;border-radius:10px;border:1px solid var(--border);outline:none;color:var(--ink)"/>
        <button class="btn dark" data-act="login" style="flex:none;justify-content:center">Inloggen</button>
        ${err ? `<div style="color:var(--danger);font-size:13px">${esc(err)}</div>` : ""}
      </div>
    </div>`;
  const p = document.getElementById("lg-pass");
  if(p) p.addEventListener("keydown",(e)=>{ if(e.key==="Enter") doLogin(); });
}

async function doLogin(){
  const email=(document.getElementById("lg-email")?.value||"").trim();
  const pass=(document.getElementById("lg-pass")?.value||"");
  if(!email||!pass){ renderLogin("Vul e-mail en wachtwoord in."); return; }
  const { error } = await sb.auth.signInWithPassword({ email, password: pass });
  if(error){ renderLogin("Aanmelden mislukt. Controleer e-mail en wachtwoord."); }
}
async function doLogout(){ await sb.auth.signOut(); }

function startApp(){
  if(started) return; started=true;
  fetchAll();
  rtChannel = sb.channel("items-rt").on("postgres_changes",{event:"*",schema:"public",table:"items"},()=>{
    if(busyInput || state.editingId || state.adding){ pendingSync=true; return; }
    fetchAll();
  }).subscribe();
}
function stopApp(){
  started=false;
  if(rtChannel){ sb.removeChannel(rtChannel); rtChannel=null; }
  items=[];
}

/* ---------- boot ---------- */
function boot(){
  if(!cfgOk()){ renderSetup(); return; }
  sb = supabase.createClient(window.INPAKLIJST_CONFIG.SUPABASE_URL, window.INPAKLIJST_CONFIG.SUPABASE_ANON_KEY);

  sb.auth.onAuthStateChange((_e, s)=>{
    authedReady = true;
    session = s;
    if(s){ startApp(); render(); }
    else { stopApp(); renderLogin(); }
  });
  sb.auth.getSession().then(({data})=>{
    authedReady = true;
    session = data ? data.session : null;
    if(session){ startApp(); render(); } else { renderLogin(); }
  });

  window.addEventListener("focus", ()=>{
    if(started && !busyInput && !state.editingId && !state.adding) fetchAll();
  });

  if("serviceWorker" in navigator){
    const hadCtrl = !!navigator.serviceWorker.controller;
    let reloaded=false;
    navigator.serviceWorker.addEventListener("controllerchange", ()=>{
      if(reloaded || !hadCtrl) return;
      reloaded=true; window.location.reload();
    });
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  }
}
boot();
