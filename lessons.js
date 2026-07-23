/* =========================================================================
   LEÇONS — le contenu.
   Chaque leçon : on APPREND (cartes concept) puis on VÉRIFIE (quiz).

   Une carte concept :
     { front, example, explain }
       front   → l'idée / la règle (recto)
       example → l'exemple (souvent coranique) révélé au verso
       explain → l'explication courte au verso

   Une question de quiz :
     { q, options:[...], answer: <index correct>, explain }

   Pour ajouter une leçon : copier un bloc { ... } et remplir.
   ========================================================================= */

window.LESSONS = [
  /* ---------------------------------------------------------------------- */
  {
    id: "s5",
    n: 5,
    title: "Les 3 types de mots",
    subtitle: "Nom · verbe · particule — puis défini & indéfini",
    cards: [
      {
        front: "Tout mot arabe appartient à l'un de <b>3 types</b> : اِسْم (nom), فِعْل (verbe), حَرْف (particule).",
        example: "اِسْم · فِعْل · حَرْف",
        explain: "La première question devant un mot : lequel des trois ? Chaque type suit ses propres règles.",
      },
      {
        front: "<b>الاِسْم</b> — le nom. Une personne, un objet, un lieu, une qualité.",
        example: "كِتَاب · رَجُل · اللَّه",
        explain: "Le nom se décline : sa terminaison change selon sa fonction dans la phrase.",
      },
      {
        front: "<b>الفِعْل</b> — le verbe. Il exprime une action.",
        example: "خَلَقَ (il a créé) · قَالَ (il a dit)",
        explain: "Il se conjugue selon le temps, la personne et le nombre — comme en français.",
      },
      {
        front: "<b>الحَرْف</b> — la particule. Un petit mot-outil invariable (préposition, conjonction…).",
        example: "فِي (dans) · مِنْ (de) · وَ (et)",
        explain: "Il ne change jamais de forme, mais influence souvent le mot qui le suit.",
      },
      {
        front: "Un nom est soit <b>indéfini</b> (نَكِرَة), soit <b>défini</b> (مَعْرِفَة).",
        example: "كِتَابٌ = un livre · الْكِتَابُ = le livre",
        explain: "Exactement comme « un / une » face à « le / la » en français.",
      },
      {
        front: "Le <b>tanwin</b> — la marque de l'indéfini. Un « n » final, écrit par un signe doublé : ـٌ ـً ـٍ.",
        example: "كِتَابٌ (kitābun) · كِتَابًا (kitāban) · كِتَابٍ (kitābin)",
        explain: "On l'entend partout dans le Coran : أَحَدٌ « Un seul » (sourate Al-Ikhlâs).",
      },
      {
        front: "<b>الـ</b> (al-) — la marque du défini. Dès qu'on l'ajoute, le tanwin disparaît.",
        example: "كِتَابٌ  →  الْكِتَابُ  (un livre → le livre)",
        explain: "Un mot ne peut pas être indéfini ET défini en même temps.",
      },
      {
        front: "Le ل de الـ se prononce… ou pas. C'est la règle <b>solaire / lunaire</b>.",
        example: "الْقَمَر → al-qamar (lunaire) · الشَّمْس → ash-shams (solaire)",
        explain: "Astuce : قمر (lune) = lunaire, ل prononcé ; شمس (soleil) = solaire, ل muet (chadda).",
      },
    ],
    quiz: [
      {
        q: "Dans quel type se classe قَالَ (il a dit) ?",
        options: ["فِعْل — verbe", "اِسْم — nom", "حَرْف — particule"],
        answer: 0,
        explain: "Une action → un verbe.",
      },
      {
        q: "كِتَابٌ (avec tanwin) est…",
        options: ["indéfini", "défini"],
        answer: 0,
        explain: "Le tanwin est la marque de l'indéfini (نَكِرَة).",
      },
      {
        q: "Quelle est la marque du défini ?",
        options: ["الـ", "le tanwin", "la chadda"],
        answer: 0,
        explain: "الـ définit le mot — et le tanwin disparaît alors.",
      },
      {
        q: "فِي (dans) est…",
        options: ["حَرْف — particule", "فِعْل — verbe", "اِسْم — nom"],
        answer: 0,
        explain: "Une préposition invariable → une particule.",
      },
      {
        q: "Dans الشَّمْس, prononce-t-on le ل de الـ ?",
        options: ["Non — lettre solaire", "Oui — lettre lunaire"],
        answer: 0,
        explain: "ش est solaire : le ل est muet, doublé par la chadda.",
      },
      {
        q: "Que devient كِتَابٌ avec الـ ?",
        options: ["الْكِتَابُ", "كِتَابًا", "كِتَابٍ"],
        answer: 0,
        explain: "الـ + perte du tanwin → الْكِتَابُ (le livre).",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: "s6",
    n: 6,
    title: "La phrase & l'annexion",
    subtitle: "مبتدأ + خبر — puis l'iḍāfa (« de »)",
    cards: [
      {
        front: "La <b>phrase nominale</b> : au présent, l'arabe n'a pas de verbe « être ». On accole deux mots.",
        example: "هٰذَا كِتَابٌ — « ceci (est) un livre »",
        explain: "Le sens « est » est sous-entendu — rien à ajouter.",
      },
      {
        front: "Elle a deux parties : <b>المُبْتَدَأ</b> (le sujet) + <b>الخَبَر</b> (ce qu'on en dit).",
        example: "هٰذَا كِتَابٌ  →  مبتدأ: هٰذَا · خبر: كِتَابٌ",
        explain: "Le sujet est souvent défini ; le خبر souvent indéfini (tanwin).",
      },
      {
        front: "« Ceci » : <b>هٰذَا</b> (masculin) · <b>هٰذِهِ</b> (féminin).",
        example: "هٰذَا بَيْتٌ (une maison) · هٰذِهِ شَجَرَةٌ (un arbre)",
        explain: "Presque tout nom finissant par ة est féminin → هٰذِهِ.",
      },
      {
        front: "La phrase nominale est <b>partout dans le Coran</b>.",
        example: "اللَّهُ أَحَدٌ — « Allah est Un » (Al-Ikhlâs)",
        explain: "مبتدأ: اللَّهُ (déjà défini) · خبر: أَحَدٌ (indéfini, tanwin).",
      },
      {
        front: "Questionner : <b>مَا</b> (« qu'est-ce que », les choses) · <b>مَنْ</b> (« qui », les personnes).",
        example: "مَا هٰذَا؟ (qu'est-ce que c'est ?) · مَنْ هٰذَا؟ (qui est-ce ?)",
        explain: "Elles se placent en tête de la phrase nominale.",
      },
      {
        front: "<b>الإِضَافَة</b> — dire « de » sans le mot « de ». On accole deux noms.",
        example: "كِتَابُ الطَّالِبِ — « le livre de l'étudiant »",
        explain: "1er mot = le possédé (مُضَاف) · 2e = le possesseur (مُضَاف إِلَيْه).",
      },
      {
        front: "Règle d'or : le 1er mot d'une إضافة (le مُضَاف) ne prend <b>JAMAIS الـ ni tanwin</b>.",
        example: "كِتَابُ الطَّالِبِ ✓   ·   الْكِتَابُ الطَّالِبِ ✗   ·   كِتَابٌ الطَّالِبِ ✗",
        explain: "Le 2e mot, lui, est toujours au génitif (kasra).",
      },
      {
        front: "Tu récites déjà des إضافات <b>sans le savoir</b>.",
        example: "بِسْمِ اللَّهِ (au nom d'Allah) · رَبِّ العَالَمِينَ (Seigneur des mondes)",
        explain: "Et même une chaîne : مَالِكِ يَوْمِ الدِّينِ (Maître du Jour de la rétribution).",
      },
    ],
    quiz: [
      {
        q: "En arabe, « ceci est un livre » a-t-il besoin du verbe « être » ?",
        options: ["Non", "Oui"],
        answer: 0,
        explain: "La phrase nominale accole les deux mots : هٰذَا كِتَابٌ.",
      },
      {
        q: "Dans هٰذَا كِتَابٌ, quel est le مُبْتَدَأ (sujet) ?",
        options: ["هٰذَا", "كِتَابٌ"],
        answer: 0,
        explain: "هٰذَا = ce dont on parle.",
      },
      {
        q: "Pour un mot féminin comme شَجَرَة, on dit :",
        options: ["هٰذِهِ", "هٰذَا"],
        answer: 0,
        explain: "La terminaison ة marque le féminin → هٰذِهِ.",
      },
      {
        q: "« le livre de l'étudiant » se dit :",
        options: ["كِتَابُ الطَّالِبِ", "الْكِتَابُ الطَّالِبِ", "كِتَابٌ الطَّالِبِ"],
        answer: 0,
        explain: "Le مُضَاف n'a ni الـ ni tanwin.",
      },
      {
        q: "Dans une إضافة, le 1er mot peut-il porter الـ ?",
        options: ["Non, jamais", "Oui"],
        answer: 0,
        explain: "Le مُضَاف reste sans الـ, même quand l'ensemble est défini.",
      },
      {
        q: "مَنْ sert à demander…",
        options: ["qui (personnes)", "quoi (choses)"],
        answer: 0,
        explain: "مَنْ = qui ; مَا = qu'est-ce que.",
      },
      {
        q: "بِسْمِ اللَّهِ est un exemple de…",
        options: ["إضافة (annexion)", "phrase nominale", "particule"],
        answer: 0,
        explain: "Deux noms accolés (اسم + الله) = une annexion.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: "s7",
    n: 7,
    title: "Genre, nombre & cas",
    subtitle: "مذكّر/مؤنّث · duel & pluriel · l'i'rāb",
    cards: [
      {
        front: "Tout nom est <b>masculin</b> (مُذَكَّر) ou <b>féminin</b> (مُؤَنَّث).",
        example: "كِتَاب (m.) · مَدْرَسَة (f.)",
        explain: "Le féminin a des marqueurs visuels — le plus courant : la تاء مربوطة (ة).",
      },
      {
        front: "Les <b>3 marqueurs du féminin</b> : ة (le plus courant), ى, et اء.",
        example: "مَدْرَسَة (école) · كُبْرَى (grande) · حَمْرَاء (rouge, f.)",
        explain: "Sans aucun marqueur, un nom est en général masculin.",
      },
      {
        front: "Attention : certains mots sont <b>féminins sans marqueur</b>.",
        example: "شَمْس (soleil) · أَرْض (terre) · يَد (main)",
        explain: "Les organes qui vont par paire (عَيْن, أُذُن) aussi. À mémoriser — très fréquents dans le Coran.",
      },
      {
        front: "Le <b>duel</b> (المُثَنَّى) — « deux X ». On ajoute une terminaison au singulier.",
        example: "كِتَاب → كِتَابَان (sujet) / كِتَابَيْن (autres cas)",
        explain: "Le ة du féminin devient ت : مَدْرَسَة → مَدْرَسَتَان.",
      },
      {
        front: "Pluriels <b>réguliers (sains)</b> : masculin + ون/ين · féminin (–ة) + ات.",
        example: "مُسْلِم → مُسْلِمُون · مُسْلِمَة → مُسْلِمَات",
        explain: "Le masculin varie selon le cas (ـُون sujet / ـِين sinon) ; le féminin ajoute ات.",
      },
      {
        front: "Le <b>pluriel brisé</b> (جمع التكسير) : le mot change de l'intérieur.",
        example: "كِتَاب → كُتُب · رَجُل → رِجَال",
        explain: "Pas de règle — à mémoriser. Il se décline comme un singulier (damma/fatha/kasra).",
      },
      {
        front: "L'<b>إِعْرَاب</b> : le signe final n'est pas une prononciation, c'est une <b>fonction</b>.",
        example: "رَفْع (u) = sujet · نَصْب (a) = objet · جَرّ (i) = après prép. / إضافة",
        explain: "La fonction du mot dans la phrase commande sa voyelle finale.",
      },
      {
        front: "Un même mot change de terminaison selon sa fonction — <b>اللَّه</b> dans le Coran :",
        example: "اللَّهُ أَحَدٌ (sujet) · إِنَّ اللَّهَ (après إنّ) · بِسْمِ اللَّهِ (إضافة)",
        explain: "ـُ rafʿ · ـَ naṣb · ـِ jarr. Trois fonctions, trois voyelles.",
      },
    ],
    quiz: [
      { q: "مَدْرَسَة est…", options: ["féminin", "masculin"], answer: 0,
        explain: "La ة est le marqueur du féminin le plus courant." },
      { q: "شَمْس (soleil) est…", options: ["féminin (sans marqueur)", "masculin"], answer: 0,
        explain: "Féminin « caché », à mémoriser — fréquent dans le Coran." },
      { q: "Le duel de كِتَاب au cas sujet est…", options: ["كِتَابَان", "كِتَابَيْن", "كُتُب"], answer: 0,
        explain: "ـَان au cas sujet (rafʿ) ; ـَيْن dans les autres cas." },
      { q: "Le pluriel de مُسْلِمَة est…", options: ["مُسْلِمَات", "مُسْلِمُون", "مَسَاجِد"], answer: 0,
        explain: "Féminin régulier : on retire ة, on ajoute ات." },
      { q: "كُتُب (pluriel de كِتَاب) est un pluriel…", options: ["brisé", "masculin sain", "féminin sain"], answer: 0,
        explain: "Le mot change de l'intérieur → pluriel brisé." },
      { q: "Dans بِسْمِ اللَّهِ, le mot اللَّهِ est au cas…", options: ["جَرّ (i)", "رَفْع (u)", "نَصْب (a)"], answer: 0,
        explain: "2e terme d'une إضافة → génitif (kasra)." },
      { q: "L'i'rāb indique surtout…", options: ["la fonction du mot", "comment le prononcer"], answer: 0,
        explain: "Le signe final dit le rôle du mot dans la phrase." },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: "s8",
    n: 8,
    title: "Pronoms & l'adjectif",
    subtitle: "الضمائر · le نَعْت (accord sur 4 points)",
    cards: [
      {
        front: "Les <b>pronoms isolés</b> (المُنْفَصِلَة) — invariables, ils servent de sujet.",
        example: "أَنَا (je) · أَنْتَ (tu, m.) · هُوَ (il) · هِيَ (elle) · نَحْنُ (nous)",
        explain: "Ex. : هُوَ اللَّهُ أَحَدٌ — « Lui, Allah, est Un ».",
      },
      {
        front: "Les <b>pronoms suffixes</b> (المُتَّصِلَة) — « mon, ton, son » — s'attachent au nom.",
        example: "كِتَاب + ي → كِتَابِي (mon livre)",
        explain: "كَ = ton (m.) · كِ = ton (f.) · هُ = son · هَا = sa · نَا = notre. Le nom perd son tanwin.",
      },
      {
        front: "Tu connais déjà ces suffixes par cœur — <b>via la Fatiha</b>.",
        example: "رَبُّكُمْ (votre Seigneur) · عَلَيْهِمْ (sur eux) · إِيَّاكَ (Toi seul)",
        explain: "رَبّ + كُمْ, عَلَى + هِمْ… le suffixe précise la personne.",
      },
      {
        front: "L'adjectif (<b>النَّعْت</b>) suit <b>toujours</b> le nom, et s'accorde sur <b>4 points</b> à la fois.",
        example: "الكِتَابُ الجَدِيدُ — « le livre neuf »",
        explain: "Genre · nombre · définition · cas — les quatre en même temps.",
      },
      {
        front: "Les 4 accords : <b>genre, nombre, définition</b> (نكرة/معرفة), <b>cas</b>.",
        example: "كِتَابٌ جَدِيدٌ (un livre neuf) · الكِتَابُ الجَدِيدُ (le livre neuf)",
        explain: "Nom avec الـ → adjectif avec الـ. Nom avec tanwin → adjectif avec tanwin.",
      },
      {
        front: "Piège : un pluriel de <b>choses</b> (non-humain) s'accorde comme un <b>féminin singulier</b>.",
        example: "كُتُبٌ جَدِيدَةٌ ✓   (et non كُتُبٌ جَدِيدُونَ ✗)",
        explain: "Ex. coranique : آيَاتٌ بَيِّنَاتٌ (des versets clairs).",
      },
      {
        front: "Le نعت parfaitement accordé, <b>tu le récites déjà</b>.",
        example: "الصِّرَاطَ المُسْتَقِيمَ (le droit chemin) · الرَّحْمَٰنِ الرَّحِيمِ",
        explain: "Nom et adjectif : même genre, nombre, définition ET cas — accord 4/4.",
      },
    ],
    quiz: [
      { q: "« mon livre » se dit…", options: ["كِتَابِي", "كِتَابُكَ", "كِتَابُهُ"], answer: 0,
        explain: "Le suffixe ـِي = « mon »." },
      { q: "Le suffixe كُمْ signifie…", options: ["votre (vous, m.)", "son", "notre"], answer: 0,
        explain: "رَبُّكُمْ = votre Seigneur." },
      { q: "En arabe, l'adjectif se place…", options: ["après le nom", "avant le nom"], answer: 0,
        explain: "Le نعت suit toujours le nom qu'il qualifie." },
      { q: "Sur combien de points l'adjectif s'accorde-t-il ?", options: ["4", "1", "2"], answer: 0,
        explain: "Genre, nombre, définition et cas." },
      { q: "« le livre neuf » se dit…", options: ["الكِتَابُ الجَدِيدُ", "الكِتَابُ جَدِيدٌ", "كِتَابُ الجَدِيدُ"], answer: 0,
        explain: "Le nom porte الـ → l'adjectif aussi." },
      { q: "Un pluriel de choses (كُتُب) prend un adjectif…", options: ["féminin singulier", "masculin pluriel"], answer: 0,
        explain: "Règle du non-humain : كُتُبٌ جَدِيدَةٌ." },
      { q: "Dans الرَّحْمَٰنِ الرَّحِيمِ, les deux mots s'accordent en…", options: ["genre, nombre, définition et cas", "genre seulement"], answer: 0,
        explain: "Accord 4/4 — le نعت parfait." },
    ],
  },
];
