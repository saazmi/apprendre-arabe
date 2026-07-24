/* =========================================================================
   VOCABULAIRE — jeux de cartes de mots (ancrés dans le Coran).
   Chaque mot : { ar: arabe, fr: français }.
   Les quiz de vocabulaire sont générés dynamiquement (voir quiz.js) :
   « Que signifie X ? » et « Quel mot signifie … ? », avec des distracteurs
   tirés du même jeu.

   Pour ajouter des mots : ajoute des { ar, fr } ; pour un nouveau jeu,
   copie un bloc { id, title, subtitle, words }.
   ========================================================================= */

window.VOCAB = [
  {
    id: "fatiha",
    title: "Les mots de la Fatiha",
    subtitle: "Le vocabulaire de la sourate d'ouverture",
    words: [
      { ar: "حَمْد", fr: "louange" },
      { ar: "رَبّ", fr: "Seigneur" },
      { ar: "عَالَمِين", fr: "les mondes" },
      { ar: "رَحْمَٰن", fr: "le Tout-Miséricordieux" },
      { ar: "رَحِيم", fr: "le Très-Miséricordieux" },
      { ar: "مَالِك", fr: "Maître" },
      { ar: "يَوْم", fr: "jour" },
      { ar: "دِين", fr: "la rétribution" },
      { ar: "صِرَاط", fr: "chemin" },
      { ar: "مُسْتَقِيم", fr: "droit" },
      { ar: "نِعْمَة", fr: "bienfait" },
      { ar: "ضَالِّين", fr: "les égarés" },
    ],
  },
  {
    id: "coran",
    title: "Mots fréquents du Coran",
    subtitle: "Les mots qu'on rencontre le plus souvent",
    words: [
      { ar: "اللَّه", fr: "Dieu (Allah)" },
      { ar: "كِتَاب", fr: "livre" },
      { ar: "نُور", fr: "lumière" },
      { ar: "حَقّ", fr: "vérité" },
      { ar: "عِلْم", fr: "savoir" },
      { ar: "قَلْب", fr: "cœur" },
      { ar: "نَفْس", fr: "âme" },
      { ar: "نَاس", fr: "les gens" },
      { ar: "أَرْض", fr: "terre" },
      { ar: "سَمَاء", fr: "ciel" },
      { ar: "جَنَّة", fr: "paradis" },
      { ar: "آيَة", fr: "signe / verset" },
    ],
  },
  {
    id: "quotidien",
    title: "Premiers mots",
    subtitle: "Le vocabulaire du quotidien",
    words: [
      { ar: "بَيْت", fr: "maison" },
      { ar: "مَاء", fr: "eau" },
      { ar: "خُبْز", fr: "pain" },
      { ar: "أُمّ", fr: "mère" },
      { ar: "أَب", fr: "père" },
      { ar: "يَد", fr: "main" },
      { ar: "عَيْن", fr: "œil" },
      { ar: "شَمْس", fr: "soleil" },
      { ar: "قَمَر", fr: "lune" },
      { ar: "بَاب", fr: "porte" },
      { ar: "كَلْب", fr: "chien" },
      { ar: "قِطّ", fr: "chat" },
    ],
  },
];
