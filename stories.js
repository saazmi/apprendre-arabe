/* =========================================================================
   HISTOIRE DES PROPHÈTES — cartes de lecture (pas de quiz : on lit).
   Arabe simple (exercice de lecture) + traduction française sous chaque ligne.

   Adab : on ne met JAMAIS de paroles dans la bouche d'Allah. Le récit
   RAPPORTE (« Allah annonce que… »). Seul le Coran est cité mot pour mot,
   et uniquement dans les panneaux de versets (window.VERSES).

   Une carte : { ar:[lignes…], fr:[lignes…], refs:[clés], analysis?:{…} }
   analysis (facultatif) : décortique une phrase mot par mot (leçons 1–4).
   ========================================================================= */

window.STORIES = [
  {
    id: "isa",
    n: 1,
    title: "عِيسَى عَلَيْهِ السَّلَام",
    titleFr: "Le prophète ʿĪsā (Jésus)",
    subtitle: "De l'annonce à Marie jusqu'à l'élévation au ciel",
    cards: [
      {
        ar: ["كانَتْ مَرْيَمُ امْرَأَةً صالِحَةً طاهِرَةً.", "اِبْتَعَدَتْ عَنْ أَهْلِها إِلى مَكانٍ فِي الشَّرْقِ."],
        fr: ["Marie était une femme pieuse et pure.", "Elle s'éloigna de sa famille vers un lieu à l'est."],
        refs: ["19:16"],
      },
      {
        ar: ["أَرْسَلَ اللَّهُ إِلَيْها المَلَكَ فِي صُورَةِ رَجُلٍ.", "أَخْبَرَها أَنَّهُ رَسُولٌ مِنْ رَبِّها لِيَهَبَ لَها وَلَدًا طاهِرًا."],
        fr: ["Allah lui envoya l'ange sous la forme d'un homme.", "Il l'informa qu'il était un messager de son Seigneur, pour lui accorder un fils pur."],
        refs: ["19:19"],
      },
      {
        ar: ["بَشَّرَتْها المَلائِكَةُ بِكَلِمَةٍ مِنَ اللَّهِ.", "اسْمُهُ المَسِيحُ عِيسَى ابْنُ مَرْيَمَ."],
        fr: ["Les anges lui annoncèrent une parole venue d'Allah.", "Son nom est al-Masîḥ, ʿĪsā, fils de Marie."],
        refs: ["3:45"],
      },
      {
        ar: ["تَعَجَّبَتْ مَرْيَمُ: كَيْفَ يَكُونُ لَها وَلَدٌ؟", "فَأَخْبَرَها المَلَكُ أَنَّ اللَّهَ يَخْلُقُ ما يَشاءُ بِأَمْرِهِ."],
        fr: ["Marie s'étonna : comment aurait-elle un enfant ?", "L'ange lui apprit qu'Allah crée ce qu'Il veut, par Son ordre."],
        refs: [],
      },
      {
        ar: ["حَمَلَتْ مَرْيَمُ بِعِيسَى بِإِذْنِ اللَّهِ.", "ثُمَّ اِبْتَعَدَتْ إِلى مَكانٍ بَعِيدٍ."],
        fr: ["Marie conçut ʿĪsā par la permission d'Allah.", "Puis elle se retira en un lieu éloigné."],
        refs: [],
      },
      {
        ar: ["جاءَها المَخاضُ عِنْدَ جِذْعِ النَّخْلَةِ.", "تَمَنَّتْ لَوْ أَنَّها ماتَتْ قَبْلَ هٰذا اليَوْمِ."],
        fr: ["Les douleurs de l'enfantement la menèrent au tronc du palmier.", "Elle souhaita être morte avant ce jour."],
        refs: ["19:23"],
      },
      {
        ar: ["طَمْأَنَها صَوْتٌ مِنْ تَحْتِها.", "جَعَلَ اللَّهُ تَحْتَها نَهْرًا، وَأَمَرَها أَنْ تَهُزَّ النَّخْلَةَ لِيَسْقُطَ عَلَيْها الرُّطَبُ."],
        fr: ["Une voix, au-dessous d'elle, la rassura.", "Allah fit sous elle un ruisseau, et lui ordonna de secouer le palmier pour que les dattes fraîches tombent sur elle."],
        refs: [],
      },
      {
        ar: ["أَمَرَها اللَّهُ أَنْ تَصُومَ عَنِ الكَلامِ.", "ثُمَّ رَجَعَتْ إِلى قَوْمِها تَحْمِلُ طِفْلَها."],
        fr: ["Allah lui ordonna de s'abstenir de parler — un jeûne du silence.", "Puis elle revint vers son peuple en portant son enfant."],
        refs: ["19:26"],
      },
      {
        ar: ["تَعَجَّبَ القَوْمُ وَاتَّهَمُوا مَرْيَمَ.", "فَأَشارَتْ إِلى الطِّفْلِ لِيَسْأَلُوهُ."],
        fr: ["Le peuple s'étonna et accusa Marie.", "Elle désigna alors l'enfant pour qu'ils l'interrogent."],
        refs: [],
      },
      {
        ar: ["تَكَلَّمَ عِيسَى وَهُوَ طِفْلٌ فِي المَهْدِ.", "أَخْبَرَهُمْ أَنَّهُ عَبْدُ اللَّهِ، آتاهُ الكِتابَ وَجَعَلَهُ نَبِيًّا."],
        fr: ["ʿĪsā parla alors qu'il était un enfant au berceau.", "Il leur apprit qu'il est le serviteur d'Allah, qui lui a donné le Livre et a fait de lui un prophète."],
        refs: ["19:30"],
      },
      {
        ar: ["أَرْسَلَ اللَّهُ عِيسَى إِلى بَنِي إِسْرائِيلَ بِالمُعْجِزاتِ.", "كانَ يَخْلُقُ مِنَ الطِّينِ طَيْرًا، فَيَنْفُخُ فِيهِ فَيَصِيرُ حَيًّا بِإِذْنِ اللَّهِ."],
        fr: ["Allah envoya ʿĪsā aux enfants d'Israël avec des miracles.", "Il façonnait un oiseau dans l'argile, soufflait dedans, et il devenait vivant par la permission d'Allah."],
        refs: ["3:49"],
        analysis: {
          phrase: "أَرْسَلَ اللَّهُ عِيسَى إِلى بَنِي إِسْرائِيلَ",
          words: [
            { w: "أَرْسَلَ", type: "verbe", role: "فِعْل — action passée (« envoya »)" },
            { w: "اللَّهُ", type: "nom", role: "فاعل — le sujet du verbe · cas رَفْع (ـُ)" },
            { w: "عِيسَى", type: "nom", role: "مفعول به — le complément d'objet · cas نَصْب" },
            { w: "إِلى", type: "particule", role: "حَرْف — préposition (« vers »)" },
            { w: "بَنِي", type: "nom", role: "مجرور après la préposition · 1er terme d'une إضافة" },
            { w: "إِسْرائِيلَ", type: "nom", role: "مضاف إليه — 2e terme de l'إضافة" },
          ],
          takeaway: "Phrase verbale : فعل + فاعل + مفعول به. On y voit les 3 types de mots (leçon 1) et les cas رفع / نصب / جر (leçon 3).",
        },
      },
      {
        ar: ["وَكانَ يَشْفِي الأَعْمى وَالأَبْرَصَ، وَيُحْيِي المَوْتى بِإِذْنِ اللَّهِ.", "وَيُخْبِرُ النّاسَ بِما يَأْكُلُونَ وَما يَدَّخِرُونَ فِي بُيُوتِهِمْ."],
        fr: ["Il guérissait l'aveugle-né et le lépreux, et ressuscitait les morts par la permission d'Allah.", "Et il informait les gens de ce qu'ils mangeaient et de ce qu'ils gardaient dans leurs maisons."],
        refs: [],
      },
      {
        ar: ["صَدَّقَ عِيسَى التَّوْراةَ الَّتِي قَبْلَهُ، وَجاءَ بِالإِنْجِيلِ.", "وَبَشَّرَ بِرَسُولٍ يَأْتِي بَعْدَهُ اسْمُهُ أَحْمَدُ."],
        fr: ["ʿĪsā confirma la Torah venue avant lui, et apporta l'Évangile.", "Et il annonça un messager qui viendrait après lui, nommé Aḥmad."],
        refs: ["3:50", "61:6"],
      },
      {
        ar: ["آمَنَ بِهِ الحَوارِيُّونَ وَنَصَرُوهُ.", "طَلَبُوا مائِدَةً مِنَ السَّماءِ، فَدَعا عِيسى رَبَّهُ فَأَنْزَلَها اللَّهُ آيَةً لَهُمْ."],
        fr: ["Les disciples crurent en lui et le soutinrent.", "Ils demandèrent une table du ciel ; ʿĪsā invoqua son Seigneur, et Allah la fit descendre comme un signe pour eux."],
        refs: ["5:114"],
      },
      {
        ar: ["أَرادَ الأَعْداءُ قَتْلَ عِيسى وَصَلْبَهُ.", "لٰكِنَّ اللَّهَ نَجّاهُ مِنْهُمْ."],
        fr: ["Les ennemis voulurent tuer ʿĪsā et le crucifier.", "Mais Allah le sauva d'eux."],
        refs: [],
        analysis: {
          phrase: "أَرادَ الأَعْداءُ قَتْلَ عِيسى",
          words: [
            { w: "أَرادَ", type: "verbe", role: "فِعْل — action passée (« voulut »)" },
            { w: "الأَعْداءُ", type: "nom", role: "فاعل — le sujet · défini par الـ (leçon 1) · cas رَفْع" },
            { w: "قَتْلَ", type: "nom", role: "مفعول به · 1er terme d'une إضافة (sans الـ, sans tanwin)" },
            { w: "عِيسى", type: "nom", role: "مضاف إليه — 2e terme de l'إضافة (génitif)" },
          ],
          takeaway: "Un فعل + un فاعل défini (الـ, leçon 1), puis une إضافة : قَتْلَ عِيسى « le fait de tuer ʿĪsā » (leçon 2).",
        },
      },
      {
        ar: ["أَلْقى اللَّهُ شَبَهَ عِيسى عَلى رَجُلٍ آخَرَ.", "فَأَخَذَهُ الأَعْداءُ وَصَلَبُوهُ وَهُمْ يَحْسِبُونَهُ عِيسى."],
        fr: ["Allah projeta la ressemblance de ʿĪsā sur un autre homme.", "Les ennemis le saisirent et le crucifièrent, croyant que c'était ʿĪsā."],
        refs: ["4:157"],
      },
      {
        ar: ["فَما قَتَلُوا عِيسى وَما صَلَبُوهُ.", "بَلْ رَفَعَهُ اللَّهُ إِلَيْهِ إِلى السَّماءِ."],
        fr: ["Ils n'ont donc pas tué ʿĪsā ni ne l'ont crucifié.", "Allah l'éleva plutôt vers Lui, au ciel."],
        refs: ["4:158"],
      },
      {
        ar: ["عِيسى عَبْدُ اللَّهِ وَرَسُولُهُ.", "وَهُوَ نَبِيٌّ كَرِيمٌ مِنْ أُولِي العَزْمِ."],
        fr: ["ʿĪsā est le serviteur d'Allah et Son messager.", "C'est un noble prophète, parmi ceux dotés de fermeté (ūlū al-ʿazm)."],
        refs: [],
        analysis: {
          phrase: "عِيسى عَبْدُ اللَّهِ وَرَسُولُهُ",
          words: [
            { w: "عِيسى", type: "nom", role: "مُبْتَدَأ — le sujet (nom propre, donc défini)" },
            { w: "عَبْدُ", type: "nom", role: "خَبَر — le prédicat · 1er terme d'une إضافة" },
            { w: "اللَّهِ", type: "nom", role: "مضاف إليه — 2e terme de l'إضافة (génitif, kasra)" },
            { w: "وَ", type: "particule", role: "حَرْف — conjonction (« et »)" },
            { w: "رَسُولُ", type: "nom", role: "coordonné au خَبَر · 1er terme d'une إضافة" },
            { w: "ـهُ", type: "pronom", role: "ضمير — suffixe « son » · 2e terme de l'إضافة" },
          ],
          takeaway: "Phrase nominale sans « être » : مبتدأ + خبر (leçon 2). Avec deux إضافات et un pronom suffixe ـهُ (leçon 4).",
        },
      },
    ],
  },
];

// frName : nom français court ; surah : nom arabe court (pour les puces)
window.VERSES = {
  "3:45": { surah: "آل عمران", frName: "Âl ʿImrān", ayah: 45,
    ar: "إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ وَجِيهًا فِي الدُّنْيَا وَالْآخِرَةِ وَمِنَ الْمُقَرَّبِينَ",
    fr: "(Rappelle-toi) quand les Anges dirent : « O Marie, voilà qu'Allah t'annonce une parole de Sa part : son nom sera « Al-Masîh », « ʿĪsā », fils de Marie, illustre ici-bas comme dans l'au-delà, et l'un des rapprochés d'Allah ».",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/338.mp3" },
  "19:16": { surah: "مريم", frName: "Maryam", ayah: 16,
    ar: "وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ إِذِ انْتَبَذَتْ مِنْ أَهْلِهَا مَكَانًا شَرْقِيًّا",
    fr: "Mentionne, dans le Livre (le Coran), Marie, quand elle se retira de sa famille en un lieu vers l'Orient.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2266.mp3" },
  "19:19": { surah: "مريم", frName: "Maryam", ayah: 19,
    ar: "قَالَ إِنَّمَا أَنَا رَسُولُ رَبِّكِ لِأَهَبَ لَكِ غُلَامًا زَكِيًّا",
    fr: "Il dit : « Je suis en fait un Messager de ton Seigneur pour te faire don d'un fils pur ».",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2269.mp3" },
  "19:23": { surah: "مريم", frName: "Maryam", ayah: 23,
    ar: "فَأَجَاءَهَا الْمَخَاضُ إِلَىٰ جِذْعِ النَّخْلَةِ قَالَتْ يَا لَيْتَنِي مِتُّ قَبْلَ هَٰذَا وَكُنْتُ نَسْيًا مَنْسِيًّا",
    fr: "Puis les douleurs de l'enfantement l'amenèrent au tronc du palmier, et elle dit : « Malheur à moi ! Que je fusse morte avant cet instant ! Et que je fusse totalement oubliée ! »",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2273.mp3" },
  "19:26": { surah: "مريم", frName: "Maryam", ayah: 26,
    ar: "فَكُلِي وَاشْرَبِي وَقَرِّي عَيْنًا ۖ فَإِمَّا تَرَيِنَّ مِنَ الْبَشَرِ أَحَدًا فَقُولِي إِنِّي نَذَرْتُ لِلرَّحْمَٰنِ صَوْمًا فَلَنْ أُكَلِّمَ الْيَوْمَ إِنْسِيًّا",
    fr: "Mange donc et bois et que ton œil se réjouisse ! Si tu vois quelqu'un d'entre les humains, dis [lui :] « Assurément, j'ai voué un jeûne au Tout Miséricordieux : je ne parlerai donc aujourd'hui à aucun être humain ».",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2276.mp3" },
  "19:30": { surah: "مريم", frName: "Maryam", ayah: 30,
    ar: "قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا",
    fr: "Mais (le bébé) dit : « Je suis vraiment le serviteur d'Allah. Il m'a donné le Livre et m'a désigné Prophète.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2280.mp3" },
  "3:49": { surah: "آل عمران", frName: "Âl ʿImrān", ayah: 49,
    ar: "وَرَسُولًا إِلَىٰ بَنِي إِسْرَائِيلَ أَنِّي قَدْ جِئْتُكُمْ بِآيَةٍ مِنْ رَبِّكُمْ ۖ أَنِّي أَخْلُقُ لَكُمْ مِنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنْفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ ۖ وَأُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ وَأُحْيِي الْمَوْتَىٰ بِإِذْنِ اللَّهِ ۖ وَأُنَبِّئُكُمْ بِمَا تَأْكُلُونَ وَمَا تَدَّخِرُونَ فِي بُيُوتِكُمْ ۚ إِنَّ فِي ذَٰلِكَ لَآيَةً لَكُمْ إِنْ كُنْتُمْ مُؤْمِنِينَ",
    fr: "et Il sera le messager aux enfants d'Israël, [et leur dira] : « En vérité, je viens à vous avec un signe de la part de votre Seigneur. Pour vous, je forme de la glaise comme la figure d'un oiseau, puis je souffle dedans : et, par la permission d'Allah, cela devient un oiseau. Et je guéris l'aveugle-né et le lépreux, et je ressuscite les morts, par la permission d'Allah. Et je vous apprends ce que vous mangez et ce que vous amassez dans vos maisons. Voilà bien là un signe, pour vous, si vous êtes croyants !",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/342.mp3" },
  "3:50": { surah: "آل عمران", frName: "Âl ʿImrān", ayah: 50,
    ar: "وَمُصَدِّقًا لِمَا بَيْنَ يَدَيَّ مِنَ التَّوْرَاةِ وَلِأُحِلَّ لَكُمْ بَعْضَ الَّذِي حُرِّمَ عَلَيْكُمْ ۚ وَجِئْتُكُمْ بِآيَةٍ مِنْ رَبِّكُمْ فَاتَّقُوا اللَّهَ وَأَطِيعُونِ",
    fr: "Et je confirme ce qu'il y a dans la Thora révélée avant moi, et je vous rends licite une partie de ce qui vous était interdit. Et j'ai certes apporté un signe de votre Seigneur. Craignez Allah donc, et obéissez-moi.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/343.mp3" },
  "61:6": { surah: "الصف", frName: "As-Saff", ayah: 6,
    ar: "وَإِذْ قَالَ عِيسَى ابْنُ مَرْيَمَ يَا بَنِي إِسْرَائِيلَ إِنِّي رَسُولُ اللَّهِ إِلَيْكُمْ مُصَدِّقًا لِمَا بَيْنَ يَدَيَّ مِنَ التَّوْرَاةِ وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِنْ بَعْدِي اسْمُهُ أَحْمَدُ ۖ فَلَمَّا جَاءَهُمْ بِالْبَيِّنَاتِ قَالُوا هَٰذَا سِحْرٌ مُبِينٌ",
    fr: "Et quand Jésus fils de Marie dit : « O Enfants d'Israël, je suis vraiment le Messager d'Allah [envoyé] à vous, confirmateur de ce qui, dans la Thora, est antérieur à moi, et annonciateur d'un Messager à venir après moi, dont le nom sera « Ahmad ». Puis quand celui-ci vint à eux avec des preuves évidentes, ils dirent : « C'est là une magie manifeste ».",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/5169.mp3" },
  "5:114": { surah: "المائدة", frName: "Al-Mā'ida", ayah: 114,
    ar: "قَالَ عِيسَى ابْنُ مَرْيَمَ اللَّهُمَّ رَبَّنَا أَنْزِلْ عَلَيْنَا مَائِدَةً مِنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِأَوَّلِنَا وَآخِرِنَا وَآيَةً مِنْكَ ۖ وَارْزُقْنَا وَأَنْتَ خَيْرُ الرَّازِقِينَ",
    fr: "« O Allah, notre Seigneur, dit Jésus, fils de Marie, fais descendre du ciel sur nous une table servie qui soit une fête pour nous, pour le premier d'entre nous, comme pour le dernier, ainsi qu'un signe de Ta part. Nourris-nous : Tu es le meilleur des nourrisseurs. »",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/783.mp3" },
  "4:157": { surah: "النساء", frName: "An-Nisā'", ayah: 157,
    ar: "وَقَوْلِهِمْ إِنَّا قَتَلْنَا الْمَسِيحَ عِيسَى ابْنَ مَرْيَمَ رَسُولَ اللَّهِ وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِنْ شُبِّهَ لَهُمْ ۚ وَإِنَّ الَّذِينَ اخْتَلَفُوا فِيهِ لَفِي شَكٍّ مِنْهُ ۚ مَا لَهُمْ بِهِ مِنْ عِلْمٍ إِلَّا اتِّبَاعَ الظَّنِّ ۚ وَمَا قَتَلُوهُ يَقِينًا",
    fr: "et à cause de leur parole : « Nous avons vraiment tué le Christ, Jésus, fils de Marie, le Messager d'Allah »… Or, ils ne l'ont ni tué ni crucifié ; mais ce n'était qu'un faux semblant ! Et ceux qui ont discuté sur son sujet sont vraiment dans l'incertitude : ils n'en ont aucune connaissance certaine, ils ne font que suivre des conjectures ; et ils ne l'ont certainement pas tué.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/650.mp3" },
  "4:158": { surah: "النساء", frName: "An-Nisā'", ayah: 158,
    ar: "بَلْ رَفَعَهُ اللَّهُ إِلَيْهِ ۚ وَكَانَ اللَّهُ عَزِيزًا حَكِيمًا",
    fr: "mais Allah l'a élevé vers Lui. Et Allah est Puissant et Sage.",
    audio: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/651.mp3" },
};
