# Apprendre l'arabe

Cartes mémoire pour apprendre l'arabe (fusha), une carte à la fois.
Conçu pour des séances courtes (10–15 min), calmes et sans surcharge —
pensé autour d'un profil TDAH.

**En ligne :** https://saazmi.github.io/apprendre-arabe/

## Comment ça marche

- **Répétition espacée (SRS)** : chaque carte revient juste avant l'oubli.
  Système de « boîtes » (Leitner) — `BOX_DAYS` dans `app.js`.
- **Séances finies** : max 10 cartes, dont 4 nouvelles au plus. Une fin visible.
- **Tout est local** : la progression est sauvée dans le navigateur
  (`localStorage`). Aucun serveur, aucun compte. Fonctionne hors-ligne (PWA).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | page de l'app |
| `styles.css` | design (calme, iPad paysage, mode sombre) |
| `decks.js` | **le contenu** — cartes à éditer |
| `app.js` | moteur SRS + interface |
| `sw.js` · `manifest.webmanifest` | hors-ligne + installation (PWA) |
