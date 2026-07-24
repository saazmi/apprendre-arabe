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

  function go(view, param) {
    if (view === "home") return screenHome();
    if (view === "grammar") return screenGrammar();
    if (view === "vocab") return screenVocab();
    if (view === "lesson") return screenLesson(param);
    if (view === "deck") return screenDeck(param);
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
      const badge = b ? '<span class="badge done">✓ ' + b.best + "/" + b.total + "</span>"
                      : '<span class="badge todo">À découvrir</span>';
      rows += '<button class="list-row" data-lesson="' + l.id + '">' +
                '<span class="list-num">' + l.n + "</span>" +
                '<span class="list-meta"><span class="list-title" dir="ltr">' + bidi(l.title) + "</span>" +
                  '<span class="list-sub" dir="ltr">' + bidi(l.subtitle) + "</span></span>" +
                badge + "</button>";
    });
    shell("grammar",
      '<div class="section-head"><h1>Grammaire</h1>' +
        '<p class="greeting">Apprends une leçon, puis révise avec un quiz.</p></div>' +
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
    Array.prototype.forEach.call(document.querySelectorAll(".list-row"), function (b) {
      b.onclick = function () { go("lesson", b.getAttribute("data-lesson")); };
    });
  }

  // ---- détail d'une leçon ------------------------------------------------
  function screenLesson(id) {
    const lesson = LESSONS.filter(l => l.id === id)[0];
    if (!lesson) return screenGrammar();
    const b = best("g:" + lesson.id);
    shell("grammar",
      '<button class="btn btn-ghost back-inline" id="tolist">‹ Toutes les leçons</button>' +
      '<div class="lesson-detail">' +
        '<div class="ld-num">' + lesson.n + "</div>" +
        '<h1 dir="ltr">' + bidi(lesson.title) + "</h1>" +
        '<p class="greeting" dir="ltr">' + bidi(lesson.subtitle) + "</p>" +
        (b ? '<p class="best-line">Meilleur score : <b>' + b.best + "/" + b.total + "</b></p>" : "") +
        '<div class="detail-actions">' +
          '<button class="btn btn-primary" id="learn">Apprendre la leçon (' + lesson.cards.length + " cartes)</button>" +
          '<button class="btn btn-soft" id="quiz">Quiz de révision (10 questions)</button>' +
        "</div>" +
      "</div>"
    );
    document.getElementById("tolist").onclick = screenGrammar;
    document.getElementById("learn").onclick = function () { teach(lesson, 0); };
    document.getElementById("quiz").onclick = function () { startLessonQuiz(lesson); };
  }

  function startLessonQuiz(lesson) {
    runQuiz({
      label: "Leçon " + lesson.n, saveKey: "g:" + lesson.id,
      generate: function () { return window.QUIZ.buildLessonQuiz(lesson.id, 10); },
      onExit: function () { screenLesson(lesson.id); },
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
          '<div class="concept-front" dir="ltr">' + bidi(card.front) + "</div>" +
          '<div class="reveal-hint" id="hint">touche pour voir l\'exemple</div>' +
          '<div class="concept-back" id="back" hidden>' +
            '<div class="example-word" dir="ltr">' + bidi(card.example).replace(/\s*·\s*/g, "<br>") + "</div>" +
            '<div class="example-explain" dir="ltr">' + bidi(card.explain) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next" hidden>' + (last ? "Passer au quiz →" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      "Leçon " + lesson.n, function () { screenLesson(lesson.id); }
    );

    let revealed = false;
    function reveal() {
      if (revealed) return; revealed = true;
      document.getElementById("back").hidden = false;
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
      const badge = b ? '<span class="badge done">✓ ' + b.best + "/" + b.total + "</span>"
                      : '<span class="badge todo">' + d.words.length + " mots</span>";
      rows += '<button class="list-row" data-deck="' + d.id + '">' +
                '<span class="list-ic" dir="rtl">كَلِمَات</span>' +
                '<span class="list-meta"><span class="list-title">' + d.title + "</span>" +
                  '<span class="list-sub">' + d.subtitle + "</span></span>" +
                badge + "</button>";
    });
    shell("vocab",
      '<div class="section-head"><h1>Vocabulaire</h1>' +
        '<p class="greeting">Parcours les cartes, puis teste-toi.</p></div>' +
      '<div class="list">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".list-row"), function (b) {
      b.onclick = function () { go("deck", b.getAttribute("data-deck")); };
    });
  }

  function screenDeck(id) {
    const deck = VOCAB.filter(d => d.id === id)[0];
    if (!deck) return screenVocab();
    const b = best("v:" + deck.id);
    shell("vocab",
      '<button class="btn btn-ghost back-inline" id="tolist">‹ Tous les jeux</button>' +
      '<div class="lesson-detail">' +
        '<div class="ld-ic" dir="rtl">كَلِمَات</div>' +
        "<h1>" + deck.title + "</h1>" +
        '<p class="greeting">' + deck.subtitle + " · " + deck.words.length + " mots</p>" +
        (b ? '<p class="best-line">Meilleur score : <b>' + b.best + "/" + b.total + "</b></p>" : "") +
        '<div class="detail-actions">' +
          '<button class="btn btn-primary" id="browse">Parcourir les cartes</button>' +
          '<button class="btn btn-soft" id="quiz">Quiz (10 questions)</button>' +
        "</div>" +
      "</div>"
    );
    document.getElementById("tolist").onclick = screenVocab;
    document.getElementById("browse").onclick = function () { browse(deck, 0); };
    document.getElementById("quiz").onclick = function () {
      runQuiz({
        label: deck.title, saveKey: "v:" + deck.id,
        generate: function () { return window.QUIZ.buildVocabQuiz(deck.id, 10); },
        onExit: function () { screenDeck(deck.id); },
      });
    };
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
          '<div class="vcard-fr" id="back" hidden>' + w.fr + "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>' : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next">' + (last ? "Terminer" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>",
      deck.title, function () { screenDeck(deck.id); }
    );

    let revealed = false;
    function reveal() {
      if (revealed) return; revealed = true;
      document.getElementById("back").hidden = false;
      document.getElementById("hint").style.visibility = "hidden";
    }
    document.getElementById("card").onclick = reveal;
    if (i > 0) document.getElementById("prev").onclick = function () { browse(deck, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) screenDeck(deck.id); else browse(deck, i + 1);
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
