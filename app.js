/* =========================================================================
   Apprendre l'arabe — coquille de l'app : navigation, accueil, leçons de
   grammaire, vocabulaire, et le lanceur de quiz dynamiques.
   État (meilleurs scores) dans localStorage. Aucun serveur.
   ========================================================================= */

(function () {
  "use strict";

  const app = document.getElementById("app");
  const STORE_KEY = "arabe.progress.v3";
  const LESSONS = window.LESSONS || [];
  const VOCAB = window.VOCAB || [];
  const STORIES = window.STORIES || [];
  const VERSES = window.VERSES || {};

  // ---- bidi : isole chaque passage arabe (RTL) pour que le français et les
  //      parenthèses autour restent bien placés ----------------------------
  const AR = "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF";
  const AR_RUN = new RegExp("[" + AR + "](?:[" + AR + "\\s]*[" + AR + "])?", "g");
  function bidi(s) {
    return String(s).replace(AR_RUN, function (m) { return '<bdi dir="rtl">' + m + "</bdi>"; });
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---- translittération des TERMES de grammaire -------------------------
  //  Quand un terme arabe apparaît (اِسْم, حَرْف…), on ajoute sa prononciation
  //  la première fois qu'il est vu dans une carte. Le glossaire est indexé
  //  sur la forme « nue » (sans voyelles ni article الـ) pour tout attraper.
  const TRANSLIT = {
    "اسم": "ism", "فعل": "fiʿl", "حرف": "ḥarf", "نكرة": "nakira", "معرفة": "maʿrifa",
    "تنوين": "tanwīn", "مبتدأ": "mubtadaʾ", "خبر": "khabar", "إضافة": "iḍāfa", "مضاف": "muḍāf",
    "نعت": "naʿt", "مذكر": "mudhakkar", "مؤنث": "muʾannath", "مثنى": "muthannā", "جمع": "jamʿ",
    "إعراب": "iʿrāb", "رفع": "rafʿ", "نصب": "naṣb", "جر": "jarr", "ضمير": "ḍamīr", "ضمائر": "ḍamāʾir",
  };
  const DIAC = /[ـً-ٰٕ]/g;                 // tatweel + harakat + hamza combinantes
  function normAr(s) {
    s = s.replace(DIAC, "");
    if (s.length > 2 && s.charCodeAt(0) === 0x0627 && s.charCodeAt(1) === 0x0644) s = s.slice(2); // ال
    return s;
  }
  const ANNOT_RE = new RegExp("([" + AR + "]+)(\\s*\\(([^)]*)\\))?", "g");
  function annotate(text) {
    const full = String(text);
    const used = {};
    return full.replace(ANNOT_RE, function (m, word, parenAll, glossInner, offset) {
      const key = normAr(word);
      const tr = TRANSLIT[key];
      if (!tr || used[key]) return m;
      const before = full.slice(0, offset);
      const after = full.slice(offset + m.length);
      if (/[؀-ۿ]\s*$/.test(before)) return m;              // mot arabe précédent → dans une phrase
      const wrapped = before.slice(-1) === "(" && after.charAt(0) === ")";
      if (!parenAll && !wrapped && /^\s*[؀-ۿ]/.test(after)) return m; // mot arabe suivant
      used[key] = 1;
      if (wrapped) return word + " — " + tr;                          // (مُضَاف) → (مُضَاف — muḍāf)
      if (parenAll) return word + " (" + tr + ", " + glossInner + ")"; // اِسْم (nom) → اِسْم (ism, nom)
      return word + " (" + tr + ")";                                  // الفِعْل → الفِعْل (fiʿl)
    });
  }

  // ---- progression -------------------------------------------------------
  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; } }
  function save(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
  let state = Object.assign({ scores: {} }, load());
  function best(key) { return state.scores[key] || null; }
  function recordScore(key, score, total) {
    const p = state.scores[key] || { best: 0 };
    state.scores[key] = { best: Math.max(p.best || 0, score), last: score, total: total };
    save(state);
  }

  function h(html) { app.innerHTML = html; window.scrollTo(0, 0); }

  // =========================================================================
  //  COQUILLE + NAVIGATION
  // =========================================================================
  const NAV = [
    { id: "home", label: "Accueil", icon: "☾" },
    { id: "grammar", label: "Grammaire", icon: "ن" },
    { id: "vocab", label: "Vocabulaire", icon: "ك" },
    { id: "stories", label: "Récits", icon: "ق" },
  ];

  function shell(active, mainHTML) {
    let items = "";
    NAV.forEach(function (it) {
      items += '<button class="nav-item' + (it.id === active ? " active" : "") + '" data-nav="' + it.id + '">' +
                 '<span class="nav-ic" dir="rtl">' + it.icon + "</span>" +
                 '<span class="nav-lbl">' + it.label + "</span>" +
               "</button>";
    });
    h(
      '<div class="shell">' +
        '<nav class="rail">' +
          '<div class="brand"><div class="bismillah" dir="rtl">بِسْمِ اللَّه</div>' +
            '<div class="brand-t">Apprendre<br>l\'arabe</div></div>' +
          '<div class="nav-items">' + items + "</div>" +
        "</nav>" +
        '<main class="main"><div class="screen">' + mainHTML + "</div></main>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-nav")); };
    });
  }

  function focus(mainHTML, backLabel, onBack) {
    h('<div class="topbar"><button class="btn btn-ghost" id="back">‹ ' + (backLabel || "Retour") + "</button></div>" +
      '<div class="focus-wrap">' + mainHTML + "</div>");
    document.getElementById("back").onclick = onBack;
  }

  function go(view) {
    if (view === "grammar") return screenGrammar();
    if (view === "vocab") return screenVocab();
    if (view === "stories") return screenStories();
    return screenHome();
  }

  // =========================================================================
  //  ACCUEIL
  // =========================================================================
  function screenHome() {
    const heure = new Date().getHours();
    const salut = heure < 18 ? "As-salāmu ʿalaykum · prête à apprendre ?"
                             : "As-salāmu ʿalaykum · une séance ce soir ?";
    const gDone = LESSONS.filter(l => best("g:" + l.id)).length;
    const vDone = VOCAB.filter(d => best("v:" + d.id)).length;

    shell("home",
      '<div class="home">' +
        '<h1>Ahlan wa sahlan 🌙</h1>' +
        '<p class="greeting">' + salut + "</p>" +
        '<div class="tiles">' +
          '<button class="tile" data-go="grammar">' +
            '<div class="tile-ic" dir="rtl">نَحْو</div>' +
            '<div class="tile-t">Grammaire</div>' +
            '<div class="tile-s">' + LESSONS.length + " leçons · apprendre & réviser</div>" +
          "</button>" +
          '<button class="tile" data-go="vocab">' +
            '<div class="tile-ic" dir="rtl">كَلِمَات</div>' +
            '<div class="tile-t">Vocabulaire</div>' +
            '<div class="tile-s">' + VOCAB.length + " jeux de mots · cartes & quiz</div>" +
          "</button>" +
          '<button class="tile" data-go="stories">' +
            '<div class="tile-ic" dir="rtl">قَصَص</div>' +
            '<div class="tile-t">Récits du Coran</div>' +
            '<div class="tile-s">' + STORIES.length + " récit" + (STORIES.length > 1 ? "s" : "") + " · lecture & versets</div>" +
          "</button>" +
        "</div>" +
        '<p class="footnote">Grammaire : ' + gDone + "/" + LESSONS.length +
          " · Vocabulaire : " + vDone + "/" + VOCAB.length +
          "<br>Apprends à ton rythme, reviens quand tu veux. 🌱</p>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".tile"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-go")); };
    });
  }

  // =========================================================================
  //  GRAMMAIRE — liste des leçons + révision globale
  // =========================================================================
  function screenGrammar() {
    let rows = "";
    LESSONS.forEach(function (l) {
      const b = best("g:" + l.id);
      const score = b ? '<span class="rq-score">✓ ' + b.best + "/" + b.total + "</span>" : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-lesson="' + l.id + '">' +
                  '<span class="list-num">' + l.n + "</span>" +
                  '<span class="list-meta"><span class="list-title" dir="ltr">' + bidi(l.title) + "</span>" +
                    '<span class="list-sub" dir="ltr">' + bidi(l.subtitle) + "</span></span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + l.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    shell("grammar",
      '<div class="section-head"><h1>Grammaire</h1>' +
        '<p class="greeting">Touche une leçon pour apprendre · le bouton <b>Quiz</b> pour réviser.</p></div>' +
      '<button class="btn btn-primary wide" id="revall">Quiz de révision · toute la grammaire</button>' +
      '<div class="list">' + rows + "</div>"
    );
    document.getElementById("revall").onclick = function () {
      runQuiz({
        label: "Grammaire", saveKey: "g:all",
        generate: function () { return window.QUIZ.buildGrammarQuiz(10); },
        onExit: screenGrammar,
      });
    };
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const l = LESSONS.filter(x => x.id === b.getAttribute("data-lesson"))[0];
        if (l) teach(l, 0);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".row-quiz"), function (b) {
      b.onclick = function () {
        const l = LESSONS.filter(x => x.id === b.getAttribute("data-quiz"))[0];
        if (l) startLessonQuiz(l);
      };
    });
  }

  function startLessonQuiz(lesson) {
    runQuiz({
      label: "Leçon " + lesson.n, saveKey: "g:" + lesson.id,
      generate: function () { return window.QUIZ.buildLessonQuiz(lesson.id, 10); },
      onExit: screenGrammar,
    });
  }

  // ---- apprentissage (cartes concept) ------------------------------------
  function teach(lesson, i) {
    const card = lesson.cards[i];
    const total = lesson.cards.length;
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    focus(
      '<div class="study">' +
        '<div class="phase-label">Leçon ' + lesson.n + " · Apprentissage · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card concept" id="card">' +
          '<div class="concept-front" dir="ltr">' + bidi(annotate(card.front)) + "</div>" +
          '<div class="reveal-hint" id="hint">touche pour voir l\'exemple</div>' +
          '<div class="concept-back" id="cardback" hidden>' +
            '<div class="example-word" dir="ltr">' + bidi(annotate(card.example)).replace(/\s*·\s*/g, "<br>") + "</div>" +
            '<div class="example-explain" dir="ltr">' + bidi(annotate(card.explain)) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next" hidden>' + (last ? "Passer au quiz →" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Grammaire", screenGrammar
    );

    let revealed = false;
    function reveal() {
      if (revealed) return; revealed = true;
      document.getElementById("cardback").hidden = false;
      document.getElementById("hint").style.visibility = "hidden";
      document.getElementById("next").hidden = false;
    }
    document.getElementById("card").onclick = reveal;
    if (i > 0) document.getElementById("prev").onclick = function () { teach(lesson, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) startLessonQuiz(lesson); else teach(lesson, i + 1);
    };
  }

  // =========================================================================
  //  VOCABULAIRE
  // =========================================================================
  function screenVocab() {
    let rows = "";
    VOCAB.forEach(function (d) {
      const b = best("v:" + d.id);
      const score = b ? '<span class="rq-score">✓ ' + b.best + "/" + b.total + "</span>" : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-deck="' + d.id + '">' +
                  '<span class="list-ic" dir="rtl">كَلِمَات</span>' +
                  '<span class="list-meta"><span class="list-title">' + d.title + "</span>" +
                    '<span class="list-sub">' + d.subtitle + " · " + d.words.length + " mots</span></span>" +
                "</button>" +
                '<button class="row-quiz" data-quiz="' + d.id + '"><span class="rq-label">Quiz</span>' + score + "</button>" +
              "</div>";
    });
    shell("vocab",
      '<div class="section-head"><h1>Vocabulaire</h1>' +
        '<p class="greeting">Touche un jeu pour parcourir les cartes · le bouton <b>Quiz</b> pour te tester.</p></div>' +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const d = VOCAB.filter(x => x.id === b.getAttribute("data-deck"))[0];
        if (d) browse(d, 0);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".row-quiz"), function (b) {
      b.onclick = function () {
        const d = VOCAB.filter(x => x.id === b.getAttribute("data-quiz"))[0];
        if (d) runQuiz({
          label: d.title, saveKey: "v:" + d.id,
          generate: function () { return window.QUIZ.buildVocabQuiz(d.id, 10); },
          onExit: screenVocab,
        });
      };
    });
  }

  // ---- parcourir les cartes de vocabulaire -------------------------------
  function browse(deck, i) {
    const w = deck.words[i];
    const total = deck.words.length;
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    focus(
      '<div class="study">' +
        '<div class="phase-label">' + deck.title + " · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card vcard" id="card">' +
          '<div class="vcard-ar" dir="rtl">' + w.ar + "</div>" +
          '<div class="reveal-hint" id="hint">touche pour voir le sens</div>' +
          '<div class="vcard-back" id="cardback" hidden>' +
            '<div class="vcard-tr">' + w.tr + "</div>" +
            '<div class="vcard-fr">' + w.fr + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Terminer" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Vocabulaire", screenVocab
    );

    let revealed = false;
    function reveal() {
      if (revealed) return; revealed = true;
      document.getElementById("cardback").hidden = false;
      document.getElementById("hint").style.visibility = "hidden";
    }
    document.getElementById("card").onclick = reveal;
    if (i > 0) document.getElementById("prev").onclick = function () { browse(deck, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) screenVocab(); else browse(deck, i + 1);
    };
  }

  // =========================================================================
  //  HISTOIRE DES PROPHÈTES — lecture + versets cliquables + récitation
  // =========================================================================
  let audioEl = null, audioBtn = null;
  function stopAudio() {
    if (audioEl) { audioEl.pause(); audioEl = null; }
    if (audioBtn) { audioBtn.classList.remove("playing"); audioBtn.innerHTML = "▶ Écouter"; audioBtn = null; }
  }
  function playAudio(url, btn) {
    if (audioEl && audioBtn === btn) { stopAudio(); return; }
    stopAudio();
    audioEl = new Audio(url); audioBtn = btn;
    btn.classList.add("playing"); btn.innerHTML = "⏸ Pause";
    audioEl.onended = stopAudio;
    audioEl.onerror = function () { btn.innerHTML = "⚠ indisponible"; };
    audioEl.play().catch(function () { btn.innerHTML = "⚠ hors-ligne"; });
  }

  function screenStories() {
    stopAudio();
    let rows = "";
    STORIES.forEach(function (s) {
      rows += '<div class="list-row"><button class="row-main" data-story="' + s.id + '">' +
                '<span class="list-ic" dir="rtl">ق</span>' +
                '<span class="list-meta">' +
                  '<span class="list-title" dir="rtl">' + s.title + "</span>" +
                  '<span class="list-sub">' + s.titleFr + " — " + s.subtitle + "</span>" +
                "</span></button></div>";
    });
    shell("stories",
      '<div class="section-head"><h1>Les récits du Coran</h1>' +
        '<p class="greeting">Lis l\'histoire en arabe. Le français est sous chaque ligne ; ' +
        "touche une référence pour lire et écouter le verset.</p></div>" +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".row-main"), function (b) {
      b.onclick = function () {
        const s = STORIES.filter(function (x) { return x.id === b.getAttribute("data-story"); })[0];
        if (s) readStory(s, 0);
      };
    });
  }

  function readStory(story, i) {
    stopAudio();
    const card = story.cards[i];
    const total = story.cards.length;
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    let lines = "";
    card.ar.forEach(function (a, idx) {
      lines += '<p class="story-ar" dir="rtl">' + a + "</p>";
      lines += '<p class="story-fr">' + (card.fr[idx] || "") + "</p>";
    });

    let refsHtml = "";
    (card.refs || []).forEach(function (ref) {
      const v = VERSES[ref];
      if (!v) return;
      const pid = "panel-" + ref.replace(":", "-");
      refsHtml +=
        '<div class="verse-block">' +
          '<button class="verse-chip" data-ref="' + ref + '">' +
            '<span class="q-ic" dir="rtl">۩</span> ' + v.frName + " " + ref +
          "</button>" +
          '<div class="verse-panel" id="' + pid + '" hidden>' +
            '<div class="verse-ar" dir="rtl">' + v.ar + "</div>" +
            '<div class="verse-fr">' + v.fr + "</div>" +
            '<div class="verse-foot">' +
              '<span class="verse-src" dir="rtl">' + v.surah + " · " + v.ayah + "</span>" +
              '<button class="btn-listen" data-audio="' + v.audio + '">▶ Écouter</button>' +
            "</div>" +
          "</div>" +
        "</div>";
    });

    // bouton d'analyse grammaticale (leçons 1–4) sur les phrases-exemples
    if (card.analysis) {
      const a = card.analysis;
      const TYPE = {
        nom: "اسم · nom", verbe: "فعل · verbe", particule: "حرف · particule", pronom: "ضمير · pronom",
      };
      let wordsHtml = "";
      a.words.forEach(function (wd) {
        wordsHtml +=
          '<div class="aw">' +
            '<span class="aw-word" dir="rtl">' + wd.w + "</span>" +
            '<span class="aw-body">' +
              '<span class="aw-type t-' + wd.type + '" dir="rtl">' + (TYPE[wd.type] || wd.type) + "</span>" +
              '<span class="aw-role" dir="ltr">' + wd.role + "</span>" +
            "</span>" +
          "</div>";
      });
      refsHtml +=
        '<div class="verse-block">' +
          '<button class="analyse-btn" data-an="1">⚙ Analyser la structure de la phrase</button>' +
          '<div class="analyse-panel" id="analyse" hidden>' +
            '<div class="analyse-phrase" dir="rtl">' + a.phrase + "</div>" +
            '<div class="analyse-words">' + wordsHtml + "</div>" +
            '<div class="analyse-take">' + a.takeaway + "</div>" +
          "</div>" +
        "</div>";
    }

    focus(
      '<div class="study story">' +
        '<div class="phase-label">' + story.titleFr + " · " + (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card story-card">' + lines +
          (refsHtml ? '<div class="verse-refs">' + refsHtml + "</div>" : "") +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Terminer" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Prophètes", function () { stopAudio(); screenStories(); }
    );

    if (i > 0) document.getElementById("prev").onclick = function () { readStory(story, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) { stopAudio(); screenStories(); } else readStory(story, i + 1);
    };
    Array.prototype.forEach.call(document.querySelectorAll(".verse-chip"), function (chip) {
      chip.onclick = function () {
        const panel = document.getElementById("panel-" + chip.getAttribute("data-ref").replace(":", "-"));
        panel.hidden = !panel.hidden;
        chip.classList.toggle("open", !panel.hidden);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".btn-listen"), function (b) {
      b.onclick = function () { playAudio(b.getAttribute("data-audio"), b); };
    });
    const anBtn = document.querySelector(".analyse-btn");
    if (anBtn) anBtn.onclick = function () {
      const p = document.getElementById("analyse");
      p.hidden = !p.hidden;
      anBtn.classList.toggle("open", !p.hidden);
    };
  }

  // =========================================================================
  //  LANCEUR DE QUIZ DYNAMIQUES (générique)
  //  cfg : { label, generate:()=>questions, saveKey, onExit }
  // =========================================================================
  function runQuiz(cfg) {
    const questions = cfg.generate();
    ask(0, 0);

    function ask(i, score) {
      if (i >= questions.length) return finish(score);
      const item = questions[i];
      const total = questions.length;
      const pct = Math.round((i / total) * 100);

      const opts = shuffle(item.options.map(function (text, idx) {
        return { text: text, correct: idx === item.answer };
      }));
      let optsHtml = "";
      opts.forEach(function (o) {
        optsHtml += '<button class="opt" data-correct="' + o.correct + '" dir="ltr">' + bidi(o.text) + "</button>";
      });

      focus(
        '<div class="study">' +
          '<div class="phase-label">' + cfg.label + " · Quiz · " + (i + 1) + "/" + total + "</div>" +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<div class="question" dir="ltr">' + bidi(item.q) + "</div>" +
          '<div class="options">' + optsHtml + "</div>" +
          '<div class="feedback" id="feedback" hidden></div>' +
          '<div class="nav-row center"><button class="btn btn-primary" id="next" hidden>' +
            (i === total - 1 ? "Voir le résultat →" : "Question suivante →") + "</button></div>" +
        "</div>",
        cfg.label, cfg.onExit
      );

      let answered = false, wasCorrect = false;
      const buttons = document.querySelectorAll(".opt");
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.onclick = function () {
          if (answered) return; answered = true;
          wasCorrect = btn.getAttribute("data-correct") === "true";
          Array.prototype.forEach.call(buttons, function (b) {
            b.disabled = true;
            if (b.getAttribute("data-correct") === "true") b.classList.add("correct");
            else if (b === btn) b.classList.add("wrong");
          });
          const fb = document.getElementById("feedback");
          fb.hidden = false;
          fb.className = "feedback " + (wasCorrect ? "ok" : "no");
          fb.innerHTML = (wasCorrect ? "✓ Bien vu ! " : "Pas tout à fait. ") + bidi(item.explain);
          document.getElementById("next").hidden = false;
        };
      });
      document.getElementById("next").onclick = function () {
        ask(i + 1, score + (wasCorrect ? 1 : 0));
      };
    }

    function finish(score) {
      const total = questions.length;
      recordScore(cfg.saveKey, score, total);
      const ratio = score / total;
      const arabic = ratio === 1 ? "ما شاء الله" : ratio >= 0.6 ? "أَحْسَنْتِ" : "وَاصِلِي";
      const msg = ratio === 1 ? "Sans faute. Tu maîtrises."
                : ratio >= 0.6 ? "Très bien. Encore un tour et ce sera parfait."
                : "C'est en révisant qu'on retient. Reprends tranquillement — tu vas y arriver.";
      focus(
        '<div class="celebrate">' +
          '<div class="mashallah" dir="rtl">' + arabic + "</div>" +
          '<div class="score-big">' + score + "<span>/" + total + "</span></div>" +
          "<p>" + msg + "</p>" +
          '<div class="result-actions">' +
            '<button class="btn btn-primary" id="again">Refaire (nouvelles questions)</button>' +
            '<button class="btn btn-ghost" id="done">Terminer</button>' +
          "</div>" +
        "</div>",
        cfg.label, cfg.onExit
      );
      document.getElementById("again").onclick = function () { runQuiz(cfg); };
      document.getElementById("done").onclick = cfg.onExit;
    }
  }

  // ---- démarrage ---------------------------------------------------------
  screenHome();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
