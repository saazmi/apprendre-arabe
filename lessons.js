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
];
