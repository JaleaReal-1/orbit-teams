'use strict';
const API_BASE=(window.API_BASE_URL || '').replace(/\/$/,'');
const form=document.querySelector('#create-form'),status=document.querySelector('#status');
let uploadedPhoto=null,uploadedFile=null;
async function parseResponse(response){let data;try{data=await response.json();}catch{throw new Error('El servidor devolvió una respuesta inesperada.');}if(!response.ok){const detail=data.detail;throw new Error(Array.isArray(detail)?detail.map(e=>e.msg).join(' · '):detail || 'No pudimos completar la solicitud.');}return data;}
form.onsubmit=async(event)=>{event.preventDefault();const button=document.querySelector('#submit');button.disabled=true;status.textContent='Preparando tu dedicatoria…';document.querySelector('#result').hidden=true;
try{
  const photo=document.querySelector('#photo').files[0];
  if(photo && photo!==uploadedFile){if(photo.size>3*1024*1024)throw new Error('La foto supera 3 MB.');const upload=new FormData();upload.append('file',photo);const data=await parseResponse(await fetch(`${API_BASE}/api/upload`,{method:'POST',body:upload}));uploadedPhoto=data.url;uploadedFile=photo;}
  const fields=Object.fromEntries(new FormData(form));fields.url_foto_fondo=photo?uploadedPhoto:null;
  const data=await parseResponse(await fetch(`${API_BASE}/api/crear`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(fields)}));
  await window.giftCheckout.show(data,{form,container:document.querySelector('#result')});
}catch(error){status.textContent=error instanceof TypeError?'No se pudo conectar con el servidor. Comprueba si se creó la orden antes de volver a enviarla.':error.message;}finally{button.disabled=false;}};
document.querySelector('#copy').onclick=()=>window.giftCheckout.copy(document.querySelector('#result'));
document.querySelector('#photo').onchange=()=>window.giftCheckout.validatePhoto(document.querySelector('#photo'));
