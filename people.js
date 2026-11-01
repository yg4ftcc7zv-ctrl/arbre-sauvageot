// Répertoire des personnes : toutes les entrées, y compris hors arbre.
(function(){
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const search=document.getElementById('people-search');
  const filter=document.getElementById('people-filter');
  const rows=document.getElementById('people-rows');
  const total=document.getElementById('people-total');
  if(!search||!filter||!rows)return;
  // Une date seule ne prouve pas qu'une copie d'acte est présente.
  function actOf(p,field){
    const event=p[field]||{};
    const term=field==='birth'?/naissance|bapt[eê]me/i:/d[eé]c[eè]s|inhumation/i;
    return (event.sources||[]).filter(id=>{
      const s=S[id];
      return s&&term.test(s.title||'')&&Boolean(s.image||(s.images&&s.images.length)||s.url);
    });
  }
  function status(p,field){
    const ids=actOf(p,field);
    return ids.length
      ? '<span class="person-status yes">Oui</span> '+ids.map(id=>'<button class="person-act" data-source="'+esc(id)+'" title="Voir l’acte">'+esc(id)+'</button>').join(' ')
      : '<span class="person-status no">Non</span>';
  }
  function render(){
    const q=norm(search.value.trim()),f=filter.value;
    const list=D.people.filter(p=>{
      const found=norm([p.name,p.branch,p.birth?.place,p.death?.place].join(' ')).includes(q);
      const birth=actOf(p,'birth').length>0,death=actOf(p,'death').length>0;
      return found&&(f==='missing'?(!birth||!death):f==='complete'?(birth&&death):true);
    }).sort((a,b)=>a.name.localeCompare(b.name,'fr'));
    total.textContent=list.length+' / '+D.people.length+' personnes';
    rows.innerHTML=list.map(p=>'<tr><td><button class="person-name" data-person="'+esc(p.id)+'">'+esc(p.name)+'</button><small>'+esc(p.branch||'')+'</small></td><td>'+esc(p.birth?.date||'—')+'</td><td>'+esc(p.death?.date||'—')+'</td><td>'+status(p,'birth')+'</td><td>'+status(p,'death')+'</td></tr>').join('')||'<tr><td colspan="5" class="people-empty">Aucune personne trouvée.</td></tr>';
  }
  search.addEventListener('input',render);
  filter.addEventListener('change',render);
  render();
})();