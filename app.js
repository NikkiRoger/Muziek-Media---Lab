const SUPABASE_URL="https://ynwwfoaotblygzwdbxmq.supabase.co";
const SUPABASE_KEY="sb_publishable_kzv5vvuWGaikpHKd3Tb_nA_bFdEdeSe";
const db=window.supabase?.createClient?.(SUPABASE_URL,SUPABASE_KEY) || null;
let labStudent=null;let labProgress={};
const loginScreen=document.querySelector("#login-screen"),labApp=document.querySelector("#lab-app"),studentName=document.querySelector("#student-name");
function setLoggedIn(on){document.body.classList.toggle("locked",!on);loginScreen.classList.toggle("hidden",on);labApp.classList.toggle("hidden",!on)}
async function loadProgress(){if(!labStudent)return;const {data,error}=await db.rpc("lab_get_progress",{p_student:labStudent.id,p_code:labStudent.code});if(error)return;labProgress={};(data||[]).forEach(p=>labProgress[p.assignment_id]=p);paintProgress()}
function paintProgress(){document.querySelectorAll("[data-assignment]").forEach(el=>{const p=labProgress[el.dataset.assignment];el.classList.toggle("is-complete",p?.status==="completed");el.classList.toggle("is-started",p?.status==="started");const badge=el.querySelector(".progress-badge");if(badge)badge.textContent=p?.status==="completed"?"✓ Klaar":p?"● Bezig":"○ Nieuw"});
const ids=new Set((window.quickMissions||[]).map(m=>m.id));const total=ids.size;const done=Object.values(labProgress).filter(p=>ids.has(p.assignment_id)&&p.status==="completed").length;const pct=total?Math.min(100,Math.round(done/total*100)):0;const fill=document.querySelector("#progress-fill"),txt=document.querySelector("#progress-text"),per=document.querySelector("#progress-percent");if(fill)fill.style.width=pct+"%";if(txt)txt.textContent=done+" van "+total+" opdrachten klaar";if(per)per.textContent=pct+"%";window.labAdventureProgress=labProgress;window.updateAdventure?.();}
async function saveProgress(id,status="started",answers={},step=1){if(!labStudent)return;const {error}=await db.rpc("lab_save_progress",{p_student:labStudent.id,p_code:labStudent.code,p_assignment:id,p_status:status,p_answers:answers,p_step:step});if(!error){labProgress[id]={assignment_id:id,status,answers,current_step:step};paintProgress();return true}return false}
async function login(name,code){if(!db)throw new Error("De verbinding met het spel is niet geladen. Vernieuw de pagina en probeer opnieuw.");const request=db.rpc(registrationMode?"lab_register":"lab_login",{p_name:name,p_code:code});const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error("De verbinding duurt te lang. Controleer je internet en probeer opnieuw.")),12000));const {data,error}=await Promise.race([request,timeout]);if(error){console.error("Adventure login error:",error);throw new Error(registrationMode?"Account aanmaken lukt niet. Probeer een andere gebruikersnaam of probeer later opnieuw.":"Inloggen lukt niet. Controleer je gegevens of probeer later opnieuw.");}if(!data?.length)throw new Error(registrationMode?"Registreren is niet gelukt. Kies een andere gebruikersnaam.":"Gebruikersnaam of toegangscode klopt niet. Nieuwe leerling? Kies ‘Nieuw account’.");labStudent={id:data[0].student_id,name:data[0].display_name,code};sessionStorage.setItem("labStudent",JSON.stringify(labStudent));studentName.textContent="Hoi, "+labStudent.name;setLoggedIn(true);await loadProgress()}
let registrationMode=false;
const loginSubmit=document.querySelector(".login-button");
function setLoginMode(register){
 registrationMode=register;
 document.querySelector("#mode-login").classList.toggle("active",!register);
 document.querySelector("#mode-register").classList.toggle("active",register);
 document.querySelector("#mode-login").setAttribute("aria-pressed",String(!register));
 document.querySelector("#mode-register").setAttribute("aria-pressed",String(register));
 document.querySelector("#login-intro").textContent=register?"Kies een unieke gebruikersnaam en een toegangscode. Zo kun je later verder spelen.":"Heb je al een account? Log in en speel verder.";
 document.querySelector("#login-help").textContent=register?"Gebruik bijvoorbeeld je voornaam met een cijfer. Onthoud je toegangscode.":"Nieuw op school? Kies hierboven ‘Nieuw account’.";
 document.querySelector("#login-name").placeholder=register?"bv. Sam7":"Je gebruikersnaam";
 document.querySelector("#login-code").autocomplete=register?"new-password":"current-password";
 loginSubmit.textContent=register?"Maak mijn account →":"Start mijn avontuur →";
 document.querySelector("#login-error").textContent="";
}
document.querySelector("#mode-login").addEventListener("click",()=>setLoginMode(false));
document.querySelector("#mode-register").addEventListener("click",()=>setLoginMode(true));
document.querySelector("#login-form").addEventListener("submit",async e=>{e.preventDefault();const err=document.querySelector("#login-error"),button=document.querySelector(".login-button");err.textContent="";const name=document.querySelector("#login-name").value.trim(),code=document.querySelector("#login-code").value.trim();button.disabled=true;button.textContent="Even laden…";try{await login(name,code)}catch(x){err.textContent=x.message||"Inloggen lukt niet. Probeer opnieuw."}finally{button.disabled=false;button.textContent=registrationMode?"Maak mijn account →":"Start mijn avontuur →"}});
document.querySelector("#logout").addEventListener("click",()=>{sessionStorage.removeItem("labStudent");labStudent=null;setLoggedIn(false);document.querySelector("#login-code").value="";document.querySelector("#login-name").focus()});
try{const saved=JSON.parse(sessionStorage.getItem("labStudent"));if(saved?.id){labStudent=saved;studentName.textContent="Hoi, "+saved.name;setLoggedIn(true);loadProgress()}else setLoggedIn(false)}catch{setLoggedIn(false)}

const worlds=document.querySelectorAll(".world");const title=document.querySelector("#mission-title");const intro=document.querySelector("#mission-intro");const showAll=document.querySelector("#show-all");const names={explorer:"Explorer",musician:"Musician",producer:"Producer",designer:"Designer",media:"Media Maker",coder:"Coder"};
const grid=document.querySelector(".grid");
document.querySelector("#back-to-map")?.addEventListener("click",()=>{document.body.classList.remove("world-selected");document.querySelector("#back-to-map").classList.add("hidden");document.querySelector("#adventure").scrollIntoView({behavior:"smooth",block:"start"});});
(window.quickMissions||[]).forEach(m=>{const a=document.createElement("article");a.className="card quick-card";a.dataset.track=m.track;a.dataset.assignment=m.id;a.innerHTML=`<div class="tag">${m.trackLabel} · QUICK</div><h3>${m.title}</h3><p>${m.mission}</p><div class="progress-badge">○ Nieuw</div><div class="bottom"><span>${m.duration}</span><button class="mission-open" data-id="${m.id}">Start quick →</button></div>`;grid.appendChild(a);});
function cards(){return document.querySelectorAll(".card")}
function filterMissions(filter){cards().forEach(card=>card.classList.toggle("hidden",filter!=="all"&&card.dataset.track!==filter));if(filter==="all"){title.textContent="Alle missies";intro.textContent="Kies een QUICK voor een korte start of een langere missie als je meer tijd hebt.";showAll.classList.add("hidden");}else{title.textContent=names[filter]+" missies";intro.textContent="Kies een korte QUICK of ga voor een langere missie.";showAll.classList.remove("hidden");}document.body.classList.toggle("world-selected",filter!=="all");document.querySelector("#back-to-map")?.classList.toggle("hidden",filter==="all");document.querySelector("#missies").scrollIntoView({behavior:"smooth",block:"start"});}
worlds.forEach(world=>world.addEventListener("click",()=>filterMissions(world.dataset.filter)));showAll.addEventListener("click",()=>{filterMissions("all");document.querySelector("#werelden").scrollIntoView({behavior:"smooth"});});

const explorerPrompts={
"E-Q02":{intro:"Luister naar het begin van drie verschillende nummers. Welke intro maakt je nieuwsgierig?",fields:[["song1","Nummer 1 (artiest en titel)","Bijvoorbeeld: Stromae – Papaoutai"],["song2","Nummer 2 (artiest en titel)",""],["song3","Nummer 3 (artiest en titel)",""],["favorite","Welk nummer heeft de beste intro?","Nummer 1, 2 of 3"],["reason","Waarom kies je deze intro?","Bijvoorbeeld: de drums beginnen meteen."]],steps:[["KIES","Zoek drie verschillende liedjes op YouTube of Spotify. Vul hun titels in.",["song1","song2","song3"]],["LUISTER","Luister bij elk nummer alleen naar de eerste 15 seconden. Je mag opnieuw luisteren.",[]],["VERGELIJK","Kies welke intro jij het beste vindt.",["favorite"]],["BESLUIT","Leg in één zin uit waarom die intro jou aanspreekt.",["reason"]]]},
"E-Q03":{intro:"Vergelijk het origineel met een cover of remix. Wat is hetzelfde en wat klinkt anders?",fields:[["original","Origineel: artiest en titel",""],["version","Cover of remix: artiest en titel",""],["difference1","Verschil 1","Bijvoorbeeld: andere stem"],["difference2","Verschil 2","Bijvoorbeeld: sneller tempo"],["difference3","Verschil 3","Bijvoorbeeld: meer gitaar"],["favorite","Welke versie vind jij beter?","Origineel of cover/remix"],["reason","Waarom?","Omdat…"]],steps:[["ZOEK","Zoek een origineel nummer en een cover of remix. Vul beide titels in.",["original","version"]],["LUISTER","Luister naar een stukje van beide versies. Je mag pauzeren en terugspoelen.",[]],["ONTDEK","Noteer drie verschillen. Denk aan stem, instrumenten, tempo of sfeer.",["difference1","difference2","difference3"]],["KIES","Welke versie vind jij beter? Vertel waarom.",["favorite","reason"]]]}
};
function showExplorerMission(m){
const spec=explorerPrompts[m.id],old=document.querySelector("#quick-modal");if(old)old.remove();
const saved=labProgress[m.id]?.answers||{};let step=1,dirty=false,timer=null,saving=Promise.resolve();
const modal=document.createElement("div");modal.id="quick-modal";modal.className="quick-overlay";
const fieldMap=Object.fromEntries(spec.fields.map(([id,label,placeholder])=>[id,`<label class="sd-field" for="ex-${id}">${label}<textarea id="ex-${id}" data-answer="${id}" rows="2" placeholder="${placeholder}">${esc(saved[id]||"")}</textarea></label>`]));
modal.innerHTML=`<section class="quick-sheet interactive-sheet" role="dialog" aria-modal="true" aria-labelledby="ex-title">
<div class="sd-top"><button type="button" id="ex-home" class="sd-home">← Terug naar opdrachtenbank</button><span>Stap <strong id="ex-count">1</strong> van 4</span></div><div class="sd-step-track"><div id="ex-fill"></div></div>
<p class="kicker">EXPLORER · QUICK · ${m.duration}</p><h2 id="ex-title">${m.title}</h2><p class="sd-intro">${spec.intro}</p><p class="sd-save" id="ex-status" role="status">Je antwoorden worden automatisch bewaard.</p>
${spec.steps.map(([label,instruction,ids],i)=>`<section class="sd-panel ${i?"hidden":""}" data-ex-step="${i+1}"><span class="step-label">STAP ${i+1} · ${label}</span><h3>${instruction}</h3>${ids.map(id=>fieldMap[id]).join("")}${!ids.length?'<p class="sd-hint">Klaar met luisteren? Klik op ‘Volgende stap’.</p>':""}</section>`).join("")}
<div class="sd-actions" id="ex-actions"><button type="button" class="sd-secondary" id="ex-back">← Vorige stap</button><button type="button" class="sd-primary" id="ex-next">Volgende stap →</button></div>
<section class="sd-finish hidden" id="ex-finish"><h3>✓ Opdracht afgerond!</h3><p>Je antwoorden zijn opgeslagen. Je kunt ze later opnieuw bekijken.</p><button type="button" class="sd-home sd-finish-home" id="ex-finish-home">← Terug naar opdrachtenbank</button></section></section>`;
document.body.appendChild(modal);
const status=modal.querySelector("#ex-status"),collect=()=>Object.fromEntries([...modal.querySelectorAll("[data-answer]")].map(x=>[x.dataset.answer,x.value.trim()]));
const persist=(done=false)=>{clearTimeout(timer);dirty=false;const answers=collect();status.textContent="Bewaren…";saving=saving.catch(()=>{}).then(async()=>{const ok=await saveProgress(m.id,done?"completed":"started",answers,step);status.textContent=ok?"✓ Opgeslagen":"Opslaan mislukt. Probeer opnieuw.";return ok});return saving};
const schedule=()=>{dirty=true;clearTimeout(timer);status.textContent="Wijzigingen worden bewaard…";timer=setTimeout(()=>persist(),700)};
const refresh=()=>{modal.querySelectorAll("[data-ex-step]").forEach(x=>x.classList.toggle("hidden",Number(x.dataset.exStep)!==step));modal.querySelector("#ex-count").textContent=step;modal.querySelector("#ex-fill").style.width=step*25+"%";modal.querySelector("#ex-back").disabled=step===1;modal.querySelector("#ex-next").textContent=step===4?"✓ Afronden":"Volgende stap →"};
const close=async()=>{if(dirty)await persist();else await saving;modal.remove();document.querySelector("#missies").scrollIntoView({block:"start",behavior:"smooth"})};
modal.querySelector("#ex-home").onclick=close;modal.querySelector("#ex-finish-home").onclick=close;
modal.querySelector("#ex-back").onclick=async()=>{if(dirty)await persist();step=Math.max(1,step-1);refresh();modal.querySelector(".quick-sheet").scrollIntoView({block:"start"})};
modal.querySelector("#ex-next").onclick=async()=>{const missing=spec.steps[step-1][2].find(id=>!collect()[id]);if(missing){status.textContent="Vul eerst de vraag in. Eén korte zin is genoeg.";modal.querySelector("#ex-"+missing).focus();return}const last=step===4;if(await persist(last)===false)return;if(last){modal.querySelectorAll("[data-ex-step],#ex-actions").forEach(x=>x.classList.add("hidden"));modal.querySelector("#ex-finish").classList.remove("hidden")}else{step++;refresh()}modal.querySelector(".quick-sheet").scrollIntoView({block:"start"})};
modal.addEventListener("input",schedule);modal.addEventListener("click",e=>{if(e.target===modal)close()});refresh();
}

function showQuick(id){
 const m=(window.quickMissions||[]).find(x=>x.id===id);if(!m)return;
 if(id==="E-Q01"){showSongDetective(m);return;}
 if(explorerPrompts[id]){showExplorerMission(m);return;}
 showStepMission(m);
}
function showStepMission(m){
 document.querySelector("#quick-modal")?.remove();
 const old=labProgress[m.id]||{},saved=old.answers||{};
 let step=Math.max(1,Math.min(m.steps.length,Number(old.current_step)||1));
 let saving=Promise.resolve(),timer=null,dirty=false;
 const modal=document.createElement("div");modal.id="quick-modal";modal.className="quick-overlay";
 modal.innerHTML=`<section class="quick-sheet interactive-sheet" role="dialog" aria-modal="true" aria-labelledby="mission-dialog-title">
 <div class="sd-top"><button type="button" class="sd-home" id="mission-exit">← Terug naar missies</button><span>Stap <strong id="mission-step-num">${step}</strong> van ${m.steps.length}</span></div>
 <div class="sd-step-track"><div id="mission-step-fill"></div></div>
 <p class="kicker">${esc(m.trackLabel)} · QUICK · ${esc(m.duration)}</p>
 <h2 id="mission-dialog-title">${esc(m.title)}</h2>
 <p class="sd-intro">${esc(m.mission)}</p>
 <p class="sd-save" id="mission-save-status" role="status" aria-live="polite">Je kunt je voortgang bewaren.</p>
 ${m.steps.map((instruction,i)=>`<section class="sd-panel ${i===step-1?"":"hidden"}" data-mission-step="${i+1}">
 <span class="step-label">STAP ${i+1} VAN ${m.steps.length}</span>
 <h3>${esc(instruction)}</h3>
 <label class="mission-check"><input type="checkbox" data-check="${i}" ${saved["check"+i]?"checked":""}> Deze stap heb ik uitgevoerd.</label>
 <label class="sd-field">Mijn notitie (mag leeg blijven)<textarea rows="3" data-note="${i}" placeholder="Wat heb je gemaakt of ontdekt?">${esc(saved["note"+i]||"")}</textarea></label>
 </section>`).join("")}
 <p class="quick-tools"><strong>NODIG</strong> · ${esc(m.tools)}</p>
 <div class="sd-actions" id="mission-actions"><button type="button" class="sd-secondary" id="mission-back">← Vorige stap</button><button type="button" class="sd-primary" id="mission-next">Volgende stap →</button></div>
 <section class="sd-finish hidden" id="mission-finish"><h3>✓ Missie afgerond!</h3><p>${esc(m.done)}</p><p>+50 XP · +10 OV+ Coins</p><details class="sd-extra"><summary>★ Extra uitdaging (vrijblijvend)</summary><p>${esc(m.extra)}</p></details><button type="button" class="sd-home" id="mission-finish-exit">← Terug naar missies</button></section>
 </section>`;
 document.body.appendChild(modal);
 const status=modal.querySelector("#mission-save-status");
 const collect=()=>{const result={};modal.querySelectorAll("[data-check]").forEach(x=>result["check"+x.dataset.check]=x.checked);modal.querySelectorAll("[data-note]").forEach(x=>result["note"+x.dataset.note]=x.value.trim());return result;};
 const persist=(complete=false)=>{clearTimeout(timer);dirty=false;const answers=collect();status.textContent="Bewaren…";saving=saving.catch(()=>{}).then(async()=>{const ok=await saveProgress(m.id,complete||old.status==="completed"?"completed":"started",answers,step);status.textContent=ok?"✓ Voortgang opgeslagen":"Bewaren mislukt. Probeer opnieuw.";return ok});return saving;};
 const schedule=()=>{dirty=true;clearTimeout(timer);status.textContent="Wijzigingen worden bewaard…";timer=setTimeout(()=>persist(),850);};
 const refresh=()=>{modal.querySelectorAll("[data-mission-step]").forEach(x=>x.classList.toggle("hidden",Number(x.dataset.missionStep)!==step));modal.querySelector("#mission-step-num").textContent=step;modal.querySelector("#mission-step-fill").style.width=Math.round(step/m.steps.length*100)+"%";modal.querySelector("#mission-back").disabled=step===1;modal.querySelector("#mission-next").textContent=step===m.steps.length?"✓ Missie afronden":"Volgende stap →";};
 const close=async()=>{if(dirty)await persist();else await saving;modal.remove();document.querySelector("#missies").scrollIntoView({block:"start",behavior:"smooth"});};
 modal.querySelector("#mission-exit").onclick=close;modal.querySelector("#mission-finish-exit").onclick=close;
 modal.querySelector("#mission-back").onclick=async()=>{if(dirty&&await persist()===false)return;step=Math.max(1,step-1);refresh();};
 modal.querySelector("#mission-next").onclick=async()=>{
 const checked=modal.querySelector('[data-check="'+(step-1)+'"]');
 if(!checked.checked){status.textContent="Vink eerst aan dat je deze stap hebt uitgevoerd.";checked.focus();return;}
 const final=step===m.steps.length;
 if(await persist(final)===false)return;
 if(final){modal.querySelectorAll("[data-mission-step],#mission-actions").forEach(x=>x.classList.add("hidden"));modal.querySelector("#mission-finish").classList.remove("hidden");}
 else{step++;refresh();}
 modal.querySelector(".quick-sheet").scrollIntoView({block:"start"});
 };
 modal.addEventListener("input",schedule);modal.addEventListener("change",schedule);
 modal.addEventListener("click",e=>{if(e.target===modal)close();});
 refresh();modal.querySelector("#mission-exit").focus();
}

function esc(v=""){return String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]))}
function showSongDetective(m){
 const saved=labProgress[m.id]?.answers||{};
 const previous=document.querySelector("#quick-modal");if(previous)previous.remove();
 const choices=["Ritme","Instrumenten","Stem","Bas","Melodie","Effecten","Sfeer","Opbouw"];
 const help={Ritme:"De maat of het patroon waarop je kunt meetikken.",Instrumenten:"Bijvoorbeeld gitaar, piano, drums of synthesizer.",Stem:"Hoe iemand zingt, rapt of praat.",Bas:"De lage klanken die je vaak kunt voelen.",Melodie:"De tonen die je kunt neuriën.",Effecten:"Bijvoorbeeld echo, vervorming of galm.",Sfeer:"Hoe het nummer aanvoelt: vrolijk, donker, rustig…",Opbouw:"Wat erbij komt, wegvalt of verandert."};
 const selected=Array.isArray(saved.elements)?saved.elements:[];
 const modal=document.createElement("div");modal.id="quick-modal";modal.className="quick-overlay";
 modal.innerHTML=`<section class="quick-sheet interactive-sheet" role="dialog" aria-modal="true" aria-labelledby="sd-title">
 <div class="sd-top"><button type="button" class="sd-home">← Terug naar opdrachtenbank</button><span class="sd-step-count">Stap <span id="sd-step-number">1</span> van 4</span></div>
 <div class="sd-step-track"><div id="sd-step-fill"></div></div>
 <p class="kicker">EXPLORER · 10–15 MINUTEN</p><h2 id="sd-title">🎧 Song Detective</h2>
 <p class="sd-intro">Jij bent de detective. Kies een liedje, luister aandachtig en ontdek wat het bijzonder maakt. Je hoeft niets over muziektheorie te weten.</p>
 <p class="sd-save" id="sd-status" role="status" aria-live="polite">Je werk wordt automatisch opgeslagen.</p>
 <div class="sd-panel" data-step="1"><span class="step-label">STAP 1 · KIES</span><h3>Welk nummer ga je onderzoeken?</h3><p>Open YouTube of Spotify in een ander tabblad. Kies een liedje dat je kent of leuk vindt. Luister er minstens één minuut naar.</p><label for="sd-song">Schrijf hier de artiest en titel.</label><input type="text" id="sd-song" value="${esc(saved.song||"")}" placeholder="Bijvoorbeeld: Stromae – Alors on danse"><p class="sd-hint">Tip: je mag je eigen favoriete nummer kiezen.</p></div>
 <div class="sd-panel hidden" data-step="2"><span class="step-label">STAP 2 · ONTDEK</span><h3>Waar ga jij op letten?</h3><p>Vink precies <strong>drie</strong> dingen aan. Je hoeft ze nog niet te kunnen uitleggen.</p><div class="choice-grid">${choices.map(x=>`<label class="choice-chip"><input type="checkbox" name="sd-element" value="${x}" ${selected.includes(x)?"checked":""}><span>${x}</span></label>`).join("")}</div><p id="choice-help" class="field-help"></p><div id="sd-definitions" class="sd-definitions"></div></div>
 <div class="sd-panel hidden" data-step="3"><span class="step-label">STAP 3 · LUISTER</span><h3>Wat ontdek je?</h3><p>Luister opnieuw naar hetzelfde nummer. Let vooral op de drie dingen die je net koos.</p><label for="sd-hear">Wat hoor je dat opvalt?</label><p class="sd-example">Voorbeeld: “Ik hoor een zware bas en een stem met echo.”</p><textarea id="sd-hear" placeholder="Ik hoor…">${esc(saved.hear||"")}</textarea><label for="sd-change">Verandert er iets in het nummer?</label><p class="sd-example">Voorbeeld: “Na het refrein komen de drums erbij.” Of schrijf: “Ik hoor geen verandering.”</p><textarea id="sd-change" placeholder="Er verandert…">${esc(saved.change||"")}</textarea></div>
 <div class="sd-panel hidden" data-step="4"><span class="step-label">STAP 4 · BESLUIT</span><h3>Wat maakt dit nummer bijzonder?</h3><p>Er is geen fout antwoord. Vertel wat <strong>jij</strong> goed of opvallend vindt.</p><label for="sd-conclusion">Waarom zou je dit nummer opnieuw beluisteren?</label><p class="sd-example">Voorbeeld: “Omdat het ritme me energie geeft.”</p><textarea id="sd-conclusion" placeholder="Ik zou opnieuw luisteren omdat…">${esc(saved.conclusion||"")}</textarea><details class="sd-extra"><summary>★ Extra uitdaging (niet verplicht)</summary><p>Luister nog eens. Hoor je iets dat je eerst gemist had?</p><textarea id="sd-extra" placeholder="Mijn extra ontdekking…">${esc(saved.extra||"")}</textarea></details></div>
 <div class="sd-actions"><button type="button" id="sd-back" class="sd-secondary">← Vorige stap</button><button type="button" id="sd-next" class="sd-primary">Volgende stap →</button></div>
 <div class="sd-finish hidden" id="sd-finish"><h3>🎉 Goed onderzocht!</h3><p>Je antwoorden zijn opgeslagen. Je kunt later terugkomen en ze opnieuw bekijken.</p><button type="button" class="sd-home sd-finish-home">← Terug naar opdrachtenbank</button></div>
 </section>`;
 document.body.appendChild(modal);
 let step=1,timer=null,dirty=false,saving=Promise.resolve();
 const status=modal.querySelector("#sd-status");
 const collect=()=>({song:modal.querySelector("#sd-song").value.trim(),elements:[...modal.querySelectorAll('input[name="sd-element"]:checked')].map(x=>x.value),hear:modal.querySelector("#sd-hear").value.trim(),change:modal.querySelector("#sd-change").value.trim(),conclusion:modal.querySelector("#sd-conclusion").value.trim(),extra:modal.querySelector("#sd-extra").value.trim()});
 const persist=(finished=false)=>{clearTimeout(timer);const answers=collect();dirty=false;status.textContent="Bewaren…";saving=saving.catch(()=>{}).then(async()=>{const result=await saveProgress(m.id,finished?"completed":"started",answers,step);status.textContent=result===false?"Opslaan niet gelukt. Probeer opnieuw.":"✓ Antwoorden opgeslagen";return result});return saving};
 const schedule=()=>{dirty=true;clearTimeout(timer);status.textContent="Wijzigingen worden bewaard…";timer=setTimeout(()=>persist(),650)};
 const refresh=()=>{modal.querySelectorAll(".sd-panel").forEach(p=>p.classList.toggle("hidden",Number(p.dataset.step)!==step));modal.querySelector("#sd-step-number").textContent=step;modal.querySelector("#sd-step-fill").style.width=(step*25)+"%";modal.querySelector("#sd-back").disabled=step===1;modal.querySelector("#sd-next").textContent=step===4?"✓ Opdracht afronden":"Volgende stap →";const a=collect();modal.querySelector("#choice-help").textContent=a.elements.length+" van 3 gekozen";modal.querySelector("#sd-definitions").textContent=a.elements.map(x=>x+": "+help[x]).join(" • ");};
 const close=async()=>{if(dirty)await persist();else await saving;modal.remove();document.querySelector("#missies").scrollIntoView({behavior:"smooth",block:"start"})};
 modal.querySelectorAll(".sd-home").forEach(b=>b.addEventListener("click",close));
 modal.querySelector("#sd-back").onclick=async()=>{if(dirty)await persist();step=Math.max(1,step-1);refresh();modal.querySelector(".quick-sheet").scrollIntoView({block:"start"})};
 modal.querySelector("#sd-next").onclick=async()=>{const a=collect();if(step===1&&!a.song){status.textContent="Schrijf eerst de titel van je nummer op.";modal.querySelector("#sd-song").focus();return}if(step===2&&a.elements.length!==3){status.textContent="Kies eerst precies drie dingen.";return}if(step===3&&(!a.hear||!a.change)){status.textContent="Vul beide luistervragen in. Eén korte zin is genoeg.";return}if(step===4&&!a.conclusion){status.textContent="Schrijf eerst jouw besluit op.";modal.querySelector("#sd-conclusion").focus();return}const final=step===4;const result=await persist(final);if(result===false)return;if(final){modal.querySelectorAll(".sd-panel,.sd-actions").forEach(p=>p.classList.add("hidden"));modal.querySelector("#sd-finish").classList.remove("hidden");modal.querySelector("#sd-step-fill").style.width="100%";modal.querySelector(".quick-sheet").scrollIntoView({block:"start"})}else{step++;refresh();modal.querySelector(".quick-sheet").scrollIntoView({block:"start"})}};
 modal.addEventListener("input",schedule);
 modal.addEventListener("change",e=>{if(e.target.name==="sd-element"){const checked=modal.querySelectorAll('input[name="sd-element"]:checked');if(checked.length>3){e.target.checked=false;status.textContent="Je kunt maximaal drie dingen kiezen.";return}refresh();schedule()}});
 modal.addEventListener("click",e=>{if(e.target===modal)close()});
 refresh();modal.querySelector(".sd-home").focus();
}

document.addEventListener("click",e=>{const link=e.target.closest(".card:not(.quick-card) a");if(link){const card=link.closest(".card");if(card){const id=card.querySelector("h3").textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");saveProgress("LONG-"+id,"started",{},1)}}const b=e.target.closest(".mission-open");if(b)showQuick(b.dataset.id);const done=e.target.closest("[data-complete]");if(done){done.disabled=true;done.textContent="Bewaren…";saveProgress(done.dataset.complete,"completed",labProgress[done.dataset.complete]?.answers||{},99).then(ok=>{done.textContent=ok?"✓ Opdracht opgeslagen · +50 XP · +10 Coins":"Opslaan mislukt — probeer opnieuw";done.disabled=!!ok})}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const m=document.querySelector("#quick-modal");if(m)m.remove();}});
const existing=[...document.querySelectorAll(".card:not(.quick-card) a")].map(a=>({kind:"url",value:a.href}));const quick=(window.quickMissions||[]).map(m=>({kind:"quick",value:m.id}));const all=[...existing,...quick];document.querySelector("#surprise").addEventListener("click",()=>{const c=all[Math.floor(Math.random()*all.length)];if(c.kind==="url")window.location.href=c.value;else showQuick(c.value);});
