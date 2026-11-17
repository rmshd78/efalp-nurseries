"""Regenerate assets/data/plants.js from the nursery inventory spreadsheet.

Usage:
    pip install openpyxl
    python tools/update_catalogue.py "INVENTORY DATA SHEET.xlsx"

What it does
  * reads the "Raheeb Stock" and "Dadna Stock" sheets (the sheet names only need to contain "raheeb" / "dadna")
  * keeps rows with available plants > 0 and maps each row to a species + variety (tools/rules.py)
  * converts suppliers to origin countries; quantities, sizes, dates and prices are never published
  * adds descriptions from tools/species.py and photos from tools/images.txt
Rows it cannot match are listed at the end so you can add a rule or a new species.
"""
import json, sys, os, hashlib, unicodedata
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from species import S, FEATURED  # noqa: E402
from rules import classify, origin_of  # noqa: E402

ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "assets", "data", "plants.js")
CAT_ORDER = ["Fruit Trees", "Citrus", "Palms & Cycads", "Native & Desert Trees", "Shade & Flowering Trees",
             "Tropical & Specialty Crops", "Shrubs, Climbers & Ornamentals", "Herbs & Medicinal Plants"]
NURSERIES = {"raheeb": "Al Raheeb Nursery", "dhadna": "Dhadna Nursery"}


def read_rows(path):
    import openpyxl
    wb = openpyxl.load_workbook(path, data_only=True)
    rows = []
    for ws in wb.worksheets:
        low = ws.title.lower()
        nursery = "raheeb" if "raheeb" in low else ("dhadna" if ("dadna" in low or "dhadna" in low) else None)
        if not nursery:
            continue
        header_row = None
        for i, r in enumerate(ws.iter_rows(min_row=1, max_row=10, values_only=True), start=1):
            if r and any(str(c).strip().lower() == "plant name" for c in r if c is not None):
                header_row = i
                cols = {str(c).strip().lower(): k for k, c in enumerate(r) if c is not None}
                break
        if not header_row:
            print("skipped sheet (no 'Plant name' header):", ws.title)
            continue
        ci = lambda name: cols.get(name)
        for r in ws.iter_rows(min_row=header_row + 1, values_only=True):
            plant = r[ci("plant name")] if ci("plant name") is not None else None
            variety = r[ci("variety")] if ci("variety") is not None else None
            if plant is None and variety is None:
                continue
            qty = r[ci("available plants")] if ci("available plants") is not None else 0
            try:
                qty = float(qty)
            except (TypeError, ValueError):
                qty = 0
            rows.append(dict(nursery=nursery, plant=str(plant or "").strip(), variety=str(variety or "").strip(),
                             source=str(r[ci("source")] or "").strip() if ci("source") is not None else "", qty=qty))
    return rows


def photo_urls(f, w):
    if f.startswith("local:"):
        p = f[6:].strip()
        return p, p, p
    name = f.replace(" ", "_")
    h = hashlib.md5(name.encode("utf-8")).hexdigest()
    q = quote(name, safe="()!,;:@$*~'-_.")
    base = f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{q}"
    th = lambda px: f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{px}px-{q}"
    return (th(500) if w > 500 else base), (th(1280) if w > 1280 else (th(960) if w > 960 else base)), \
        "https://commons.wikimedia.org/wiki/File:" + q


def load_images():
    imgs = {}
    for line in open(os.path.join(HERE, "images.txt"), encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip() or line.startswith("#"):
            continue
        sid, f, w, by, lic = line.split("|")
        s, l, page = photo_urls(unicodedata.normalize("NFC", f), int(w or 0))
        imgs.setdefault(sid, []).append({"src": s, "large": l, "page": page, "by": by, "lic": lic})
    return imgs


def main(path, updated):
    rows = read_rows(path)
    by = {s["id"]: dict(s, v={}, n=set(), o=set()) for s in S}
    unmatched = []
    for r in rows:
        if r["qty"] <= 0:
            continue
        sid, var = classify(r)
        if not sid:
            unmatched.append((r["plant"], r["variety"]))
            continue
        e = by[sid]
        o = origin_of(r["source"])
        e["n"].add(r["nursery"]); e["o"].update(o)
        if var:
            vv = e["v"].setdefault(var, {"n": set(), "o": set()})
            vv["n"].add(r["nursery"]); vv["o"].update(o)
    so = lambda xs: sorted(xs, key=lambda x: (x != "UAE", x))
    imgs = load_images()
    out = []
    for s in S:
        e = by[s["id"]]
        if not e["n"]:
            continue
        if s["id"] not in imgs:
            print("WARNING: no photos listed in images.txt for", s["id"])
        out.append({
            "id": s["id"], "name": s["name"], "botanical": s["botanical"], "ar": s["ar"], "family": s["family"],
            "category": s["category"], "type": s["type"], "light": s["light"], "water": s["water"], "uses": s["uses"],
            "native": s["native"], "desc": s["desc"], "nurseries": sorted(e["n"], key=list(NURSERIES).index), "origins": so(e["o"]),
            "varieties": [{"name": k, "nurseries": sorted(v["n"], key=list(NURSERIES).index), "origins": so(v["o"])}
                          for k, v in sorted(e["v"].items(), key=lambda kv: kv[0].lower())],
            "images": imgs.get(s["id"], []),
        })
    out.sort(key=lambda p: (CAT_ORDER.index(p["category"]), p["name"]))
    meta = {"updated": updated, "categories": CAT_ORDER, "nurseries": NURSERIES, "featured": FEATURED}
    js = ("/* Efalp Nurseries plant catalogue data. Generated by tools/update_catalogue.py.\n"
          "   Quantities, sizes and prices are intentionally not included. Photos: see each image's page for author & licence. */\n")
    js += "window.EFALP_META = " + json.dumps(meta, ensure_ascii=False, indent=1) + ";\n"
    js += "window.EFALP_PLANTS = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    open(OUT, "w", encoding="utf-8").write(js)
    print(f"Wrote {OUT}: {len(out)} species, {sum(len(p['varieties']) for p in out)} varieties")
    if unmatched:
        print("\nRows not matched to a species (add a rule in tools/rules.py or a species in tools/species.py):")
        for u in sorted(set(unmatched)):
            print("  -", u)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "October 2026")
