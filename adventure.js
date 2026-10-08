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
let active=0;
const avatar=document.createElement("div");avatar.className="pixel-avatar";avatar.setAttribute("aria-hidden","true");
avatar.innerHTML='<span class="avatar-head"></span><span class="avatar-body"></span><span class="avatar-feet"></span>';
layer.appendChild(avatar);
const controls=document.createElement("div");controls.className="map-controls";
controls.innerHTML='<button type="button" class="map-prev" aria-label="Vorig eiland">◀ Vorige</button><span class="map-current" aria-live="polite"></span><button type="button" class="map-next" aria-label="Volgend eiland">Volgende ▶</button><button type="button" class="map-enter">Ontdek missies ↵</button>';
root.insertAdjacentElement("afterend",controls);
const buttons=[];
function move(i){
 active=(i+worlds.length)%worlds.length;
 const w=worlds[active];
 avatar.style.left=w.x+"%";avatar.style.top=(w.y-12)+"%";
 buttons.forEach((b,j)=>{b.classList.toggle("selected",j===active);b.setAttribute("aria-current",String(j===active));});
 controls.querySelector(".map-current").textContent=w.name+" · "+(active+1)+"/"+worlds.length;
}
function enterWorld(i=active){
 move(i);
 document.querySelector('.world[data-filter="'+worlds[active].id+'"]')?.click();
}
worlds.forEach((w,i)=>{
 const b=document.createElement("button");b.type="button";b.className="pixel-world";
 b.style.left=w.x+"%";b.style.top=w.y+"%";
 b.innerHTML='<span class="pixel-world-icon" aria-hidden="true">'+w.symbol+'</span><strong>'+w.name+'</strong><small>'+w.subtitle+'</small>';
 b.setAttribute("aria-label","Open missies van "+w.name);
 b.addEventListener("click",()=>enterWorld(i));layer.appendChild(b);buttons.push(b);
});
move(0);
root.setAttribute("tabindex","0");root.setAttribute("aria-label","Wereldkaart. Gebruik de pijltjestoetsen om eilanden te kiezen en Enter om missies te openen.");
controls.querySelector(".map-prev").addEventListener("click",()=>move(active-1));
controls.querySelector(".map-next").addEventListener("click",()=>move(active+1));
controls.querySelector(".map-enter").addEventListener("click",()=>enterWorld());
document.addEventListener("keydown",e=>{
 if(!["ArrowLeft","ArrowUp","ArrowRight","ArrowDown","Enter"].includes(e.key))return;
 if(document.body.classList.contains("locked")||document.body.classList.contains("world-selected"))return;
 const t=e.target;
 if(t.closest?.("input,textarea,select,[contenteditable=true],button,a,[role=dialog]"))return;
 if(!root.getClientRects().length)return;
 e.preventDefault();
 if(e.key==="Enter")enterWorld();
 else move(active+(e.key==="ArrowLeft"||e.key==="ArrowUp"?-1:1));
});

function update(){const entries=Object.values(window.labAdventureProgress||{});const done=entries.filter(p=>p.status==="completed"&&/^[A-Z]-Q\d+$/.test(p.assignment_id));const xp=done.length*50,coins=done.length*10;const level=1+Math.floor(xp/250);const put=(id,v)=>{const e=document.querySelector(id);if(e)e.textContent=v};put("#coin-count",coins);put("#adventure-level","Level "+level);put("#adventure-xp",xp+" XP");}
window.updateAdventure=update;update();
})();
