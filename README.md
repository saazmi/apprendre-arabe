# Apprendre l'arabe

Cartes mémoire pour apprendre l'arabe (fusha), une carte à la fois.
Conçu pour des séances courtes (10–15 min), calmes et sans surcharge —
pensé autour d'un profil TDAH / TDA.

**En ligne :** https://saazmi.github.io/apprendre-arabe/

## Comment ça marche

- **Répétition espacée (SRS)** : chaque carte revient juste avant l'oubli.
  Système de « boîtes » (Leitner) — `BOX_DAYS` dans `app.js`.
- **Séances finies** : max 10 cartes, dont 4 nouvelles au plus. Une fin visible.
- **Tout est local** : la progression est sauvée dans le navigateur
  (`localStorage`). Aucun serveur, aucun compte. Fonctionne hors-ligne (PWA).

## Installer sur l'iPad (recommandé)

1. Ouvrir le lien dans **Safari**.
2. Bouton **Partager** → **Sur l'écran d'accueil**.
3. Lancer depuis l'icône : plein écran, sans barre, et la progression est
   protégée (Safari n'efface pas les données d'une app installée).

## Ajouter du contenu

Tout le contenu est dans [`decks.js`](decks.js). Pour ajouter une leçon,
copier un bloc `{ ... }` et changer les valeurs. Aucune autre étape.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | page de l'app |
| `styles.css` | design (calme, iPad paysage, mode sombre) |
| `decks.js` | **le contenu** — cartes à éditer |
| `app.js` | moteur SRS + interface |
| `sw.js` · `manifest.webmanifest` | hors-ligne + installation (PWA) |
