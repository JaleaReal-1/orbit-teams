'use strict';
// Same origin by default. Set window.API_BASE_URL before this script if hosting the frontend separately.
const API_BASE = (window.API_BASE_URL || '').replace(/\/$/, '');
const status = document.querySelector('#status');
const models = window.giftModels;
async function loadDedication(){
  const params=new URLSearchParams(window.location.search);
  const demo=params.get('demo');
  const slug=params.get('slug')||location.pathname.match(/^\/([a-z0-9]{6})$/i)?.[1]?.toLowerCase();
  if(demo && models[demo]){present({nombre_chico:'Mateo',mensaje_texto:'Hay algo que quizás no te digo tan seguido: me alegra muchísimo que seas parte de mi vida.\n\nAdmiro tu forma de seguir adelante, tu corazón y esas pequeñas cosas que haces sin darte cuenta y que vuelven mis días más bonitos.\n\nHoy este carrito lleva algo más que ruedas: lleva mi cariño, mi admiración y un montón de buenos deseos para ti.\n\nQue la vida te regale tantos momentos hermosos como los que tú regalas a los demás.',modelo_auto_elegido:demo,url_foto_fondo:null});document.querySelector('#demoNotice').hidden=false;return;}
  if(!slug || !/^[a-z0-9]{6}$/.test(slug)){status.textContent='El enlace está incompleto o no es válido. Pide que te lo envíen nuevamente.';return;}
  try{
    const response=await fetch(`${API_BASE}/api/dedicatoria/${encodeURIComponent(slug)}`,{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error(response.status===404?'No encontramos esta dedicatoria. Revisa el enlace.':'No pudimos cargar la sorpresa. Intenta más tarde.');
    const data=await response.json();
    if(data.estado==='pendiente'){location.replace(`${API_BASE}/${encodeURIComponent(data.slug_url)}`);return;}
    present(data);
  }catch(error){status.textContent=error.name==='TimeoutError'?'La conexión tardó demasiado. Vuelve a cargar la página.':error instanceof TypeError?'No se pudo conectar con el servidor. Vuelve a intentarlo.':error.message;}
}
function present(data){
    // textContent prevents names/messages from being interpreted as HTML.
    document.querySelector('#nombre-chico').textContent=data.nombre_chico;
    document.querySelector('#mensaje-texto').textContent=data.mensaje_texto;
    const model=models[data.modelo_auto_elegido];
    if(!model)throw new Error('Este modelo de carrito no está disponible.');
    document.querySelector('#modelo-auto').textContent=window.giftScenes[data.modelo_auto_elegido]?.title||model.label;
    window.paintGiftScene(document.querySelector('#car'),model,{interactive:true,onDiscover:()=>document.querySelector('#reveal').click()});document.querySelector('#giftKicker').textContent=model.edition?'FELIZ DÍA DEL HOMBRE':'ESTE CAMINO LLEVA A TI';
    const gift=document.querySelector('#gift');gift.classList.add(model.theme);
    const stories={noir:['Tu forma de ser merece','algo extraordinario.','Hay personas que brillan sin hacer ruido. Tú eres una de ellas.'],midnight:['Entre tantos caminos,','qué suerte encontrarte.','Algunas personas se vuelven nuestros recuerdos favoritos.'],forest:['El mejor destino','es tenerte cerca.','Por las aventuras de ayer y todas las que todavía nos esperan.'],ivory:['Hay cosas bonitas','que nunca pasan de moda.','Tu cariño, tu esencia y esa forma tan tuya de hacer bien.'],circuit:['Que nunca te falten','motivos para sonreír.','Por tus sueños, tu alegría y cada nuevo camino que elijas.'],silver:['A veces, lo más especial','es simplemente tú.','Un detalle pequeño para alguien que significa tanto.']};
    const scene=window.giftScenes[data.modelo_auto_elegido];if(scene){gift.classList.add('virtual-gift', 'format-'+scene.kind);gift.style.setProperty('--scene-accent',scene.accent);document.querySelector('#giftKicker').textContent='UN RAMO DE CARIÑO · SOLO PARA TI';}
    const story=scene?[scene.title,'', 'Cada pequeño detalle dice algo bonito de ti.']:stories[model.theme];if(story){const heading=gift.querySelector('h1');heading.replaceChildren(document.createTextNode(story[0]));const em=document.createElement('em');em.textContent=story[1];heading.append(em);gift.querySelector('.letter h2').textContent=story[2];if(!story[1])em.remove();}
    if(data.url_foto_fondo){
      const url=new URL(data.url_foto_fondo,API_BASE || window.location.origin);
      // Only display uploaded images from the configured backend origin.
      const apiOrigin=new URL(API_BASE || window.location.origin).origin;
      if(url.origin!==apiOrigin || !/^\/static\/uploads\/[a-f0-9]{32}\.jpg$/.test(url.pathname))throw new Error('La foto de esta dedicatoria no es válida.');
      gift.style.backgroundImage=`linear-gradient(${['noir','midnight','forest'].includes(model.theme)?'rgba(20,27,32,.82),rgba(20,27,32,.94)':'rgba(255,255,255,.88),rgba(255,255,255,.96)'}),url("${url.href}")`;
    }
    document.title=`Para ${data.nombre_chico} · Orbit Joy`;gift.hidden=false;status.hidden=true;
}
const gift=document.querySelector('#gift');
const message=document.querySelector('#message');
const reveal=document.querySelector('#reveal');
for(let i=0;i<30;i++){const star=document.createElement('i');star.style.left=`${(i*37+11)%100}%`;star.style.top=`${(i*23+7)%100}%`;star.style.animationDelay=`${i%7*.3}s`;document.querySelector('#sparkles').append(star);}
const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
reveal.onclick=()=>{message.hidden=false;gift.classList.add('opened');reveal.setAttribute('aria-expanded','true');reveal.hidden=true;document.querySelector('#openingHint').hidden=true;document.querySelector('#experienceActions').hidden=false;message.focus({preventScroll:true});message.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'center'});};
document.querySelector('#replay').onclick=()=>{gift.classList.remove('opened');document.querySelector('#car').classList.remove('scene-discovered');document.querySelectorAll('.scene-touch').forEach(button=>button.classList.remove('discovered'));const note=document.querySelector('.scene-note');if(note)note.textContent=gift.classList.contains('format-box')?'Toca el lazo para descubrir tu sorpresa.':'Toca los destellos. Hay palabras escondidas para ti.';message.hidden=true;reveal.hidden=false;reveal.setAttribute('aria-expanded','false');document.querySelector('#openingHint').hidden=false;document.querySelector('#experienceActions').hidden=true;reveal.focus({preventScroll:true});gift.scrollIntoView({behavior:reduceMotion()?'instant':'smooth',block:'start'});};
loadDedication();
