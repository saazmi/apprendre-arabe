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

  // ---- progression (cloud + local mirror) --------------------------------
  //   Source of truth = Supabase (user_data.data). localStorage kept as an
  //   offline mirror so the app still renders when the network is down.
  function localLoad() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; } }
  function localSave(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (_) {} }
  // Track the newest server timestamp we know about for our own row. Used to
  // detect edits made from another device: if the cloud value is greater, we
  // adopt server state on the next refresh.
  let myLastCloudTs = "";
  function cloudSave(s) {
    localSave(s);
    if (window.Cloud && Cloud.isSignedIn()) {
      const ts = new Date().toISOString();
      myLastCloudTs = ts;
      Cloud.saveData(s, ts).catch(function (e) { console.warn("cloud save failed", e); });
    }
  }
  let state = { scores: {} };
  function best(key) { return state.scores[key] || null; }
  function recordScore(key, score, total) {
    const p = state.scores[key] || { best: 0 };
    state.scores[key] = { best: Math.max(p.best || 0, score), last: score, total: total };
    cloudSave(state);
  }
  // Card positions per lesson / vocab deck. Kind = "g" (grammar) or "v" (vocab).
  function getPos(kind, id) {
    const p = state.pos && state.pos[kind];
    return (p && typeof p[id] === "number") ? p[id] : 0;
  }
  function setPos(kind, id, i) {
    state.pos = state.pos || { g: {}, v: {} };
    state.pos[kind] = state.pos[kind] || {};
    state.pos[kind][id] = i;
    cloudSave(state);
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
    { id: "hifdh", label: "Hifdh", icon: "ح" },
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
          '<button class="nav-signout" id="signout" title="Se déconnecter">⎋</button>' +
        "</nav>" +
        '<main class="main"><div class="screen" data-view="' + active + '">' + mainHTML + "</div></main>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-nav")); };
    });
    const so = document.getElementById("signout");
    if (so) so.onclick = async function () {
      if (window.Cloud) { try { await Cloud.signOut(); } catch (_) {} }
      try { localStorage.removeItem(STORE_KEY); } catch (_) {}
      state = { scores: {} };
      screenAuth();
    };
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
    if (view === "hifdh") return screenHifdh();
    return screenHome();
  }

  // Track the current top-level view so a background refresh (triggered on
  // app focus) knows what to re-render.
  let currentView = "home";
  const _goInner = go;
  go = function (view) { currentView = view; return _goInner(view); };

  // Refresh from cloud when the app becomes visible again — the classic
  // "just opened the app after switching away" moment. Silent when nothing
  // changed; re-renders the current view only if our own row was edited
  // elsewhere, or patches the Hifdh list if the friend row changed.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible") return;
    refreshFromCloud().then(function (changed) {
      if (changed.own) return go(currentView);
      if (changed.friend && currentView === "hifdh") refreshHifdhListInPlace();
    });
  });

  // =========================================================================
  //  ACCUEIL
  // =========================================================================
  function surahSuggestion(n) {
    const meta = HIFDH_META[n - 1];
    const inAmma = n >= 78 && n <= 114;
    return { kind: "surah", n: n,
             label: "Sourate " + meta.n + " · " + meta.tr,
             sub: (inAmma ? "Juzʾ ʿAmma · " : "") + meta.ayahs + " ayat",
             go: function () { screenSurah(n); } };
  }
  function todaySuggestions() {
    const out = [];
    // 1. In-progress lessons / vocab decks — top priority
    LESSONS.forEach(function (l) {
      const pos = getPos("g", l.id);
      const total = l.cards.length;
      if (pos > 0 && pos < total) {
        out.push({ kind: "lesson", label: "Reprendre L" + l.n + " · " + l.title,
                   sub: pos + "/" + total + " cartes", go: function () { teach(l); } });
      }
    });
    VOCAB.forEach(function (d) {
      const pos = getPos("v", d.id);
      const total = d.words.length;
      if (pos > 0 && pos < total) {
        out.push({ kind: "vocab", label: "Reprendre " + d.title,
                   sub: pos + "/" + total + " cartes", go: function () { browse(d); } });
      }
    });
    // 2. Next new lesson / vocab / story (one of each, if room)
    if (out.length < 4) {
      const nextL = LESSONS.filter(function (l) { return getPos("g", l.id) === 0 && !best("g:" + l.id); })[0];
      if (nextL) out.push({ kind: "lesson", label: "Nouvelle L" + nextL.n + " · " + nextL.title,
                            sub: nextL.cards.length + " cartes", go: function () { teach(nextL); } });
    }
    if (out.length < 4) {
      const nextV = VOCAB.filter(function (d) { return getPos("v", d.id) === 0 && !best("v:" + d.id); })[0];
      if (nextV) out.push({ kind: "vocab", label: "Vocabulaire · " + nextV.title,
                            sub: nextV.words.length + " mots", go: function () { browse(nextV); } });
    }
    if (out.length < 4 && STORIES.length) {
      const s = STORIES[0];
      out.push({ kind: "story", label: "Récit — " + (s.title || s.name || ""),
                 sub: "coran & versets", go: function () { screenStories(); } });
    }
    // 3. Pad remaining slots with hifdh surahs (Juzʾ ʿAmma first, then Quran order).
    //    This is where Hifdh takes over: any leftover half-card goes to a surah.
    while (out.length < 4) {
      const already = {};
      out.forEach(function (i) { if (i.kind === "surah") already[i.n] = true; });
      let nextN = null;
      for (let n = 78; n <= 114; n++) if (!getStarts(state)[n] && !already[n]) { nextN = n; break; }
      if (!nextN) for (let n = 1; n <= 114; n++) if (!getStarts(state)[n] && !already[n]) { nextN = n; break; }
      if (!nextN) break;
      out.push(surahSuggestion(nextN));
    }
    return out.slice(0, 4);
  }

  function screenHome() {
    const heure = new Date().getHours();
    const salut = heure < 18 ? "As-salāmu ʿalaykum · prête à apprendre ?"
                             : "As-salāmu ʿalaykum · une séance ce soir ?";
    const gDone = LESSONS.filter(l => best("g:" + l.id)).length;
    const vDone = VOCAB.filter(d => best("v:" + d.id)).length;
    const todo = todaySuggestions();
    const todoHTML = todo.map(function (t, idx) {
      const ic = t.kind === "lesson" ? "ن" : t.kind === "vocab" ? "ك" : t.kind === "story" ? "ق" : "ح";
      return '<button class="home-card home-half" data-todo="' + idx + '">' +
               '<span class="home-half-ic" dir="rtl">' + ic + "</span>" +
               '<span class="home-half-txt">' +
                 '<span class="home-half-label">' + t.label + "</span>" +
                 '<span class="home-half-sub">' + t.sub + "</span>" +
               "</span>" +
             "</button>";
    }).join("");

    shell("home",
      '<div class="home">' +
        '<h1>Ahlan wa sahlan 🌙</h1>' +
        '<p class="greeting">' + salut + "</p>" +
        '<div class="home-grid">' +
          // Row 1: 3 features (each spans 2 of 6 cols)
          '<button class="home-card tile" data-go="grammar">' +
            '<div class="tile-ic" dir="rtl">نَحْو</div>' +
            '<div class="tile-t">Grammaire</div>' +
            '<div class="tile-s">' + LESSONS.length + " leçons · apprendre & réviser</div>" +
          "</button>" +
          '<button class="home-card tile" data-go="vocab">' +
            '<div class="tile-ic" dir="rtl">كَلِمَات</div>' +
            '<div class="tile-t">Vocabulaire</div>' +
            '<div class="tile-s">' + VOCAB.length + " jeux de mots · cartes & quiz</div>" +
          "</button>" +
          '<button class="home-card tile" data-go="stories">' +
            '<div class="tile-ic" dir="rtl">قَصَص</div>' +
            '<div class="tile-t">Récits du Coran</div>' +
            '<div class="tile-s">' + STORIES.length + " récit" + (STORIES.length > 1 ? "s" : "") + " · lecture & versets</div>" +
          "</button>" +
          // Row 2: Hifdh (spans 2) + 4 todo halves (spans 1 each)
          '<button class="home-card tile" data-go="hifdh">' +
            '<div class="tile-ic" dir="rtl">حِفْظ</div>' +
            '<div class="tile-t">Hifdh</div>' +
            '<div class="tile-s">Mémorisation · verset par verset</div>' +
          "</button>" +
          todoHTML +
        "</div>" +
        '<p class="footnote">Grammaire : ' + gDone + "/" + LESSONS.length +
          " · Vocabulaire : " + vDone + "/" + VOCAB.length +
          "<br>Apprends à ton rythme, reviens quand tu veux. 🌱</p>" +
      "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".tile"), function (b) {
      b.onclick = function () { go(b.getAttribute("data-go")); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-todo]"), function (b) {
      b.onclick = function () {
        const idx = parseInt(b.getAttribute("data-todo"), 10);
        if (todo[idx] && todo[idx].go) todo[idx].go();
      };
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
      const total = l.cards.length;
      const pos = Math.min(getPos("g", l.id), total);
      const cardsChip = pos > 0
        ? '<span class="cards-chip' + (pos >= total ? " done" : "") + '">' + Math.min(pos, total) + "/" + total + " cartes</span>"
        : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-lesson="' + l.id + '">' +
                  '<span class="list-num">' + l.n + "</span>" +
                  '<span class="list-meta"><span class="list-title" dir="ltr">' + bidi(l.title) + "</span>" +
                    '<span class="list-sub" dir="ltr">' + bidi(l.subtitle) + " " + cardsChip + "</span></span>" +
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
        if (l) teach(l);
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
    const total = lesson.cards.length;
    if (typeof i !== "number") i = Math.min(getPos("g", lesson.id), total - 1);
    if (i < 0) i = 0;
    setPos("g", lesson.id, i);
    const card = lesson.cards[i];
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
      if (last) { setPos("g", lesson.id, total); startLessonQuiz(lesson); }
      else teach(lesson, i + 1);
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
      const total = d.words.length;
      const pos = Math.min(getPos("v", d.id), total);
      const cardsChip = pos > 0
        ? ' <span class="cards-chip' + (pos >= total ? " done" : "") + '">' + Math.min(pos, total) + "/" + total + " cartes</span>"
        : "";
      rows += '<div class="list-row">' +
                '<button class="row-main" data-deck="' + d.id + '">' +
                  '<span class="list-ic" dir="rtl">كَلِمَات</span>' +
                  '<span class="list-meta"><span class="list-title">' + d.title + "</span>" +
                    '<span class="list-sub">' + d.subtitle + " · " + total + " mots" + cardsChip + "</span></span>" +
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
        if (d) browse(d);
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
    const total = deck.words.length;
    if (typeof i !== "number") i = Math.min(getPos("v", deck.id), total - 1);
    if (i < 0) i = 0;
    setPos("v", deck.id, i);
    const w = deck.words[i];
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
      if (last) { setPos("v", deck.id, total); screenVocab(); }
      else browse(deck, i + 1);
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

    const LOUPE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>';
    const TYPE = { nom: "اسم · nom", verbe: "فعل · verbe", particule: "حرف · particule", pronom: "ضمير · pronom" };
    function renderAn(an) {
      let w = "";
      an.words.forEach(function (wd) {
        w += '<div class="aw">' +
               '<span class="aw-word" dir="rtl">' + wd.w + "</span>" +
               '<span class="aw-body">' +
                 '<span class="aw-type t-' + wd.type + '" dir="rtl">' + (TYPE[wd.type] || wd.type) + "</span>" +
                 '<span class="aw-role" dir="ltr">' + wd.role + "</span>" +
               "</span>" +
             "</div>";
      });
      return '<div class="analyse-words">' + w + "</div>" +
             '<div class="analyse-take">' + an.takeaway + "</div>";
    }

    // chaque phrase : arabe, français grisé, et son propre bouton d'analyse
    let lines = "";
    card.ar.forEach(function (a, idx) {
      lines += '<div class="story-line">' +
        '<p class="story-ar" dir="rtl">' + a + "</p>" +
        '<p class="story-fr">' + (card.fr[idx] || "") + "</p>";
      if (card.an && card.an[idx]) {
        lines += '<button class="loupe-btn" data-target="an-' + idx + '" ' +
                   'title="Analyser la phrase" aria-label="Analyser la phrase">' + LOUPE + "</button>" +
                 '<div class="analyse-panel" id="an-' + idx + '" hidden>' +
                   '<div class="analyse-head">Analyser la phrase</div>' + renderAn(card.an[idx]) +
                 "</div>";
      }
      lines += "</div>";
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
      "Récits", function () { stopAudio(); screenStories(); }
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
    Array.prototype.forEach.call(document.querySelectorAll(".loupe-btn"), function (b) {
      b.onclick = function () {
        const p = document.getElementById(b.getAttribute("data-target"));
        p.hidden = !p.hidden;
        b.classList.toggle("open", !p.hidden);
      };
    });
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

  // =========================================================================
  //  HIFDH — mémorisation par verset
  // =========================================================================
  const HIFDH_META = window.HIFDH_META || [];
  let allRows = []; // {user_id, display_name, data} for both users, refreshed at boot

  function getAyahs(data) { return (data && data.hifdh && data.hifdh.ayahs) || {}; }
  function getStarts(data) { return (data && data.hifdh && data.hifdh.starts) || {}; }
  function getDeadlines(data) { return (data && data.hifdh && data.hifdh.deadlines) || {}; }
  function getPins(data) { return (data && data.hifdh && data.hifdh.pins) || {}; }
  function isPinned(n) { return !!(state.hifdh && state.hifdh.pins && state.hifdh.pins[n]); }
  function ensureHifdh() {
    state.hifdh = state.hifdh || { ayahs: {}, starts: {}, deadlines: {}, pins: {}, settings: {} };
    state.hifdh.ayahs = state.hifdh.ayahs || {};
    state.hifdh.starts = state.hifdh.starts || {};
    state.hifdh.deadlines = state.hifdh.deadlines || {};
    state.hifdh.pins = state.hifdh.pins || {};
    return state.hifdh;
  }
  function togglePin(n) {
    ensureHifdh();
    if (state.hifdh.pins[n]) delete state.hifdh.pins[n];
    else state.hifdh.pins[n] = true;
    commitAndCache();
  }

  function handlePinClick(pinEl) {
    const n = parseInt(pinEl.getAttribute("data-pin"), 10);
    togglePin(n);
    const rowEl = pinEl.closest("[data-surah]");
    const listEl = rowEl && rowEl.parentElement;
    if (!rowEl || !listEl) return;
    const pinnedNow = isPinned(n);
    rowEl.classList.toggle("is-pinned", pinnedNow);
    // Toggle the star class on ALL matching pin elements for this surah (row + card, if both mounted)
    Array.prototype.forEach.call(listEl.querySelectorAll('[data-pin="' + n + '"]'), function (el) {
      el.classList.toggle("pinned", pinnedNow);
    });
    // Move only this row — no innerHTML rewrite, no reflow of the other 113 rows.
    const siblings = Array.prototype.slice.call(listEl.children);
    if (pinnedNow) {
      let anchor = null;
      siblings.forEach(function (c) {
        if (c !== rowEl && c.classList.contains("is-pinned")) anchor = c;
      });
      listEl.insertBefore(rowEl, anchor ? anchor.nextSibling : listEl.firstChild);
    } else {
      let firstUnpinned = null;
      siblings.forEach(function (c) {
        if (!firstUnpinned && c !== rowEl && !c.classList.contains("is-pinned")) firstUnpinned = c;
      });
      listEl.insertBefore(rowEl, firstUnpinned);
    }
  }
  function fmtDate(iso) {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    } catch (_) { return null; }
  }
  function surahStats(data, meta) {
    const p = surahProgress(data, meta.n);
    return {
      m: p.m, l: p.l,
      remaining: meta.ayahs - p.m - p.l,
      pct: Math.round((p.m / meta.ayahs) * 100),
      startAt: getStarts(data)[meta.n] || null,
      deadline: getDeadlines(data)[meta.n] || null,
    };
  }
  function surahProgress(data, n) {
    const ayahs = getAyahs(data);
    let m = 0, l = 0;
    const prefix = n + ":";
    for (const k in ayahs) {
      if (k.slice(0, prefix.length) !== prefix) continue;
      const s = ayahs[k] && ayahs[k].s;
      if (s === "m") m++;
      else if (s === "l") l++;
    }
    return { m: m, l: l };
  }
  function overallProgress(data) {
    const ayahs = getAyahs(data);
    let m = 0, l = 0;
    for (const k in ayahs) {
      const s = ayahs[k] && ayahs[k].s;
      if (s === "m") m++;
      else if (s === "l") l++;
    }
    return { m: m, l: l, total: 6236 };
  }
  function otherRow() {
    const me = window.Cloud ? Cloud.currentUserId() : null;
    return allRows.filter(r => r.user_id !== me)[0] || null;
  }
  function friendData() { const r = otherRow(); return r && r.data || {}; }
  function friendName() {
    const r = otherRow();
    return (r && r.display_name) || "Autre";
  }
  function lastActivityAt(data, n) {
    const ayahs = getAyahs(data);
    const prefix = n + ":";
    let best = null;
    for (const k in ayahs) {
      if (k.slice(0, prefix.length) !== prefix) continue;
      const t = ayahs[k] && ayahs[k].mAt;
      if (t && (!best || t > best)) best = t;
    }
    const start = getStarts(data)[n];
    if (start && (!best || start > best)) best = start;
    return best;
  }

  function applyAyahMutation(surah, ayah, next) {
    // Mutates state.hifdh in place. No save. Returns nothing.
    ensureHifdh();
    const key = surah + ":" + ayah;
    const cur = state.hifdh.ayahs[key] || null;
    if (next === "none") {
      delete state.hifdh.ayahs[key];
    } else {
      const rec = cur ? Object.assign({}, cur) : {};
      rec.s = next;
      if (next === "m" && !rec.mAt) rec.mAt = new Date().toISOString();
      state.hifdh.ayahs[key] = rec;
      if (!state.hifdh.starts[surah]) state.hifdh.starts[surah] = new Date().toISOString();
    }
  }
  function commitAndCache() {
    const me = Cloud && Cloud.currentUserId();
    const mine = allRows.filter(r => r.user_id === me)[0];
    if (mine) mine.data = state;
    cloudSave(state);
  }
  function surahHasAnyAyah(n) {
    const ayahs = state.hifdh && state.hifdh.ayahs;
    if (!ayahs) return false;
    const prefix = n + ":";
    for (const k in ayahs) if (k.slice(0, prefix.length) === prefix) return true;
    return false;
  }
  function cleanupStart(n) {
    if (state.hifdh && state.hifdh.starts && !surahHasAnyAyah(n)) {
      delete state.hifdh.starts[n];
    }
  }
  function setAyahState(surah, ayah, next) {
    applyAyahMutation(surah, ayah, next);
    cleanupStart(surah);
    commitAndCache();
  }
  function setRange(surah, from, to, next) {
    if (from > to) { const t = from; from = to; to = t; }
    for (let a = from; a <= to; a++) applyAyahMutation(surah, a, next);
    cleanupStart(surah);
    commitAndCache();
  }
  function setDeadline(surah, iso) {
    ensureHifdh();
    if (iso) state.hifdh.deadlines[surah] = iso;
    else delete state.hifdh.deadlines[surah];
    commitAndCache();
  }
  function nextState(cur) {
    if (!cur || !cur.s) return "l";
    if (cur.s === "l") return "m";
    return "none";
  }

  // sort: null (canonical) or { key: "progress"|"activity"|"deadline", dir: "asc"|"desc" }
  let hifdhSort = null;
  let hideCompleted = false;
  let hideNotStarted = false;
  let onlyJuzAmma = false; // surahs 78..114
  let searchOpen = false;
  let searchQuery = "";

  function normLatin(s) {
    return String(s).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip combining diacritics
      .replace(/[ʾʿʼʻ]/g, "")         // hamza / ayn modifier letters
      .replace(/[^a-z0-9 ]+/g, "");
  }
  function surahMatchesQuery(s, q) {
    if (!q) return true;
    const qn = normLatin(q);
    if (qn && normLatin(s.tr).indexOf(qn) !== -1) return true;
    // Arabic branch: strip harakat + article via normAr
    const qa = normAr(q).trim();
    if (qa && normAr(s.ar).indexOf(qa) !== -1) return true;
    return false;
  }

  function filteredSurahs() {
    let list = HIFDH_META.slice();
    if (onlyJuzAmma) list = list.filter(s => s.n >= 78 && s.n <= 114);
    if (hideCompleted) list = list.filter(s => surahStats(state, s).m < s.ayahs);
    if (hideNotStarted) list = list.filter(s => !!getStarts(state)[s.n]);
    if (searchQuery.trim()) list = list.filter(s => surahMatchesQuery(s, searchQuery));
    if (hifdhSort) {
      const key = hifdhSort.key;
      const dir = hifdhSort.dir === "asc" ? 1 : -1;
      list.sort(function (a, b) {
        const va = surahKey(a, key);
        const vb = surahKey(b, key);
        if (va == null && vb == null) return a.n - b.n;
        if (va == null) return 1;
        if (vb == null) return -1;
        if (va < vb) return -1 * dir;
        if (va > vb) return  1 * dir;
        return a.n - b.n;
      });
    }
    // Z-tier: pinned always come first, preserving their filtered/sorted order.
    const pinned = [], other = [];
    list.forEach(function (s) { (isPinned(s.n) ? pinned : other).push(s); });
    return pinned.concat(other);
  }
  function surahKey(meta, key) {
    const st = surahStats(state, meta);
    if (key === "progress") {
      if (st.m === 0 && st.l === 0) return null;
      return st.pct + st.l / meta.ayahs * 0.001;
    }
    if (key === "activity") return lastActivityAt(state, meta.n);
    if (key === "deadline") return st.deadline || null;
    return meta.n;
  }
  function cycleSort(key) {
    if (!hifdhSort || hifdhSort.key !== key) hifdhSort = { key: key, dir: "desc" };
    else if (hifdhSort.dir === "desc") hifdhSort = { key: key, dir: "asc" };
    else hifdhSort = null;
  }
  function sortArrow(key) {
    if (!hifdhSort || hifdhSort.key !== key) return "";
    return hifdhSort.dir === "desc" ? " ↓" : " ↑";
  }

  function pinIconHTML(n) {
    const pinned = isPinned(n);
    return '<span class="hf-pin' + (pinned ? " pinned" : "") +
      '" data-pin="' + n + '" title="' + (pinned ? "Désépingler" : "Épingler") + '">★</span>';
  }

  function surahCardHTML(s) {
    const me = surahStats(state, s);
    const myM = (me.m / s.ayahs) * 100;
    const myL = (me.l / s.ayahs) * 100;
    const started = me.startAt ? fmtDate(me.startAt) : null;
    const due = me.deadline ? fmtDate(me.deadline) : null;
    const active = me.m > 0 || me.l > 0;
    return '<button class="hf-card' + (active ? " is-active" : "") + (isPinned(s.n) ? " is-pinned" : "") + '" data-surah="' + s.n + '">' +
      pinIconHTML(s.n) +
      '<div class="hf-card-num">#' + s.n + "</div>" +
      '<div class="hf-card-ar" dir="rtl">' + s.ar + "</div>" +
      '<div class="hf-card-tr">' + s.tr + "</div>" +
      '<div class="hf-card-pct">' + me.pct + "%</div>" +
      '<div class="hf-bar hf-mine hf-card-bar">' +
        '<span class="seg-m" style="width:' + myM + '%"></span>' +
        '<span class="seg-l" style="width:' + myL + '%"></span>' +
      "</div>" +
      '<div class="hf-card-chips">' +
        '<span class="hf-chip hf-chip-m">' + me.m + "</span>" +
        '<span class="hf-chip hf-chip-l">' + me.l + "</span>" +
        '<span class="hf-chip hf-chip-r">' + me.remaining + "</span>" +
      "</div>" +
      (due ? '<div class="hf-card-dates"><b class="hf-due">Deadline ' + due + "</b></div>"
           : started ? '<div class="hf-card-dates">débuté ' + started + "</div>" : "") +
    "</button>";
  }

  function surahRowHTML(s) {
    const me = surahStats(state, s);
    const myM = (me.m / s.ayahs) * 100;
    const myL = (me.l / s.ayahs) * 100;
    const started = me.startAt ? fmtDate(me.startAt) : null;
    const due = me.deadline ? fmtDate(me.deadline) : null;
    const dates = [
      started ? "débuté " + started : null,
      due ? '<b class="hf-due">Deadline ' + due + "</b>" : null,
    ].filter(Boolean).join(" · ");
    const active = me.m > 0 || me.l > 0;
    return '<button class="hf-row' + (active ? " is-active" : "") + (isPinned(s.n) ? " is-pinned" : "") + '" data-surah="' + s.n + '">' +
        pinIconHTML(s.n) +
        '<span class="hf-num">' + s.n + "</span>" +
        '<span class="hf-main">' +
          '<span class="hf-title-row">' +
            '<span class="hf-ar" dir="rtl">' + s.ar + "</span>" +
            '<span class="hf-tr">' + s.tr + " · " + s.ayahs + " ayat</span>" +
          "</span>" +
          '<span class="hf-stats">' +
            '<span class="hf-pct">' + me.pct + "%</span>" +
            '<span class="hf-chip hf-chip-m">' + me.m + " mém.</span>" +
            '<span class="hf-chip hf-chip-l">' + me.l + " en cours</span>" +
            '<span class="hf-chip hf-chip-r">' + me.remaining + " restants</span>" +
          "</span>" +
          (dates ? '<span class="hf-dates">' + dates + "</span>" : "") +
        "</span>" +
        '<span class="hf-bars">' +
          '<span class="hf-bar hf-mine">' +
            '<span class="seg-m" style="width:' + myM + '%"></span>' +
            '<span class="seg-l" style="width:' + myL + '%"></span>' +
          "</span>" +
        "</span>" +
      "</button>";
  }

  function refreshHifdhListInPlace() {
    const listEl = document.querySelector(".hf-list");
    if (!listEl) return false;
    const view = getHifdhView();
    const list = filteredSurahs();
    listEl.className = "hf-list" + (view === "gallery" ? " is-gallery" : "");
    listEl.innerHTML = view === "gallery"
      ? list.map(surahCardHTML).join("")
      : list.map(surahRowHTML).join("");
    Array.prototype.forEach.call(listEl.querySelectorAll("[data-surah]"), function (b) {
      b.onclick = function (e) {
        if (e.target && e.target.closest && e.target.closest("[data-pin]")) return;
        screenSurah(parseInt(b.getAttribute("data-surah"), 10));
      };
    });
    Array.prototype.forEach.call(listEl.querySelectorAll("[data-pin]"), function (p) {
      p.onclick = function (e) { e.stopPropagation(); handlePinClick(p); };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-sort"), function (b) {
      const key = b.getAttribute("data-sort");
      const active = hifdhSort && hifdhSort.key === key;
      b.classList.toggle("active", active);
      const label = key === "progress" ? "Progression" : key === "activity" ? "Récente" : "Deadline";
      b.textContent = label + sortArrow(key);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-viewtoggle button"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === view);
    });
    return true;
  }

  // Pull fresh rows from Supabase. Adopts a newer own row (edited elsewhere)
  // only when its updated_at is strictly greater than what we last wrote.
  // Always updates the friend row. Returns which parts changed.
  async function refreshFromCloud() {
    if (!window.Cloud || !Cloud.isSignedIn()) return { own: false, friend: false };
    try {
      const rows = await Cloud.loadAll();
      const me = Cloud.currentUserId();
      const newOwn = (rows || []).filter(r => r.user_id === me)[0] || null;
      const newFriend = (rows || []).filter(r => r.user_id !== me)[0] || null;
      const oldFriend = (allRows || []).filter(r => r.user_id !== me)[0] || null;
      let ownChanged = false;
      let friendChanged = false;
      if (newFriend && (!oldFriend || newFriend.updated_at !== oldFriend.updated_at ||
                        (newFriend.display_name !== (oldFriend && oldFriend.display_name)))) {
        friendChanged = true;
      }
      if (newOwn && newOwn.updated_at && (!myLastCloudTs || newOwn.updated_at > myLastCloudTs)) {
        state = Object.assign({ scores: {} }, newOwn.data || {});
        myLastCloudTs = newOwn.updated_at;
        localSave(state);
        ownChanged = true;
      }
      allRows = rows || [];
      return { own: ownChanged, friend: friendChanged };
    } catch (e) {
      console.warn("refresh from cloud failed", e);
      return { own: false, friend: false };
    }
  }

  function screenHifdh() {
    const my = overallProgress(state);
    const fr = overallProgress(friendData());
    const view = getHifdhView();
    const list = filteredSurahs();
    const rows = view === "gallery" ? list.map(surahCardHTML).join("") : list.map(surahRowHTML).join("");
    const sortBtn = function (key, label) {
      const active = hifdhSort && hifdhSort.key === key;
      return '<button class="hf-sort' + (active ? " active" : "") + '" data-sort="' + key + '">' +
             label + sortArrow(key) + "</button>";
    };
    shell("hifdh",
      '<div class="section-head"><h1>Hifdh</h1>' +
        '<p class="greeting">' +
          '<a class="hf-who" data-stats="me">Moi</a> : ' + my.m + " mémorisés · " + my.l + " en cours" +
          ' &nbsp;·&nbsp; ' +
          '<a class="hf-who" data-stats="other">' + friendName() + "</a> : " + fr.m + " mémorisés · " + fr.l + " en cours" +
        "</p>" +
      "</div>" +
      '<div class="hf-sortbar">' +
        '<span class="hf-sort-lbl">Trier :</span>' +
        sortBtn("progress", "Progression") +
        sortBtn("activity", "Récente") +
        sortBtn("deadline", "Deadline") +
      "</div>" +
      '<div class="hf-filterbar">' +
        '<button class="hf-search-toggle' + (searchOpen ? " open" : "") + '" id="hf-search-toggle" title="Rechercher">⌕</button>' +
        (searchOpen
          ? '<input type="search" class="hf-search-input" id="hf-search-input" placeholder="Sourate (arabe ou translit.)" value="' + searchQuery.replace(/"/g, "&quot;") + '">'
          : "") +
        '<label class="hf-check"><input type="checkbox" id="hf-only-amma"' + (onlyJuzAmma ? " checked" : "") + "><span>Juzʾ ʿAmma</span></label>" +
        '<label class="hf-check"><input type="checkbox" id="hf-hide-done"' + (hideCompleted ? " checked" : "") + "><span>Cacher terminées</span></label>" +
        '<label class="hf-check"><input type="checkbox" id="hf-hide-untouched"' + (hideNotStarted ? " checked" : "") + "><span>Cacher non commencées</span></label>" +
        '<div class="hf-viewtoggle">' +
          '<button data-view="list"' + (view === "list" ? " class=\"active\"" : "") + '>Liste</button>' +
          '<button data-view="gallery"' + (view === "gallery" ? " class=\"active\"" : "") + '>Galerie</button>' +
        "</div>" +
      "</div>" +
      '<div class="hf-list' + (view === "gallery" ? " is-gallery" : "") + '">' + rows + "</div>"
    );
    Array.prototype.forEach.call(document.querySelectorAll(".hf-list [data-surah]"), function (b) {
      b.onclick = function (e) {
        if (e.target && e.target.closest && e.target.closest("[data-pin]")) return;
        screenSurah(parseInt(b.getAttribute("data-surah"), 10));
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-list [data-pin]"), function (p) {
      p.onclick = function (e) {
        e.stopPropagation();
        togglePin(parseInt(p.getAttribute("data-pin"), 10));
        refreshHifdhListInPlace();
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-sort"), function (b) {
      b.onclick = function () { cycleSort(b.getAttribute("data-sort")); refreshHifdhListInPlace(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-viewtoggle button"), function (b) {
      b.onclick = function () { setHifdhView(b.getAttribute("data-view")); refreshHifdhListInPlace(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".hf-who"), function (a) {
      a.onclick = function () { screenStats(a.getAttribute("data-stats")); };
    });
    const hd = document.getElementById("hf-hide-done");
    if (hd) hd.onchange = function () { hideCompleted = hd.checked; refreshHifdhListInPlace(); };
    const hu = document.getElementById("hf-hide-untouched");
    if (hu) hu.onchange = function () { hideNotStarted = hu.checked; refreshHifdhListInPlace(); };
    const ha = document.getElementById("hf-only-amma");
    if (ha) ha.onchange = function () { onlyJuzAmma = ha.checked; refreshHifdhListInPlace(); };

    const st = document.getElementById("hf-search-toggle");
    if (st) st.onclick = function () {
      searchOpen = !searchOpen;
      if (!searchOpen) searchQuery = "";
      screenHifdh();
      if (searchOpen) {
        const inp = document.getElementById("hf-search-input");
        if (inp) inp.focus();
      }
    };
    const si = document.getElementById("hf-search-input");
    if (si) si.oninput = function () { searchQuery = si.value; refreshHifdhListInPlace(); };
  }

  // =========================================================================
  //  HIFDH — page statistiques (heatmap + tableau)
  // =========================================================================
  // Juz boundaries — first (surah,ayah) of each juz (Hafs). Juz 1..30.
  const JUZ_STARTS = [
    [1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],
    [9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],
    [29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]
  ];
  function juzOf(surah, ayah) {
    for (let j = JUZ_STARTS.length - 1; j >= 0; j--) {
      const s = JUZ_STARTS[j][0], a = JUZ_STARTS[j][1];
      if (surah > s || (surah === s && ayah >= a)) return j + 1;
    }
    return 1;
  }

  function statsForData(data) {
    const ayahs = getAyahs(data);
    let m = 0, l = 0;
    const perDay = {};
    const perJuz = {}; // juz → { m, l }
    for (const k in ayahs) {
      const rec = ayahs[k];
      const parts = k.split(":");
      const sn = parseInt(parts[0], 10);
      const an = parseInt(parts[1], 10);
      const j = juzOf(sn, an);
      perJuz[j] = perJuz[j] || { m: 0, l: 0 };
      if (rec.s === "m") {
        m++;
        perJuz[j].m++;
        if (rec.mAt) { const d = rec.mAt.slice(0,10); perDay[d] = (perDay[d] || 0) + 1; }
      } else if (rec.s === "l") {
        l++;
        perJuz[j].l++;
      }
    }

    // Streaks + activity
    const dates = Object.keys(perDay).sort();
    let bestDay = 0, bestDate = null;
    dates.forEach(function (d) {
      if (perDay[d] > bestDay) { bestDay = perDay[d]; bestDate = d; }
    });
    const daysActive = dates.length;
    const firstDate = dates[0] || null;
    // Current + longest streak (consecutive calendar days with ≥1 memorized ayah)
    let longest = 0, cur = 0, prev = null;
    dates.forEach(function (d) {
      if (prev) {
        const gap = Math.round((new Date(d) - new Date(prev)) / 86400000);
        if (gap === 1) cur++;
        else cur = 1;
      } else cur = 1;
      if (cur > longest) longest = cur;
      prev = d;
    });
    // Current streak: only if the last active day is today or yesterday
    let currentStreak = 0;
    if (dates.length) {
      const today = new Date(); today.setHours(0,0,0,0);
      let cursor = new Date(today);
      const hasDay = function (d) { return !!perDay[d.toISOString().slice(0,10)]; };
      if (!hasDay(cursor)) cursor.setDate(cursor.getDate() - 1);
      while (hasDay(cursor)) { currentStreak++; cursor.setDate(cursor.getDate() - 1); }
    }

    // Averages / cadence
    const now = new Date(); now.setHours(0,0,0,0);
    function sumOverLastNDays(n) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        sum += perDay[d.toISOString().slice(0,10)] || 0;
      }
      return sum;
    }
    const last7 = sumOverLastNDays(7);
    const last30 = sumOverLastNDays(30);
    const avg7 = last7 / 7;
    const avg30 = last30 / 30;
    // Pace (ayahs / week over last 4 weeks)
    const pace4w = sumOverLastNDays(28) / 4;

    // ETA: at recent rate (prefer last 30 avg, fallback last 7)
    const rate = avg30 || avg7 || 0;
    const remaining = 6236 - m;
    const etaDays = rate > 0 ? Math.ceil(remaining / rate) : null;
    let etaDate = null;
    if (etaDays !== null) {
      const dt = new Date(now); dt.setDate(dt.getDate() + etaDays);
      etaDate = dt.toISOString().slice(0,10);
    }

    return {
      m: m, l: l,
      remaining: 6236 - m - l,
      pct: Math.round(m / 6236 * 100),
      perDay: perDay,
      perJuz: perJuz,
      bestDay: bestDay, bestDate: bestDate,
      daysActive: daysActive, firstDate: firstDate,
      currentStreak: currentStreak, longestStreak: longest,
      last7: last7, last30: last30, avg7: avg7, avg30: avg30, pace4w: pace4w,
      etaDays: etaDays, etaDate: etaDate,
    };
  }
  function activeSurahs(data) {
    const list = [];
    HIFDH_META.forEach(function (meta) {
      const st = surahStats(data, meta);
      if (st.m || st.l) list.push({ meta: meta, st: st });
    });
    list.sort(function (a, b) {
      if (b.st.pct !== a.st.pct) return b.st.pct - a.st.pct;
      return a.meta.n - b.meta.n;
    });
    return list;
  }
  function heatmapHTML(perDay, weeks) {
    weeks = weeks || 26;
    const days = weeks * 7;
    const today = new Date();
    // align so the last column is the current week; start day = today - (days-1)
    const start = new Date(today);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - (days - 1));
    // find max count for scaling
    let max = 0;
    for (const k in perDay) if (perDay[k] > max) max = perDay[k];
    function shade(c) {
      if (!c) return "hm-c0";
      const r = c / (max || 1);
      if (r < 0.25) return "hm-c1";
      if (r < 0.5)  return "hm-c2";
      if (r < 0.75) return "hm-c3";
      return "hm-c4";
    }
    let cells = "";
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = d.toISOString().slice(0,10);
      const c = perDay[iso] || 0;
      cells += '<i class="hm-cell ' + shade(c) + '" title="' + iso + ' · ' + c + ' ayat"></i>';
    }
    return '<div class="hm-grid">' + cells + "</div>" +
           '<div class="hm-legend"><span>Moins</span>' +
             '<i class="hm-cell hm-c0"></i><i class="hm-cell hm-c1"></i><i class="hm-cell hm-c2"></i><i class="hm-cell hm-c3"></i><i class="hm-cell hm-c4"></i>' +
             '<span>Plus</span></div>';
  }

  function tile(value, label, sub, metric, color) {
    return '<button class="stat-tile" data-metric="' + metric + '" style="--tile-color:' + color + '">' +
             '<div class="stat-val">' + value + "</div>" +
             '<div class="stat-lbl">' + label + "</div>" +
             (sub ? '<div class="stat-sub">' + sub + "</div>" : "") +
           "</button>";
  }

  function dailyCounts(perDay, days) {
    const now = new Date(); now.setHours(0,0,0,0);
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0,10);
      out.push({ label: iso.slice(5), c: perDay[iso] || 0 });
    }
    return out;
  }
  function weeklyCounts(perDay, weeks) {
    const now = new Date(); now.setHours(0,0,0,0);
    const out = [];
    for (let w = weeks - 1; w >= 0; w--) {
      let sum = 0;
      let endDate = null;
      for (let d = 0; d < 7; d++) {
        const dt = new Date(now);
        dt.setDate(dt.getDate() - w * 7 - d);
        const iso = dt.toISOString().slice(0,10);
        sum += perDay[iso] || 0;
        if (d === 0) endDate = iso;
      }
      out.push({ label: "S" + (weeks - w), c: sum });
    }
    return out;
  }
  function cumulativeMemorized(perDay) {
    const dates = Object.keys(perDay).sort();
    if (!dates.length) return [];
    const start = new Date(dates[0]); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(0,0,0,0);
    const out = [];
    let sum = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0,10);
      sum += perDay[iso] || 0;
      out.push({ label: iso, c: sum });
    }
    return out;
  }
  function barChartSVG(data, color, highlightMax) {
    const W = 400, H = 180, pad = 22;
    const max = Math.max(1, ...data.map(x => x.c));
    const n = data.length || 1;
    const bw = (W - pad*2) / n;
    let bars = "";
    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const h = d.c > 0 ? Math.max(1.5, ((H - pad*2) * d.c) / max) : 0;
      const x = pad + i*bw + 1;
      const y = H - pad - h;
      const isMax = highlightMax && d.c === max && max > 0;
      const col = isMax ? "var(--again)" : color;
      const op = isMax ? 1 : 0.9;
      bars += '<rect x="' + x + '" y="' + y + '" width="' + Math.max(1, bw - 2) + '" height="' + h + '" rx="1.5" fill="' + col + '" opacity="' + op + '"></rect>';
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="chart">' +
      bars +
      '<line x1="' + pad + '" y1="' + (H-pad) + '" x2="' + (W-pad) + '" y2="' + (H-pad) + '" stroke="rgba(157,177,216,0.25)"/>' +
      '<text x="' + pad + '" y="' + (pad - 6) + '" fill="rgba(157,177,216,0.7)" font-size="10">max ' + max + "</text>" +
    "</svg>";
  }
  function lineChartSVG(data, color, goal) {
    const W = 400, H = 180, pad = 22;
    const max = goal || Math.max(1, ...data.map(x => x.c));
    const n = data.length || 1;
    const step = (W - pad*2) / Math.max(1, n - 1);
    let path = "";
    for (let i = 0; i < data.length; i++) {
      const x = pad + i*step;
      const y = H - pad - (H - pad*2) * data[i].c / max;
      path += (i === 0 ? "M " : " L ") + x.toFixed(1) + " " + y.toFixed(1);
    }
    const last = data[data.length - 1];
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" class="chart">' +
      '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      '<line x1="' + pad + '" y1="' + (H-pad) + '" x2="' + (W-pad) + '" y2="' + (H-pad) + '" stroke="rgba(157,177,216,0.25)"/>' +
      (goal ? '<line x1="' + pad + '" y1="' + (pad) + '" x2="' + (W-pad) + '" y2="' + (pad) + '" stroke="rgba(231,201,118,0.4)" stroke-dasharray="4 4"/><text x="' + (W-pad) + '" y="' + (pad-4) + '" text-anchor="end" fill="rgba(231,201,118,0.7)" font-size="10">6236</text>' : "") +
      (last ? '<text x="' + pad + '" y="' + (pad - 6) + '" fill="rgba(157,177,216,0.7)" font-size="10">total ' + last.c + "</text>" : "") +
    "</svg>";
  }
  function metricGraph(metricKey, s) {
    switch (metricKey) {
      case "series":  return barChartSVG(dailyCounts(s.perDay, 30), "var(--good)");
      case "active":  return barChartSVG(dailyCounts(s.perDay, 90), "var(--gold)");
      case "avg7":    return barChartSVG(dailyCounts(s.perDay, 7),  "var(--emerald)");
      case "avg30":   return barChartSVG(dailyCounts(s.perDay, 30), "var(--good)");
      case "pace":    return barChartSVG(weeklyCounts(s.perDay, 12), "var(--gold)");
      case "best":    return barChartSVG(dailyCounts(s.perDay, 90), "var(--again)", true);
      case "eta":     return lineChartSVG(cumulativeMemorized(s.perDay), "var(--emerald)", 6236);
    }
    return "";
  }
  function metricCaption(metricKey) {
    return {
      series:  "Activité — 30 derniers jours",
      active:  "Activité — 90 derniers jours",
      avg7:    "Ayat mémorisés — 7 derniers jours",
      avg30:   "Ayat mémorisés — 30 derniers jours",
      pace:    "Cadence hebdomadaire — 12 dernières semaines",
      best:    "Meilleur jour — 90 derniers jours",
      eta:     "Progression cumulée vers 6236",
    }[metricKey] || "";
  }
  function juzHTML(perJuz) {
    let html = '<div class="juz-grid">';
    for (let j = 1; j <= 30; j++) {
      const p = perJuz[j] || { m: 0, l: 0 };
      // ayah counts per juz aren't uniform; use % of memorized ratio vs local total we have.
      // Approx: 6236/30 ≈ 207 ayahs per juz. We just show m/l counts + a small bar.
      const total = 207;
      const mPct = Math.min(100, (p.m / total) * 100);
      const lPct = Math.min(100, (p.l / total) * 100);
      html += '<div class="juz-cell" title="Juz ' + j + " · " + p.m + " mém. · " + p.l + ' en cours">' +
                '<div class="juz-n">' + j + "</div>" +
                '<div class="juz-bar"><span class="seg-m" style="width:' + mPct + '%"></span>' +
                                     '<span class="seg-l" style="width:' + lPct + '%"></span></div>' +
                '<div class="juz-count">' + p.m + "</div>" +
              "</div>";
    }
    return html + "</div>";
  }

  // Preference: gallery vs list for the Hifdh surah page. Persisted.
  function getHifdhView() { try { return localStorage.getItem("hifdh.view") || "list"; } catch (_) { return "list"; } }
  function setHifdhView(v) { try { localStorage.setItem("hifdh.view", v); } catch (_) {} }

  function activeSurahRowHTML(x) {
    const started = x.st.startAt ? fmtDate(x.st.startAt) : "—";
    const due = x.st.deadline ? fmtDate(x.st.deadline) : "—";
    return "<tr>" +
      '<td class="st-num">' + x.meta.n + "</td>" +
      '<td class="st-name"><span dir="rtl">' + x.meta.ar + "</span><br><small>" + x.meta.tr + "</small></td>" +
      "<td>" + x.st.pct + "%</td>" +
      "<td>" + x.st.m + "</td>" +
      "<td>" + x.st.l + "</td>" +
      "<td>" + x.st.remaining + "</td>" +
      "<td>" + started + "</td>" +
      "<td>" + due + "</td>" +
    "</tr>";
  }
  function activeSurahCardHTML(x) {
    const started = x.st.startAt ? fmtDate(x.st.startAt) : null;
    const due = x.st.deadline ? fmtDate(x.st.deadline) : null;
    const myM = (x.st.m / x.meta.ayahs) * 100;
    const myL = (x.st.l / x.meta.ayahs) * 100;
    return '<div class="stat-card">' +
      '<div class="stat-card-head">' +
        '<div class="stat-card-num">#' + x.meta.n + "</div>" +
        '<div class="stat-card-ar" dir="rtl">' + x.meta.ar + "</div>" +
        '<div class="stat-card-tr">' + x.meta.tr + "</div>" +
      "</div>" +
      '<div class="stat-card-pct">' + x.st.pct + "%</div>" +
      '<div class="hf-bar hf-mine stat-card-bar">' +
        '<span class="seg-m" style="width:' + myM + '%"></span>' +
        '<span class="seg-l" style="width:' + myL + '%"></span>' +
      "</div>" +
      '<div class="stat-card-chips">' +
        '<span class="hf-chip hf-chip-m">' + x.st.m + " mém.</span>" +
        '<span class="hf-chip hf-chip-l">' + x.st.l + " en cours</span>" +
        '<span class="hf-chip hf-chip-r">' + x.st.remaining + " restants</span>" +
      "</div>" +
      (started || due ?
        '<div class="stat-card-dates">' +
          (started ? "débuté " + started : "") +
          (started && due ? " · " : "") +
          (due ? '<b class="hf-due">Deadline ' + due + "</b>" : "") +
        "</div>"
      : "") +
    "</div>";
  }

  function screenStats(who) {
    const isMe = who === "me";
    const data = isMe ? state : friendData();
    const name = isMe ? "Moi" : friendName();
    const s = statsForData(data);
    const active = activeSurahs(data);
    const listBody = active.length
      ? '<div class="stats-tablewrap"><table class="stats-table">' +
        "<thead><tr><th>#</th><th>Sourate</th><th>%</th><th>Mém.</th><th>En cours</th><th>Restants</th><th>Débuté</th><th>Deadline</th></tr></thead>" +
        "<tbody>" + active.map(activeSurahRowHTML).join("") + "</tbody></table></div>"
      : '<p class="stats-empty">Rien encore. Commence par une petite sourate 🌱</p>';

    const streakVal = s.currentStreak > 0 ? (s.currentStreak + " j") : "0 j";
    const streakSub = s.currentStreak > 0
      ? (s.longestStreak > s.currentStreak ? ("record : " + s.longestStreak + " j") : "record personnel")
      : "reprends aujourd’hui";
    const etaVal = s.etaDays ? (s.etaDays + " j") : "—";
    const etaSub = s.etaDays ? ("≈ " + fmtDate(s.etaDate)) : "avance à ton rythme";

    let selected = "series";

    focus(
      '<div class="stats-wrap">' +
        '<div class="stats-head">' +
          "<h1>Statistiques · " + name + "</h1>" +
          '<p class="stats-sum">' +
            '<span class="hf-pct big">' + s.pct + "%</span> " +
            '<span class="hf-chip hf-chip-m">' + s.m + " mémorisés</span> " +
            '<span class="hf-chip hf-chip-l">' + s.l + " en cours</span> " +
            '<span class="hf-chip hf-chip-r">' + s.remaining + " restants</span>" +
          "</p>" +
        "</div>" +

        '<section class="stats-section">' +
          "<h2>Chiffres clés <span class=\"stats-hint\">— touche une carte pour tracer</span></h2>" +
          '<div class="stat-grid">' +
            tile(streakVal, "Série", streakSub, "series", "var(--good)") +
            tile(s.daysActive, "Jours actifs", s.firstDate ? ("depuis " + fmtDate(s.firstDate)) : "—", "active", "var(--gold)") +
            tile(s.avg7.toFixed(1), "Moy. / jour (7 j)", s.last7 + " ayat / 7 j", "avg7", "var(--emerald)") +
            tile(s.avg30.toFixed(1), "Moy. / jour (30 j)", s.last30 + " ayat / 30 j", "avg30", "var(--good)") +
            tile(s.pace4w.toFixed(0), "Cadence hebdo", "ayat / semaine (4 sem.)", "pace", "var(--gold)") +
            tile(s.bestDay, "Meilleur jour", s.bestDate ? fmtDate(s.bestDate) : "—", "best", "var(--again)") +
            tile(etaVal, "Achèvement estimé", etaSub, "eta", "var(--emerald)") +
          "</div>" +
        "</section>" +

        '<section class="stats-section">' +
          "<h2>Sourates en cours (" + active.length + ")</h2>" +
          listBody +
        "</section>" +

        '<section class="stats-section stats-bottom">' +
          '<div class="stats-bottom-grid">' +
            '<div class="stats-panel">' +
              '<h3 id="graph-caption">' + metricCaption(selected) + "</h3>" +
              '<div id="graph-slot">' + metricGraph(selected, s) + "</div>" +
            "</div>" +
            '<div class="stats-panel">' +
              "<h3>Heatmap — 26 dernières semaines</h3>" +
              heatmapHTML(s.perDay) +
            "</div>" +
          "</div>" +
        "</section>" +
      "</div>",
      "Hifdh", screenHifdh
    );

    function markSelected() {
      Array.prototype.forEach.call(document.querySelectorAll(".stat-tile"), function (t) {
        t.classList.toggle("selected", t.getAttribute("data-metric") === selected);
      });
    }
    markSelected();
    Array.prototype.forEach.call(document.querySelectorAll(".stat-tile"), function (t) {
      t.onclick = function () {
        selected = t.getAttribute("data-metric");
        markSelected();
        const slot = document.getElementById("graph-slot");
        const cap = document.getElementById("graph-caption");
        if (slot) slot.innerHTML = metricGraph(selected, s);
        if (cap) cap.textContent = metricCaption(selected);
      };
    });
  }

  function renderSurahGrid(n, range) {
    const meta = HIFDH_META[n - 1];
    const myAyahs = getAyahs(state);
    const frAyahs = getAyahs(friendData());
    const rf = range && range.from;
    const rt = range && range.to;
    const rlo = rf && rt ? Math.min(rf, rt) : rf;
    const rhi = rf && rt ? Math.max(rf, rt) : rf;
    let cells = "";
    for (let a = 1; a <= meta.ayahs; a++) {
      const key = n + ":" + a;
      const mine = myAyahs[key];
      const them = frAyahs[key];
      let cls = "hf-cell" +
        (mine && mine.s === "m" ? " is-m" : mine && mine.s === "l" ? " is-l" : "") +
        (them && them.s === "m" ? " f-m" : them && them.s === "l" ? " f-l" : "");
      if (rf && a === rf) cls += " range-anchor";
      if (rlo && rhi && a >= rlo && a <= rhi) cls += " range-in";
      cells += '<button class="' + cls + '" data-ayah="' + a + '">' + a + "</button>";
    }
    return cells;
  }

  function screenSurah(n) {
    const meta = HIFDH_META[n - 1];
    if (!meta) return screenHifdh();
    // range: null = off. { from, to } while picking. from set on first tap, to on second.
    let range = null;

    function render() {
      const st = surahStats(state, meta);
      const deadline = getDeadlines(state)[n] || "";
      let banner = "";
      if (range) {
        if (!range.from) banner = "Touche le <b>premier</b> verset du passage.";
        else if (!range.to) banner = "Verset " + range.from + " sélectionné · touche le <b>dernier</b> verset.";
        else {
          const lo = Math.min(range.from, range.to);
          const hi = Math.max(range.from, range.to);
          banner = "Ayat " + lo + "–" + hi + " (" + (hi - lo + 1) + " versets) · choisis un état :";
        }
      }
      focus(
        '<div class="hf-surah">' +
          '<div class="hf-surah-head">' +
            '<div class="hf-surah-ar" dir="rtl">' + meta.ar + "</div>" +
            '<div class="hf-surah-tr">' + meta.tr + " · sourate " + n + " · " + meta.ayahs + " ayat</div>" +
            '<div class="hf-surah-stats">' +
              '<span class="hf-pct big">' + st.pct + "%</span>" +
              '<span class="hf-chip hf-chip-m">' + st.m + " mém.</span>" +
              '<span class="hf-chip hf-chip-l">' + st.l + " en cours</span>" +
              '<span class="hf-chip hf-chip-r">' + st.remaining + " restants</span>" +
            "</div>" +
            (st.startAt ? '<div class="hf-surah-dates">Débuté le ' + fmtDate(st.startAt) + "</div>" : "") +
          "</div>" +
          '<div class="hf-tools">' +
            '<button class="hf-pinbtn' + (isPinned(n) ? " pinned" : "") + '" id="hf-pin">' +
              '<span class="hf-pin' + (isPinned(n) ? " pinned" : "") + '">★</span>' +
              (isPinned(n) ? " Épinglée" : " Épingler") +
            "</button>" +
            '<label class="hf-deadline"><span class="hf-deadline-lbl">Deadline</span>' +
              '<input type="date" id="hf-deadline" value="' + (deadline ? deadline.slice(0,10) : "") + '">' +
            "</label>" +
            '<button class="btn ' + (range ? "btn-primary" : "btn-ghost") + '" id="hf-range-toggle">' +
              (range ? "Annuler la sélection" : "Marquer un passage…") +
            "</button>" +
          "</div>" +
          (range ?
            '<div class="hf-rangebar">' +
              '<span class="hf-rangebar-msg">' + banner + "</span>" +
              (range.from && range.to ?
                '<span class="hf-rangebar-actions">' +
                  '<button class="btn btn-ghost"   data-rng="none">Non commencé</button>' +
                  '<button class="btn btn-ghost"   data-rng="l">En cours</button>' +
                  '<button class="btn btn-primary" data-rng="m">Mémorisé</button>' +
                "</span>"
              : "") +
            "</div>"
          : '<p class="hf-hint">Touche un verset : <b>rien → en cours → mémorisé → rien</b>.</p>') +
          '<div class="hf-grid' + (range ? " picking" : "") + '">' + renderSurahGrid(n, range) + "</div>" +
        "</div>",
        "Hifdh", screenHifdh
      );

      Array.prototype.forEach.call(document.querySelectorAll(".hf-cell"), function (c) {
        c.onclick = function () {
          const a = parseInt(c.getAttribute("data-ayah"), 10);
          if (range) {
            if (!range.from) range.from = a;
            else if (!range.to) range.to = a;
            else { range = { from: a, to: null }; } // start over
            render();
            return;
          }
          const cur = state.hifdh && state.hifdh.ayahs && state.hifdh.ayahs[n + ":" + a];
          setAyahState(n, a, nextState(cur));
          render();
        };
      });

      const dl = document.getElementById("hf-deadline");
      if (dl) dl.onchange = function () { setDeadline(n, dl.value || null); render(); };

      const pn = document.getElementById("hf-pin");
      if (pn) pn.onclick = function () { togglePin(n); render(); };

      const rt = document.getElementById("hf-range-toggle");
      if (rt) rt.onclick = function () {
        range = range ? null : { from: null, to: null };
        render();
      };

      Array.prototype.forEach.call(document.querySelectorAll("[data-rng]"), function (b) {
        b.onclick = function () {
          const lo = Math.min(range.from, range.to);
          const hi = Math.max(range.from, range.to);
          setRange(n, lo, hi, b.getAttribute("data-rng"));
          range = null;
          render();
        };
      });
    }
    render();
  }

  // =========================================================================
  //  AUTH SCREEN
  // =========================================================================
  function screenAuth(errMsg) {
    h(
      '<div class="auth-wrap">' +
        '<div class="auth-card">' +
          '<div class="bismillah" dir="rtl">بِسْمِ اللَّه</div>' +
          '<h1>Apprendre l\'arabe</h1>' +
          '<p class="auth-sub">Connecte-toi pour retrouver ta progression.</p>' +
          '<form id="auth-form" class="auth-form">' +
            '<input id="auth-email" type="email" autocomplete="email" placeholder="Email" required>' +
            '<input id="auth-pw" type="password" autocomplete="current-password" placeholder="Mot de passe" required>' +
            '<button class="btn btn-primary wide" type="submit">Se connecter</button>' +
            (errMsg ? '<p class="auth-err">' + errMsg + "</p>" : "") +
          "</form>" +
        "</div>" +
      "</div>"
    );
    document.getElementById("auth-form").onsubmit = async function (e) {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      const pw = document.getElementById("auth-pw").value;
      try {
        await Cloud.signIn(email, pw);
        await boot();
      } catch (err) {
        screenAuth(err && err.message ? err.message : "Échec de connexion");
      }
    };
  }

  async function boot() {
    if (!window.Cloud) { state = Object.assign({ scores: {} }, localLoad()); screenHome(); return; }
    try { await Cloud.init(); } catch (_) {}
    Cloud.setOnAuthChange(function () { boot(); });
    if (!Cloud.isSignedIn()) { screenAuth(); return; }
    try {
      const rows = await Cloud.loadAll();
      allRows = rows || [];
      const me = Cloud.currentUserId();
      const own = allRows.filter(r => r.user_id === me)[0] || null;
      const cloudData = own && own.data ? own.data : null;
      state = Object.assign({ scores: {} }, cloudData || {});
      myLastCloudTs = (own && own.updated_at) || "";
      localSave(state);
      if (!own) { cloudSave(state); allRows.push({ user_id: me, display_name: null, data: state }); }
    } catch (e) {
      console.warn("cloud load failed, falling back to local", e);
      state = Object.assign({ scores: {} }, localLoad());
      allRows = [];
    }
    screenHome();
  }

  // ---- démarrage ---------------------------------------------------------
  boot();
  // The service worker was retired because its cache-first strategy stranded
  // mobile devices on stale JS. sw.js is now a self-unregistering kill-worker
  // that runs once for anyone still holding an old SW, then goes away. New
  // visitors register nothing. Live progress is cloud-sync only.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (r) { try { r.unregister(); } catch (_) {} });
      }).catch(function () {});
    });
  }
})();
