/* OV+ Adventure World: code-drawn pixel map, no image assets. */
(()=>{
const root=document.querySelector("#pixel-map");if(!root)return;
const worlds=[
{id:"explorer",name:"Explorer",subtitle:"Luistereiland",x:13,y:26,color:"#77B7A4",symbol:"♫",shape:"island"},
{id:"musician",name:"Musician",subtitle:"Melodiebos",x:47,y:14,color:"#A8CE84",symbol:"♪",shape:"forest"},
{id:"producer",name:"Producer",subtitle:"Beatfabriek",x:81,y:27,color:"#D4A3C9",symbol:"▣",shape:"factory"},
{id:"designer",name:"Designer",subtitle:"Kleurenstad",x:18,y:75,color:"#E9A987",symbol:"✦",shape:"city"},
{id:"media",name:"Media Maker",subtitle:"Filmhaven",x:51,y:70,color:"#8DAFDD",symbol:"▶",shape:"studio"},
{id:"coder",name:"Coder",subtitle:"Arcadepoort",x:84,y:78,color:"#DCC77D",symbol:"⌘",shape:"arcade"}
];
const NS="http://www.w3.org/2000/svg";const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 1000 600");svg.setAttribute("preserveAspectRatio","none");svg.setAttribute("aria-hidden","true");svg.classList.add("pixel-map-art");
function rect(x,y,w,h,fill){const e=document.createElementNS(NS,"rect");for(const [k,v] of Object.entries({x,y,width:w,height:h,fill}))e.setAttribute(k,v);svg.appendChild(e)}
// Pixel ocean with six distinct islands, reefs, boats and wave tiles.
rect(0,0,1000,600,"#70B9C9");
for(let y=0;y<600;y+=24)for(let x=0;x<1000;x+=32){
 if((x/32*3+y/24*5)%9===0){rect(x+7,y+9,15,4,"#A6D9D7");rect(x+2,y+13,8,3,"#91CED1");}
 if((x/32+y/24*2)%31===0)rect(x+21,y+3,5,5,"#D0E8D9");
}
const positions=worlds.map(w=>({x:w.x*10,y:w.y*6}));
function island(cx,cy,land,kind){
 const tiles=[[ -76,-28,152,70],[-63,-45,126,108],[-45,-59,90,136],[-90,-10,180,42]];
 for(const [dx,dy,w,h] of tiles)rect(cx+dx+4,cy+dy+10,w,h,"#438F9B");
 for(const [dx,dy,w,h] of tiles)rect(cx+dx,cy+dy+4,w,h,"#F3DEAC");
 for(const [dx,dy,w,h] of [[-68,-23,136,63],[-56,-37,112,90],[-36,-49,72,112],[-80,-3,160,29]])rect(cx+dx,cy+dy,w,h,land);
 // Pixelated shoreline, grasses and stones
 for(let j=0;j<7;j++){let px=cx-58+j*18;rect(px,cy+34+(j%2)*7,9,5,"#4E997A");}
 if(kind==="forest"){for(const [dx,dy] of [[-39,-20],[-8,-32],[27,-11]]){rect(cx+dx-5,cy+dy+14,10,23,"#725E4E");rect(cx+dx-19,cy+dy-7,38,27,"#397E67");rect(cx+dx-12,cy+dy-19,24,16,"#4F9B76");}}
 if(kind==="factory"){rect(cx-35,cy-25,76,55,"#9A8AA6");rect(cx-39,cy-30,80,11,"#D6B9C6");rect(cx+20,cy-53,13,32,"#675F7D");rect(cx-22,cy-9,16,18,"#F7D58D");rect(cx+4,cy-9,16,18,"#F7D58D");}
 if(kind==="city"){for(const [dx,dy,h] of [[-42,-14,41],[-11,-32,59],[23,-7,35]]){rect(cx+dx,cy+dy,27,h,"#D98183");rect(cx+dx+6,cy+dy+9,9,10,"#FFF0C7");}}
 if(kind==="studio"){rect(cx-43,cy-21,84,54,"#677EA4");rect(cx-48,cy-29,94,13,"#A8BCE0");rect(cx-19,cy-9,35,26,"#F2E4C8");rect(cx-8,cy-3,15,15,"#D98083");rect(cx+39,cy-8,13,29,"#5A738B");}
 if(kind==="arcade"){rect(cx-36,cy-35,72,65,"#725F99");rect(cx-29,cy-28,58,17,"#E9C16D");rect(cx-22,cy-5,44,25,"#2B5666");rect(cx-11,cy+3,21,8,"#9FD9CD");}
 if(kind==="island"){rect(cx-36,cy-21,72,49,"#F0E1BD");rect(cx-40,cy-27,80,11,"#E7A57B");rect(cx-25,cy-9,17,19,"#88B8B5");rect(cx+7,cy-9,17,19,"#88B8B5");rect(cx-3,cy+7,12,21,"#806F67");}
}
worlds.forEach(w=>island(w.x*10,w.y*6,w.color,w.shape));
// Dotted sea routes connect the six islands without competing with labels.
for(const [a,b] of [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]]){
 const p=positions[a],q=positions[b],n=19;
 for(let j=4;j<n-3;j+=2){const t=j/n;rect(Math.round(p.x+(q.x-p.x)*t),Math.round(p.y+(q.y-p.y)*t),7,7,"#E8F3DC");}
}
// Little sailing boat and a treasure marker
rect(344,317,40,9,"#466C79");rect(351,309,27,9,"#E9D5AB");rect(365,277,4,33,"#375B69");rect(369,281,20,23,"#FFF4D9");
rect(700,364,18,13,"#D6A44D");rect(705,358,8,7,"#F4D889");rect(704,368,10,4,"#9A743E");
root.appendChild(svg);
const layer=document.createElement("div");layer.className="pixel-world-layer";root.appendChild(layer);
// Free sailing: no timer, no score for speed, no moving hazards.
const boat=document.createElement("div");
boat.className="pixel-boat";boat.setAttribute("aria-hidden","true");
boat.innerHTML='<span class="boat-sail"></span><span class="boat-mast"></span><span class="boat-hull"></span><span class="boat-wake"></span>';
layer.appendChild(boat);
let boatX=35,boatY=53,near=-1;
const keys=new Set();let lastFrame=0;
const controls=document.createElement("div");controls.className="map-controls sailing-controls";
controls.innerHTML='<div class="sailing-pad" aria-label="Bestuur het bootje"><button type="button" data-sail="ArrowUp" aria-label="Vaar omhoog">▲</button><div class="sailing-pad-row"><button type="button" data-sail="ArrowLeft" aria-label="Vaar naar links">◀</button><button type="button" data-sail="ArrowDown" aria-label="Vaar omlaag">▼</button><button type="button" data-sail="ArrowRight" aria-label="Vaar naar rechts">▶</button></div></div><div class="sailing-actions"><span class="map-current" role="status" aria-live="polite">Vaar naar een eiland</span><button type="button" class="map-enter" disabled>Vaar dichterbij om aan te meren</button><button type="button" class="map-reset">Terug naar start</button></div>';
root.insertAdjacentElement("afterend",controls);
const status=controls.querySelector(".map-current"),dock=controls.querySelector(".map-enter");
const buttons=[];
function renderBoat(){
 boat.style.left=boatX+"%";boat.style.top=boatY+"%";
 let best=-1,dist=Infinity;
 worlds.forEach((w,i)=>{const dx=(boatX-w.x)*10,dy=(boatY-w.y)*6;const d=Math.hypot(dx,dy);if(d<dist){dist=d;best=i;}});
 near=dist<=115?best:-1;
 buttons.forEach((b,i)=>b.classList.toggle("selected",i===near));
 const message=near<0?"Vaar naar een eiland":("Bij "+worlds[near].name+" · klaar om aan te meren");
 if(status.textContent!==message)status.textContent=message;
 dock.disabled=near<0;dock.textContent=near<0?"Vaar dichterbij om aan te meren":"Aanmeren bij "+worlds[near].name+" ↵";
}
function enterWorld(i=near){
 if(i<0)return;
 document.querySelector('.world[data-filter="'+worlds[i].id+'"]')?.click();
}
worlds.forEach((w,i)=>{
 const b=document.createElement("button");b.type="button";b.className="pixel-world";
 b.style.left=w.x+"%";b.style.top=w.y+"%";
 b.innerHTML='<span class="pixel-world-icon" aria-hidden="true">'+w.symbol+'</span><strong>'+w.name+'</strong><small>'+w.subtitle+'</small>';
 b.setAttribute("aria-label","Open missies van "+w.name);
 b.addEventListener("click",()=>enterWorld(i));layer.appendChild(b);buttons.push(b);
});
function sail(dx,dy){
 const speed=1.25;const norm=Math.hypot(dx,dy)||1;
 boatX=Math.max(3,Math.min(97,boatX+dx/norm*speed));
 boatY=Math.max(5,Math.min(95,boatY+dy/norm*speed));
 boat.classList.toggle("sailing-left",dx<0);
 renderBoat();
}
function sailingAllowed(){return !document.body.classList.contains("locked")&&!document.body.classList.contains("world-selected")&&!!root.getClientRects().length;}
function tick(timestamp){
 const elapsed=lastFrame?Math.min(timestamp-lastFrame,64):16;lastFrame=timestamp;
 if(sailingAllowed()&&keys.size){
 const dx=Number(keys.has("ArrowRight"))-Number(keys.has("ArrowLeft"));
 const dy=Number(keys.has("ArrowDown"))-Number(keys.has("ArrowUp"));
 if(dx||dy)sail(dx*elapsed/45,dy*elapsed/45);
 }
 requestAnimationFrame(tick);
}
root.setAttribute("tabindex","0");
root.setAttribute("aria-label","Zee met zes eilanden. Vaar met pijltjestoetsen en druk op Enter als je bij een eiland bent.");
document.addEventListener("keydown",e=>{
 if(!sailingAllowed())return;
 if(e.target.closest?.("input,textarea,select,[contenteditable=true],button,a,[role=dialog]"))return;
 if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();keys.add(e.key);}
 if(e.key==="Enter"&&near>=0){e.preventDefault();enterWorld();}
});
document.addEventListener("keyup",e=>keys.delete(e.key));
window.addEventListener("blur",()=>keys.clear());
document.addEventListener("visibilitychange",()=>{if(document.hidden)keys.clear();});
controls.querySelectorAll("[data-sail]").forEach(b=>{
 const key=b.dataset.sail;
 b.addEventListener("pointerdown",e=>{if(!sailingAllowed())return;e.preventDefault();keys.add(key);b.setPointerCapture?.(e.pointerId);});
 for(const event of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(event,()=>keys.delete(key));
 b.addEventListener("click",()=>{if(sailingAllowed())sail(key==="ArrowRight"?1:key==="ArrowLeft"?-1:0,key==="ArrowDown"?1:key==="ArrowUp"?-1:0);});
});
dock.addEventListener("click",()=>enterWorld());
controls.querySelector(".map-reset").addEventListener("click",()=>{boatX=35;boatY=53;keys.clear();renderBoat();});
renderBoat();requestAnimationFrame(tick);

function update(){const entries=Object.values(window.labAdventureProgress||{});const done=entries.filter(p=>p.status==="completed"&&/^[A-Z]-Q\d+$/.test(p.assignment_id));const xp=done.length*50,coins=done.length*10;const level=1+Math.floor(xp/250);const put=(id,v)=>{const e=document.querySelector(id);if(e)e.textContent=v};put("#coin-count",coins);put("#adventure-level","Level "+level);put("#adventure-xp",xp+" XP");}
window.updateAdventure=update;update();
})();
