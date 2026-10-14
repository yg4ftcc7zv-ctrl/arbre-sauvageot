const D=window.FAMILY_DATA, P=Object.fromEntries(D.people.map(p=>[p.id,p])), S=Object.fromEntries(D.sources.map(s=>[s.id,s]));
const el=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected='andre1901',zoom=.35,current='family',pos={},size=[4200,2200],listMode=window.matchMedia('(max-width:900px)').matches,lastFocus=null; const mobile=()=>window.matchMedia('(max-width:900px)').matches;

const childrenOf=id=>D.people.filter(p=>p.parents.includes(id)).map(p=>p.id);
function addAncestors(id,set){if(!P[id]||set.has(id))return;set.add(id);P[id].parents.forEach(v=>addAncestors(v,set))}
function addDescendants(id,set){if(!P[id]||set.has(id))return;set.add(id);childrenOf(id).forEach(v=>addDescendants(v,set))}
// Display only documented sibling groups explicitly selected for the tree.
const visibleSiblingFamilies=[
  ['germaine_mere_georges','georges_serre_1896','yvonne_suzanne_helene_serre_1898'],
  ['philippe','alain','brigitte']
];
function branchSet(id){
  const set=new Set();addAncestors(id,set);addDescendants(id,set);
  let changed=true;
  while(changed){changed=false;D.unions.forEach(u=>{
    if(set.has(u.a)&&!set.has(u.b)){set.add(u.b);changed=true}
    else if(set.has(u.b)&&!set.has(u.a)){set.add(u.a);changed=true}
  })}
  visibleSiblingFamilies.forEach(group=>{if(group.some(personId=>set.has(personId)))group.forEach(personId=>{if(P[personId])set.add(personId)})});
  return set;
}
function buildLayout(idSet,anchors,opts={}){
  const ids=[...idSet].filter(id=>P[id]), gens={}, queue=[];
  const seed=(id,g)=>{if(idSet.has(id)&&gens[id]===undefined){gens[id]=g;queue.push(id)}};
  const propagate=()=>{while(queue.length){const id=queue.shift(),g=gens[id],p=P[id];p.parents.forEach(v=>{if(idSet.has(v)&&gens[v]===undefined){gens[v]=g-1;queue.push(v)}});childrenOf(id).forEach(v=>{if(idSet.has(v)&&gens[v]===undefined){gens[v]=g+1;queue.push(v)}});D.unions.forEach(u=>{let other=u.a===id?u.b:u.b===id?u.a:null;if(other&&idSet.has(other)&&gens[other]===undefined){gens[other]=g;queue.push(other)}})}};
  (Array.isArray(anchors)?anchors:[anchors]).forEach(id=>seed(id,0));propagate();
  ids.forEach(id=>{if(gens[id]===undefined){seed(id,0);propagate()}});
  const vals=Object.values(gens),min=Math.min(...vals),max=Math.max(...vals);Object.keys(gens).forEach(k=>gens[k]-=min);
  const rows={};ids.forEach(id=>(rows[gens[id]]??=[]).push(id));
  const branchOrder={Sauvageot:0,Legris:1,Quesnot:2,Lacroix:3,Nachon:4,Corsi:5,'Préaudat':6,Pecquet:7,Dumont:8,'Déherpe':9,Loosdregt:10,Bertrand:11,Lanzalavi:12,Grossi:13,Maury:14};
  // Respecter l'ordre des lignées et les couples : côté Serre / Ordonneau à gauche,
  // côté Testaud / Aubert à droite ; ne jamais classer ces couples par alphabet.
  const serreOrder={jean_david_serre:0,marie_ordonneau:1,pierre_ordonneau:2,henry_louis_serre:3,adele_testaud:4,jules_testaud:5,leonie_aubert:6};
  const isSerre=id=>Object.prototype.hasOwnProperty.call(serreOrder,id);
  Object.values(rows).forEach(row=>{
    row.sort((a,b)=>{
      if(isSerre(a)&&isSerre(b))return serreOrder[a]-serreOrder[b];
      const ra=isSerre(a)?17:(branchOrder[P[a].branch]??50);
      const rb=isSerre(b)?17:(branchOrder[P[b].branch]??50);
      return ra-rb||P[a].name.localeCompare(P[b].name,'fr');
    });
    // Keep spouses adjacent, even when new ancestors are added in future updates.
    const rowIds=new Set(row);
    const pairs=[['jean_david_serre','marie_ordonneau'],['jules_testaud','leonie_aubert'],['henry_louis_serre','adele_testaud']];
    for(const [a,b] of pairs){
      if(!rowIds.has(a)||!rowIds.has(b))continue;
      const ia=row.indexOf(a),ib=row.indexOf(b);
      if(ib!==ia+1){row.splice(ib,1);row.splice(row.indexOf(a)+1,0,b);}
    }
  });
  // Only selected fratries are displayed as grouped family clusters.
  Object.values(rows).forEach(row=>{
    visibleSiblingFamilies.forEach(group=>{
      const present=group.filter(id=>row.includes(id));
      if(present.length<2)return;
      const at=Math.min(...present.map(id=>row.indexOf(id)));
      present.forEach(id=>row.splice(row.indexOf(id),1));
      row.splice(at,0,...present);
    });
  });
  // In branch-specific layouts, pin each ancestral lineage to its own side.
  // For Loosdregt: Marie Germaine SERRE's ancestors left of Georges,
  // Gerard LOOSDREGT's ancestors right; shared descendants below them.
  if(opts.splitAncestors){
    const [leftRoot,rightRoot]=opts.splitAncestors;
    const left=new Set(),right=new Set();
    addAncestors(leftRoot,left);addAncestors(rightRoot,right);
    Object.values(rows).forEach(row=>{
      const side=id=>left.has(id)&&!right.has(id)?0:right.has(id)&&!left.has(id)?2:1;
      row.sort((a,b)=>side(a)-side(b));
    });
  }
  const maxCount=Math.max(...Object.values(rows).map(r=>r.length)),gap=300,rowGap=290,cardW=240,margin=80;let width=Math.max(1800,maxCount*gap+margin*2);
  const pos={};Object.entries(rows).forEach(([g,row])=>{
    const rowW=(row.length-1)*gap+cardW,startX=Math.max(margin,(width-rowW)/2);
    row.forEach((id,i)=>pos[id]=[Math.round(startX+i*gap),Number(g)*rowGap+40]);
  });
  // Reposition descendants beneath the centre of their displayed parents.
  // This preserves side-by-side ancestor families and reduces crossing edges.
  if(opts.splitAncestors){
    const [leftRoot,rightRoot]=opts.splitAncestors;
    const left=new Set(),right=new Set();addAncestors(leftRoot,left);addAncestors(rightRoot,right);
    const anchorX=width/2;
    Object.keys(pos).forEach(id=>{
      if(left.has(id)&&!right.has(id))pos[id][0]-=Math.max(140,width*.08);
      if(right.has(id)&&!left.has(id))pos[id][0]+=Math.max(140,width*.08);
    });
    const generationNumbers=Object.keys(rows).map(Number).sort((a,b)=>a-b);
    for(const gen of generationNumbers){
      const row=rows[gen].filter(id=>!left.has(id)&&!right.has(id));
      row.forEach(id=>{
        const parentXs=(P[id].parents||[]).filter(p=>pos[p]).map(p=>pos[p][0]+120);
        if(parentXs.length){const target=parentXs.reduce((a,b)=>a+b,0)/parentXs.length;
          pos[id][0]=Math.round(target-120);
        }
      });
    }
    // Avoid collisions in each generation after parental-centre alignment.
    Object.values(rows).forEach(row=>{
      const ordered=[...row].sort((a,b)=>pos[a][0]-pos[b][0]);
      for(let i=1;i<ordered.length;i++){
        const prev=pos[ordered[i-1]][0],now=pos[ordered[i]][0];
        if(now<prev+gap)pos[ordered[i]][0]=prev+gap;
      }
    });
    const minX=Math.min(...Object.values(pos).map(p=>p[0]));
    if(minX<margin)Object.values(pos).forEach(p=>p[0]+=margin-minX);
    const maxX=Math.max(...Object.values(pos).map(p=>p[0]+cardW));
    width=Math.max(width,maxX+margin);
  }
  return {size:[width,(max-min+1)*rowGap+260],pos};
}

// V4: draw a strict ancestry pedigree instead of ordering all ancestors by surname.
// Each person can only be connected to parents declared in the genealogical data.
function pedigreeLayout(root){
  if(!P[root])return {size:[1200,700],pos:{}};
  const unit=300, rowGap=270, margin=130, positions={}, levels={}, widths=new Map();
  const parents=id=>(P[id]?.parents||[]).filter(p=>P[p]);
  function widthOf(id,seen=new Set()){
    if(seen.has(id))return 1;
    if(widths.has(id))return widths.get(id);
    const ps=parents(id),next=new Set(seen);next.add(id);
    const w=ps.length?Math.max(1,ps.reduce((n,p)=>n+widthOf(p,next),0)):1;
    widths.set(id,w);return w;
  }
  let maxDepth=0;
  function setPositions(id,left,depth,seen=new Set()){
    if(seen.has(id))return;
    maxDepth=Math.max(maxDepth,depth);
    const ps=parents(id),next=new Set(seen);next.add(id);
    if(ps.length){
      let offset=left;const centers=[];
      ps.forEach(p=>{
        setPositions(p,offset,depth+1,next);
        centers.push(positions[p]?.x??offset+widthOf(p)*unit/2);
        offset+=widthOf(p)*unit;
      });
      positions[id]={x:(centers[0]+centers[centers.length-1])/2,depth};
    }else positions[id]={x:left+widthOf(id)*unit/2,depth};
  }
  setPositions(root,margin,0);
  const pos={};let maxX=0;
  Object.entries(positions).forEach(([id,p])=>{
    const x=Math.round(p.x-120),y=(maxDepth-p.depth)*rowGap+40;
    pos[id]=[x,y];maxX=Math.max(maxX,x+240);
  });
  return {size:[Math.max(1300,maxX+margin),(maxDepth+1)*rowGap+230],pos};
}
const allIds=new Set(D.people.map(p=>p.id));
function directAncestors(root){const ids=new Set();addAncestors(root,ids);return ids}
const layouts={
  mariechristine:pedigreeLayout('mariechristine_loosdregt'),
  philippe:pedigreeLayout('philippe'),
  family:buildLayout((()=>{const direct=new Set();['antoine_sauvageot','julien_sauvageot','marion_sauvageot'].forEach(id=>addAncestors(id,direct));return direct})(),['antoine_sauvageot','julien_sauvageot','marion_sauvageot']),
loosdregt:pedigreeLayout('mariechristine_loosdregt'),
  andre:buildLayout(branchSet('andre1901'),'andre1901'),
  colette:buildLayout(branchSet('colette'),'colette'),
  serre:buildLayout(branchSet('henry_louis_serre'),'henry_louis_serre')
};

function labelDate(e){return e.date||'date à compléter'}
function buttons(ids){return ids.map(id=>`<button class="mini" data-source="${id}">${id}</button>`).join('')}
function badge(status){return `<span class="badge ${['À confirmer','Borne documentaire','Table'].includes(status)?'warn':''}">${esc(status)}</span>`}
function eventHTML(title,e){return `<div class="fact"><small>${title}</small><strong>${esc(e.date||'Date à compléter')}</strong><div>${esc(e.place||'Lieu à compléter')}</div>${e.detail?`<p>${esc(e.detail)}</p>`:''}${e.sources.length?badge(e.status)+buttons(e.sources):'<span class="badge warn">Non renseigné</span>'}</div>`}
function detail(id){selected=id;const p=P[id];let h=`<button class="sheet-close" id="sheet-close" aria-label="Fermer la fiche">Fermer ✕</button><div class="eyebrow">${esc(p.branch)} · fiche individuelle</div><h2>${esc(p.name)}</h2>${p.occupation?`<p class="small">${esc(p.occupation)}</p>`:''}`+eventHTML('Naissance',p.birth);
let us=D.unions.filter(u=>u.a===id||u.b===id);us.forEach(u=>{let sp=P[u.a===id?u.b:u.a];h+=`<div class="fact"><small>Mariage</small><strong>${esc(u.date||'Date à compléter')}</strong><div>${esc(u.place||'Lieu à compléter')}</div><p>Avec <button class="mini" data-person="${sp.id}">${esc(sp.name)}</button></p>${u.note?`<p>${esc(u.note)}</p>`:''}${u.sources.length?badge(u.date?u.status:'Date inconnue')+buttons(u.sources):''}</div>`});if(!us.length)h+='<div class="fact"><small>Mariage</small><div>Non renseigné dans le dossier</div></div>';h+=eventHTML('Décès',p.death);
if(p.parents.length)h+=`<div class="fact"><small>Parents — voir les sources</small>${p.parents.map(v=>`<button class="mini" data-person="${v}">${esc(P[v].name)}</button>`).join('')}${id==='adelphine'?'<p>Lien avec Jean Nachon à confirmer.</p>':''}</div>`;
const siblings=D.people.filter(q=>q.id!==id&&p.parents.length===2&&q.parents.length===2&&p.parents.every(v=>q.parents.includes(v)));if(siblings.length)h+=`<div class="fact"><small>Frères et sœurs</small>${siblings.map(q=>`<button class="mini" data-person="${q.id}">${esc(q.name)}</button>`).join('')}</div>`;
let children=D.people.filter(q=>q.parents.includes(id));if(children.length)h+=`<div class="fact"><small>Enfants présents dans le dossier</small>${children.map(q=>`<button class="mini" data-person="${q.id}">${esc(q.name)}</button>`).join('')}</div>`;
if(p.relations?.length)h+=`<div class="fact"><small>Autres liens attestés</small>${p.relations.map(r=>`<p>${esc(r.label)} : <button class="mini" data-person="${r.target}">${esc(P[r.target].name)}</button></p>`).join('')}</div>`;if(p.notes)h+=`<div class="note">${esc(p.notes)}</div>`;h+='<div class="fact"><small>Pièces associées</small>'+p.sources.map(s=>`<button class="doclink" data-source="${s}">${s} · ${esc(S[s].title)}</button>`).join('')+'</div>';const deathScans=(p.death.sources||[]).map(sid=>S[sid]).filter(s=>s?.image);deathScans.forEach(s=>{h+=`<section class="fact"><small>Acte de décès · ${esc(s.ref)}</small>${s.transcription?`<div class="trans">${esc(s.transcription)}</div>`:''}<button class="doclink" data-source="${s.id}" aria-label="Agrandir l'acte de décès de ${esc(p.name)}"><img src="${esc(s.image)}" alt="Acte de décès de ${esc(p.name)}" loading="lazy" style="display:block;width:100%;height:auto;margin-top:12px"></button><p class="small">Cliquer sur l’image pour consulter la pièce et sa transcription.</p></section>`});el('detail').innerHTML=h;document.querySelectorAll('.person,.list-person').forEach(b=>b.classList.toggle('selected',b.dataset.person===id));el('sheet-close').onclick=closeSheet;}
function draw(){const notes={
mariechristine:'Marie-Christine Loosdregt et ses ascendants directs uniquement, sans fratries ni descendants.',
philippe:'Philippe Sauvageot et ses ascendants directs uniquement, sans fratries ni descendants.',
family:'Arbre principal : Antoine, Julien et Marion et uniquement leurs ascendants directs. Les fratries collatérales sont consultables dans les branches et fiches individuelles.',
loosdregt:'Branche Loosdregt : ascendants directs de Marie-Christine uniquement. Gérard Loosdregt et Marie Germaine Serre sont les parents de Georges ; Raoul Bertrand et Argentine Lanzalavi sont les parents de Henriette.',
andre:'Branche André Sauvageot (1901) : ascendance d’André Louis René Sauvageot et sa descendance connue. Les alliances apparaissent sans développer automatiquement toute leur propre ascendance.',
colette:'Branche Colette Pecquet : ascendance de Colette Pecquet et sa descendance connue. Les branches Pecquet, Dumont et Déherpe sont regroupées dans cette vue.',
serre:'Famille SERRE : Marie Germaine, Georges et Yvonne Suzanne Hélène apparaissent côte à côte sous Henry Louis SERRE et Adèle TESTAUD.'
};el('branch-note').textContent=notes[current]||'';el('branch-note').classList.toggle('hidden',!notes[current]);pos=layouts[current].pos;size=layouts[current].size;let paths='',labels='',cards='';const path=(d,color='#71958a',dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="7 5"':''}/>`;
D.unions.forEach(u=>{if(!pos[u.a]||!pos[u.b])return;let a=pos[u.a],b=pos[u.b];if(a[1]!==b[1])return;if(Math.abs(a[0]-b[0])>900)return;let left=a[0]<b[0]?a:b,right=a[0]<b[0]?b:a,cx=(left[0]+240+right[0])/2,y=a[1];paths+=path(`M${left[0]+240},${y+78}H${right[0]}`,'#b08d51');if(u.date){labels+=`<div class="union" style="left:${cx-110}px;top:${y+173}px">${esc(u.date)} · ${esc(u.place.replace(/ \(.*/,''))}${u.status==='À confirmer'?' ?':''}</div>`;paths+=path(`M${cx},${y+78}V${y+173}`,'#b08d51')}
});
const groups={};Object.keys(pos).forEach(id=>{let pars=P[id].parents.filter(v=>pos[v]);if(pars.length){let key=pars.join('|');(groups[key]??=[]).push(id)}});Object.entries(groups).forEach(([key,kids])=>{let ps=key.split('|'),a=pos[ps[0]],sx=a[0]+120,sy=a[1]+155;if(ps.length===2&&pos[ps[1]][1]===a[1]){let b=pos[ps[1]];let u=D.unions.find(u=>ps.includes(u.a)&&ps.includes(u.b));if(!u){let yy=Math.min(...kids.map(k=>pos[k][1]))-35;ps.forEach(v=>{let xy=pos[v];paths+=path(`M${xy[0]+120},${xy[1]+155}V${yy}H${pos[kids[0]][0]+120}`)});kids.forEach(k=>paths+=path(`M${pos[kids[0]][0]+120},${yy}H${pos[k][0]+120}V${pos[k][1]}`));return;}sx=(a[0]+b[0]+240)/2;sy=a[1]+78;if(u?.date)sy=a[1]+211;}let ky=Math.min(...kids.map(k=>pos[k][1]));let by=sy+(ky-sy)*(ps.includes('jules')?.28:.72);let color=ps.includes('jules')?'#b08d51':'#71958a';let dash=key==='jean'||kids.some(k=>P[k].uncertainParents);paths+=path(`M${sx},${sy}V${by}`,color,dash);kids.forEach(id=>{let k=pos[id];paths+=path(`M${sx},${by}H${k[0]+120}V${k[1]}`,color,dash)})});
Object.entries(pos).forEach(([id,[x,y]])=>{let p=P[id],fam=p.name.split(' ').slice(-1)[0];cards+=`<button class="person ${p.branch.toLowerCase()} ${id===selected?'selected':''}" data-person="${id}" style="left:${x}px;top:${y}px"><div class="family">${esc(fam)}</div><div class="given">${esc(p.short)}</div><div class="life"><div><span>°</span>${esc(p.birth.date||'Naissance à compléter')}</div><div>${esc(p.birth.place||'')}</div><div><span>†</span>${esc(p.death.date||'Décès non renseigné')}</div></div><div class="more">${p.sources.length} pièce${p.sources.length>1?'s':''} · ouvrir la fiche →</div></button>`});
el('tree').style.width=size[0]+'px';el('tree').style.height=size[1]+'px';el('tree').innerHTML=`<svg width="${size[0]}" height="${size[1]}" aria-hidden="true">${paths}</svg>${labels}${cards}`;applyZoom();renderList();setMode();filter();}
function applyZoom(){el('tree').style.transform=`scale(${zoom})`;el('space').style.width=size[0]*zoom+'px';el('space').style.height=size[1]*zoom+'px';el('scale').textContent=Math.round(zoom*100)+' %'}
function fit(){zoom=Math.min(1,Math.max(.08,(el('viewport').clientWidth-30)/size[0]));applyZoom()}
function showPerson(id){if(!pos[id]){let target=Object.keys(layouts).find(k=>layouts[k].pos[id]);if(target){current=target;el('view').value=current;draw();fit()}}showTab('arbre');detail(id);let p=pos[id];if(p)el('viewport').scrollTo({left:Math.max(0,p[0]*zoom-el('viewport').clientWidth/3),top:Math.max(0,p[1]*zoom-50)});if(mobile())openSheet();}
function filter(){let q=el('search').value.toLocaleLowerCase('fr');document.querySelectorAll('.person,.list-person').forEach(b=>b.classList.toggle('dim',q&&!P[b.dataset.person].name.toLocaleLowerCase('fr').includes(q)))}
function showTab(id){['arbre','actes','carte','recherche'].forEach(v=>el(v).classList.toggle('hidden',v!==id));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===id))}
function attachmentCount(s){return (s.images?.length||0)||(s.image?1:0)}
function source(id){let s=S[id];el('mtitle').textContent=id+' · '+s.title;el('mbody').innerHTML=`<p>${esc(s.ref)}</p><p class="small">Provenance : ${esc(s.file)}</p>${s.url?`<a class="button" href="${esc(s.url)}" target="_blank" rel="noopener">${s.url.endsWith('.pdf')?'Ouvrir le PDF original':'Ouvrir le registre'} — ${esc(s.ref||s.title)} ↗</a>`:'<span class="badge warn">Lien fiable vers ce registre à compléter</span>'}${s.note?`<div class="note">${esc(s.note)}</div>`:''}${s.transcription?`<section class="transcript-card"><h3>${esc(s.transLabel||'Transcription écrite')}</h3><p class="small">Lecture fidèle de travail : les mots incertains sont signalés entre crochets et ne sont pas complétés par conjecture.</p><div class="trans">${esc(s.transcription)}</div></section>`:''}${s.image?`<h3 class="scan-title">📎 Pièce jointe</h3><p class="small">${attachmentCount(s)} scan(s) joint(s). Cliquer sur l’image pour l’agrandir.</p>${(s.images||[s.image]).map((im,i)=>`<div class="scanzoom" style="margin-bottom:16px"><img class="scan" src="${im}" alt="${esc(s.title)} — pièce jointe ${i+1}"></div>`).join('')}`:s.url?`<div class="note">📎 PJ · <a href="${esc(s.url)}" target="_blank" rel="noopener">ouvrir le registre en ligne</a>${s.ref?`<br><span class="small">${esc(s.ref)}</span>`:''}</div>`:'<div class="issue">📎 PJ · aucune image ni lien archive.</div>'}`;el('modal').showModal();}
el('gallery').innerHTML=D.sources.map(s=>`<button class="doccard" data-source="${s.id}">${s.image?`<img src="${s.image}" loading="lazy" alt="${esc(s.title)}">`:'<div class="noimage">Transcription ou renseignement</div>'}<div class="content"><div class="eyebrow">${s.id} · ${esc(s.kind)}</div><h3>${esc(s.title)}</h3><p>${esc(s.ref)}</p><p class="small">Provenance : ${esc(s.file)}</p><p>${s.image?`<span class="badge">📎 PJ · ${attachmentCount(s)} scan${attachmentCount(s)>1?'s':''}</span>`:s.url?`<span class="badge">📎 PJ · registre en ligne</span>`:'<span class="badge warn">📎 PJ · aucune pièce</span>'}</p></div></button>`).join('');el('issues').innerHTML=D.issues.map((s,i)=>`<div class="issue"><span class="eyebrow">Point ${i+1}</span><p>${esc(s)}</p></div>`).join('');el('index').innerHTML=D.people.map(p=>`<button data-person="${p.id}">${esc(p.name)}</button>`).join('');
document.addEventListener('click',e=>{let b=e.target.closest('[data-person]');if(b)showPerson(b.dataset.person);let s=e.target.closest('[data-source]');if(s)source(s.dataset.source);let t=e.target.closest('[data-tab]');if(t)showTab(t.dataset.tab);if(e.target.classList.contains('scan'))e.target.parentElement.classList.toggle('expanded')});el('close').onclick=()=>el('modal').close();el('view').onchange=e=>{current=e.target.value;if(!layouts[current].pos[selected])selected=Object.keys(layouts[current].pos)[0];draw();detail(selected);fit();el('viewport').scrollTo(0,0)};el('plus').onclick=()=>{zoom=Math.min(1.6,zoom+.15);applyZoom()};el('minus').onclick=()=>{zoom=Math.max(.08,zoom-.15);applyZoom()};el('fit').onclick=fit;el('search').oninput=filter;el('search').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();let q=e.target.value.toLowerCase(),p=D.people.find(p=>p.name.toLowerCase().includes(q));if(p)showPerson(p.id)}};el('export').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(D,null,2)],{type:'application/json'}));a.download='Sauvageot_donnees_genealogiques.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
function renderList(){const groups={};Object.entries(pos).forEach(([id,xy])=>(groups[xy[1]]??=[]).push(id));let h='';Object.keys(groups).sort((a,b)=>a-b).forEach((y,i)=>{h+=`<section class="generation"><h3>Génération ${i+1}</h3><div class="generation-grid">`;groups[y].forEach(id=>{let p=P[id],u=D.unions.find(u=>u.a===id||u.b===id),sp=u?P[u.a===id?u.b:u.a]:null;h+=`<button class="list-person ${p.branch.toLowerCase()} ${id===selected?'selected':''}" data-person="${id}"><div class="family">${esc(p.branch)}</div><div class="given">${esc(p.name)}</div><div class="life">° ${esc(p.birth.date||'Naissance à compléter')}${p.birth.place?' · '+esc(p.birth.place):''}<br>† ${esc(p.death.date||'Décès non renseigné')}${p.death.place?' · '+esc(p.death.place):''}</div><div class="relation">${p.parents.length?'Parents : '+p.parents.map(v=>esc(P[v].name)).join(' et ')+'.<br>':''}${sp?'Avec '+esc(sp.name)+(u.date?' · '+esc(u.date):'')+'.<br>':''}${p.sources.length} pièce(s) · Ouvrir la fiche →</div></button>`});h+='</div></section>'});el('family-list').innerHTML=h}
function setMode(){el('family-list').classList.toggle('hidden',!listMode);el('viewport').classList.toggle('hidden',listMode);el('mode').textContent=listMode?'Vue arbre':'Vue liste';el('mode').setAttribute('aria-pressed',String(listMode));['minus','plus','fit','scale'].forEach(id=>el(id).classList.toggle('hidden',listMode));}
function lockBehind(v){document.querySelectorAll('header,nav,.stage,#actes,#carte,#recherche,footer').forEach(n=>n.inert=v)}
function openSheet(){lastFocus=document.activeElement;document.body.classList.add('detail-open');el('detail').setAttribute('role','dialog');el('detail').setAttribute('aria-modal','true');el('detail').setAttribute('aria-label','Fiche de '+P[selected].name);lockBehind(true);el('detail').scrollTop=0;el('sheet-close').focus()}
function closeSheet(){document.body.classList.remove('detail-open');el('detail').removeAttribute('role');el('detail').removeAttribute('aria-modal');lockBehind(false);if(lastFocus?.isConnected)lastFocus.focus()}
el('sheet-backdrop').onclick=closeSheet;el('mode').onclick=()=>{listMode=!listMode;setMode();if(!listMode)fit()};
document.addEventListener('keydown',e=>{if(!document.body.classList.contains('detail-open')||el('modal').open)return;if(e.key==='Escape')closeSheet();if(e.key==='Tab'){let a=[...el('detail').querySelectorAll('button,a[href],input')].filter(n=>n.offsetParent!==null);if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus()}}});
window.addEventListener('resize',()=>{if(!mobile())closeSheet();if(!listMode)fit()});
draw();if(!listMode)fit();detail(selected);

