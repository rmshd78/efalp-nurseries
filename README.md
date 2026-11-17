# Efalp Nurseries website

Company profile and plant catalogue for **Efalp Nurseries**, the nursery division of
[Emirates Farm for Livestock & Agriculture Production L.L.C. (EFALP)](https://efalp.ae/), with
**Al Raheeb Nursery** and **Dhadna Nursery** in Fujairah, UAE.

It is a static website (HTML, CSS and JavaScript only, no build step), so it can be hosted free on
GitHub Pages, Netlify, Vercel or Cloudflare Pages.

## What's included

| Page | What it does |
| --- | --- |
| `index.html` | Home: plant search, collections, company summary, both nurseries, featured plants |
| `about.html` | Company profile: who we are, EFALP background, values, stock origins, customers |
| `nurseries.html` | Al Raheeb and Dhadna: growing units, highlights and full plant lists |
| `catalogue.html` | Searchable catalogue of 94 species with filters (collection, nursery, water needs, origin), photo gallery for each plant, varieties table and enquiry list |
| `contact.html` | Contact details, nursery maps and an enquiry form that opens the visitor's email app |
| `credits.html` | Author and licence for every plant photo |

**PDF catalogue download** — the "Download catalogue" button (on every page) builds a PDF in the
visitor's browser with a cover, contents, one entry per plant (photo, description, native region,
origin of stock, nursery, varieties) and photo credits. Visitors can download the full catalogue,
one nursery only, or just the plants matching their current search.

**Kept out on purpose:** prices, shipping, quantities, plant sizes and nursery areas. Only nursery
names, plant details and origin countries are published.

## Deploy with GitHub Pages (recommended)

1. Create a new repository on GitHub, for example `efalp-nurseries` (public, or private on a paid plan).
2. Push this folder:
   ```bash
   cd efalp-nurseries
   git remote add origin https://github.com/<your-account>/efalp-nurseries.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
   The included workflow (`.github/workflows/pages.yml`) publishes the site on every push to `main`.
   (Alternatively choose **Deploy from a branch → main → / (root)**.)
4. After a minute the site is live at `https://<your-account>.github.io/efalp-nurseries/`.

### Custom domain (e.g. `nurseries.efalp.ae`)
In **Settings → Pages → Custom domain** enter the domain, then add a `CNAME` DNS record pointing
`nurseries` to `<your-account>.github.io`. Tick **Enforce HTTPS** once the certificate is issued.

### Other hosts
* **Netlify / Cloudflare Pages / Vercel:** import the repository, leave the build command empty and set
  the publish/output directory to `/` (the repository root).
* **Any web server:** upload all files as they are.

## Editing

| To change | Edit |
| --- | --- |
| Email, phone, P.O. box, website address used in the site and PDF | `assets/js/config.js` |
| Page text | the `.html` files |
| Colours, fonts, spacing | `assets/css/styles.css` (variables at the top) |
| Logo | `assets/img/efalp-nurseries-logo.png` (and `favicon.png`) |

Enquiries from the catalogue and contact form are sent to the `email` in `config.js`
(currently `sales@efalp.ae`).

## Updating the catalogue from a new stock sheet

The plant list in `assets/data/plants.js` is generated from the inventory spreadsheet.

```bash
pip install openpyxl
python tools/update_catalogue.py "INVENTORY DATA SHEET.xlsx" "January 2027"
```

* Sheets whose names contain "Raheeb" and "Dadna"/"Dhadna" are read; rows with 0 available plants are skipped.
* `tools/rules.py` maps each row (plant name + variety + source) to a species, variety and origin country.
* `tools/species.py` holds the descriptions, Arabic names, light/water needs and collections.
* `tools/images.txt` lists the photos for each species.
* Any rows the script cannot match are printed so you can add a rule or a new species.

## Photos

Plant photos are real photographs from Wikimedia Commons (whole plants, leaves, branches, flowers
and fruit on the plant), loaded directly from `upload.wikimedia.org` and credited on
`credits.html`, in each gallery and in the PDF, as their licences require.

To use your own nursery photos instead, put them in `assets/img/plants/` and add lines to
`tools/images.txt` in this format, then rerun the update script:

```
mango|local:assets/img/plants/mango-dhadna-1.jpg|0|Efalp Nurseries|All rights reserved
```

Lines for a plant are shown in order, so put your own photo first to make it the main image.
Photos of the actual nurseries on the home and nurseries pages are a good next step: replace the
image `src` in `index.html` and `nurseries.html`.

## Browser support

Current Chrome, Edge, Safari and Firefox on desktop and mobile. The catalogue and PDF work offline
from the visitor's cache once loaded, except photos, which need an internet connection.
