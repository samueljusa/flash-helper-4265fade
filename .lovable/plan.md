# Champ de prompt extensible style Apple

## Objectif
Remplacer la saisie sur une seule longue ligne par une zone de texte élégante et multiligne, compacte au repos puis confortable dès que l’utilisateur clique ou écrit.

## Modifications
- Remplacer le champ actuel par une zone `textarea` multiligne.
- Agrandir doucement le conteneur au focus, puis adapter automatiquement sa hauteur au contenu avec une limite raisonnable et un défilement interne au-delà.
- Conserver `Entrée` pour créer une nouvelle ligne et utiliser `Cmd/Ctrl + Entrée` pour lancer la génération.
- Affiner l’apparence façon Apple : transition fluide, focus discret, lisibilité mobile et outils toujours accessibles sous le texte.
- Préserver l’Optimisation Magique, ses animations et le retour du texte optimisé dans la zone.

## Vérification
- Tester ouverture au clic, saisie sur plusieurs lignes, redimensionnement, optimisation et envoi sur la vue mobile actuelle.
- Vérifier l’absence d’erreur de compilation et de débordement visuel.
