'use strict';
window.giftCheckout=(()=>{
let number='51978371277';
const ready=fetch('/api/config').then(response=>{if(!response.ok)throw Error('Configuración no disponible.');return response.json();}).then(config=>{if(/^\d{7,15}$/.test(config.whatsapp_number))number=config.whatsapp_number;}).catch(()=>{});
async function show(result,{form,container}){
 await ready;
 const code=result.slug_url.toUpperCase();
 form.hidden=true;container.hidden=false;
 container.querySelector('[data-code]').value='#'+code;
 container.querySelector('[data-view]').href=result.enlace;
 const message=`Hola, quiero activar mi carrito digital. Mi código de regalo es #${code}. Aquí adjunto mi captura de pago de Yape/Plin para habilitarlo.`;
 container.querySelector('[data-activate]').href=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;
 container.focus({preventScroll:true});
 container.scrollIntoView({block:'nearest',behavior:'auto'});
}
async function copy(container){
 const input=container.querySelector('[data-code]'),status=container.querySelector('[data-copy-status]');
 try{await navigator.clipboard.writeText(input.value);status.textContent='Código copiado.';}
 catch{input.focus();input.select();const copied=document.execCommand('copy');status.textContent=copied?'Código copiado.':'Selecciona el código y cópialo con Ctrl+C o ⌘C.';}
}
function validatePhoto(input){const file=input.files[0];if(file&&file.size>3*1024*1024){alert('La foto supera los 3 MB. Elige una imagen más pequeña.');input.value='';return false;}return true;}
return {show,copy,validatePhoto};
})();
