/* Correctif fratrie SERRE — à déposer à la racine du dépôt GitHub. */
(function () {
  const D = window.FAMILY_DATA;
  if (!D) return;
  const parents = ['henry_louis_serre', 'adele_testaud'];
  const entries = [
    {id:'georges_serre_1896',name:'Georges Serre',short:'Georges',birth:{date:'14 décembre 1896',place:'Dijon (Côte-d’Or)',sources:['S63'],status:'Acte',detail:'Acte n° 1263 du 15 décembre 1896 ; 68 rue de la Liberté.'},death:{date:'6 février 1899',place:'Dijon (Côte-d’Or)',sources:['S66'],status:'Acte',detail:'21 h au domicile familial, 4 et 6 rue Bossuet ; acte n° 145 du 7 février 1899.'},parents,sources:['S63','S66'],notes:'Frère de Marie Germaine SERRE ; décédé à deux ans.',occupation:'',branch:'Serre'},
    {id:'yvonne_suzanne_helene_serre_1898',name:'Yvonne Suzanne Hélène Serre',short:'Yvonne',birth:{date:'27 juin 1898',place:'Dijon (Côte-d’Or)',sources:['S64'],status:'Acte',detail:'Déclarée le 28 juin 1898 ; 68 rue de la Liberté.'},death:{date:'29 janvier 1899',place:'Dijon (Côte-d’Or)',sources:['S65'],status:'Acte',detail:'15 h 30 à l’hôpital de Dijon ; sept mois.'},parents,sources:['S64','S65'],notes:'Sœur de Marie Germaine SERRE ; décédée à sept mois.',occupation:'',branch:'Serre'}
  ];
  for (const p of entries) {
    const old = D.people.find(q => q.id === p.id);
    if (old) Object.assign(old,p); else D.people.push(p);
  }
  const docs = [
    {id:'S63',title:'Georges SERRE · naissance · Dijon · 1896',kind:'Naissance',ref:'Acte n° 1263 du 15 décembre 1896 · vue 353',file:'Archives départementales de la Côte-d’Or · Dijon',url:'https://archives.cotedor.fr/v2/ad21/visualiseur/ir_ead_visu_lien.html?ir=26564&id=845402697',image:'images/S63-Georges-Serre-naissance-Dijon-1896-vue353.png',transLabel:'Transcription abrégée',transcription:'Le 15 décembre 1896, Henry Louis SERRE, 34 ans, négociant, domicilié au 68 rue de la Liberté à Dijon, déclare son fils Georges SERRE, né le 14 décembre, de son mariage avec Adèle TESTAUD contracté à Bordeaux le 9 janvier 1894. [Heure exacte et témoins à vérifier sur le registre.]'},
    {id:'S64',title:'Yvonne Suzanne Hélène SERRE · naissance · Dijon · 1898',kind:'Naissance',ref:'Acte du 28 juin 1898 · vue 28',file:'Archives départementales de la Côte-d’Or · Dijon',url:'https://archives.cotedor.fr/v2/ad21/visualiseur/ir_ead_visu_lien.html?ir=26564&id=845402847',image:'images/S64-Yvonne-Serre-naissance-Dijon-1898-vue28.png',transLabel:'Transcription abrégée',transcription:'Le 28 juin 1898, Henry Louis SERRE, négociant, domicilié au 68 rue de la Liberté à Dijon, déclare une fille née le 27 juin, issue de son mariage avec Adèle TESTAUD, à laquelle sont donnés les prénoms Yvonne Suzanne Hélène. [Heure exacte et témoins à vérifier sur le registre.]'},
    {id:'S65',title:'Yvonne Suzanne Hélène SERRE · décès · Dijon · 1899',kind:'Décès',ref:'Décès du 29 janvier 1899 · vue 258',file:'Archives départementales de la Côte-d’Or · Dijon',url:'https://archives.cotedor.fr/v2/ad21/visualiseur/ir_ead_visu_lien.html?ir=26564&id=845402897',image:'images/S65-Yvonne-Serre-deces-Dijon-1899-vue258.png',transLabel:'Transcription de travail',transcription:'Le 29 janvier 1899, à seize heures, Edmond Cugnet-Richard, comptable, et François Hermann, garçon de bureau, déclarent le décès, survenu à quinze heures trente, d’Yvonne Suzanne Hélène SERRE, sept mois, née à Dijon le 27 juin 1898, fille de Henry Louis SERRE et d’Adèle TESTAUD. L’enfant est décédée à l’hôpital de Dijon. [Transcription normalisée et partielle.]'},
    {id:'S66',title:'Georges SERRE · décès · Dijon · 1899',kind:'Décès',ref:'Acte n° 145 du 7 février 1899 · vue 76',file:'Archives départementales de la Côte-d’Or · Dijon',url:'https://archives.cotedor.fr/v2/ad21/visualiseur/ir_ead_visu_lien.html?ir=26564&id=845402972',image:'images/S66-Georges-Serre-deces-Dijon-1899-vue76.png',transLabel:'Transcription de travail',transcription:'Le 7 février 1899, à dix heures du matin, Edmond Cugnet-Richard, comptable, et François Hermann, garçon de bureau, déclarent que Georges SERRE, âgé de deux ans, né à Dijon le 14 décembre 1896, fils de Henry Louis SERRE, négociant en chaussures, et d’Adèle TESTAUD, est décédé le 6 février à neuf heures du soir, au domicile de son père, rue Bossuet, 4 et 6. L’officier de l’état civil s’est transporté sur place et a constaté le décès. [Transcription normalisée.]'}
  ];
  for (const s of docs) {
    const old = D.sources.find(q=>q.id===s.id);
    if (old) Object.assign(old,s); else D.sources.push(s);
  }
  D.updated = '2026-10-12';
  // app.js a calculé la vue depuis Marie Germaine et omet ses frères et sœurs.
  // Après initialisation de app.js, recalculer depuis le père pour inclure tous ses enfants.
  window.addEventListener('load', () => {
    if (typeof layouts === 'undefined' || typeof buildLayout !== 'function' || typeof branchSet !== 'function') return;
    layouts.serre = buildLayout(branchSet('henry_louis_serre'), 'henry_louis_serre');
    const required = ['germaine_mere_georges','georges_serre_1896','yvonne_suzanne_helene_serre_1898'];
    if (!required.every(id => Object.hasOwn(layouts.serre.pos,id))) {
      console.error('Vue SERRE incomplète :',required.filter(id=>!Object.hasOwn(layouts.serre.pos,id)));
      return;
    }
    const select = document.getElementById('view');
    if (!select) return;
    if (new URLSearchParams(location.search).get('view') === 'serre') {
      select.value='serre';
      select.dispatchEvent(new Event('change'));
    } else if (select.value === 'serre') {
      select.dispatchEvent(new Event('change'));
    }
  });
})();
