/* =========================================================================
   Apprendre l'arabe — moteur d'étude (SRS) + interface.
   Tout l'état est sauvegardé dans localStorage : rien à installer côté
   serveur. Elle rouvre l'app demain → tout est retenu.
   ========================================================================= */

(function () {
  "use strict";

  // ---- réglages pensés pour le TDAH : sessions courtes et finies --------
  const NEW_PER_SESSION = 4;     // peu de nouveautés à la fois
  const SESSION_MAX     = 10;    // une session a une fin visible
  const BOX_DAYS = [0, 1, 3, 7, 16, 35]; // répétition espacée (Leitner)

  const app = document.getElementById("app");
  const STORE_KEY = "arabe.progress.v1";
  const DAY = 86400000;

  // ---- persistance -------------------------------------------------------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function save(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

  function freshState() {
    return { cards: {}, streak: 0, lastDay: null, sessionsDone: 0 };
  }
  let state = Object.assign(freshState(), load());

  function todayIndex() { return Math.floor(Date.now() / DAY); }

  function cardState(id) {
    return state.cards[id] || { box: 0, due: 0, seen: 0, correct: 0 };
  }

  // toutes les cartes, à plat, avec leur deck
  function allCards() {
    const out = [];
    (window.DECKS || []).forEach(function (d) {
      d.cards.forEach(function (c) { out.push({ card: c, deck: d }); });
    });
    return out;
  }

  // combien de lettres "acquises" (box >= 3)
  function learnedCount() {
    let n = 0;
    for (const id in state.cards) if (state.cards[id].box >= 3) n++;
    return n;
  }

  // ---- construction de la session ---------------------------------------
  function buildSession() {
    const now = Date.now();
    const due = [], fresh = [];
    allCards().forEach(function (entry) {
      const cs = cardState(entry.card.id);
      if (cs.seen === 0) fresh.push(entry);
      else if (cs.due <= now) due.push(entry);
    });
    // les révisions d'abord, puis un peu de nouveau
    const session = due.slice(0, SESSION_MAX);
    const room = Math.min(NEW_PER_SESSION, SESSION_MAX - session.length);
    for (let i = 0; i < room && i < fresh.length; i++) session.push(fresh[i]);
    return session;
  }

  function countsForHome() {
    const now = Date.now();
    let due = 0, fresh = 0;
    allCards().forEach(function (entry) {
      const cs = cardState(entry.card.id);
      if (cs.seen === 0) fresh++;
      else if (cs.due <= now) due++;
    });
    return { due: due, fresh: fresh };
  }

  // ---- notation d'une carte ---------------------------------------------
  function grade(id, known) {
    const cs = cardState(id);
    cs.seen += 1;
    if (known) {
      cs.correct += 1;
      cs.box = Math.min(cs.box + 1, BOX_DAYS.length - 1);
    } else {
      cs.box = 1; // on la revoit très vite, sans pénaliser durement
    }
    cs.due = Date.now() + BOX_DAYS[cs.box] * DAY;
    state.cards[id] = cs;
    save(state);
  }

  function bumpStreak() {
    const t = todayIndex();
    if (state.lastDay === t) return;               // déjà compté aujourd'hui
    if (state.lastDay === t - 1) state.streak += 1; // jour consécutif
    else state.streak = 1;                          // (re)départ
    state.lastDay = t;
    state.sessionsDone += 1;
    save(state);
  }

  // =========================================================================
  //  ÉCRANS
  // =========================================================================

  function h(html) { app.innerHTML = html; }

  function screenHome() {
    const c = countsForHome();
    const deck = (window.DECKS || [])[0] || { title: "", subtitle: "" };
    const nothing = c.due === 0 && c.fresh === 0;
    const heure = new Date().getHours();
    const bonjour = heure < 18 ? "Prête pour aujourd'hui ?" : "Une petite séance ce soir ?";

    h(
      '<div class="screen home">' +
        '<div class="bismillah">بِسْمِ اللَّه</div>' +
        "<h1>Apprendre l'arabe</h1>" +
        '<p class="greeting">' + bonjour + "</p>" +

        '<div class="stats">' +
          '<div class="stat"><div class="num flame">' + state.streak + " 🔥</div>" +
            '<div class="lbl">jours de suite</div></div>' +
          '<div class="stat"><div class="num">' + learnedCount() + "</div>" +
            '<div class="lbl">lettres acquises</div></div>' +
        "</div>" +

        '<div class="session-card">' +
          '<div class="deck-title">' + deck.title + "</div>" +
          '<div class="deck-sub">' + deck.subtitle + "</div>" +
          (nothing
            ? '<p class="done-note">Tout est révisé pour aujourd\'hui. ' +
              "Reviens demain — c'est en revenant chaque jour que ça rentre. 🌱</p>"
            : '<div class="queue">' +
                (c.due   ? "<b>" + c.due + "</b> à revoir" : "") +
                (c.due && c.fresh ? " · " : "") +
                (c.fresh ? "<b>" + Math.min(c.fresh, NEW_PER_SESSION) + "</b> nouvelle" +
                           (Math.min(c.fresh, NEW_PER_SESSION) > 1 ? "s" : "") : "") +
              "</div>") +
        "</div>" +

        (nothing
          ? '<button class="btn btn-ghost" id="start">Revoir quand même</button>'
          : '<button class="btn btn-primary" id="start">Commencer ✨</button>') +
      "</div>"
    );

    document.getElementById("start").onclick = function () {
      let session = buildSession();
      if (session.length === 0) {                 // "revoir quand même"
        session = allCards().slice(0, SESSION_MAX);
      }
      startStudy(session);
    };
  }

  // ---- étude -------------------------------------------------------------
  function startStudy(session) {
    let i = 0;

    function renderCard() {
      const entry = session[i];
      const card = entry.card;
      const pct = Math.round((i / session.length) * 100);

      h(
        '<div class="topbar"><button class="btn btn-ghost" id="quit">‹ Accueil</button></div>' +
        '<div class="screen study">' +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<div class="card" id="card">' +
            '<div class="glyph" dir="rtl">' + card.front + "</div>" +
            '<div class="hint">touche la carte pour voir la réponse</div>' +
          "</div>" +
          '<div class="reveal-row">' +
            '<button class="btn btn-primary" id="reveal">Voir la réponse</button>' +
          "</div>" +
        "</div>"
      );

      document.getElementById("quit").onclick = screenHome;
      document.getElementById("card").onclick = revealCard;
      document.getElementById("reveal").onclick = revealCard;
    }

    function revealCard() {
      const entry = session[i];
      const card = entry.card;
      const pct = Math.round((i / session.length) * 100);

      h(
        '<div class="topbar"><button class="btn btn-ghost" id="quit">‹ Accueil</button></div>' +
        '<div class="screen study">' +
          '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
          '<div class="card">' +
            '<div class="back">' +
              '<div class="glyph-sm" dir="rtl">' + card.front + "</div>" +
              '<div class="name">' + card.name + "</div>" +
              '<div class="sound">son : ' + card.sound + "</div>" +
              '<div class="example">' +
                '<div class="word" dir="rtl">' + card.example + "</div>" +
                '<div class="gloss">' + card.translit + " — <b>" + card.fr + "</b></div>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="actions">' +
            '<button class="btn btn-again" id="again">À revoir</button>' +
            '<button class="btn btn-good" id="good">Je savais ✓</button>' +
          "</div>" +
        "</div>"
      );

      document.getElementById("quit").onclick = screenHome;
      document.getElementById("again").onclick = function () { answer(false); };
      document.getElementById("good").onclick  = function () { answer(true); };
    }

    function answer(known) {
      grade(session[i].card.id, known);
      i += 1;
      if (i >= session.length) finish(session.length);
      else renderCard();
    }

    renderCard();
  }

  // ---- félicitations -----------------------------------------------------
  function finish(n) {
    bumpStreak();
    h(
      '<div class="screen celebrate">' +
        '<div class="mashallah">ما شاء الله</div>' +
        "<h2>Séance terminée !</h2>" +
        '<div class="stats">' +
          '<div class="stat"><div class="num">' + n + "</div>" +
            '<div class="lbl">cartes revues</div></div>' +
          '<div class="stat"><div class="num flame">' + state.streak + " 🔥</div>" +
            '<div class="lbl">jours de suite</div></div>' +
          '<div class="stat"><div class="num">' + learnedCount() + "</div>" +
            '<div class="lbl">lettres acquises</div></div>' +
        "</div>" +
        "<p>Chaque jour compte plus que chaque carte.<br>À demain, in shā' Allah. 🌱</p>" +
        '<button class="btn btn-primary" id="home">Retour à l\'accueil</button>' +
      "</div>"
    );
    document.getElementById("home").onclick = screenHome;
  }

  // ---- démarrage ---------------------------------------------------------
  screenHome();

  // service worker (hors-ligne + installation sur l'écran d'accueil)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
})();
