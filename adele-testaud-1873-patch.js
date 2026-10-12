/* Patch additif : Adèle Testaud, acte de naissance 1873 + point de carte Mansle */
(function() {
  const D = window.FAMILY_DATA;
  const A = window.ADDRESS_DATA;
  if (!D || !Array.isArray(D.people) || !Array.isArray(D.sources)) return;
  const p = D.people.find(x => x.id === 'adele_testaud');
  const parent1 = D.people.find(x => x.id === 'jules_testaud');
  const parent2 = D.people.find(x => x.id === 'leonie_aubert');
  const src = {
    id: 'S63',
    title: 'Adèle Testaud · naissance · Mansle · 11 juillet 1873',
    file: 'Archives départementales de la Charente · Mansle · naissances 1873 · vue 7',
    url: 'https://lasource.archives.lacharente.fr/ark:/61904/s00552b5fdea0ca1/dao/0/1/idsearch:RECH_internet_2c73a47bdaf7cfed8dd4fe0fdeb942cd?id=https%3A%2F%2Flasource.archives.lacharente.fr%2Fark%3A%2F61904%2Fs00552b5fdea0ca1%2Fcanvas%2F0%2F7&vx=2087.32&vy=-1536.17&vr=0&vz=6.80891',
    ref: 'Mansle (Charente) · naissance · acte n° 24 · vue 7',
    transcription: "L’an mil huit cent soixante-treize, le quatorze juillet, à huit heures du soir, devant nous François Paul Machenaud, chevalier de la Légion d’honneur, maire, officier de l’état civil de la commune de Mansle, chef-lieu de canton, département de la Charente, est comparu Jules Testaud, négociant, âgé de vingt-sept ans, demeurant à Mansle, lequel nous a présenté un enfant du sexe féminin, né en son domicile le onze de ce mois, à onze heures et demie du soir, de lui déclarant et de Léonie Aubert, son épouse, sans profession, âgée de vingt-cinq ans, auquel enfant il a déclaré vouloir donner le prénom d’Adèle.\n\nLesdites déclarations et présentation faites en présence de Antoine Perrot, vitrier, de Mansle, âgé de vingt-sept ans, et de François Gourmain, cordonnier, âgé de cinquante-deux ans, demeurant séparément à Mansle.\n\nLe père et les témoins ont signé avec nous, le présent après que lecture leur en a été faite.\n\n[Signatures : F. Gourmain ; J. Testaud ; Perrot ; F. P. Machenaud.]",
    transLabel: 'Transcription écrite',
    note: 'L’acte original établit une naissance le 11 juillet 1873 à 23 h 30. Il corrige la date du 20 juillet 1873 précédemment déduite du mariage de 1894.',
    kind: 'Acte',
    image: 'images/S63-Adele-Testaud-naissance-Mansle-1873.png',
    images: ['images/S63-Adele-Testaud-naissance-Mansle-1873.png']
  };
  const existing = D.sources.findIndex(x => x.id === 'S63');
  if (existing >= 0) D.sources[existing] = src; else D.sources.push(src);
  const uniq = arr => [...new Set(arr)];
  if (p) {
    p.sources = uniq([...(p.sources || []), 'S63']);
    p.birth = {
      date: '11 juillet 1873',
      place: 'Mansle (Charente)',
      sources: ['S63','S57'],
      status: 'Acte',
      detail: 'Née en son domicile à 23 h 30 ; acte dressé le 14 juillet 1873.'
    };
    p.notes = (p.notes || '') + ' La date du 20 juillet 1873 issue de l’acte de mariage est rectifiée par l’acte de naissance original : naissance le 11 juillet 1873.';
  }
  if (parent1) {
    parent1.sources = uniq([...(parent1.sources || []), 'S63']);
    parent1.occupation = parent1.occupation ? (parent1.occupation + ' ; négociant (1873)') : 'Négociant (1873)';
  }
  if (parent2) {
    parent2.sources = uniq([...(parent2.sources || []), 'S63']);
    parent2.occupation = parent2.occupation ? parent2.occupation : 'Sans profession (1873)';
  }
  if (Array.isArray(A) && !A.some(x => x['Nom du point'] === 'Mansle (Charente)')) {
    A.push({
      'Nom du point':'Mansle (Charente)',
      'Adresse Google Maps':'Mansle, Charente, France',
      'Personnes liées':'Adèle Testaud ; Jules Testaud ; Léonie Aubert',
      'Groupe':'Famille',
      'Type de lien':'Lieu de naissance / domicile familial',
      'Date / période':'11 juillet 1873',
      'Source':'S63 – naissance d’Adèle Testaud',
      'Lien archive':'https://lasource.archives.lacharente.fr/ark:/61904/s00552b5fdea0ca1/dao/0/1/idsearch:RECH_internet_2c73a47bdaf7cfed8dd4fe0fdeb942cd?id=https%3A%2F%2Flasource.archives.lacharente.fr%2Fark%3A%2F61904%2Fs00552b5fdea0ca1%2Fcanvas%2F0%2F7&vx=2087.32&vy=-1536.17&vr=0&vz=6.80891',
      'Notes':'Commune de naissance d’Adèle Testaud ; l’acte ne précise pas la rue.',
      'Précision':'Ville uniquement'
    });
  }
  D.updated = '2026-10-12';
})();
