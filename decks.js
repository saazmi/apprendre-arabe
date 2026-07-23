/* =========================================================================
   DECKS — le contenu des cartes.
   Facile à éditer : chaque carte = un objet. Pour ajouter une leçon,
   copie un bloc { ... } et change les valeurs.

   Types de cartes :
     "letter"  → recto: la lettre arabe · verso: nom, son, mot exemple
     (d'autres types viendront : vocabulaire, grammaire, verset…)
   ========================================================================= */

window.DECKS = [
  {
    id: "alphabet-1",
    title: "Les premières lettres",
    subtitle: "Séance 1 · أ ب ت ث ج ح",
    accent: "#0f766e",
    cards: [
      {
        id: "s1-alif",
        type: "letter",
        front: "أ",
        name: "Alif",
        sound: "a / â",
        example: "أَب",
        translit: "ab",
        fr: "père",
      },
      {
        id: "s1-ba",
        type: "letter",
        front: "ب",
        name: "Bā",
        sound: "b",
        example: "بَاب",
        translit: "bāb",
        fr: "porte",
      },
      {
        id: "s1-ta",
        type: "letter",
        front: "ت",
        name: "Tā",
        sound: "t",
        example: "تِين",
        translit: "tīn",
        fr: "figue",
      },
      {
        id: "s1-tha",
        type: "letter",
        front: "ث",
        name: "Thā",
        sound: "th (think)",
        example: "ثَعْلَب",
        translit: "thaʿlab",
        fr: "renard",
      },
      {
        id: "s1-jim",
        type: "letter",
        front: "ج",
        name: "Jīm",
        sound: "dj",
        example: "جَمَل",
        translit: "jamal",
        fr: "chameau",
      },
      {
        id: "s1-ha",
        type: "letter",
        front: "ح",
        name: "Ḥā",
        sound: "ħ (soufflé, gorge ouverte)",
        example: "حَلِيب",
        translit: "ḥalīb",
        fr: "lait",
      },
    ],
  },
];
