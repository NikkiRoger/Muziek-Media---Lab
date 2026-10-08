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
const NS="http://www.w3.org/2000/svg";const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 1000 600");svg.setAttribute("preserveAspectRatio","xMidYMid meet");svg.setAttribute("aria-hidden","true");svg.classList.add("pixel-map-art");
function rect(x,y,w,h,fill){const e=document.createElementNS(NS,"rect");for(const [k,v] of Object.entries({x,y,width:w,height:h,fill}))e.setAttribute(k,v);svg.appendChild(e)}
rect(0,0,1000,600,"#C5DFDA");
for(let y=0;y<600;y+=40)for(let x=0;x<1000;x+=40)if((x/40+y/40)%7===0)rect(x+8,y+8,8,8,"#A9D0C9");
const positions=worlds.map(w=>({x:w.x*10,y:w.y*6}));
for(const [a,b] of [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]]){const p=positions[a],q=positions[b];const n=20;for(let i=0;i<=n;i++){const t=i/n;rect(Math.round((p.x+(q.x-p.x)*t)/10)*10,Math.round((p.y+(q.y-p.y)*t)/10)*10,12,12,"#F8F0D6")}}
worlds.forEach((w,i)=>{const p=positions[i];rect(p.x-67,p.y-42,134,90,"#5D827B");rect(p.x-60,p.y-49,120,86,w.color);rect(p.x-40,p.y-63,80,18,w.color);rect(p.x-38,p.y+36,76,16,"#668C7F");for(let j=0;j<4;j++)rect(p.x-44+j*25,p.y-32,14,14,"#F8F6E9");rect(p.x-23,p.y-17,46,38,"#384C57");rect(p.x-14,p.y-9,28,22,"#FAF2D7");});
root.appendChild(svg);
const layer=document.createElement("div");layer.className="pixel-world-layer";root.appendChild(layer);
worlds.forEach(w=>{const b=document.createElement("button");b.type="button";b.className="pixel-world";b.style.left=w.x+"%";b.style.top=w.y+"%";b.innerHTML='<span class="pixel-world-icon" aria-hidden="true">'+w.symbol+'</span><strong>'+w.name+'</strong><small>'+w.subtitle+'</small>';b.setAttribute("aria-label","Ga naar "+w.name);b.addEventListener("click",()=>{document.querySelector('.world[data-filter="'+w.id+'"]')?.click()});layer.appendChild(b)});
function update(){const entries=Object.values(window.labAdventureProgress||{});const done=entries.filter(p=>p.status==="completed"&&/^[A-Z]-Q\\d+$/.test(p.assignment_id));const xp=done.length*50,coins=done.length*10;const level=1+Math.floor(xp/250);const put=(id,v)=>{const e=document.querySelector(id);if(e)e.textContent=v};put("#coin-count",coins);put("#adventure-level","Level "+level);put("#adventure-xp",xp+" XP");}
window.updateAdventure=update;update();
})();
