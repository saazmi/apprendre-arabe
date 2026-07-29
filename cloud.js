/* =========================================================================
   Cloud layer — Supabase auth + user_data persistence.
   Exposes window.Cloud. Data shape is opaque: whatever the app hands to
   saveData() is stored verbatim in user_data.data (jsonb).
   ========================================================================= */

(function () {
  "use strict";

  const URL = "https://ellvfukkuwasepkqmkkc.supabase.co";
  const KEY = "sb_publishable_wNv4s5HfbSaXlHgVmP0LhA_bIwE6P8D";
  const client = window.supabase.createClient(URL, KEY);

  let session = null;
  let onAuthChange = function () {};

  async function init() {
    const res = await client.auth.getSession();
    session = res.data.session || null;
    client.auth.onAuthStateChange(function (_evt, s) {
      const was = !!session;
      session = s || null;
      if (!!session !== was) onAuthChange();
    });
  }

  function isSignedIn() { return !!session; }
  function currentUserId() { return session && session.user && session.user.id; }
  function currentEmail() { return session && session.user && session.user.email; }

  async function signIn(email, password) {
    const r = await client.auth.signInWithPassword({ email: email, password: password });
    if (r.error) throw r.error;
    session = r.data.session;
    return r.data;
  }

  async function signOut() {
    await client.auth.signOut();
    session = null;
  }

  async function loadOwn() {
    if (!session) return null;
    const r = await client.from("user_data")
      .select("data, display_name")
      .eq("user_id", currentUserId())
      .maybeSingle();
    if (r.error) throw r.error;
    return r.data;
  }

  async function loadAll() {
    if (!session) return [];
    const r = await client.from("user_data")
      .select("user_id, display_name, data, updated_at");
    if (r.error) throw r.error;
    return r.data || [];
  }

  let pending = null;
  let inflight = false;

  // Callers can pass a `ts` (ISO string) so they know which server timestamp
  // their write carries — useful for later refresh-vs-clobber decisions.
  async function saveData(dataObj, ts) {
    if (!session) throw new Error("not signed in");
    pending = { data: dataObj, ts: ts || new Date().toISOString() };
    if (inflight) return pending.ts;
    inflight = true;
    let lastTs = pending.ts;
    try {
      while (pending) {
        const snapshot = pending;
        pending = null;
        lastTs = snapshot.ts;
        const r = await client.from("user_data").upsert({
          user_id: currentUserId(),
          data: snapshot.data,
          updated_at: snapshot.ts,
        }, { onConflict: "user_id" });
        if (r.error) throw r.error;
      }
    } finally {
      inflight = false;
    }
    return lastTs;
  }

  window.Cloud = {
    init: init,
    isSignedIn: isSignedIn,
    currentUserId: currentUserId,
    currentEmail: currentEmail,
    signIn: signIn,
    signOut: signOut,
    loadOwn: loadOwn,
    loadAll: loadAll,
    saveData: saveData,
    setOnAuthChange: function (fn) { onAuthChange = fn; },
  };
})();
