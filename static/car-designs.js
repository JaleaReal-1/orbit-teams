/* Shared artwork keeps the saved gift consistent with its catalog preview. */
window.giftModels={
 deportivo:{label:'Deportivo rojo',icon:'🏎️',theme:'sport'},
 clasico:{label:'Clásico azul',icon:'🚙',theme:'classic'},
 todoterreno:{label:'Todoterreno verde',icon:'🚗',theme:'offroad'},
 hombre_noir:{label:'Deportivo · Noir & oro',theme:'noir',color:'#d5b675',edition:'EDICIÓN NOIR'},
 hombre_azul:{label:'Clásico · Azul de colección',theme:'midnight',color:'#9ebfdf',edition:'CLUB DE COLECCIÓN'},
 hombre_verde:{label:'Todoterreno · Verde aventura',theme:'forest',color:'#b0c2a4',edition:'ESPÍRITU AVENTURERO'},
 hombre_marfil:{label:'Clásico · Marfil & café',theme:'ivory',color:'#8b6246',edition:'CLÁSICO ATEMPORAL'},
 hombre_rojo:{label:'Deportivo · Rojo circuito',theme:'circuit',color:'#c45846',edition:'PASIÓN POR EL CAMINO'},
 hombre_plata:{label:'Deportivo · Plata minimal',theme:'silver',color:'#6d7985',edition:'DISEÑADO PARA TI'}
};
window.paintGiftCar=(target,model)=>{
 target.replaceChildren();
 if(model.icon){target.textContent=model.icon;return;}
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 360 140');svg.setAttribute('aria-hidden','true');svg.classList.add('car-artwork');
 const offroad=model.theme==='forest',classic=['midnight','ivory'].includes(model.theme);
 const body=offroad?'M38 88 L48 54 L101 54 L123 27 L241 27 L265 59 L309 64 L326 95 L320 109 L38 109 Z':classic?'M28 87 L79 74 L122 36 L216 36 L257 73 L324 84 L331 105 L28 105 Z':'M22 88 L91 71 L143 42 L218 45 L260 76 L327 85 L337 106 L22 106 Z';
 const defs=document.createElementNS(ns,'defs');const gradient=document.createElementNS(ns,'linearGradient');const gradientId='paint-'+model.theme;gradient.id=gradientId;gradient.setAttribute('x2','0');gradient.setAttribute('y2','100%');for(const [offset,color] of [['0%','#ffffff'],['28%',model.color],['65%',model.color],['100%','#26303a']]){const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);gradient.append(stop);}defs.append(gradient);svg.append(defs);
 const parts=[['ellipse',{cx:180,cy:122,rx:151,ry:8,fill:'currentColor',opacity:'.09'}],['path',{d:body,fill:`url(#${gradientId})`}],['path',{d:offroad?'M130 35 H173 V57 H115 Z M181 35 H235 L252 57 H181 Z':'M148 49 L174 49 L174 71 L113 71 Z M182 49 L214 52 L246 73 L182 71 Z',fill:'#24333d'}],['path',{d:'M37 92 H85 M274 92 H318',stroke:'#fff',opacity:'.6','stroke-width':4}],['path',{d:'M111 86 H248',stroke:'#fff',opacity:'.35','stroke-width':2}]];
 for(const cx of [91,271]){parts.push(['circle',{cx,cy:106,r:23,fill:'#20272d'}],['circle',{cx,cy:106,r:13,fill:'#cbd0d3'}],['circle',{cx,cy:106,r:7,fill:'#5b6670'}]);}
 for(const [tag,attrs] of parts){const node=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);svg.append(node);}
 target.append(svg);
};
