ARBRE SAUVAGEOT — SITE GITHUB PAGES / CLOUDFLARE PAGES

Fichiers principaux :
- index.html : structure du site
- styles.css : mise en page et responsive
- app.js : arbre, actes et navigation
- data.js : données généalogiques
- addresses.js : adresses relevées dans les actes
- map.js : carte interactive des adresses
- images/ : scans des actes

La carte utilise Leaflet + OpenStreetMap. Les adresses sont géocodées au premier affichage via l'API Adresse française, avec un repli OpenStreetMap si nécessaire, puis mises en cache dans le navigateur. Une adresse historique ambiguë peut donc nécessiter une vérification manuelle.

Pour mettre à jour le site : remplacer les fichiers modifiés dans le dépôt GitHub. Cloudflare Pages republiera automatiquement la branche main.

Mise a jour 05/10/2026 : ajout de Jacques Legris (Avallon, 1809), de ses parents Jacques Legris et Jeanne Degoix, de l acte S41 et de la ruelle du Tripot sur la carte (localisation volontairement au niveau d Avallon).

Version 2.4 : ajout du mariage Jacques Legris / Louise Justine Quesnot (29 septembre 1831), des parents Quesnot/Coufoury, de six pièces du dossier reconstitué et mise à jour de la carte pour Paris (ville uniquement).

Version 2.5 — 6 octobre 2026
- Ajout de l’acte de décès de Louise Justine Quesnot (Paris 17e, 28 mars 1904 ; acte dressé le 29 mars).
- Domicile 97 avenue de Clichy documenté jusqu’au décès en 1904.
- Transcriptions écrites enrichies pour l’ensemble des actes ; les lectures incertaines sont indiquées entre crochets.
- Les transcriptions sont désormais affichées directement avant le scan pour faciliter la lecture.
