/* À charger immédiatement après data.js et avant app.js. Patch additif sans doublons. */
(function () {
  'use strict';
  const d = window.FAMILY_DATA;
  if (!d || !Array.isArray(d.people) || !Array.isArray(d.sources)) return;
  const person = id => d.people.find(p => p.id === id);
  const unique = values => Array.from(new Set(values || []));
  const henry = person('henry_louis_serre'), jean = person('jean_david_serre'), marie = person('marie_ordonneau');
  const original = d.sources.find(s => s.id === 'S58');
  const transcription = "Acte de naissance de Henry Louis, du sexe masculin, né aujourd'hui à deux heures du matin, chez ses père et mère, rue du Cygne, 10. Fils de Jean David Serre, fabricant de chaussures, âgé de trente-deux ans, et de Marie Ordonneau, son épouse, [ménagère ?], âgée de dix-neuf ans ; sur la déclaration faite par le père de l'enfant, qui nous l'a présenté.\n\nPremier témoin : Louis Serre, âgé de cinquante-neuf ans, propriétaire, demeurant même rue du Cygne, 10, grand-oncle de l'enfant.\n\nSecond témoin : Pierre Ordonneau, âgé de quarante-[deux ?] ans, propriétaire, demeurant rue de Strasbourg, 17, aïeul maternel de l'enfant.\n\nLesquels, après lecture, ont signé avec nous et le déclarant.\n\nConstaté, suivant la loi, par nous, Auguste [nom illisible], chevalier de la Légion d'honneur, adjoint au maire du premier arrondissement de Paris, et officier de l'état civil soussigné.\n\n[Signatures : Serre ; Louis Serre ; Ordonneau ; officier de l'état civil.]";
  const image = 'images/S58-Henry-Louis-Serre-naissance-Paris-1862.png';
  const source = {
    id: 'S58',
    title: 'Henry Louis Serre · naissance · Paris 1er · 10 mars 1862',
    file: 'Paris 1er · naissances 1862 · capture de l’acte (en-tête hors cadre)',
    url: "https://archives.paris.fr/archives-numerisees/etat-civil-de-paris/etat-civil-a-partir-de-1860/consulter-les-tables-decennales",
    ref: 'Archives de Paris · naissance de Henry Louis Serre · 1862 ; capture transmise le 12 octobre 2026. Vue 9 du lien communiqué : tables décennales, non vérifiée comme renvoi direct à l’acte.',
    transcription,
    transLabel: 'Transcription paléographique — lectures incertaines entre crochets',
    note: 'L’acte confirme les parents Jean David Serre et Marie Ordonneau. La date complète provient de l’acte de mariage de 1894, l’en-tête étant absent de la capture. Pierre Ordonneau est qualifié d’aïeul maternel ; son lien comme père de Marie est déduit de ce titre.',
    kind: 'Acte de naissance',
    image,
    images: [image]
  };
  if (original) Object.assign(original,source); else d.sources.push(source);
  if (henry) {
    henry.sources = unique([...(henry.sources||[]),'S58']);
    henry.birth = {date:'10 mars 1862',place:'Paris 1er',sources:unique([...(henry.birth?.sources||[]),'S58','S57']),status:'Acte (filiation vérifiée ; date recoupée)',detail:'Né à 2 h du matin au 10 rue du Cygne ; date recoupée avec mariage de Bordeaux (1894).'};
    henry.parents = ['jean_david_serre','marie_ordonneau'];
    henry.notes = (henry.notes||'').replace(/Piste à vérifier : acte Serre[^.]*\. ?/,'').replace(/Attribution à Henry Louis Serre non confirmée\. ?/,'') + ' Acte de naissance retrouvé : Paris 1er, 10 rue du Cygne ; mère âgée de 19 ans et père fabricant de chaussures, âgé de 32 ans.';
  }
  if (jean) {
    jean.sources = unique([...(jean.sources||[]),'S58']);
    jean.occupation = 'Fabricant de chaussures (1862) ; rentier (1894)';
    jean.notes = (jean.notes||'') + ' Âgé de 32 ans à la naissance de son fils le 10 mars 1862 ; domicilié 10 rue du Cygne, Paris 1er.';
    jean.birth = {...jean.birth,date:'Vers 1829–1830',status:'Estimation par âge déclaré en 1862',sources:['S58']};
  }
  if (marie) {
    marie.sources = unique([...(marie.sources||[]),'S58']);
    marie.parents = unique([...(marie.parents||[]),'pierre_ordonneau']);
    marie.birth = {...marie.birth,date:'Vers 1842–1843',status:'Estimation par âge déclaré en 1862',sources:['S58']};
    marie.notes = (marie.notes||'') + ' Âgée de 19 ans à la naissance de Henry Louis en 1862 ; domiciliée 10 rue du Cygne. Pierre Ordonneau est explicitement désigné comme aïeul maternel de l’enfant.';
  }
  if (!person('pierre_ordonneau')) d.people.push({
    id:'pierre_ordonneau',name:'Pierre Ordonneau',short:'Pierre',branch:'Serre',
    sources:['S58'],parents:[],
    birth:{date:'Vers 1819–1820',place:'',sources:['S58'],status:'Estimation à partir de l’âge déclaré (lecture incertaine)',detail:''},
    death:{date:'',place:'',sources:[],status:'Non renseigné',detail:''},
    notes:'Aïeul maternel de Henry Louis Serre ; père probable de Marie Ordonneau. Témoin de la naissance le 10 mars 1862, domicilié 17 rue de Strasbourg à Paris. Âge lu comme quarante-deux ans, à vérifier sur l’original.',
    occupation:'Propriétaire (1862)'
  });
  if (!person('louis_serre_1803')) d.people.push({
    id:'louis_serre_1803',name:'Louis Serre',short:'Louis',branch:'Serre',
    sources:['S58'],parents:[],
    birth:{date:'Vers 1802–1803',place:'',sources:['S58'],status:'Estimation par âge déclaré',detail:''},
    death:{date:'',place:'',sources:[],status:'Non renseigné',detail:''},
    notes:'Grand-oncle de Henry Louis Serre, témoin à sa naissance en 1862. Parent collatéral : ne pas l’insérer comme ascendant direct sans filiation prouvée. Domicilié 10 rue du Cygne à Paris.',
    occupation:'Propriétaire (1862)'
  });
  d.updated='2026-10-12';
})();
