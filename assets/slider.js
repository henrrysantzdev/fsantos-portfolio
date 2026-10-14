(()=>{const h=document.querySelector(".hero"),S=[...h.querySelectorAll(".sl")],D=h.querySelector(".dots");let i=0,t=null;
const rm=matchMedia("(prefers-reduced-motion: reduce)");
S.forEach((_,k)=>{const b=document.createElement("button");b.setAttribute("aria-label","Slide "+(k+1));b.onclick=()=>{go(k);re()};D.append(b)});
function go(k){i=(k+S.length)%S.length;S.forEach((s,j)=>s.classList.toggle("on",j==i));[...D.children].forEach((d,j)=>d.classList.toggle("on",j==i))}
function stop(){clearInterval(t);t=null}function play(){stop();if(!rm.matches)t=setInterval(()=>go(i+1),5000)}function re(){if(t)play()}
h.querySelector(".sp").onclick=()=>{go(i-1);re()};h.querySelector(".sn").onclick=()=>{go(i+1);re()};
h.onmouseenter=stop;h.onmouseleave=play;let x0=null;
h.addEventListener("touchstart",e=>x0=e.touches[0].clientX,{passive:true});h.addEventListener("touchend",e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));re()}x0=null});
document.addEventListener("visibilitychange",()=>document.hidden?stop():play());rm.addEventListener?.("change",play);go(0);play()})();
