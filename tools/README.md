# Catalogue tools

`update_catalogue.py` rebuilds `assets/data/plants.js` from the nursery inventory spreadsheet.
See the main README ("Updating the catalogue from a new stock sheet").

* `species.py`: one entry per species (names, Arabic name, collection, description, light, water, uses, native region)
* `rules.py`: how stock-sheet rows map to species, varieties and origin countries
* `images.txt`: photos per species, `id|file|width|author|licence` (Wikimedia Commons file names, or `local:path`)

The spreadsheet itself is not stored in the repository (`*.xlsx` is git-ignored) because it contains quantities.
