/* Efalp Nurseries — shared site behaviour: navigation, plant cards, plant detail, enquiry list. */
(function () {
  "use strict";
  var CFG = window.EFALP_CONFIG || {};
  var META = window.EFALP_META || { categories: [], nurseries: {}, featured: [] };
  var PLANTS = window.EFALP_PLANTS || [];
  var BY_ID = {};
  PLANTS.forEach(function (p) { BY_ID[p.id] = p; });

  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    photos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5L12 13l8.5-6.5"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>'
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nurseryName(id) { return (META.nurseries && META.nurseries[id]) || id; }
  function nurseryShort(id) { return nurseryName(id).replace(/ Nursery$/, ""); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  /* ---------- Image fallbacks: try the smaller file, then show a soft placeholder ---------- */
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG") return;
    var alt = img.getAttribute("data-fallback");
    if (alt && img.src !== alt) { img.removeAttribute("data-fallback"); img.src = alt; return; }
    img.style.visibility = "hidden";
    if (img.parentNode) img.parentNode.classList.add("img-fallback");
  }, true);

  /* ---------- Enquiry list (stored in this browser only) ---------- */
  var STORE_KEY = "efalp-enquiry-list";
  var enquiry = [];
  try { enquiry = JSON.parse(localStorage.getItem(STORE_KEY) || "[]").filter(function (id) { return BY_ID[id]; }); } catch (e) { enquiry = []; }
  function saveEnquiry() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(enquiry)); } catch (e) { /* storage unavailable */ }
    syncEnquiryUI();
  }
  function inEnquiry(id) { return enquiry.indexOf(id) !== -1; }
  function toggleEnquiry(id) {
    if (inEnquiry(id)) enquiry = enquiry.filter(function (x) { return x !== id; });
    else enquiry.push(id);
    saveEnquiry();
  }
  function enquiryText(ids) {
    var lines = ["Hello Efalp Nurseries,", "", "I would like to enquire about the following plants:", ""];
    ids.forEach(function (id) {
      var p = BY_ID[id];
      if (p) lines.push("- " + p.name + " (" + p.botanical + ")");
    });
    lines.push("", "Name:", "Company:", "Phone:", "Project location:", "", "Thank you.");
    return lines.join("\n");
  }
  function mailtoFor(ids, subject) {
    return "mailto:" + (CFG.email || "") + "?subject=" + encodeURIComponent(subject || "Plant enquiry - Efalp Nurseries") +
      "&body=" + encodeURIComponent(enquiryText(ids));
  }

  /* ---------- Plant card ---------- */
  function plantCard(p) {
    var img = p.images[0] || {};
    var tags = p.nurseries.map(function (n) { return '<span class="tag tag--nursery">' + esc(nurseryShort(n)) + "</span>"; }).join("");
    var vcount = p.varieties.length ? plural(p.varieties.length, "variety", "varieties") : "Water: " + p.water.toLowerCase();
    var pressed = inEnquiry(p.id);
    return '<article class="plant-card" data-id="' + esc(p.id) + '">' +
      '<button type="button" class="plant-card__open" data-open-plant="' + esc(p.id) + '" aria-label="View details for ' + esc(p.name) + '">' +
      '<div class="plant-card__media"><img src="' + esc(img.src) + '" alt="' + esc(p.name + " (" + p.botanical + ")") + '" loading="lazy" decoding="async" width="500" height="375">' +
      (p.images.length > 1 ? '<span class="plant-card__photos">' + ICON.photos + p.images.length + "</span>" : "") + "</div>" +
      '<div class="plant-card__body"><span class="plant-card__botanical">' + esc(p.botanical) + "</span>" +
      '<h3 class="plant-card__name">' + esc(p.name) + "</h3>" +
      (p.ar ? '<span class="plant-card__ar" lang="ar">' + esc(p.ar) + "</span>" : "") +
      '<div class="plant-card__tags">' + tags + "</div></div></button>" +
      '<div class="plant-card__foot"><span>' + esc(vcount) + "</span>" +
      '<button type="button" class="enquire-toggle" data-enquire="' + esc(p.id) + '" aria-pressed="' + pressed + '">' +
      (pressed ? ICON.check + "Added" : ICON.plus + "Enquire") + "</button></div></article>";
  }

  /* ---------- Plant detail dialog ---------- */
  var dialog, galleryIndex = 0, currentPlant = null, lastFocus = null;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "plant-dialog";
    dialog.setAttribute("aria-labelledby", "plant-dialog-title");
    dialog.innerHTML = '<button type="button" class="plant-dialog__close" data-close-dialog aria-label="Close">' + ICON.close + "</button>" +
      '<div class="plant-dialog__inner"><div class="gallery">' +
      '<div class="gallery__main"><img alt="" data-gallery-main>' +
      '<button type="button" class="gallery__nav gallery__nav--prev" data-gallery-step="-1" aria-label="Previous photo">' + ICON.prev + "</button>" +
      '<button type="button" class="gallery__nav gallery__nav--next" data-gallery-step="1" aria-label="Next photo">' + ICON.next + "</button></div>" +
      '<p class="gallery__credit" data-gallery-credit></p><div class="gallery__thumbs" data-gallery-thumbs></div></div>' +
      '<div class="detail" data-detail></div></div>';
    document.body.appendChild(dialog);
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) closePlant();
      var step = e.target.closest("[data-gallery-step]");
      if (step) showImage(galleryIndex + Number(step.getAttribute("data-gallery-step")));
      var th = e.target.closest("[data-gallery-thumb]");
      if (th) showImage(Number(th.getAttribute("data-gallery-thumb")));
      if (e.target.closest("[data-close-dialog]")) closePlant();
      var copy = e.target.closest("[data-copy-link]");
      if (copy) {
        var url = new URL("catalogue.html?plant=" + currentPlant.id, location.href).href;
        copyText(url).then(function () { copy.lastChild.textContent = "Link copied"; });
      }
    });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") showImage(galleryIndex - 1);
      if (e.key === "ArrowRight") showImage(galleryIndex + 1);
    });
    dialog.addEventListener("close", function () {
      document.documentElement.style.overflow = "";
      if (new URLSearchParams(location.search).get("plant")) {
        var u = new URL(location.href); u.searchParams.delete("plant");
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
    return dialog;
  }
  function showImage(i) {
    var p = currentPlant; if (!p) return;
    var n = p.images.length;
    galleryIndex = (i + n) % n;
    var im = p.images[galleryIndex];
    var main = dialog.querySelector("[data-gallery-main]");
    main.style.visibility = "";
    main.parentNode.classList.remove("img-fallback");
    main.setAttribute("data-fallback", im.src);
    main.src = im.large;
    main.alt = p.name + " (" + p.botanical + "), photo " + (galleryIndex + 1) + " of " + n;
    dialog.querySelector("[data-gallery-credit]").innerHTML = "Photo " + (galleryIndex + 1) + " of " + n + ": " +
      (im.by ? esc(im.by) + ", " : "") + esc(im.lic) + ' &mdash; <a href="' + esc(im.page) + '" target="_blank" rel="noopener">Wikimedia Commons</a>';
    Array.prototype.forEach.call(dialog.querySelectorAll("[data-gallery-thumb]"), function (b, k) {
      b.setAttribute("aria-current", k === galleryIndex ? "true" : "false");
    });
    dialog.querySelectorAll(".gallery__nav").forEach(function (b) { b.hidden = n < 2; });
  }
  function openPlant(id, opts) {
    var p = BY_ID[id]; if (!p) return;
    ensureDialog();
    currentPlant = p;
    lastFocus = document.activeElement;
    dialog.querySelector("[data-gallery-thumbs]").innerHTML = p.images.map(function (im, k) {
      return '<button type="button" data-gallery-thumb="' + k + '" aria-label="Show photo ' + (k + 1) + '"><img src="' + esc(im.src) + '" alt="" loading="lazy"></button>';
    }).join("");
    var spec = [
      ["Family", p.family], ["Plant type", p.type], ["Light", p.light], ["Water needs", p.water],
      ["Native region", p.native], ["Origin of stock", p.origins.length ? p.origins.join(", ") : "On request"],
      ["Available at", p.nurseries.map(nurseryName).join(" and ")]
    ];
    var vt = "";
    if (p.varieties.length) {
      vt = "<h3>" + plural(p.varieties.length, "variety", "varieties") + " available</h3>" +
        '<table class="varieties"><thead><tr><th scope="col">Variety</th><th scope="col">Nursery</th><th scope="col">Origin</th></tr></thead><tbody>' +
        p.varieties.map(function (v) {
          return "<tr><td>" + esc(v.name) + "</td><td>" + esc(v.nurseries.map(nurseryShort).join(", ")) + "</td><td>" + esc(v.origins.join(", ") || "-") + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    var pressed = inEnquiry(p.id);
    dialog.querySelector("[data-detail]").innerHTML =
      '<p class="detail__botanical">' + esc(p.botanical) + "</p>" +
      '<h2 id="plant-dialog-title">' + esc(p.name) + "</h2>" +
      (p.ar ? '<p class="detail__ar" lang="ar">' + esc(p.ar) + "</p>" : "") +
      '<div class="plant-card__tags"><span class="tag">' + esc(p.category) + "</span>" +
      p.nurseries.map(function (n) { return '<span class="tag tag--nursery">' + esc(nurseryName(n)) + "</span>"; }).join("") + "</div>" +
      '<p class="detail__desc">' + esc(p.desc) + "</p>" +
      '<dl class="spec">' + spec.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
      "<h3>Uses</h3><div class=\"uses\">" + p.uses.map(function (u) { return '<span class="chip">' + esc(u) + "</span>"; }).join("") + "</div>" +
      vt +
      '<div class="detail__actions"><button type="button" class="btn btn--primary enquire-big" data-enquire="' + esc(p.id) + '" aria-pressed="' + pressed + '">' +
      (pressed ? ICON.check + "Added to enquiry list" : ICON.plus + "Add to enquiry list") + "</button>" +
      '<a class="btn btn--ghost" href="' + esc(mailtoFor([p.id], "Enquiry: " + p.name)) + '">' + ICON.mail + "Email about this plant</a>" +
      '<button type="button" class="btn btn--ghost" data-copy-link>' + ICON.link + "<span>Copy link</span></button></div>";
    dialog.querySelector(".detail").scrollTop = 0;
    showImage(0);
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
      document.documentElement.style.overflow = "hidden";
    }
    if (!opts || !opts.noUrl) {
      var u = new URL(location.href); u.searchParams.set("plant", p.id);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
    dialog.querySelector(".plant-dialog__close").focus();
  }
  function closePlant() { if (dialog && dialog.open) dialog.close(); }

  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(fallback);
    return Promise.resolve(fallback());
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) { /* ignore */ } ta.remove();
    }
  }

  /* ---------- Enquiry drawer ---------- */
  var fab, drawer, scrim;
  function buildEnquiryUI() {
    fab = document.createElement("button");
    fab.type = "button";
    fab.className = "btn btn--primary enquiry-fab";
    fab.innerHTML = ICON.list + 'Enquiry list <span class="count">0</span>';
    fab.addEventListener("click", openDrawer);
    drawer = document.createElement("aside");
    drawer.className = "drawer";
    drawer.setAttribute("aria-label", "Enquiry list");
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = '<div class="drawer__head"><h2>Your enquiry list</h2><button type="button" class="icon-btn" data-close-drawer aria-label="Close enquiry list">' + ICON.close + "</button></div>" +
      '<div class="drawer__body" data-drawer-body></div>' +
      '<div class="drawer__foot"><a class="btn btn--primary" data-drawer-mail href="#">' + ICON.mail + 'Email this list</a>' +
      '<a class="btn btn--ghost" href="contact.html#enquiry">Send with your details</a>' +
      '<button type="button" class="btn btn--ghost" data-drawer-copy>Copy list</button></div>';
    document.body.appendChild(fab);
    document.body.appendChild(drawer);
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-close-drawer]")) closeDrawer();
      var rm = e.target.closest("[data-remove]");
      if (rm) toggleEnquiry(rm.getAttribute("data-remove"));
      var cp = e.target.closest("[data-drawer-copy]");
      if (cp) copyText(enquiryText(enquiry)).then(function () { cp.textContent = "List copied"; setTimeout(function () { cp.textContent = "Copy list"; }, 2000); });
      var op = e.target.closest("[data-open-plant]");
      if (op) { closeDrawer(); openPlant(op.getAttribute("data-open-plant")); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer(); });
  }
  function openDrawer() {
    scrim = document.createElement("div"); scrim.className = "scrim"; scrim.addEventListener("click", closeDrawer);
    document.body.appendChild(scrim);
    drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false");
    drawer.querySelector("[data-close-drawer]").focus();
  }
  function closeDrawer() {
    drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true");
    if (scrim) { scrim.remove(); scrim = null; }
    fab.focus();
  }
  function syncEnquiryUI() {
    if (!fab) return;
    fab.querySelector(".count").textContent = enquiry.length;
    fab.classList.toggle("is-visible", enquiry.length > 0);
    var body = drawer.querySelector("[data-drawer-body]");
    body.innerHTML = enquiry.length ? enquiry.map(function (id) {
      var p = BY_ID[id];
      return '<div class="drawer__item"><img src="' + esc(p.images[0].src) + '" alt=""><div><button type="button" class="linklike" data-open-plant="' + esc(id) + '" style="all:unset;cursor:pointer"><strong>' + esc(p.name) + "</strong></button><em>" + esc(p.botanical) + "</em></div>" +
        '<button type="button" class="icon-btn" data-remove="' + esc(id) + '" aria-label="Remove ' + esc(p.name) + '">' + ICON.trash + "</button></div>";
    }).join("") : '<p style="color:var(--muted);padding:16px 0">Your list is empty. Use "Enquire" on any plant to add it.</p>';
    drawer.querySelector("[data-drawer-mail]").href = mailtoFor(enquiry);
    document.querySelectorAll("[data-enquire]").forEach(function (b) {
      var on = inEnquiry(b.getAttribute("data-enquire"));
      b.setAttribute("aria-pressed", on);
      if (b.classList.contains("enquire-big")) b.innerHTML = on ? ICON.check + "Added to enquiry list" : ICON.plus + "Add to enquiry list";
      else b.innerHTML = on ? ICON.check + "Added" : ICON.plus + "Enquire";
    });
    document.dispatchEvent(new CustomEvent("efalp:enquiry", { detail: enquiry.slice() }));
  }

  /* ---------- Page sections rendered from data ---------- */
  var COLLECTION_IMAGE = {
    "Fruit Trees": "mango", "Citrus": "orange", "Palms & Cycads": "date-palm", "Native & Desert Trees": "sidr",
    "Shade & Flowering Trees": "delonix", "Tropical & Specialty Crops": "cocoa",
    "Shrubs, Climbers & Ornamentals": "bougainvillea", "Herbs & Medicinal Plants": "aloe-vera"
  };
  function renderSections() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var k = el.getAttribute("data-count");
      var n = 0;
      if (k === "species") n = PLANTS.length;
      else if (k === "varieties") n = PLANTS.reduce(function (a, p) { return a + p.varieties.length; }, 0);
      else if (k === "origins") { var s = {}; PLANTS.forEach(function (p) { p.origins.forEach(function (o) { s[o] = 1; }); }); n = Object.keys(s).length; }
      else if (k === "categories") n = META.categories.length;
      else if (k.indexOf("nursery:") === 0) { var nid = k.split(":")[1]; n = PLANTS.filter(function (p) { return p.nurseries.indexOf(nid) !== -1; }).length; }
      else if (k.indexOf("nurseryvar:") === 0) { var vid = k.split(":")[1]; n = PLANTS.reduce(function (a, p) { return a + p.varieties.filter(function (v) { return v.nurseries.indexOf(vid) !== -1; }).length; }, 0); }
      el.textContent = n;
    });
    var col = document.querySelector("[data-collections]");
    if (col) {
      col.innerHTML = META.categories.map(function (c) {
        var n = PLANTS.filter(function (p) { return p.category === c; }).length;
        var p = BY_ID[COLLECTION_IMAGE[c]] || PLANTS.filter(function (x) { return x.category === c; })[0];
        return '<a class="collection" href="catalogue.html?cat=' + encodeURIComponent(c) + '"><div class="collection__img"><img src="' + esc(p.images[0].src) + '" alt="" loading="lazy"></div>' +
          '<div class="collection__body"><span class="collection__name">' + esc(c) + '</span><span class="collection__count">' + plural(n, "species", "species") + "</span></div></a>";
      }).join("");
    }
    var feat = document.querySelector("[data-featured]");
    if (feat) feat.innerHTML = META.featured.map(function (id) { return BY_ID[id] ? plantCard(BY_ID[id]) : ""; }).join("");
    document.querySelectorAll("[data-nursery-highlights]").forEach(function (el) {
      var nid = el.getAttribute("data-nursery-highlights");
      var ids = (el.getAttribute("data-ids") || "").split(",").filter(function (id) { return BY_ID[id]; });
      el.innerHTML = ids.map(function (id) {
        var p = BY_ID[id];
        return '<button type="button" class="mini" data-open-plant="' + esc(id) + '" style="all:unset;cursor:pointer;display:block"><img src="' + esc(p.images[0].src) + '" alt="" loading="lazy"><span class="mini__label" style="display:block;font-size:.88rem;font-weight:600;margin-top:6px;line-height:1.25">' + esc(p.name) + "</span></button>";
      }).join("");
      el.setAttribute("data-nursery", nid);
    });
    document.querySelectorAll("[data-nursery-list]").forEach(function (el) {
      var nid = el.getAttribute("data-nursery-list");
      var groups = {};
      PLANTS.filter(function (p) { return p.nurseries.indexOf(nid) !== -1; }).forEach(function (p) { (groups[p.category] = groups[p.category] || []).push(p.name); });
      el.innerHTML = META.categories.filter(function (c) { return groups[c]; }).map(function (c) {
        return "<li><strong>" + esc(c) + "</strong><span>" + esc(groups[c].join(", ")) + "</span></li>";
      }).join("");
    });
    var origins = document.querySelector("[data-origin-list]");
    if (origins) {
      var s = {}; PLANTS.forEach(function (p) { p.origins.forEach(function (o) { s[o] = 1; }); });
      origins.innerHTML = Object.keys(s).sort().map(function (o) { return '<a class="chip" href="catalogue.html?origin=' + encodeURIComponent(o) + '">' + esc(o) + "</a>"; }).join("");
    }
    var credits = document.querySelector("[data-credits]");
    if (credits) {
      credits.innerHTML = PLANTS.map(function (p) {
        return p.images.map(function (im, k) {
          return "<tr><td>" + (k === 0 ? "<strong>" + esc(p.name) + '</strong><br><span class="botanical">' + esc(p.botanical) + "</span>" : "") + "</td><td>Photo " + (k + 1) + "</td><td>" + esc(im.by || "Unknown") + "</td><td>" + esc(im.lic) + '</td><td><a href="' + esc(im.page) + '" target="_blank" rel="noopener">Source</a></td></tr>';
        }).join("");
      }).join("");
    }
  }

  /* ---------- Contact form: compose an email with the enquiry list ---------- */
  function initContactForm() {
    var form = document.querySelector("[data-enquiry-form]");
    if (!form) return;
    var listField = form.querySelector("[name=plants]");
    function fillList() {
      if (!listField) return;
      if (enquiry.length && !listField.dataset.touched) listField.value = enquiry.map(function (id) { return BY_ID[id].name + " (" + BY_ID[id].botanical + ")"; }).join("\n");
    }
    if (listField) listField.addEventListener("input", function () { listField.dataset.touched = "1"; });
    fillList();
    document.addEventListener("efalp:enquiry", fillList);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var errs = form.querySelector("[data-form-error]");
      if (!String(d.get("name") || "").trim() || !String(d.get("email") || "").trim()) {
        errs.textContent = "Add your name and email so the nursery team can reply.";
        (String(d.get("name") || "").trim() ? form.querySelector("[name=email]") : form.querySelector("[name=name]")).focus();
        return;
      }
      errs.textContent = "";
      var body = [
        "Name: " + d.get("name"), "Company: " + (d.get("company") || "-"), "Email: " + d.get("email"), "Phone: " + (d.get("phone") || "-"),
        "Preferred nursery: " + (d.get("nursery") || "Either"), "Project location: " + (d.get("location") || "-"), "",
        "Plants of interest:", String(d.get("plants") || "-"), "", "Message:", String(d.get("message") || "-")
      ].join("\n");
      location.href = "mailto:" + CFG.email + "?subject=" + encodeURIComponent("Plant enquiry from " + d.get("name")) + "&body=" + encodeURIComponent(body);
      var ok = form.querySelector("[data-form-ok]");
      if (ok) ok.textContent = "Your email app should now open with the enquiry ready to send. If it doesn't, email " + CFG.email + " directly.";
    });
  }

  /* ---------- Fill config-driven text ---------- */
  function applyConfig() {
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      var k = el.getAttribute("data-cfg"); var v = CFG[k]; if (!v) return;
      if (el.tagName === "A") {
        if (k === "email") el.href = "mailto:" + v;
        else if (k === "phone" || k === "phoneAlt") el.href = "tel:" + v.replace(/\s+/g, "");
        else el.href = v;
      }
      if (!el.hasAttribute("data-cfg-keep")) el.textContent = v;
    });
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Global wiring ---------- */
  function init() {
    applyConfig();
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open);
      });
    }
    buildEnquiryUI();
    renderSections();
    syncEnquiryUI();
    initContactForm();
    document.addEventListener("click", function (e) {
      var en = e.target.closest("[data-enquire]");
      if (en) { e.preventDefault(); toggleEnquiry(en.getAttribute("data-enquire")); return; }
      var op = e.target.closest("[data-open-plant]");
      if (op && !op.closest(".drawer")) { e.preventDefault(); openPlant(op.getAttribute("data-open-plant")); }
    });
    var hero = document.querySelector("[data-finder]");
    if (hero) hero.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = hero.querySelector("input").value.trim();
      location.href = "catalogue.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
    var deep = new URLSearchParams(location.search).get("plant");
    if (deep && BY_ID[deep]) openPlant(deep, { noUrl: true });
  }

  window.EF = {
    plants: PLANTS, meta: META, byId: BY_ID, config: CFG, esc: esc, plantCard: plantCard, openPlant: openPlant,
    nurseryName: nurseryName, nurseryShort: nurseryShort, plural: plural, syncEnquiryUI: syncEnquiryUI, icon: ICON
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
