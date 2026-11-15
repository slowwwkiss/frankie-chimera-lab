/* Frankie — The API Chimera Lab.
 * Static app, no backend, no keys. Every body part is a free public API
 * verified live (HTTP 200 + Access-Control-Allow-Origin: *) on 15 Nov 2026.
 * If one API dies, that part fizzles and the rest of the creature lives on.
 */
"use strict";

var FETCH_TIMEOUT_MS = 10000;
var STORAGE_KEY = "frankie.saved.v1";
var MAX_SAVED = 12;
var AUTO_REFRESH_MS = 60000;

var $ = function (id) { return document.getElementById(id); };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function fetchJson(url) {
  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT_MS);
  return fetch(url, { signal: ctrl.signal, headers: { "Accept": "application/json" } })
    .then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .catch(function (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") throw new Error("timed out after 10s");
      throw err;
    });
}

function fmtTime(d) { return new Date(d).toLocaleTimeString(); }

/* ------------------------------------------------------------------ */
/* Body parts registry                                                 */
/* ------------------------------------------------------------------ */
var PARTS = [
  {
    id: "brain", name: "Brain", organ: "thinking",
    desc: "One piece of hard-earned wisdom.",
    sourceName: "Advice Slip", sourceUrl: "https://api.adviceslip.com/",
    fetchData: function () {
      return fetchJson("https://api.adviceslip.com/advice").then(function (j) {
        if (!j || !j.slip || !j.slip.advice) throw new Error("unexpected response");
        return { big: "\u201C" + j.slip.advice + "\u201D", sub: "Advice #" + j.slip.id };
      });
    }
  },
  {
    id: "heart", name: "Heart", organ: "beating",
    desc: "The crypto pulse — live BTC + ETH prices.",
    sourceName: "CoinGecko", sourceUrl: "https://www.coingecko.com/",
    fetchData: function () {
      return fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true")
        .then(function (j) {
          if (!j || !j.bitcoin || !j.ethereum) throw new Error("unexpected response");
          var btc = j.bitcoin.usd.toLocaleString("en-US");
          var eth = j.ethereum.usd.toLocaleString("en-US");
          var bc = j.bitcoin.usd_24h_change, ec = j.ethereum.usd_24h_change;
          var sign = function (v) { return (v >= 0 ? "+" : "") + v.toFixed(2) + "%"; };
          return {
            big: "BTC $" + btc + " (" + sign(bc) + ")",
            sub: "ETH $" + eth + " (" + sign(ec) + ") · 24h change"
          };
        });
    }
  },
  {
    id: "funnybone", name: "Funny Bone", organ: "laughing",
    desc: "One safe joke, fresh from the lab.",
    sourceName: "JokeAPI v2", sourceUrl: "https://v2.jokeapi.dev/",
    fetchData: function () {
      return fetchJson("https://v2.jokeapi.dev/joke/Any?type=single&safe-mode").then(function (j) {
        if (!j || j.error) throw new Error("unexpected response");
        if (j.type === "twopart") return { big: j.setup, sub: j.delivery + " · " + j.category };
        return { big: j.joke, sub: j.category + " joke" };
      });
    }
  },
  {
    id: "eyes", name: "Eyes", organ: "watching",
    desc: "A random dog, staring into your soul.",
    sourceName: "Dog CEO", sourceUrl: "https://dog.ceo/dog-api/",
    fetchData: function () {
      return fetchJson("https://dog.ceo/api/breeds/image/random").then(function (j) {
        if (!j || j.status !== "success" || !j.message) throw new Error("unexpected response");
        return { image: j.message, big: "A very good dog.", sub: "Breed: " + breedFromUrl(j.message) };
      });
    }
  },
  {
    id: "whiskers", name: "Whiskers", organ: "sensing",
    desc: "One verified cat fact.",
    sourceName: "Cat Facts", sourceUrl: "https://catfact.ninja/",
    fetchData: function () {
      return fetchJson("https://catfact.ninja/fact").then(function (j) {
        if (!j || !j.fact) throw new Error("unexpected response");
        return { big: j.fact, sub: "Cat fact · " + j.length + " characters" };
      });
    }
  },
  {
    id: "weatherskin", name: "Weather Skin", organ: "feeling",
    desc: "Live weather for the city of your choice.",
    sourceName: "wttr.in", sourceUrl: "https://wttr.in/",
    fetchData: function () {
      var city = $("city-select").value;
      return fetchJson("https://wttr.in/" + encodeURIComponent(city) + "?format=j1").then(function (j) {
        var c = j && j.current_condition && j.current_condition[0];
        if (!c) throw new Error("unexpected response");
        var desc = c.weatherDesc && c.weatherDesc[0] ? c.weatherDesc[0].value : "unknown";
        return {
          big: city + ": " + c.temp_C + "\u00B0C, " + desc,
          sub: "Feels like " + c.FeelsLikeC + "\u00B0C · humidity " + c.humidity + "% · wind " + c.windspeedKmph + " km/h",
          rawTempC: parseFloat(c.temp_C)
        };
      });
    }
  },
  {
    id: "memory", name: "Memory", organ: "remembering",
    desc: "A book from the library of the dead.",
    sourceName: "OpenLibrary", sourceUrl: "https://openlibrary.org/",
    fetchData: function () {
      return fetchJson("https://openlibrary.org/search.json?q=frankenstein&limit=5").then(function (j) {
        var docs = (j && j.docs) || [];
        var doc = null;
        for (var i = 0; i < docs.length; i++) {
          if (docs[i].title && docs[i].author_name && docs[i].author_name[0]) { doc = docs[i]; break; }
        }
        if (!doc) throw new Error("unexpected response");
        return {
          big: "\u201C" + doc.title + "\u201D",
          sub: "by " + doc.author_name[0] + (doc.first_publish_year ? " · first published " + doc.first_publish_year : "")
        };
      });
    }
  },
  {
    id: "hands", name: "Hands", organ: "doing",
    desc: "Something to do with those new hands.",
    sourceName: "Bored API", sourceUrl: "https://www.boredapi.com/",
    fetchData: function () {
      return fetchJson("https://www.boredapi.com/api/activity").then(function (j) {
        if (!j || !j.activity) throw new Error("unexpected response");
        return { big: j.activity, sub: "Type: " + j.type + " · " + j.participants + " participant(s)" };
      });
    }
  }
];

function breedFromUrl(url) {
  var m = url.match(/breeds\/([^/]+)/);
  if (!m) return "unknown";
  return m[1].replace(/-/g, " ");
}

function partById(id) {
  for (var i = 0; i < PARTS.length; i++) if (PARTS[i].id === id) return PARTS[i];
  return null;
}

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */
var selected = [];          // part ids, in pick order
var creature = null;        // current live creature object
var autoTimer = null;
var hasFlashed = false;

function setStatus(msg) { $("status").textContent = msg; }

/* ------------------------------------------------------------------ */
/* Picker                                                              */
/* ------------------------------------------------------------------ */
function renderPicker() {
  var wrap = $("part-picker");
  wrap.innerHTML = "";
  PARTS.forEach(function (p) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "part-pick" + (selected.indexOf(p.id) !== -1 ? " selected" : "");
    b.setAttribute("aria-pressed", selected.indexOf(p.id) !== -1 ? "true" : "false");
    if (selected.indexOf(p.id) === -1 && selected.length >= 4) b.disabled = true;
    var name = document.createElement("span"); name.className = "part-name"; name.textContent = p.name;
    var desc = document.createElement("span"); desc.className = "part-desc"; desc.textContent = p.desc;
    var src = document.createElement("span"); src.className = "part-src"; src.textContent = "Source: " + p.sourceName;
    b.appendChild(name); b.appendChild(desc); b.appendChild(src);
    b.addEventListener("click", function () { togglePart(p.id); });
    wrap.appendChild(b);
  });
  $("pick-count").textContent = selected.length + " / 4 selected";
  $("bring-btn").disabled = selected.length < 2;
  $("reanimate-btn").disabled = !creature;
}

function togglePart(id) {
  var i = selected.indexOf(id);
  if (i !== -1) selected.splice(i, 1);
  else if (selected.length < 4) selected.push(id);
  renderPicker();
}

/* ------------------------------------------------------------------ */
/* Name + personality                                                  */
/* ------------------------------------------------------------------ */
var NAME_PREFIX = ["ZORP", "BOLT", "GRIMM", "VOLT", "MORT", "FRANK", "IGOR", "LURCH", "BORIS", "HECTOR"];
var NAME_CORE = ["THE", "VON", "MC", "DR", "SIR", "MADAME"];
var NAME_SUFFIX = ["CHILLY JOKER", "WANDERING MIND", "GOLDEN HEART", "RESTLESS HANDS", "ETERNAL STUDENT", "MIDNIGHT SCHOLAR", "LOYAL WATCHER", "CLOUD WHISPERER"];

function hashStr(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function generateName(ids) {
  var key = ids.slice().sort().join("+");
  var h = hashStr(key);
  return NAME_PREFIX[h % NAME_PREFIX.length] + " " +
    NAME_CORE[Math.floor(h / 7) % NAME_CORE.length] + " " +
    NAME_SUFFIX[Math.floor(h / 43) % NAME_SUFFIX.length];
}

function generatePersonality(data) {
  var bits = [];
  var joke = data.funnybone && data.funnybone.ok;
  var temp = data.weatherskin && data.weatherskin.ok ? data.weatherskin.payload.rawTempC : null;
  var heart = data.heart && data.heart.ok ? data.heart.payload.sub : "";
  if (joke && temp !== null && temp !== undefined && temp < 10)
    bits.push("a chilly joker who laughs at the cold");
  else if (joke) bits.push("a joker with a freshly stitched funny bone");
  if (temp !== null && temp !== undefined) {
    if (temp >= 28) bits.push("a sun-warmed creature that never shivers");
    else if (temp < 5) bits.push("a frost-proof monster, built for winter nights");
  }
  if (heart.indexOf("+") !== -1) bits.push("an optimistic thinker riding a green market");
  else if (heart) bits.push("a cautious soul watching red candles");
  if (data.brain && data.brain.ok) bits.push("wise beyond its stitches");
  if (data.eyes && data.eyes.ok) bits.push("always watching, tail wagging");
  if (bits.length === 0) return "A mysterious creature of stitched-together data.";
  var line = bits[0].charAt(0).toUpperCase() + bits[0].slice(1);
  for (var i = 1; i < bits.length; i++) line += "; " + bits[i];
  return line + ".";
}

/* ------------------------------------------------------------------ */
/* Creature lifecycle                                                  */
/* ------------------------------------------------------------------ */
function fetchPart(part) {
  var started = Date.now();
  return part.fetchData()
    .then(function (payload) {
      return { ok: true, payload: payload, fetchedAt: new Date().toISOString(), ms: Date.now() - started };
    })
    .catch(function (err) {
      return { ok: false, error: err && err.message ? err.message : String(err), fetchedAt: new Date().toISOString(), ms: Date.now() - started };
    });
}

function bringToLife() {
  if (selected.length < 2) return;
  setStatus("Lightning crackles… fetching live data for " + selected.length + " parts.");
  $("bring-btn").disabled = true;
  var ids = selected.slice();
  var jobs = ids.map(function (id) { return fetchPart(partById(id)); });
  Promise.all(jobs).then(function (results) {
    var data = {};
    var okCount = 0;
    ids.forEach(function (id, i) { data[id] = results[i]; if (results[i].ok) okCount++; });
    creature = {
      parts: ids,
      name: generateName(ids),
      personality: generatePersonality(data),
      data: data,
      createdAt: new Date().toISOString()
    };
    renderCreature();
    $("bring-btn").disabled = false;
    $("reanimate-btn").disabled = false;
    if (okCount === 0) {
      setStatus("The experiment failed — every API fizzled. Check your connection and retry.");
    } else if (okCount < ids.length) {
      setStatus("Creature alive with " + okCount + " of " + ids.length + " parts — " + (ids.length - okCount) + " part(s) fizzled.");
    } else {
      setStatus("Creature alive. " + okCount + " parts humming with live data.");
    }
    if (!hasFlashed && okCount > 0) {
      hasFlashed = true;
      var ov = $("alive-overlay");
      ov.classList.remove("show");
      void ov.offsetWidth; // restart animation
      ov.classList.add("show");
    }
  });
}

function reanimate() {
  if (!creature) return;
  setStatus("Reanimating… fetching fresh data for every part.");
  var ids = creature.parts.slice();
  Promise.all(ids.map(function (id) { return fetchPart(partById(id)); }))
    .then(function (results) {
      var okCount = 0;
      ids.forEach(function (id, i) { creature.data[id] = results[i]; if (results[i].ok) okCount++; });
      creature.personality = generatePersonality(creature.data);
      creature.createdAt = new Date().toISOString();
      renderCreature();
      setStatus("Reanimated: " + okCount + " of " + ids.length + " parts refreshed just now.");
    });
}

function disassemble() {
  creature = null;
  stopAutoRefresh();
  $("auto-refresh").checked = false;
  $("creature").className = "creature creature-empty";
  $("creature").innerHTML = "";
  var svg = document.createElement("div");
  svg.innerHTML = '<svg class="monster" viewBox="0 0 200 120" aria-hidden="true"><path d="M100 8 L118 26 L112 40 L128 52 L118 78 L104 92 L100 112 L96 92 L82 78 L72 52 L88 40 L82 26 Z" /><circle cx="88" cy="46" r="4" class="eye"/><circle cx="112" cy="46" r="4" class="eye"/><path d="M88 66 Q100 74 112 66" class="mouth"/></svg><p class="empty-text">No creature yet. Assemble one above and bring it to life.</p>';
  while (svg.firstChild) $("creature").appendChild(svg.firstChild);
  $("creature-head").hidden = true;
  $("part-cards").innerHTML = "";
  $("creature-actions").hidden = true;
  renderPicker();
  setStatus("Creature disassembled. The lab is quiet again.");
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */
function renderCreature() {
  var c = creature;
  if (!c) return;
  var stage = $("creature");
  stage.className = "creature creature-alive";
  stage.innerHTML = "";
  var svg = document.createElement("div");
  svg.innerHTML = '<svg class="monster" viewBox="0 0 200 120" aria-hidden="true"><path d="M100 8 L118 26 L112 40 L128 52 L118 78 L104 92 L100 112 L96 92 L82 78 L72 52 L88 40 L82 26 Z" /><circle cx="88" cy="46" r="4" class="eye"/><circle cx="112" cy="46" r="4" class="eye"/><path d="M88 66 Q100 74 112 66" class="mouth"/></svg>';
  while (svg.firstChild) stage.appendChild(svg.firstChild);

  $("creature-head").hidden = false;
  $("creature-name").textContent = c.name;
  $("creature-personality").textContent = c.personality;
  $("creature-meta").textContent = "Assembled from " + c.parts.length + " live APIs · born " + fmtTime(c.createdAt);

  var cards = $("part-cards");
  cards.innerHTML = "";
  c.parts.forEach(function (id) {
    var part = partById(id);
    var res = c.data[id];
    var card = document.createElement("article");
    card.className = "part-card" + (res.ok ? "" : " failed");
    var h = document.createElement("h4");
    h.textContent = part.name + " ";
    var tag = document.createElement("span"); tag.className = "organ-tag"; tag.textContent = "(" + part.organ + ")";
    h.appendChild(tag);
    card.appendChild(h);
    if (res.ok) {
      var data = document.createElement("p"); data.className = "data";
      var big = document.createElement("span"); big.className = "big"; big.textContent = res.payload.big;
      data.appendChild(big);
      if (res.payload.sub) {
        data.appendChild(document.createElement("br"));
        var sub = document.createElement("span"); sub.className = "sub-line"; sub.textContent = res.payload.sub;
        data.appendChild(sub);
      }
      card.appendChild(data);
      if (res.payload.image) {
        var img = document.createElement("img");
        img.src = res.payload.image;
        img.alt = "Random dog photo from Dog CEO";
        img.loading = "lazy";
        card.appendChild(img);
      }
    } else {
      var err = document.createElement("p"); err.className = "error-text";
      err.textContent = "PART FIZZLED — " + res.error + ". The rest of the creature lives on.";
      card.appendChild(err);
      var rb = document.createElement("button");
      rb.type = "button"; rb.className = "btn retry-part"; rb.textContent = "Retry this part";
      rb.addEventListener("click", function () { retryPart(id); });
      card.appendChild(rb);
    }
    var src = document.createElement("p"); src.className = "src";
    var when = res.ok ? " · fetched " + fmtTime(res.fetchedAt) + " (" + res.ms + " ms)" : " · failed " + fmtTime(res.fetchedAt);
    src.textContent = "Source: " + part.sourceName + when;
    card.appendChild(src);
    cards.appendChild(card);
  });
  $("creature-actions").hidden = false;
}

function retryPart(id) {
  var part = partById(id);
  setStatus("Retrying the " + part.name + "…");
  fetchPart(part).then(function (res) {
    if (!creature) return;
    creature.data[id] = res;
    creature.personality = generatePersonality(creature.data);
    renderCreature();
    setStatus(res.ok ? part.name + " stitched back on." : part.name + " fizzled again (" + res.error + ").");
  });
}

/* ------------------------------------------------------------------ */
/* Save / share                                                        */
/* ------------------------------------------------------------------ */
function loadSaved() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function renderSaved() {
  var list = loadSaved();
  var ul = $("saved-list");
  ul.innerHTML = "";
  $("saved-empty").hidden = list.length > 0;
  list.forEach(function (item, idx) {
    var li = document.createElement("li");
    var name = document.createElement("span"); name.className = "saved-name"; name.textContent = item.name;
    var meta = document.createElement("span"); meta.className = "saved-meta";
    meta.textContent = item.parts.length + " parts · saved " + new Date(item.savedAt).toLocaleString();
    var spacer = document.createElement("span"); spacer.className = "spacer";
    var wake = document.createElement("button"); wake.type = "button"; wake.className = "btn"; wake.textContent = "Wake";
    wake.addEventListener("click", function () { wakeSaved(idx); });
    var del = document.createElement("button"); del.type = "button"; del.className = "btn btn-danger"; del.textContent = "Delete";
    del.addEventListener("click", function () { deleteSaved(idx); });
    li.appendChild(name); li.appendChild(meta); li.appendChild(spacer);
    li.appendChild(wake); li.appendChild(del);
    ul.appendChild(li);
  });
}

function saveCreature() {
  if (!creature) return;
  var list = loadSaved();
  var item = {
    name: creature.name,
    personality: creature.personality,
    parts: creature.parts.slice(),
    data: creature.data,
    createdAt: creature.createdAt,
    savedAt: new Date().toISOString()
  };
  list.unshift(item);
  if (list.length > MAX_SAVED) list.length = MAX_SAVED;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderSaved();
    setStatus("Creature saved to this browser.");
  } catch (e) {
    setStatus("Could not save — browser storage is unavailable.");
  }
}

function wakeSaved(idx) {
  var list = loadSaved();
  var item = list[idx];
  if (!item) return;
  creature = {
    parts: item.parts.slice(),
    name: item.name,
    personality: item.personality,
    data: item.data,
    createdAt: item.createdAt
  };
  selected = item.parts.slice();
  renderPicker();
  renderCreature();
  setStatus("Woke " + item.name + " from the freezer. Press Reanimate for fresh data.");
}

function deleteSaved(idx) {
  var list = loadSaved();
  list.splice(idx, 1);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  renderSaved();
}

function b64urlEncode(obj) {
  var json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  var b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}

function shareCreature() {
  if (!creature) return;
  var hash = "#c=" + b64urlEncode({ v: 1, parts: creature.parts });
  var url = location.origin + location.pathname + hash;
  var done = function () { setStatus("Share link copied — anyone opening it gets the same parts, fresh data."); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done, function () {
      prompt("Copy this share link:", url);
    });
  } else {
    prompt("Copy this share link:", url);
  }
}

function restoreFromHash() {
  var m = location.hash.match(/^#c=([A-Za-z0-9\-_]+)$/);
  if (!m) return false;
  try {
    var obj = b64urlDecode(m[1]);
    if (!obj || obj.v !== 1 || !Array.isArray(obj.parts)) return false;
    var valid = obj.parts.filter(function (id) { return partById(id); }).slice(0, 4);
    if (valid.length < 2) return false;
    selected = valid;
    renderPicker();
    setStatus("A shared creature arrived through the link — bringing it to life with fresh data.");
    bringToLife();
    return true;
  } catch (e) {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Auto-refresh                                                        */
/* ------------------------------------------------------------------ */
function startAutoRefresh() {
  stopAutoRefresh();
  autoTimer = setInterval(function () { if (creature) reanimate(); }, AUTO_REFRESH_MS);
}
function stopAutoRefresh() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

/* ------------------------------------------------------------------ */
/* Wiring                                                              */
/* ------------------------------------------------------------------ */
$("bring-btn").addEventListener("click", bringToLife);
$("reanimate-btn").addEventListener("click", reanimate);
$("save-btn").addEventListener("click", saveCreature);
$("share-btn").addEventListener("click", shareCreature);
$("disassemble-btn").addEventListener("click", disassemble);
$("city-select").addEventListener("change", function () {
  if (creature && creature.parts.indexOf("weatherskin") !== -1) retryPart("weatherskin");
});
$("auto-refresh").addEventListener("change", function (e) {
  if (e.target.checked) { startAutoRefresh(); setStatus("Auto-refresh ON — fresh data every 60 seconds."); }
  else { stopAutoRefresh(); setStatus("Auto-refresh OFF."); }
});

renderPicker();
renderSaved();
restoreFromHash();
