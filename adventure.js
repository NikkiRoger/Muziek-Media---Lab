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
rect(0,0,1000,600,"#347F9C");\nrect(14,14,972,572,"#56A8BD");\nrect(35,35,930,530,"#65B9C8");
for(let y=0;y<600;y+=24)for(let x=0;x<1000;x+=32){
 if((x/32*3+y/24*5)%9===0){rect(x+7,y+9,15,4,"#A6D9D7");rect(x+2,y+13,8,3,"#91CED1");}
 if((x/32+y/24*2)%31===0)rect(x+21,y+3,5,5,"#D0E8D9");
}
const positions=worlds.map(w=>({x:w.x*10,y:w.y*6}));
function island(cx,cy,land,kind){
 const r=(x,y,w,h,c)=>rect(cx+x,cy+y,w,h,c);
 // Layered, irregular, tile-built coastlines with strong elevation and shadows.
 const outline=[[-90,-20,180,69],[-76,-47,151,122],[-52,-62,107,146],[-103,0,206,37]];
 outline.forEach(([x,y,w,h])=>r(x+6,y+15,w,h,"#286E80"));
 outline.forEach(([x,y,w,h])=>r(x+2,y+7,w,h,"#E8C78D"));
 outline.forEach(([x,y,w,h])=>r(x,y,w,h,"#F6DDA5"));
 const grass=[[-79,-20,158,65],[-64,-38,127,105],[-43,-52,88,131],[-91,1,182,28]];
 grass.forEach(([x,y,w,h])=>r(x,y,w,h,land));
 r(-60,42,122,6,"#428C7B");r(-37,50,75,5,"#37877E");
 // Terrain pixels, grass tufts, boulders, flowers and pathways.
 for(let i=0;i<20;i++){const x=-70+(i*29)%139,y=-34+(i*37)%78;r(x,y,7,4,i%4===0?"#E9E5B2":"#4C967C");}
 for(let i=0;i<5;i++){const x=-57+i*27;r(x,27+(i%2)*6,11,5,"#F8E7BC");}
 const tree=(x,y)=>{r(x-3,y+9,9,26,"#735747");r(x-21,y-5,43,22,"#2F745F");r(x-14,y-19,30,21,"#388D6A");r(x-7,y-27,18,13,"#62AC7C");r(x+9,y-10,6,6,"#B4D8A0");};
 const roof=(x,y,w,c)=>{r(x-5,y-9,w+10,11,"#344D5D");r(x-1,y-15,w+2,9,c);r(x+4,y-22,w-8,8,c);};
 const window=(x,y)=>{r(x,y,11,13,"#314F5E");r(x+3,y+3,5,7,"#F8DE8E");};
 if(kind==="island"){tree(-62,-33);tree(62,-20);r(-34,-15,68,54,"#FFF1D2");r(-37,-19,74,8,"#AF7D64");roof(-34,-19,68,"#C66D66");window(-23,0);window(12,0);r(-5,14,16,25,"#8C6856");r(-3,19,5,6,"#F4D88B");r(-7,38,22,18,"#D9BE92");}
 if(kind==="forest"){tree(-52,-27);tree(43,-32);tree(5,-48);tree(-24,30);r(-23,-3,50,37,"#D6A66E");roof(-23,-3,50,"#8C5D69");window(-12,10);r(9,14,12,20,"#644C4A");r(1,34,14,17,"#F5D6A3");}
 if(kind==="factory"){r(-50,-20,100,66,"#8B809D");r(-55,-27,110,12,"#D7B7C7");r(-33,-58,18,36,"#635F7D");r(21,-75,16,55,"#665A7A");r(-37,-62,26,7,"#B9A8C2");r(19,-79,20,8,"#B9A8C2");r(-33,-72,24,7,"#E5D9E3");r(22,-89,25,7,"#E5D9E3");for(let i=0;i<3;i++)window(-37+i*29,-5);r(-9,19,24,27,"#514D65");r(-2,25,9,11,"#F2D9AA");}
 if(kind==="city"){r(-59,-10,35,55,"#E9A17C");r(-19,-37,43,82,"#E2C7A2");r(30,-19,31,64,"#B57E99");roof(-59,-10,35,"#B6656E");roof(-19,-37,43,"#C96B78");roof(30,-19,31,"#835C8F");for(const x of [-50,-8,39]){window(x,1);window(x,23);}r(-10,-22,17,14,"#F9E6A2");r(-7,32,13,13,"#765D63");}
 if(kind==="studio"){r(-53,-20,108,66,"#6687B2");roof(-53,-20,108,"#3F617F");r(-30,-3,62,40,"#293F63");r(-24,3,50,28,"#E8C6B1");r(-17,7,35,19,"#B65F76");r(-4,8,12,16,"#F6E7C4");r(39,-4,11,39,"#334B6A");r(42,-19,5,16,"#F3C977");tree(-72,-17);}
 if(kind==="arcade"){r(-48,-29,96,77,"#765C9B");roof(-48,-29,96,"#D6A84F");r(-37,-12,74,48,"#2F4D70");r(-31,-6,62,32,"#77A5B4");r(-26,-1,52,22,"#E4A9B4");r(-17,6,34,10,"#FBE3A7");r(-8,34,19,14,"#3D375D");r(-43,-35,15,10,"#F4D17B");r(31,-35,15,10,"#F4D17B");}
 // Tiny docks show exactly where the player can sail.
 r(-10,58,20,17,"#8E6D52");r(-17,64,34,6,"#D3B384");r(-10,76,5,13,"#7A5D4B");r(6,76,5,13,"#7A5D4B");
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

// Atmospheric map details: ocean depth, foam, rocks, lighthouse, clouds and landmarks.
function pixelCloud(x,y){rect(x+12,y,68,15,"#E9F8F0");rect(x+24,y-12,40,13,"#F8FFF6");rect(x,y+10,95,9,"#D3EDE6");}
function reef(x,y){rect(x-17,y+7,43,10,"#4C9EA7");rect(x-9,y,24,11,"#A3C8B3");rect(x+6,y-7,11,9,"#D9D4A4");}
for(const [x,y] of [[245,82],[651,63],[933,121],[328,516],[726,545]])pixelCloud(x,y);
for(const [x,y] of [[297,190],[684,235],[410,411],[930,433],[79,518],[603,352]])reef(x,y);
rect(602,451,16,45,"#F8E9C8");rect(598,446,24,11,"#D96F68");rect(605,436,10,13,"#FFF4A3");rect(594,499,34,9,"#8C8872");
rect(916,307,44,10,"#487A8C");rect(923,293,30,15,"#E5BD82");rect(934,273,6,20,"#FFF2D9");rect(939,282,19,10,"#F9F2CF");
rect(23,365,38,8,"#4A8992");rect(32,358,20,9,"#FFF5DB");
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
