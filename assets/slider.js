(()=>{const h=document.querySelector(".hero"),S=[...h.querySelectorAll(".sl")],D=h.querySelector(".dots");let i=0,t=null,paused=false;
const rm=matchMedia("(prefers-reduced-motion: reduce)"),delay=()=>rm.matches?7000:5000;
const load=k=>{const b=S[k]&&S[k].querySelector(".bg[data-bg]");if(b){b.style.backgroundImage=`url('${b.dataset.bg}')`;b.removeAttribute("data-bg")}};
S.forEach((_,k)=>{const b=document.createElement("button");b.setAttribute("aria-label","Slide "+(k+1));b.onclick=()=>{go(k);play()};D.append(b)});
function go(k){i=(k+S.length)%S.length;load(i);load((i+1)%S.length);S.forEach((s,j)=>s.classList.toggle("on",j==i));[...D.children].forEach((d,j)=>d.classList.toggle("on",j==i));h.dataset.active=i}
function play(){clearTimeout(t);t=setTimeout(()=>{if(!paused&&!document.hidden)go(i+1);play()},delay())}
h.querySelector(".sp").onclick=()=>{go(i-1);play()};h.querySelector(".sn").onclick=()=>{go(i+1);play()};
// pausa só enquanto o mouse está sobre setas/pontos/chip (não sobre o hero inteiro)
h.querySelectorAll(".sa,.dots,.chip").forEach(el=>{el.addEventListener("mouseenter",()=>paused=true);el.addEventListener("mouseleave",()=>paused=false)});
let x0=null;h.addEventListener("touchstart",e=>x0=e.touches[0].clientX,{passive:true});
h.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));play()}x0=null});
rm.addEventListener?.("change",play);go(0);play()})();
// menu mobile
(()=>{const b=document.querySelector(".burger"),n=document.getElementById("menu");if(!b)return;
b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)};n.querySelectorAll("a").forEach(a=>a.onclick=()=>{n.classList.remove("open");b.setAttribute("aria-expanded","false")})})();
