/* =========================================================================
   VOCABULAIRE — jeux de cartes de mots (ancrés dans le Coran).
   Chaque mot : { ar: arabe, tr: translittération, fr: sens }.

   Convention des sens (fr) : minuscule pour les noms communs, majuscule
   seulement pour les noms propres et les noms divins (Allah, Seigneur…),
   pas d'article devant. Cohérent d'un bout à l'autre de l'app.
   ========================================================================= */

window.VOCAB = [
  {
    id: "fatiha",
    title: "Les mots de la Fatiha",
    subtitle: "Le vocabulaire de la sourate d'ouverture",
    words: [
      { ar: "حَمْد", tr: "ḥamd", fr: "louange" },
      { ar: "رَبّ", tr: "rabb", fr: "Seigneur" },
      { ar: "عَالَمِين", tr: "ʿālamīn", fr: "mondes" },
      { ar: "رَحْمَٰن", tr: "raḥmān", fr: "Tout-Miséricordieux" },
      { ar: "رَحِيم", tr: "raḥīm", fr: "Très-Miséricordieux" },
      { ar: "مَالِك", tr: "mālik", fr: "Maître" },
      { ar: "يَوْم", tr: "yawm", fr: "jour" },
      { ar: "دِين", tr: "dīn", fr: "rétribution" },
      { ar: "صِرَاط", tr: "ṣirāṭ", fr: "chemin" },
      { ar: "مُسْتَقِيم", tr: "mustaqīm", fr: "droit" },
      { ar: "نِعْمَة", tr: "niʿma", fr: "bienfait" },
      { ar: "ضَالِّين", tr: "ḍāllīn", fr: "égarés" },
    ],
  },
  {
    id: "coran",
    title: "Mots fréquents du Coran",
    subtitle: "Les mots qu'on rencontre le plus souvent",
    words: [
      { ar: "اللَّه", tr: "allāh", fr: "Allah" },
      { ar: "كِتَاب", tr: "kitāb", fr: "livre" },
      { ar: "نُور", tr: "nūr", fr: "lumière" },
      { ar: "حَقّ", tr: "ḥaqq", fr: "vérité" },
      { ar: "عِلْم", tr: "ʿilm", fr: "savoir" },
      { ar: "قَلْب", tr: "qalb", fr: "cœur" },
      { ar: "نَفْس", tr: "nafs", fr: "âme" },
      { ar: "نَاس", tr: "nās", fr: "gens" },
      { ar: "أَرْض", tr: "arḍ", fr: "terre" },
      { ar: "سَمَاء", tr: "samāʾ", fr: "ciel" },
      { ar: "جَنَّة", tr: "janna", fr: "paradis" },
      { ar: "آيَة", tr: "āya", fr: "signe, verset" },
    ],
  },
  {
    id: "quotidien",
    title: "Premiers mots",
    subtitle: "Le vocabulaire du quotidien",
    words: [
      { ar: "بَيْت", tr: "bayt", fr: "maison" },
      { ar: "مَاء", tr: "māʾ", fr: "eau" },
      { ar: "خُبْز", tr: "khubz", fr: "pain" },
      { ar: "أُمّ", tr: "umm", fr: "mère" },
      { ar: "أَب", tr: "ab", fr: "père" },
      { ar: "يَد", tr: "yad", fr: "main" },
      { ar: "عَيْن", tr: "ʿayn", fr: "œil" },
      { ar: "شَمْس", tr: "shams", fr: "soleil" },
      { ar: "قَمَر", tr: "qamar", fr: "lune" },
      { ar: "بَاب", tr: "bāb", fr: "porte" },
      { ar: "كَلْب", tr: "kalb", fr: "chien" },
      { ar: "قِطّ", tr: "qiṭṭ", fr: "chat" },
    ],
  },
];
