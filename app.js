/* =========================================================================
   Apprendre l'arabe — expérience d'apprentissage.
   Une leçon = on APPREND (cartes) puis on VÉRIFIE (quiz).
   Aucun streak, aucun délai. La progression (leçons faites, meilleur score)
   est gardée dans localStorage. On peut refaire une leçon quand on veut.
   ========================================================================= */

(function () {
  "use strict";

  const app = document.getElementById("app");
  const STORE_KEY = "arabe.progress.v2";
  const LESSONS = window.LESSONS || [];

  // ---- progression (simple, sans pression) ------------------------------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function save(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
  let state = Object.assign({ lessons: {} }, load());

  function lessonProgress(id) { return state.lessons[id] || null; }

  function recordResult(id, score, total) {
    const prev = state.lessons[id] || { best: 0 };
    state.lessons[id] = {
      completed: true,
      last: score,
      best: Math.max(prev.best || 0, score),
      total: total,
    };
    save(state);
  }

  function h(html) { app.innerHTML = html; }
  function esc(s) { return s; } // le contenu est de confiance (nos leçons)

  // =========================================================================
  //  ACCUEIL — la carte des leçons
  // =========================================================================
  function screenHome() {
    const heure = new Date().getHours();
    const salut = heure < 6 ? "As-salāmu ʿalaykum"
                : heure < 18 ? "As-salāmu ʿalaykum · prête à apprendre ?"
                : "As-salāmu ʿalaykum · une leçon ce soir ?";

    let rows = "";
    LESSONS.forEach(function (l) {
      const p = lessonProgress(l.id);
      const done = p && p.completed;
      const badge = done
        ? '<span class="badge done">✓ ' + p.best + "/" + p.total + "</span>"
        : '<span class="badge todo">À découvrir</span>';
      rows +=
        '<button class="lesson-row" data-id="' + l.id + '">' +
          '<span class="lesson-num">' + l.n + "</span>" +
          '<span class="lesson-meta">' +
            '<span class="lesson-title">' + l.title + "</span>" +
            '<span class="lesson-sub">' + l.subtitle + "</span>" +
          "</span>" +
          badge +
        "</button>";
    });

    h(
      '<div class="screen home">' +
        '<div class="bismillah">بِسْمِ اللَّه</div>' +
        "<h1>Apprendre l'arabe</h1>" +
        '<p class="greeting">' + salut + "</p>" +
        '<div class="lessons">' + rows + "</div>" +
        '<p class="footnote">Apprends à ton rythme. Reviens quand tu veux, ' +
          "refais une leçon autant que tu le souhaites. 🌱</p>" +
      "</div>"
    );

    Array.prototype.forEach.call(document.querySelectorAll(".lesson-row"), function (btn) {
      btn.onclick = function () { startLesson(btn.getAttribute("data-id")); };
    });
  }

  // =========================================================================
  //  LEÇON — phase APPRENTISSAGE
  // =========================================================================
  function startLesson(id) {
    const lesson = LESSONS.filter(function (l) { return l.id === id; })[0];
    if (!lesson) return screenHome();
    teach(lesson, 0);
  }

  function topbar(label) {
    return '<div class="topbar"><button class="btn btn-ghost" id="quit">‹ ' +
           (label || "Leçons") + "</button></div>";
  }

  function teach(lesson, i) {
    const card = lesson.cards[i];
    const total = lesson.cards.length;
    const pct = Math.round((i / total) * 100);
    const last = i === total - 1;

    h(
      topbar("Leçons") +
      '<div class="screen study">' +
        '<div class="phase-label">Leçon ' + lesson.n + " · Apprentissage · " +
          (i + 1) + "/" + total + "</div>" +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<div class="card concept" id="card">' +
          '<div class="concept-front">' + card.front + "</div>" +
          '<div class="reveal-hint" id="hint">touche pour voir l\'exemple</div>' +
          '<div class="concept-back" id="back" hidden>' +
            '<div class="example-word" dir="rtl">' + card.example + "</div>" +
            '<div class="example-explain">' + card.explain + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="nav-row">' +
          (i > 0 ? '<button class="btn btn-ghost" id="prev">‹ Précédent</button>'
                 : '<span class="spacer"></span>') +
          '<button class="btn btn-primary" id="next" hidden>' +
            (last ? "Passer au quiz →" : "Suivant →") + "</button>" +
        "</div>" +
      "</div>"
    );

    let revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      document.getElementById("back").hidden = false;
      document.getElementById("hint").style.visibility = "hidden";
      document.getElementById("next").hidden = false;
    }

    document.getElementById("quit").onclick = screenHome;
    document.getElementById("card").onclick = reveal;
    if (i > 0) document.getElementById("prev").onclick = function () { teach(lesson, i - 1); };
    document.getElementById("next").onclick = function () {
      if (last) startQuiz(lesson);
      else teach(lesson, i + 1);
    };
  }

  // =========================================================================
  //  LEÇON — phase QUIZ
  // =========================================================================
  function startQuiz(lesson) {
    quiz(lesson, 0, 0);
  }

  function quiz(lesson, i, score) {
    const item = lesson.quiz[i];
    const total = lesson.quiz.length;
    const pct = Math.round((i / total) * 100);

    let opts = "";
    item.options.forEach(function (o, idx) {
      opts += '<button class="opt" data-i="' + idx + '"><span dir="auto">' + o + "</span></button>";
    });

    h(
      topbar("Leçons") +
      '<div class="screen study">' +
        '<div class="phase-label">Leçon ' + lesson.n + " · Quiz · " +
          (i + 1) + "/" + total + "</div>" +
        '<div class="progress quiz"><span style="width:' + pct + '%"></span></div>' +
        '<div class="question">' + item.q + "</div>" +
        '<div class="options">' + opts + "</div>" +
        '<div class="feedback" id="feedback" hidden></div>' +
        '<div class="nav-row center">' +
          '<button class="btn btn-primary" id="next" hidden>' +
            (i === total - 1 ? "Voir le résultat →" : "Question suivante →") + "</button>" +
        "</div>" +
      "</div>"
    );

    document.getElementById("quit").onclick = screenHome;

    let answered = false;
    let wasCorrect = false;
    const buttons = document.querySelectorAll(".opt");
    Array.prototype.forEach.call(buttons, function (btn) {
      btn.onclick = function () {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.getAttribute("data-i"), 10);
        wasCorrect = chosen === item.answer;

        Array.prototype.forEach.call(buttons, function (b, idx) {
          b.disabled = true;
          if (idx === item.answer) b.classList.add("correct");
          else if (idx === chosen) b.classList.add("wrong");
        });

        const fb = document.getElementById("feedback");
        fb.hidden = false;
        fb.className = "feedback " + (wasCorrect ? "ok" : "no");
        fb.innerHTML = (wasCorrect ? "✓ Bien vu ! " : "Pas tout à fait. ") + item.explain;

        document.getElementById("next").hidden = false;
      };
    });

    document.getElementById("next").onclick = function () {
      const newScore = score + (wasCorrect ? 1 : 0);
      if (i === total - 1) result(lesson, newScore, total);
      else quiz(lesson, i + 1, newScore);
    };
  }

  // =========================================================================
  //  RÉSULTAT
  // =========================================================================
  function result(lesson, score, total) {
    recordResult(lesson.id, score, total);
    const ratio = score / total;
    const arabic = ratio === 1 ? "ما شاء الله" : ratio >= 0.6 ? "أَحْسَنْتِ" : "وَاصِلِي";
    const msg = ratio === 1
        ? "Sans faute. Tu maîtrises cette leçon."
        : ratio >= 0.6
        ? "Très bien. Relis les cartes signalées et tu l'auras entière."
        : "C'est en revoyant qu'on comprend. Reprends la leçon tranquillement — tu vas y arriver.";

    h(
      '<div class="screen celebrate">' +
        '<div class="mashallah">' + arabic + "</div>" +
        '<div class="score-big">' + score + "<span>/" + total + "</span></div>" +
        "<h2>Leçon " + lesson.n + " terminée</h2>" +
        "<p>" + msg + "</p>" +
        '<div class="result-actions">' +
          '<button class="btn btn-primary" id="again">Refaire le quiz</button>' +
          '<button class="btn btn-ghost" id="relearn">Revoir la leçon</button>' +
          '<button class="btn btn-ghost" id="home">Retour aux leçons</button>' +
        "</div>" +
      "</div>"
    );
    document.getElementById("again").onclick = function () { startQuiz(lesson); };
    document.getElementById("relearn").onclick = function () { teach(lesson, 0); };
    document.getElementById("home").onclick = screenHome;
  }

  // ---- démarrage ---------------------------------------------------------
  screenHome();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
