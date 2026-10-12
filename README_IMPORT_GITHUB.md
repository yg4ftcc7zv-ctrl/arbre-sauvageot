# Pack GitHub — Adèle Testaud · naissance · Mansle 1873

## Contenu
- `TRANSCRIPTION_ADELE_TESTAUD.md` : transcription écrite + note critique
- `images/S63-Adele-Testaud-naissance-Mansle-1873.png` : screenshot de l’acte
- `adele-testaud-1873-patch.js` : patch additif pour le site généalogique, incluant la mise à jour des données et l’ajout du point sur la carte

## Intégration GitHub
1. Ajouter `adele-testaud-1873-patch.js` à la racine du dépôt.
2. Ajouter l’image `images/S63-Adele-Testaud-naissance-Mansle-1873.png` dans le dossier `images/`.
3. Dans `index.html`, insérer la ligne suivante **après** `<script src="addresses.js"></script>` et **avant** `app.js` :

```html
<script src="adele-testaud-1873-patch.js"></script>
```

## Effet attendu
- fiche d’Adèle Testaud enrichie ;
- source `S63` ajoutée avec transcription et capture ;
- date de naissance corrigée au **11 juillet 1873** ;
- point de carte **Mansle (Charente)** ajouté.
