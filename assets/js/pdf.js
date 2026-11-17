/* Efalp Nurseries — builds the downloadable PDF catalogue in the browser.
   A small self-contained PDF writer (no external libraries): vector text in standard PDF fonts + JPEG photos. */
(function () {
  "use strict";

  /* ================= Minimal PDF writer ================= */
  var WIN = { 0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F };
  function toWin(s) {
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF) { i++; out += "?"; continue; }
      if (c < 128 || (c >= 0xA0 && c <= 0xFF)) out += s.charAt(i);
      else if (WIN[c]) out += String.fromCharCode(WIN[c]);
      else {
        var b = s.charAt(i).normalize("NFD").replace(/[̀-ͯ]/g, "");
        out += (b && b.charCodeAt(0) < 256) ? b : (c === 0x2192 ? "->" : "-");
      }
    }
    return out;
  }
  function pdfStr(s) { return "(" + toWin(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\r?\n/g, " ") + ")"; }
  function n(v) { return (Math.round(v * 100) / 100).toString(); }
  function latin1(s) { var a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 255; return a; }
  function rgb(hex) { var h = hex.replace("#", ""); return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255].map(function (x) { return n(x); }).join(" "); }

  function Pdf() {
    this.W = 595.28; this.H = 841.89;
    this.objects = []; this.pages = []; this.images = [];
    this.catalogId = this.newObj(); this.pagesId = this.newObj();
    var fonts = { F1: "Helvetica", F2: "Helvetica-Bold", F3: "Helvetica-Oblique", F4: "Times-Italic" };
    this.fontIds = {};
    for (var k in fonts) {
      var id = this.newObj();
      this.setObj(id, ["<< /Type /Font /Subtype /Type1 /BaseFont /" + fonts[k] + " /Encoding /WinAnsiEncoding >>"]);
      this.fontIds[k] = id;
    }
    this.ctx = document.createElement("canvas").getContext("2d");
  }
  Pdf.prototype.newObj = function () { this.objects.push(null); return this.objects.length; };
  Pdf.prototype.setObj = function (id, chunks) { this.objects[id - 1] = chunks; };
  Pdf.prototype.addImage = function (bytes, w, h) {
    var id = this.newObj(), name = "Im" + (this.images.length + 1);
    this.setObj(id, ["<< /Type /XObject /Subtype /Image /Width " + w + " /Height " + h + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + bytes.length + " >>\nstream\n", bytes, "\nendstream"]);
    this.images.push({ id: id, name: name });
    return name;
  };
  Pdf.prototype.addPage = function () { var p = { ops: [], imgs: {}, links: [] }; this.pages.push(p); this.cur = p; return p; };
  Pdf.prototype.usePage = function (p) { this.cur = p; };
  Pdf.prototype.op = function (s) { this.cur.ops.push(s); };
  Pdf.prototype.font = function (f, size) {
    var css = { F1: "", F2: "bold ", F3: "italic ", F4: "italic " }[f] + size + "px " + (f === "F4" ? '"Times New Roman", Times, serif' : "Helvetica, Arial, sans-serif");
    this.ctx.font = css;
  };
  Pdf.prototype.measure = function (s, f, size) { this.font(f, size); return this.ctx.measureText(s).width; };
  Pdf.prototype.text = function (s, x, y, f, size, color, align) {
    if (!s) return;
    var w = 0;
    if (align === "right" || align === "center") { w = this.measure(s, f, size); x = align === "right" ? x - w : x - w / 2; }
    this.op("BT /" + f + " " + n(size) + " Tf " + rgb(color || "#17251d") + " rg 1 0 0 1 " + n(x) + " " + n(this.H - y) + " Tm " + pdfStr(s) + " Tj ET");
  };
  Pdf.prototype.rect = function (x, y, w, h, color) { this.op(rgb(color) + " rg " + n(x) + " " + n(this.H - y - h) + " " + n(w) + " " + n(h) + " re f"); };
  Pdf.prototype.rrPath = function (x, y, w, h, r) {
    var X = x, Y = this.H - y - h, k = 0.5523 * r;
    return n(X + r) + " " + n(Y) + " m " + n(X + w - r) + " " + n(Y) + " l " +
      n(X + w - r + k) + " " + n(Y) + " " + n(X + w) + " " + n(Y + r - k) + " " + n(X + w) + " " + n(Y + r) + " c " +
      n(X + w) + " " + n(Y + h - r) + " l " + n(X + w) + " " + n(Y + h - r + k) + " " + n(X + w - r + k) + " " + n(Y + h) + " " + n(X + w - r) + " " + n(Y + h) + " c " +
      n(X + r) + " " + n(Y + h) + " l " + n(X + r - k) + " " + n(Y + h) + " " + n(X) + " " + n(Y + h - r + k) + " " + n(X) + " " + n(Y + h - r) + " c " +
      n(X) + " " + n(Y + r) + " l " + n(X) + " " + n(Y + r - k) + " " + n(X + r - k) + " " + n(Y) + " " + n(X + r) + " " + n(Y) + " c h";
  };
  Pdf.prototype.roundRect = function (x, y, w, h, r, color) { this.op(rgb(color) + " rg " + this.rrPath(x, y, w, h, r) + " f"); };
  Pdf.prototype.line = function (x1, y1, x2, y2, color, width) { this.op(rgb(color) + " RG " + n(width || 0.6) + " w " + n(x1) + " " + n(this.H - y1) + " m " + n(x2) + " " + n(this.H - y2) + " l S"); };
  Pdf.prototype.image = function (name, x, y, w, h, radius) {
    var img = null;
    for (var i = 0; i < this.images.length; i++) if (this.images[i].name === name) img = this.images[i];
    this.cur.imgs[name] = img.id;
    var clip = radius ? this.rrPath(x, y, w, h, radius) + " W n " : "";
    this.op("q " + clip + n(w) + " 0 0 " + n(h) + " " + n(x) + " " + n(this.H - y - h) + " cm /" + name + " Do Q");
  };
  Pdf.prototype.link = function (x, y, w, h, url) { this.cur.links.push({ r: [x, this.H - y - h, x + w, this.H - y], url: url }); };
  Pdf.prototype.wrap = function (s, f, size, maxW) {
    var words = String(s || "").split(/\s+/).filter(Boolean), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (this.measure(test, f, size) <= maxW) { line = test; continue; }
      if (line) lines.push(line);
      line = words[i];
      while (this.measure(line, f, size) > maxW && line.length > 1) {
        var cut = line.length - 1;
        while (cut > 1 && this.measure(line.slice(0, cut), f, size) > maxW) cut--;
        lines.push(line.slice(0, cut)); line = line.slice(cut);
      }
    }
    if (line) lines.push(line);
    return lines;
  };
  Pdf.prototype.output = function (title) {
    var self = this, kids = [];
    var fontRes = Object.keys(this.fontIds).map(function (k) { return "/" + k + " " + self.fontIds[k] + " 0 R"; }).join(" ");
    this.pages.forEach(function (p) {
      var content = latin1(p.ops.join("\n"));
      var cid = self.newObj();
      self.setObj(cid, ["<< /Length " + content.length + " >>\nstream\n", content, "\nendstream"]);
      var annots = p.links.map(function (l) {
        var aid = self.newObj();
        self.setObj(aid, ["<< /Type /Annot /Subtype /Link /Rect [" + l.r.map(n).join(" ") + "] /Border [0 0 0] /A << /S /URI /URI " + pdfStr(l.url) + " >> >>"]);
        return aid + " 0 R";
      });
      var xo = Object.keys(p.imgs).map(function (k) { return "/" + k + " " + p.imgs[k] + " 0 R"; }).join(" ");
      var pid = self.newObj();
      self.setObj(pid, ["<< /Type /Page /Parent " + self.pagesId + " 0 R /MediaBox [0 0 " + n(self.W) + " " + n(self.H) + "] /Resources << /Font << " + fontRes + " >>" +
        (xo ? " /XObject << " + xo + " >>" : "") + " >> /Contents " + cid + " 0 R" + (annots.length ? " /Annots [" + annots.join(" ") + "]" : "") + " >>"]);
      kids.push(pid + " 0 R");
    });
    this.setObj(this.pagesId, ["<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + kids.length + " >>"]);
    this.setObj(this.catalogId, ["<< /Type /Catalog /Pages " + this.pagesId + " 0 R /PageMode /UseNone >>"]);
    var d = new Date(), pad = function (x) { return (x < 10 ? "0" : "") + x; };
    var infoId = this.newObj();
    this.setObj(infoId, ["<< /Title " + pdfStr(title) + " /Author (Efalp Nurseries) /Producer (Efalp Nurseries website) /CreationDate (D:" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getHours()) + pad(d.getMinutes()) + ") >>"]);

    var parts = [latin1("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")], len = parts[0].length, offsets = [];
    this.objects.forEach(function (chunks, i) {
      offsets.push(len);
      var head = latin1((i + 1) + " 0 obj\n"); parts.push(head); len += head.length;
      chunks.forEach(function (c) { var b = typeof c === "string" ? latin1(c) : c; parts.push(b); len += b.length; });
      var tail = latin1("\nendobj\n"); parts.push(tail); len += tail.length;
    });
    var xref = "xref\n0 " + (this.objects.length + 1) + "\n0000000000 65535 f \n" +
      offsets.map(function (o) { return ("0000000000" + o).slice(-10) + " 00000 n \n"; }).join("") +
      "trailer\n<< /Size " + (this.objects.length + 1) + " /Root " + this.catalogId + " 0 R /Info " + infoId + " 0 R >>\nstartxref\n" + len + "\n%%EOF\n";
    parts.push(latin1(xref));
    return new Blob(parts, { type: "application/pdf" });
  };

  /* ================= Image helpers ================= */
  function loadImg(url) {
    return new Promise(function (resolve, reject) {
      var im = new Image(), done = false;
      im.crossOrigin = "anonymous";
      im.onload = function () { if (!done) { done = true; resolve(im); } };
      im.onerror = function () { if (!done) { done = true; reject(new Error("load")); } };
      setTimeout(function () { if (!done) { done = true; reject(new Error("timeout")); } }, 25000);
      im.src = url;
    });
  }
  function b64ToBytes(b64) { var bin = atob(b64), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
  function canvasJpeg(im, w, h, mode, bg, quality) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d"); x.fillStyle = bg || "#ffffff"; x.fillRect(0, 0, w, h);
    var s = mode === "contain" ? Math.min(w / im.naturalWidth, h / im.naturalHeight) : Math.max(w / im.naturalWidth, h / im.naturalHeight);
    var dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    x.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
    return b64ToBytes(c.toDataURL("image/jpeg", quality || 0.82).split(",")[1]);
  }
  function getJpeg(url, w, h, mode, bg, q) {
    return loadImg(url).catch(function () { return loadImg(url + (url.indexOf("?") === -1 ? "?" : "&") + "pdf=1"); })
      .then(function (im) { return canvasJpeg(im, w, h, mode, bg, q); });
  }
  function pool(items, limit, fn, onDone) {
    var i = 0, results = new Array(items.length), active = 0, finished = 0;
    return new Promise(function (resolve) {
      if (!items.length) return resolve(results);
      function next() {
        while (active < limit && i < items.length) {
          (function (k) {
            active++;
            fn(items[k]).then(function (r) { results[k] = r; }, function () { results[k] = null; }).then(function () {
              active--; finished++; if (onDone) onDone(finished, items.length);
              if (finished === items.length) resolve(results); else next();
            });
          })(i++);
        }
      }
      next();
    });
  }

  /* ================= Catalogue layout ================= */
  var C = { grove: "#123e2b", fern: "#13804a", leaf: "#62ad3e", ink: "#17251d", muted: "#536459", line: "#d3dbcc", stone: "#eef1ea", white: "#ffffff", soft: "#cfe3bf" };

  function buildCatalogue(opts, progress) {
    var EF = window.EF, CFG = EF.config, META = EF.meta;
    var plants = opts.ids.map(function (id) { return EF.byId[id]; }).filter(Boolean);
    plants.sort(function (a, b) { return META.categories.indexOf(a.category) - META.categories.indexOf(b.category) || a.name.localeCompare(b.name); });
    var withPhotos = opts.photos;
    var cover = EF.byId.ghaf || plants[0];

    progress(0, "Preparing photos");
    var jobs = [];
    if (withPhotos) {
      jobs.push({ kind: "cover", url: cover.images[0].large, fallback: cover.images[0].src });
      plants.forEach(function (p) { jobs.push({ kind: "plant", id: p.id, url: p.images[0].src }); });
    }
    jobs.push({ kind: "logo", url: "assets/img/efalp-nurseries-logo.png" });

    return pool(jobs, 6, function (j) {
      if (j.kind === "cover") return getJpeg(j.url, 1190, 960, "cover", C.grove, 0.8).catch(function () { return getJpeg(j.fallback, 1000, 806, "cover", C.grove, 0.8); });
      if (j.kind === "logo") return getJpeg(j.url, 260, 248, "contain", "#ffffff", 0.92);
      return getJpeg(j.url, 480, 360, "cover", "#ffffff", 0.8);
    }, function (done, total) { progress(done / total * 0.9, withPhotos ? "Preparing photos " + Math.min(done, total) + " of " + total : "Preparing"); })
      .then(function (bytes) {
        progress(0.92, "Laying out pages");
        var doc = new Pdf();
        var imgs = {};
        jobs.forEach(function (j, k) {
          if (!bytes[k]) return;
          if (j.kind === "cover") imgs.cover = doc.addImage(bytes[k], 1190, 960);
          else if (j.kind === "logo") imgs.logo = doc.addImage(bytes[k], 260, 248);
          else imgs[j.id] = doc.addImage(bytes[k], 480, 360);
        });
        layout(doc, plants, imgs, opts, CFG, META, EF);
        progress(0.98, "Saving PDF");
        return { blob: doc.output("Efalp Nurseries Plant Catalogue"), missing: plants.filter(function (p) { return withPhotos && !imgs[p.id]; }).length };
      });
  }

  function layout(doc, plants, imgs, opts, CFG, META, EF) {
    var W = doc.W, H = doc.H, M = 44, CW = W - 2 * M;
    var scopeLabel = opts.scopeLabel;
    var updated = META.updated || "";
    var site = (CFG.website || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

    /* ---- Cover ---- */
    doc.addPage();
    doc.rect(0, 0, W, H, C.grove);
    var photoH = 480;
    if (imgs.cover) doc.image(imgs.cover, 0, 0, W, photoH);
    else doc.rect(0, 0, W, photoH, "#1d5a3f");
    doc.rect(0, photoH, W, 4, C.leaf);
    if (imgs.logo) { doc.roundRect(M, photoH - 62, 124, 118, 14, C.white); doc.image(imgs.logo, M + 10, photoH - 52, 104, 99); }
    doc.text("Plant Catalogue", M, photoH + 120, "F2", 44, C.white);
    doc.text(scopeLabel, M, photoH + 152, "F1", 15, "#cfe3bf");
    var sub = doc.wrap("Fruit trees, citrus, palms, native desert trees, shade and flowering trees, specialty crops and ornamentals, grown in Fujairah for UAE farms, landscapes and estates.", "F1", 11.5, CW - 60);
    sub.forEach(function (l, i) { doc.text(l, M, photoH + 186 + i * 16, "F1", 11.5, "#e6efe0"); });
    doc.text(plants.length + " species" + (updated ? "   |   Stock list updated " + updated : ""), M, photoH + 186 + sub.length * 16 + 14, "F2", 10.5, C.white);
    doc.line(M, H - 70, W - M, H - 70, "#2f6a4f", 0.8);
    doc.text("Efalp Nurseries, a division of " + (CFG.parentShort || "Emirates Farm (EFALP)"), M, H - 50, "F2", 9.5, C.white);
    doc.text((CFG.email || "") + "   " + (CFG.phone || "") + "   " + site, M, H - 35, "F1", 9, "#cfe3bf");
    if (cover() && imgs.cover) doc.text("Cover: Ghaf (Prosopis cineraria), the national tree of the UAE.", W - M, photoH - 12, "F3", 7.5, "#ffffff", "right");
    function cover() { return EF.byId.ghaf; }

    /* ---- Intro page (contents filled after layout) ---- */
    var intro = doc.addPage();
    var contents = [];
    var pageNo = 2;

    /* ---- Plant pages ---- */
    var y = 0, page = null, curCat = null;
    function header(cat) {
      doc.text("Efalp Nurseries  |  Plant Catalogue", M, 30, "F1", 8, C.muted);
      doc.text(cat, W - M, 30, "F2", 8, C.fern, "right");
      doc.line(M, 38, W - M, 38, C.line, 0.6);
    }
    function footer(num) {
      doc.line(M, H - 40, W - M, H - 40, C.line, 0.6);
      doc.text(site + "   |   " + (CFG.email || ""), M, H - 26, "F1", 8, C.muted);
      doc.text(String(num), W - M, H - 26, "F2", 8.5, C.grove, "right");
    }
    function newPage(cat) {
      page = doc.addPage(); pageNo++;
      header(cat); footer(pageNo);
      y = 62;
    }
    var bottom = H - 58;

    var IMGW = 168, IMGH = 126, X0 = M + IMGW + 18, TW = W - M - X0, LW = 78;
    function specRows(p) {
      var rows = [
        ["Native region", p.native],
        ["Origin of stock", p.origins.length ? p.origins.join(", ") : "On request"],
        ["Light / water", p.light + "; water needs " + p.water.toLowerCase()],
        ["Available at", p.nurseries.map(EF.nurseryName).join(" and ")]
      ];
      if (p.varieties.length) rows.push(["Varieties", p.varieties.map(function (v) { return v.name; }).join(", ")]);
      return rows;
    }
    function measureEntry(p) {
      var h = 14 + 15 + 13;
      var desc = doc.wrap(p.desc, "F1", 9.2, TW);
      h += desc.length * 12.6 + 6;
      specRows(p).forEach(function (r) { h += doc.wrap(r[1], "F1", 8.4, TW - LW).length * 11.4 + 2.5; });
      return { h: Math.max(IMGH, h), desc: desc };
    }
    function drawEntry(p, m) {
      if (imgs[p.id]) doc.image(imgs[p.id], M, y, IMGW, IMGH, 6);
      else { doc.roundRect(M, y, IMGW, IMGH, 6, C.stone); doc.text(p.name, M + IMGW / 2, y + IMGH / 2 + 3, "F2", 9, C.muted, "center"); }
      var ty = y + 13;
      doc.text(p.name, X0, ty, "F2", 14, C.ink);
      ty += 15; doc.text(p.botanical, X0, ty, "F4", 11, C.muted);
      ty += 13; doc.text(p.type + ", " + p.family, X0, ty, "F1", 8.5, C.fern);
      ty += 15;
      m.desc.forEach(function (l) { doc.text(l, X0, ty, "F1", 9.2, C.ink); ty += 12.6; });
      ty += 4;
      specRows(p).forEach(function (r) {
        doc.text(r[0], X0, ty, "F2", 7.8, C.muted);
        doc.wrap(r[1], "F1", 8.4, TW - LW).forEach(function (l) { doc.text(l, X0 + LW, ty, "F1", 8.4, C.ink); ty += 11.4; });
        ty += 2.5;
      });
    }

    plants.forEach(function (p) {
      var m = measureEntry(p);
      if (p.category !== curCat) {
        var catCount = plants.filter(function (x) { return x.category === p.category; }).length;
        if (!page || y + 58 + m.h > bottom) newPage(p.category);
        else { y += 6; }
        curCat = p.category;
        contents.push({ cat: p.category, count: catCount, page: pageNo });
        doc.rect(M, y, 4, 26, C.leaf);
        doc.text(p.category, M + 14, y + 19, "F2", 19, C.grove);
        doc.text(catCount + (catCount === 1 ? " species" : " species"), W - M, y + 19, "F1", 9.5, C.muted, "right");
        y += 40;
        doc.line(M, y - 6, W - M, y - 6, C.line, 0.8);
        y += 6;
      } else if (y + m.h > bottom) {
        newPage(p.category);
      }
      drawEntry(p, m);
      y += m.h + 14;
      if (y + 10 < bottom) doc.line(M, y - 2, W - M, y - 2, "#e3e8dd", 0.6);
      y += 12;
    });

    /* ---- Closing page: contact + credits ---- */
    newPage("Contact and photo credits");
    doc.text("Visit or contact the nurseries", M, y + 18, "F2", 20, C.grove);
    y += 44;
    var blurb = doc.wrap("Availability changes through the season. Share your plant list with our team to confirm current stock, sizes and a visit to Al Raheeb or Dhadna nursery.", "F1", 10, CW);
    blurb.forEach(function (l) { doc.text(l, M, y, "F1", 10, C.ink); y += 14; });
    y += 10;
    var colW = (CW - 20) / 2;
    [["Sales and enquiries", [CFG.parentCompany || "", CFG.poBox || "", "Tel " + (CFG.phone || "") + (CFG.phoneAlt ? " / " + CFG.phoneAlt : ""), "Email " + (CFG.email || ""), site]],
     ["Our nurseries", [CFG.nurseries.raheeb.name + " - " + CFG.nurseries.raheeb.place, CFG.nurseries.dhadna.name + " - " + CFG.nurseries.dhadna.place]]
    ].forEach(function (blk, i) {
      var x = M + i * (colW + 20), yy = y;
      doc.roundRect(x, yy - 4, colW, 100, 8, C.stone);
      doc.text(blk[0], x + 14, yy + 14, "F2", 11, C.grove);
      yy += 32;
      blk[1].forEach(function (l) { doc.wrap(l, "F1", 9, colW - 28).forEach(function (w) { doc.text(w, x + 14, yy, "F1", 9, C.ink); yy += 12.5; }); });
    });
    if (CFG.email) doc.link(M, y - 4, colW, 100, "mailto:" + CFG.email);
    y += 120;
    doc.text("Photo credits", M, y, "F2", 12, C.grove);
    y += 8;
    var cred = doc.wrap("Plant photographs are from Wikimedia Commons and are used under the licences shown. Full credits for every photo on the website: " + site + "/credits.html", "F1", 8, CW);
    cred.forEach(function (l) { y += 11; doc.text(l, M, y, "F1", 8, C.muted); });
    y += 14;
    var credits = plants.filter(function (p) { return !opts.photos || imgs[p.id]; }).map(function (p) { var im = p.images[0]; return p.name + ": " + (im.by || "Unknown") + ", " + im.lic; });
    var cw = (CW - 18) / 2, col = 0, startY = y, cy = y;
    credits.forEach(function (c) {
      var lines = doc.wrap(c, "F1", 6.6, cw);
      if (cy + lines.length * 7.9 > bottom) {
        if (col === 0) { col = 1; cy = startY; }
        else { newPage("Photo credits"); col = 0; startY = y; cy = y; }
      }
      lines.forEach(function (l) { doc.text(l, M + col * (cw + 18), cy, "F1", 6.6, C.muted); cy += 7.9; });
      cy += 1.2;
    });

    /* ---- Intro page content ---- */
    doc.usePage(intro);
    header("About");
    footer(2);
    var iy = 74;
    doc.text("About Efalp Nurseries", M, iy, "F2", 24, C.grove);
    iy += 26;
    var about = "Efalp Nurseries is the nursery division of " + (CFG.parentCompany || "Emirates Farm for Livestock & Agriculture Production L.L.C.") +
      " (EFALP), the Abu Dhabi agricultural company founded in 2009. At two nurseries in the emirate of Fujairah we propagate and grow fruit trees, native desert species, palms, shade and flowering trees and specialty crops such as cocoa and coffee, raised under greenhouse, shade-house and net-house conditions and selected for the UAE climate.";
    doc.wrap(about, "F1", 10.5, CW).forEach(function (l) { doc.text(l, M, iy, "F1", 10.5, C.ink); iy += 15.5; });
    iy += 14;
    var bw = (CW - 20) / 2;
    [["raheeb", "Greenhouses for cocoa, coffee, mangoes and tropical fruit; shade houses for sidr, citrus, grapes and flowering trees; a net house for natives, palms and seedlings."],
     ["dhadna", "Shade house for grafted mangoes, citrus, pomegranates, olives and desert plants; greenhouses for propagation, raising new trees from seed and cuttings."]
    ].forEach(function (b, i) {
      var x = M + i * (bw + 20), yy = iy;
      var count = plants.filter(function (p) { return p.nurseries.indexOf(b[0]) !== -1; }).length;
      doc.roundRect(x, yy, bw, 128, 8, C.stone);
      doc.text(CFG.nurseries[b[0]].name, x + 14, yy + 22, "F2", 12.5, C.grove);
      doc.text(CFG.nurseries[b[0]].place + "   |   " + count + " species in this catalogue", x + 14, yy + 37, "F1", 8.5, C.fern);
      var ly = yy + 56;
      doc.wrap(b[1], "F1", 9.2, bw - 28).forEach(function (l) { doc.text(l, x + 14, ly, "F1", 9.2, C.ink); ly += 12.8; });
    });
    iy += 156;
    doc.text("In this catalogue", M, iy, "F2", 15, C.grove);
    iy += 10;
    contents.forEach(function (c) {
      iy += 22;
      doc.text(c.cat, M, iy, "F1", 11, C.ink);
      var label = c.count + " species";
      var pw = doc.measure(String(c.page), "F2", 11);
      doc.text(label, W - M - pw - 18, iy, "F1", 9, C.muted, "right");
      doc.text(String(c.page), W - M, iy, "F2", 11, C.grove, "right");
      doc.line(M, iy + 8, W - M, iy + 8, "#e3e8dd", 0.6);
    });
    iy += 40;
    doc.text("How to read the entries", M, iy, "F2", 12, C.grove);
    iy += 6;
    [["Native region", "where the species grows wild."],
     ["Origin of stock", "the countries our nursery stock of this plant was sourced from."],
     ["Available at", "the nursery or nurseries currently holding this plant."],
     ["Varieties", "named cultivars or selections we hold, where applicable."]
    ].forEach(function (r) {
      iy += 16;
      doc.text(r[0], M, iy, "F2", 9, C.ink);
      doc.text(r[1], M + 86, iy, "F1", 9, C.ink);
    });
    iy += 26;
    doc.wrap("Availability changes through the season. Please contact us to confirm current stock and sizes before planning a project.", "F3", 9, CW).forEach(function (l) { doc.text(l, M, iy, "F3", 9, C.muted); iy += 12.5; });
  }

  /* ================= Download dialog ================= */
  var modal;
  function ensureModal() {
    if (modal) return modal;
    var EF = window.EF;
    modal = document.createElement("dialog");
    modal.className = "modal";
    modal.setAttribute("aria-labelledby", "pdf-title");
    modal.innerHTML = '<form method="dialog" class="modal__body" data-pdf-form>' +
      '<h2 id="pdf-title">Download the plant catalogue</h2>' +
      "<p>A PDF with a photo, description, origin and varieties for every plant. It is created in your browser and takes a few seconds.</p>" +
      '<fieldset><legend>Plants to include</legend>' +
      '<label class="opt"><input type="radio" name="scope" value="all" checked><span>Complete catalogue</span><span class="opt__count">' + EF.plants.length + "</span></label>" +
      Object.keys(EF.meta.nurseries).map(function (k) {
        return '<label class="opt"><input type="radio" name="scope" value="' + k + '"><span>' + EF.esc(EF.meta.nurseries[k]) + ' only</span><span class="opt__count">' +
          EF.plants.filter(function (p) { return p.nurseries.indexOf(k) !== -1; }).length + "</span></label>";
      }).join("") +
      '<label class="opt" data-scope-current hidden><input type="radio" name="scope" value="current"><span>Plants matching my current search</span><span class="opt__count" data-current-count></span></label>' +
      "</fieldset>" +
      '<label class="opt"><input type="checkbox" name="photos" checked><span>Include plant photos</span></label>' +
      '<div data-pdf-progress hidden><div class="progress"><span></span></div><p class="progress-text" data-pdf-status></p></div>' +
      '<p class="progress-text" data-pdf-error role="alert"></p>' +
      '<div class="modal__actions"><button type="button" class="btn btn--ghost" data-pdf-cancel>Close</button>' +
      '<button type="submit" class="btn btn--primary" data-pdf-go>Download PDF</button></div></form>';
    document.body.appendChild(modal);
    modal.querySelector("[data-pdf-cancel]").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal && !busy) modal.close(); });
    modal.querySelector("[data-pdf-form]").addEventListener("submit", function (e) { e.preventDefault(); generate(); });
    return modal;
  }
  var busy = false;
  function openDialog() {
    var EF = window.EF;
    ensureModal();
    var cur = EF.currentList;
    var row = modal.querySelector("[data-scope-current]");
    if (cur && cur.length && cur.length < EF.plants.length) {
      row.hidden = false; modal.querySelector("[data-current-count]").textContent = cur.length;
    } else { row.hidden = true; if (row.querySelector("input").checked) modal.querySelector('input[value="all"]').checked = true; }
    modal.querySelector("[data-pdf-error]").textContent = "";
    modal.querySelector("[data-pdf-progress]").hidden = true;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }
  function generate() {
    if (busy) return;
    var EF = window.EF;
    var f = modal.querySelector("[data-pdf-form]");
    var scope = f.querySelector('input[name="scope"]:checked').value;
    var photos = f.querySelector('input[name="photos"]').checked;
    var ids, label;
    if (scope === "current") { ids = EF.currentList.slice(); label = "Selected plants from Al Raheeb and Dhadna nurseries"; }
    else if (scope === "all") { ids = EF.plants.map(function (p) { return p.id; }); label = "Al Raheeb Nursery and Dhadna Nursery, Fujairah"; }
    else { ids = EF.plants.filter(function (p) { return p.nurseries.indexOf(scope) !== -1; }).map(function (p) { return p.id; }); label = EF.meta.nurseries[scope] + ", Fujairah"; }
    var btn = f.querySelector("[data-pdf-go]");
    var bar = f.querySelector(".progress span"), status = f.querySelector("[data-pdf-status]"), err = f.querySelector("[data-pdf-error]");
    f.querySelector("[data-pdf-progress]").hidden = false;
    err.textContent = "";
    busy = true; btn.disabled = true; btn.textContent = "Creating PDF...";
    buildCatalogue({ ids: ids, photos: photos, scopeLabel: label }, function (p, msg) { bar.style.width = Math.round(p * 100) + "%"; status.textContent = msg; })
      .then(function (res) {
        var name = "Efalp-Nurseries-Catalogue" + (scope === "all" ? "" : "-" + (scope === "current" ? "Selection" : EF.meta.nurseries[scope].replace(/\s+/g, "-"))) + "-" + (EF.meta.updated || "").replace(/\s+/g, "-") + ".pdf";
        var url = URL.createObjectURL(res.blob);
        var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
        bar.style.width = "100%";
        status.innerHTML = "Done. Your PDF (" + Math.round(res.blob.size / 1024 / 102.4) / 10 + " MB) is downloading. " +
          '<a href="' + url + '" download="' + name + '">Download again</a>';
        if (res.missing) err.textContent = res.missing + " photo" + (res.missing === 1 ? " was" : "s were") + " unavailable and replaced with a plain panel.";
      })
      .catch(function (e) {
        err.textContent = "The PDF could not be created (" + (e && e.message ? e.message : "unknown error") + "). Untick “Include plant photos” and try again.";
      })
      .then(function () { busy = false; btn.disabled = false; btn.textContent = "Download PDF"; });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-download-catalogue]");
    if (t) { e.preventDefault(); openDialog(); }
  });
  window.EFALP_PDF = { open: openDialog, build: buildCatalogue };
})();
