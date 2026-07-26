/* =========================================================================
   HISTOIRE DES PROPHÈTES — cartes de lecture (pas de quiz : on lit).
   Arabe simple (exercice de lecture) + traduction française sous chaque ligne.
   Les références coraniques sont cliquables : elles déplient le verset
   (arabe + français) avec un bouton d'écoute (récitation).

   Une carte : { ar:[lignes…], fr:[lignes…], refs:[clés de versets] }
   Les versets sont dans window.VERSES (texte Tanzil quran-simple + trad.
   Hamidullah + audio Alafasy via alquran.cloud / islamic.network).
   ========================================================================= */

window.STORIES = [
  {
    id: "isa",
    n: 1,
    title: "عِيسَى ﷺ",
    titleFr: "Le prophète ʿĪsā (Jésus)",
    subtitle: "De l'annonce à Marie jusqu'à l'élévation au ciel",
    cards: [
      {
        ar: ["بَشَّرَتِ المَلائِكَةُ مَرْيَمَ بِوَلَدٍ.", "اسْمُهُ عِيسَى ابْنُ مَرْيَمَ."],
        fr: ["Les anges annoncèrent à Marie un enfant.", "Son nom est ʿĪsā, fils de Marie."],
        refs: ["3:45"],
      },
      {
        ar: ["قالَتْ مَرْيَمُ: كَيْفَ يَكُونُ لِي وَلَدٌ؟", "قالَ اللَّهُ: كُنْ، فَيَكُونُ."],
        fr: ["Marie dit : comment aurais-je un enfant ?", "Allah dit : « Sois », et il fut."],
        refs: [],
      },
      {
        ar: ["وَلَدَتْ مَرْيَمُ عِيسَى تَحْتَ النَّخْلَةِ.", "وَكانَ ذٰلِكَ آيَةً مِنَ اللَّهِ."],
        fr: ["Marie mit ʿĪsā au monde sous le palmier.", "Ce fut là un signe d'Allah."],
        refs: [],
      },
      {
        ar: ["تَكَلَّمَ عِيسَى وَهُوَ طِفْلٌ فِي المَهْدِ.", "قالَ: إِنِّي عَبْدُ اللَّهِ."],
        fr: ["ʿĪsā parla alors qu'il était un enfant au berceau.", "Il dit : « Je suis le serviteur d'Allah. »"],
        refs: ["19:30"],
      },
      {
        ar: ["أَرْسَلَ اللَّهُ عِيسَى إِلى بَنِي إِسْرائِيلَ.", "كانَ يَشْفِي المَرْضى وَيُحْيِي المَوْتى بِإِذْنِ اللَّهِ."],
        fr: ["Allah envoya ʿĪsā aux enfants d'Israël.", "Il guérissait les malades et ressuscitait les morts, par la permission d'Allah."],
        refs: ["3:49"],
      },
      {
        ar: ["طَلَبَ الحَوارِيُّونَ مائِدَةً مِنَ السَّماءِ.", "دَعا عِيسى رَبَّهُ، فَأَنْزَلَ اللَّهُ المائِدَةَ."],
        fr: ["Les disciples demandèrent une table venue du ciel.", "ʿĪsā invoqua son Seigneur, et Allah fit descendre la table."],
        refs: ["5:114"],
      },
      {
        ar: ["أَرادَ الأَعْداءُ قَتْلَ عِيسى.", "لٰكِنَّ اللَّهَ رَفَعَهُ إِلَيْهِ إِلى السَّماءِ."],
        fr: ["Les ennemis voulurent tuer ʿĪsā.", "Mais Allah l'éleva vers Lui, au ciel."],
        refs: ["4:158"],
      },
      {
        ar: ["عِيسى عَبْدُ اللَّهِ وَرَسُولُهُ.", "وَهُوَ نَبِيٌّ كَرِيمٌ."],
        fr: ["ʿĪsā est le serviteur d'Allah et Son messager.", "C'est un noble prophète."],
        refs: [],
      },
    ],
  },
];

window.VERSES = {
  "3:45": {
    surah: "آل عمران", frName: "Âl ʿImrān", ayah: 45,
    ar: "إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ وَجِيهًا فِي الدُّنْيَا وَالْآخِرَةِ وَمِنَ الْمُقَرَّبِينَ",
    fr: "(Rappelle-toi) quand les Anges dirent : « O Marie, voilà qu'Allah t'annonce une parole de Sa part : son nom sera « Al-Masîh », « ʿĪsā », fils de Marie, illustre ici-bas comme dans l'au-delà, et l'un des rapprochés d'Allah ».",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/338.mp3",
  },
  "19:30": {
    surah: "مريم", frName: "Maryam", ayah: 30,
    ar: "قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا",
    fr: "Mais (le bébé) dit : « Je suis vraiment le serviteur d'Allah. Il m'a donné le Livre et m'a désigné Prophète.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2280.mp3",
  },
  "3:49": {
    surah: "آل عمران", frName: "Âl ʿImrān", ayah: 49,
    ar: "وَرَسُولًا إِلَىٰ بَنِي إِسْرَائِيلَ أَنِّي قَدْ جِئْتُكُمْ بِآيَةٍ مِنْ رَبِّكُمْ ۖ أَنِّي أَخْلُقُ لَكُمْ مِنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنْفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ ۖ وَأُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ وَأُحْيِي الْمَوْتَىٰ بِإِذْنِ اللَّهِ ۖ وَأُنَبِّئُكُمْ بِمَا تَأْكُلُونَ وَمَا تَدَّخِرُونَ فِي بُيُوتِكُمْ ۚ إِنَّ فِي ذَٰلِكَ لَآيَةً لَكُمْ إِنْ كُنْتُمْ مُؤْمِنِينَ",
    fr: "et Il sera le messager aux enfants d'Israël, [et leur dira] : « En vérité, je viens à vous avec un signe de la part de votre Seigneur. Pour vous, je forme de la glaise comme la figure d'un oiseau, puis je souffle dedans : et, par la permission d'Allah, cela devient un oiseau. Et je guéris l'aveugle-né et le lépreux, et je ressuscite les morts, par la permission d'Allah. Et je vous apprends ce que vous mangez et ce que vous amassez dans vos maisons. Voilà bien là un signe, pour vous, si vous êtes croyants !",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/342.mp3",
  },
  "5:114": {
    surah: "المائدة", frName: "Al-Mā'ida", ayah: 114,
    ar: "قَالَ عِيسَى ابْنُ مَرْيَمَ اللَّهُمَّ رَبَّنَا أَنْزِلْ عَلَيْنَا مَائِدَةً مِنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِأَوَّلِنَا وَآخِرِنَا وَآيَةً مِنْكَ ۖ وَارْزُقْنَا وَأَنْتَ خَيْرُ الرَّازِقِينَ",
    fr: "« O Allah, notre Seigneur, dit Jésus, fils de Marie, fais descendre du ciel sur nous une table servie qui soit une fête pour nous, pour le premier d'entre nous, comme pour le dernier, ainsi qu'un signe de Ta part. Nourris-nous : Tu es le meilleur des nourrisseurs. »",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/783.mp3",
  },
  "4:158": {
    surah: "النساء", frName: "An-Nisā'", ayah: 158,
    ar: "بَلْ رَفَعَهُ اللَّهُ إِلَيْهِ ۚ وَكَانَ اللَّهُ عَزِيزًا حَكِيمًا",
    fr: "mais Allah l'a élevé vers Lui. Et Allah est Puissant et Sage.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/651.mp3",
  },
};
