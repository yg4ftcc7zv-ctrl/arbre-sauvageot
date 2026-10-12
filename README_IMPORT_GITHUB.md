# Mise à jour de l'arbre Sauvageot — 12 octobre 2026

Fichiers à ajouter au dépôt GitHub à la racine (respecter le répertoire images/) :
- `serre-1862-update.js`
- `images/S58-Henry-Louis-Serre-naissance-Paris-1862.png`

Dans `index.html`, immédiatement après `<script src="data.js"></script>` ajouter :
`<script src="serre-1862-update.js"></script>`

Ne pas supprimer les scripts existants. Le patch réutilise S58, Henry Louis Serre, Jean David Serre et Marie Ordonneau, et ajoute Pierre Ordonneau comme ascendant et Louis Serre comme collatéral.

La capture est coupée en haut. La date du 10 mars 1862 est recoupée avec l'acte de mariage de 1894. La relation de Pierre Ordonneau à Marie est déduite de la mention « aïeul maternel » ; aucune épouse de Pierre n'est inventée.

Après import, ouvrir la fiche Henry Louis Serre, vérifier la transcription et l'image, puis les fiches de Jean David, Marie et Pierre. Tester le chargement de l'arbre en navigation privée.
