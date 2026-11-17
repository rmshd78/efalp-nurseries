/* Efalp Nurseries — catalogue search and filters */
(function () {
  "use strict";
  function start() {
    var EF = window.EF;
    var root = document.querySelector("[data-catalogue]");
    if (!EF || !root) return;
    var esc = EF.esc, PLANTS = EF.plants, META = EF.meta;

    var els = {
      q: root.querySelector("#q"),
      search: root.querySelector(".search"),
      clear: root.querySelector(".search__clear"),
      sort: root.querySelector("#sort"),
      grid: root.querySelector("[data-grid]"),
      count: root.querySelector("[data-result-count]"),
      active: root.querySelector("[data-active-filters]"),
      cats: root.querySelector("[data-filter-cats]"),
      nurs: root.querySelector("[data-filter-nursery]"),
      origin: root.querySelector("#origin"),
      water: root.querySelector("[data-filter-water]"),
      reset: root.querySelectorAll("[data-reset]"),
      filters: root.querySelector(".filters"),
      openFilters: root.querySelector(".filters-toggle"),
      closeFilters: root.querySelector(".filters__close")
    };

    var WATER = ["Very low", "Low", "Moderate", "Regular"];
    function waterBand(w) {
      if (/very low/i.test(w)) return "Very low";
      if (/^low/i.test(w)) return "Low";
      if (/moderate/i.test(w)) return "Moderate";
      return "Regular";
    }
    function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[×]/g, "x"); }

    // Pre-compute search text
    PLANTS.forEach(function (p) {
      p._name = norm(p.name);
      p._bot = norm(p.botanical);
      p._var = norm(p.varieties.map(function (v) { return v.name; }).join(" | "));
      p._all = norm([p.family, p.category, p.type, p.uses.join(" "), p.native, p.origins.join(" "), p.desc].join(" | "));
      p._ar = p.ar || "";
      p._water = waterBand(p.water);
    });

    var origins = {};
    PLANTS.forEach(function (p) { p.origins.forEach(function (o) { origins[o] = (origins[o] || 0) + 1; }); });

    var state = { q: "", cat: "", nursery: "", origin: "", water: "", sort: "relevance" };
    var params = new URLSearchParams(location.search);
    ["q", "cat", "nursery", "origin", "water", "sort"].forEach(function (k) { if (params.get(k)) state[k] = params.get(k); });

    // Build filter controls
    els.cats.innerHTML = radio("cat", "", "All collections", PLANTS.length) +
      META.categories.map(function (c) { return radio("cat", c, c, PLANTS.filter(function (p) { return p.category === c; }).length); }).join("");
    els.nurs.innerHTML = radio("nursery", "", "Both nurseries", PLANTS.length) +
      Object.keys(META.nurseries).map(function (n) { return radio("nursery", n, META.nurseries[n], PLANTS.filter(function (p) { return p.nurseries.indexOf(n) !== -1; }).length); }).join("");
    els.water.innerHTML = radio("water", "", "Any", PLANTS.length) +
      WATER.map(function (w) { return radio("water", w, w, PLANTS.filter(function (p) { return p._water === w; }).length); }).join("");
    els.origin.innerHTML = '<option value="">Any origin</option>' + Object.keys(origins).sort().map(function (o) {
      return '<option value="' + esc(o) + '">' + esc(o) + " (" + origins[o] + ")</option>";
    }).join("");

    function radio(name, value, label, count) {
      var id = "f-" + name + "-" + (value || "all").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      return '<label class="opt" for="' + id + '"><input type="radio" id="' + id + '" name="' + name + '" value="' + esc(value) + '"><span>' + esc(label) + '</span><span class="opt__count">' + count + "</span></label>";
    }

    function syncControls() {
      els.q.value = state.q;
      els.search.classList.toggle("has-value", !!state.q);
      els.sort.value = state.sort;
      els.origin.value = state.origin;
      ["cat", "nursery", "water"].forEach(function (k) {
        var r = root.querySelector('input[name="' + k + '"][value="' + cssEsc(state[k]) + '"]');
        if (r) r.checked = true;
      });
    }
    function cssEsc(s) { return String(s).replace(/["\\]/g, "\\$&"); }

    function score(p, terms) {
      if (!terms.length) return 1;
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], s = 0;
        if (p._name.indexOf(t) === 0) s = 100;
        else if (p._name.indexOf(" " + t) !== -1 || p._name.indexOf("(" + t) !== -1) s = 80;
        else if (p._name.indexOf(t) !== -1) s = 60;
        else if (p._bot.indexOf(t) !== -1) s = 50;
        else if (p._ar && p._ar.indexOf(t) !== -1) s = 50;
        else if (p._var.indexOf(t) !== -1) s = 40;
        else if (p._all.indexOf(t) !== -1) s = 10;
        if (!s) return 0;
        total += s;
      }
      return total;
    }

    function apply() {
      var terms = norm(state.q).split(/\s+/).filter(Boolean);
      var list = [];
      PLANTS.forEach(function (p) {
        if (state.cat && p.category !== state.cat) return;
        if (state.nursery && p.nurseries.indexOf(state.nursery) === -1) return;
        if (state.origin && p.origins.indexOf(state.origin) === -1) return;
        if (state.water && p._water !== state.water) return;
        var s = score(p, terms);
        if (!s) return;
        list.push({ p: p, s: s });
      });
      var catIdx = function (p) { return META.categories.indexOf(p.category); };
      if (state.sort === "az") list.sort(function (a, b) { return a.p.name.localeCompare(b.p.name); });
      else if (state.sort === "botanical") list.sort(function (a, b) { return a.p.botanical.localeCompare(b.p.botanical); });
      else if (state.sort === "varieties") list.sort(function (a, b) { return b.p.varieties.length - a.p.varieties.length || a.p.name.localeCompare(b.p.name); });
      else list.sort(function (a, b) { return (b.s - a.s) || (catIdx(a.p) - catIdx(b.p)) || a.p.name.localeCompare(b.p.name); });

      window.EF.currentList = list.map(function (x) { return x.p.id; });
      els.count.textContent = list.length === PLANTS.length ? "Showing all " + list.length + " plants" : "Showing " + list.length + " of " + PLANTS.length + " plants";
      if (!list.length) {
        els.grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><h2>No plants match ' + (state.q ? "\u201c" + esc(state.q) + "\u201d" : "these filters") + '</h2>' +
          "<p>Try a common or botanical name, a variety such as Alphonso, or clear the filters.</p>" +
          '<button type="button" class="btn btn--primary" data-reset>Clear search and filters</button></div>';
      } else {
        els.grid.innerHTML = list.map(function (x) { return EF.plantCard(x.p); }).join("");
      }
      renderActive();
      writeUrl();
    }

    function renderActive() {
      var chips = [];
      if (state.q) chips.push(["q", "Search: " + state.q]);
      if (state.cat) chips.push(["cat", state.cat]);
      if (state.nursery) chips.push(["nursery", META.nurseries[state.nursery]]);
      if (state.origin) chips.push(["origin", "Origin: " + state.origin]);
      if (state.water) chips.push(["water", "Water: " + state.water]);
      els.active.innerHTML = chips.map(function (c) {
        return '<button type="button" data-clear="' + c[0] + '" aria-label="Remove filter ' + esc(c[1]) + '">' + esc(c[1]) + ' <span aria-hidden="true">\u00d7</span></button>';
      }).join("");
    }

    function writeUrl() {
      var u = new URL(location.href);
      ["q", "cat", "nursery", "origin", "water", "sort"].forEach(function (k) {
        if (state[k] && !(k === "sort" && state[k] === "relevance")) u.searchParams.set(k, state[k]); else u.searchParams.delete(k);
      });
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }

    var t;
    els.q.addEventListener("input", function () {
      els.search.classList.toggle("has-value", !!els.q.value);
      clearTimeout(t);
      t = setTimeout(function () { state.q = els.q.value.trim(); apply(); }, 120);
    });
    els.q.form && els.q.form.addEventListener("submit", function (e) { e.preventDefault(); state.q = els.q.value.trim(); apply(); });
    els.clear.addEventListener("click", function () { state.q = ""; syncControls(); apply(); els.q.focus(); });
    els.sort.addEventListener("change", function () { state.sort = els.sort.value; apply(); });
    els.origin.addEventListener("change", function () { state.origin = els.origin.value; apply(); });
    root.addEventListener("change", function (e) {
      var r = e.target;
      if (r.type === "radio" && ["cat", "nursery", "water"].indexOf(r.name) !== -1) { state[r.name] = r.value; apply(); }
    });
    root.addEventListener("click", function (e) {
      var c = e.target.closest("[data-clear]");
      if (c) { state[c.getAttribute("data-clear")] = ""; syncControls(); apply(); }
      if (e.target.closest("[data-reset]")) { state = { q: "", cat: "", nursery: "", origin: "", water: "", sort: state.sort }; syncControls(); apply(); }
    });

    // Mobile filter drawer
    var scrim;
    function openFilters() {
      els.filters.classList.add("is-open");
      scrim = document.createElement("div"); scrim.className = "scrim"; scrim.addEventListener("click", closeFilters);
      document.body.appendChild(scrim);
      els.openFilters.setAttribute("aria-expanded", "true");
      els.closeFilters.focus();
    }
    function closeFilters() {
      els.filters.classList.remove("is-open");
      if (scrim) { scrim.remove(); scrim = null; }
      els.openFilters.setAttribute("aria-expanded", "false");
    }
    els.openFilters.addEventListener("click", openFilters);
    els.closeFilters.addEventListener("click", function () { closeFilters(); els.openFilters.focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && els.filters.classList.contains("is-open")) closeFilters(); });

    syncControls();
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
