# Curated species master list for the Efalp Nurseries catalogue.
# Fields: id, name, botanical, family, cat, type, light, water, uses, native, wiki, ar, desc
C_FRUIT = "Fruit Trees"
C_CITRUS = "Citrus"
C_TROP = "Tropical & Specialty Crops"
C_PALM = "Palms & Cycads"
C_NATIVE = "Native & Desert Trees"
C_SHADE = "Shade & Flowering Trees"
C_ORN = "Shrubs, Climbers & Ornamentals"
C_HERB = "Herbs & Medicinal Plants"

FS = "Full sun"
FSP = "Full sun to partial shade"
PS = "Partial shade"
BRIGHT = "Bright, indirect light"

S = []
def sp(id, name, botanical, family, cat, type, light, water, uses, native, wiki, desc, ar=""):
    S.append(dict(id=id, name=name, botanical=botanical, family=family, category=cat, type=type,
                  light=light, water=water, uses=uses, native=native, wiki=wiki, ar=ar, desc=desc))

# ---------------- FRUIT TREES ----------------
sp("mango", "Mango", "Mangifera indica", "Anacardiaceae", C_FRUIT, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Shade", "Orchards"], "South & Southeast Asia", "Mango",
   "The king of tropical fruits and the largest collection in our nurseries. Grafted trees of Indian, Pakistani, Egyptian, Thai, Japanese and Florida cultivars, selected for heat tolerance and reliable fruiting in the UAE climate.", "مانجو")
sp("pomegranate", "Pomegranate", "Punica granatum", "Lythraceae", C_FRUIT, "Deciduous fruit shrub / small tree", FS, "Low to moderate",
   ["Fruit", "Ornamental", "Orchards"], "Iran to northern India", "Pomegranate",
   "A drought-hardy heritage fruit of Arabia, prized for its jewel-like arils and showy orange-red flowers. Our range spans regional favourites from Oman's Jebel Akhdar, Yemen and Saudi Arabia alongside international cultivars.", "رمان")
sp("fig", "Common Fig", "Ficus carica", "Moraceae", C_FRUIT, "Deciduous fruit tree", FS, "Low to moderate",
   ["Fruit", "Shade", "Home gardens"], "Western Asia & Mediterranean", "Common fig",
   "One of the oldest cultivated fruit trees, fig thrives in heat and tolerates alkaline soils. Produces sweet, soft fruit that can be eaten fresh or dried.", "تين")
sp("olive", "Olive", "Olea europaea", "Oleaceae", C_FRUIT, "Evergreen fruit tree", FS, "Low",
   ["Fruit", "Oil", "Landscaping", "Windbreak"], "Mediterranean Basin", "Olive",
   "A long-lived, silver-leaved evergreen valued for table olives and oil, and as a striking landscape tree. Very drought tolerant once established.", "زيتون")
sp("grape", "Grape Vine", "Vitis vinifera", "Vitaceae", C_FRUIT, "Deciduous climbing vine", FS, "Moderate",
   ["Fruit", "Pergolas", "Shade"], "Mediterranean, Central Europe & SW Asia", "Vitis vinifera",
   "Table-grape vines including popular seedless cultivars. Ideal for pergolas and trellises, providing both fruit and summer shade.", "عنب")
sp("guava", "Guava", "Psidium guajava", "Myrtaceae", C_FRUIT, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Home gardens"], "Tropical Americas", "Psidium guajava",
   "A fast-fruiting, adaptable tropical tree with fragrant, vitamin C-rich fruit. Selected white- and red-fleshed types from Thailand, Vietnam, India and Israel.", "جوافة")
sp("strawberry-guava", "Strawberry Guava", "Psidium cattleyanum", "Myrtaceae", C_FRUIT, "Evergreen shrub / small tree", FSP, "Moderate",
   ["Fruit", "Hedging", "Ornamental"], "Brazil (Atlantic Forest)", "Psidium cattleyanum",
   "A compact guava with glossy leaves and small red fruits with a sweet-tart, strawberry-like flavour. Excellent for containers and hedges.")
sp("jackfruit", "Jackfruit", "Artocarpus heterophyllus", "Moraceae", C_FRUIT, "Evergreen fruit tree", FS, "Regular",
   ["Fruit", "Shade"], "Western Ghats, India", "Jackfruit",
   "Produces the largest tree-borne fruit in the world. A handsome, dense shade tree with sweet, aromatic flesh used fresh and in cooking.", "جاك فروت")
sp("banana", "Banana", "Musa × paradisiaca", "Musaceae", C_FRUIT, "Giant herbaceous perennial", FS, "Regular",
   ["Fruit", "Tropical landscaping"], "Southeast Asia & Oceania", "Banana",
   "Fast-growing tropical plants that bring a lush look to gardens. Includes the creamy 'Blue Java' (ice-cream banana) and red-skinned banana.", "موز")
sp("papaya", "Papaya", "Carica papaya", "Caricaceae", C_FRUIT, "Fast-growing tree-like herb", FS, "Regular",
   ["Fruit", "Home gardens"], "Southern Mexico & Central America", "Papaya",
   "Fruits within the first year of planting. Sweet, orange-fleshed fruit rich in vitamins and the digestive enzyme papain.", "بابايا")
sp("dragon-fruit", "Dragon Fruit (Pitaya)", "Selenicereus undatus", "Cactaceae", C_FRUIT, "Climbing cactus", FS, "Low",
   ["Fruit", "Ornamental"], "Central America & Mexico", "Selenicereus undatus",
   "A climbing cactus with spectacular night-blooming flowers and vivid pink fruit. Water-efficient and well suited to arid climates.", "فاكهة التنين")
sp("sugar-apple", "Custard Apple (Sugar-Apple)", "Annona squamosa", "Annonaceae", C_FRUIT, "Semi-deciduous small tree", FS, "Moderate",
   ["Fruit", "Home gardens"], "Tropical Americas & West Indies", "Sugar-apple",
   "A small tree bearing knobbly green fruits with creamy, custard-sweet flesh. Heat loving and productive.", "قشطة")
sp("sapodilla", "Sapodilla (Chikoo)", "Manilkara zapota", "Sapotaceae", C_FRUIT, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Shade", "Coastal planting"], "Southern Mexico & Central America", "Manilkara zapota",
   "A wind- and salt-tolerant evergreen with brown, malty-sweet fruit. Popular across South Asia and the Gulf as chikoo.", "سابوتا (شيكو)")
sp("black-sapote", "Black Sapote", "Diospyros nigra", "Ebenaceae", C_FRUIT, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Shade"], "Mexico & Central America", "Diospyros nigra",
   "Known as the 'chocolate pudding fruit' for its dark, rich flesh when ripe. A handsome glossy-leaved evergreen.")
sp("longan", "Longan", "Dimocarpus longan", "Sapindaceae", C_FRUIT, "Evergreen fruit tree", FS, "Regular",
   ["Fruit", "Shade"], "Southern China & Southeast Asia", "Longan",
   "A lychee relative bearing clusters of small, translucent, sweet fruits. Attractive dense canopy.", "لونجان")
sp("wampee", "Wampee", "Clausena lansium", "Rutaceae", C_FRUIT, "Evergreen small tree", FS, "Moderate",
   ["Fruit", "Ornamental"], "Southern China & Vietnam", "Clausena lansium",
   "A citrus relative bearing grape-like clusters of tangy-sweet yellow fruit. Uncommon and highly collectable.")
sp("feijoa", "Feijoa (Pineapple Guava)", "Acca sellowiana", "Myrtaceae", C_FRUIT, "Evergreen shrub", FS, "Moderate",
   ["Fruit", "Hedging", "Ornamental"], "Southern Brazil, Uruguay & Argentina", "Acca sellowiana",
   "Grey-green foliage, edible red-and-white flowers and aromatic green fruit. Makes an attractive fruiting hedge.", "فيجوا")
sp("avocado", "Avocado", "Persea americana", "Lauraceae", C_FRUIT, "Evergreen fruit tree", FS, "Regular",
   ["Fruit", "Shade"], "South-central Mexico", "Avocado",
   "Grafted avocado trees including 'Ettinger' and 'Pinkerton', cultivars known for good fruit quality and productivity.", "أفوكادو")
sp("pear", "Pear", "Pyrus communis", "Rosaceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit"], "Europe & Western Asia", "Pear",
   "Low-chill pear trees suited to warmer climates, with spring blossom and sweet, juicy fruit.", "كمثرى")
sp("apple", "Apple", "Malus domestica", "Rosaceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit"], "Central Asia", "Apple",
   "Low-chill apple trees for warm-climate home orchards, with spring blossom and crisp fruit.", "تفاح")
sp("apricot", "Apricot", "Prunus armeniaca", "Rosaceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit"], "Central Asia & China", "Apricot",
   "Early-flowering stone fruit with golden, sweet fruit. Best in well-drained soils.", "مشمش")
sp("nectarine", "Nectarine", "Prunus persica var. nucipersica", "Rosaceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit"], "China", "Nectarine",
   "A smooth-skinned peach with juicy, aromatic flesh and showy pink spring blossom.", "نكتارين")
sp("plum", "Plum", "Prunus domestica", "Rosaceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit"], "Western Asia & Caucasus", "Prunus domestica",
   "A classic stone fruit with white spring blossom and sweet, juicy fruit for fresh eating or preserves.", "برقوق")
sp("jujube", "Chinese Jujube (Annab)", "Ziziphus jujuba", "Rhamnaceae", C_FRUIT, "Deciduous fruit tree", FS, "Low",
   ["Fruit", "Drought planting"], "China", "Jujube",
   "A tough, drought-tolerant tree with crisp, apple-like fruits that sweeten as they dry. Thrives in heat and poor soils.", "عناب")
sp("thai-ber", "Thai Apple Ber (Thai Sidr)", "Ziziphus mauritiana", "Rhamnaceae", C_FRUIT, "Evergreen fruit tree", FS, "Low",
   ["Fruit", "Drought planting"], "South & Southeast Asia", "Ziziphus mauritiana",
   "Large-fruited grafted ber (Thai sidr) producing crisp, green apple-like fruits. Grafted onto hardy local sidr rootstock for vigour in arid conditions.", "سدر تايلندي")
sp("surinam-cherry", "Brazilian Cherry (Pitanga)", "Eugenia uniflora", "Myrtaceae", C_FRUIT, "Evergreen shrub / small tree", FSP, "Moderate",
   ["Fruit", "Hedging", "Ornamental"], "Eastern South America (Brazil)", "Eugenia uniflora",
   "Glossy foliage that flushes bronze, followed by ribbed, bright red cherries with a sweet-spicy taste. Excellent as a fruiting hedge.", "الكرز البرازيلي")
sp("barbados-cherry", "Barbados Cherry (Acerola)", "Malpighia emarginata", "Malpighiaceae", C_FRUIT, "Evergreen shrub", FS, "Moderate",
   ["Fruit", "Hedging"], "Caribbean, Central & northern South America", "Malpighia emarginata",
   "A compact shrub bearing bright red cherries that are among the richest natural sources of vitamin C.", "أسيرولا")
sp("mulberry", "White Mulberry", "Morus alba", "Moraceae", C_FRUIT, "Deciduous fruit tree", FS, "Moderate",
   ["Fruit", "Shade"], "Northern China", "Morus alba",
   "A fast-growing, heat-tolerant shade tree bearing sweet berries in spring.", "توت")
sp("noni", "Noni", "Morinda citrifolia", "Rubiaceae", C_TROP, "Evergreen shrub / small tree", FSP, "Moderate",
   ["Fruit", "Medicinal", "Coastal planting"], "Southeast Asia & Australasia", "Morinda citrifolia",
   "A salt-tolerant tropical tree with glossy leaves, valued in traditional wellness for its fruit and leaves.", "نوني")
sp("carob", "Carob", "Ceratonia siliqua", "Fabaceae", C_FRUIT, "Evergreen tree", FS, "Low",
   ["Fruit / pods", "Shade", "Windbreak"], "Mediterranean & Middle East", "Carob",
   "A drought-hardy evergreen with sweet edible pods used as a cocoa alternative. A dense, long-lived shade tree.", "خروب")
sp("walnut", "Walnut", "Juglans regia", "Juglandaceae", C_FRUIT, "Deciduous nut tree", FS, "Moderate",
   ["Nuts", "Shade"], "Central Asia to SE Europe", "Juglans regia",
   "The Persian walnut, a stately tree producing the familiar edible nuts.", "جوز")
sp("cashew", "Cashew", "Anacardium occidentale", "Anacardiaceae", C_FRUIT, "Evergreen nut tree", FS, "Moderate",
   ["Nuts", "Fruit", "Shade"], "Northeastern Brazil", "Cashew",
   "Produces the cashew nut and the juicy cashew apple. A spreading, heat-loving evergreen.", "كاجو")
sp("tamarind", "Tamarind", "Tamarindus indica", "Fabaceae", C_FRUIT, "Evergreen tree", FS, "Low",
   ["Fruit / pods", "Shade", "Avenues"], "Tropical Africa", "Tamarind",
   "A long-lived, wind-firm shade tree with feathery foliage and sweet-sour pods used widely in Gulf and Asian cuisine.", "تمر هندي")
sp("malabar-tamarind", "Malabar Tamarind", "Garcinia gummi-gutta", "Clusiaceae", C_TROP, "Evergreen tree", FSP, "Regular",
   ["Fruit / spice", "Culinary"], "India (Western Ghats) & Southeast Asia", "Garcinia gummi-gutta",
   "Known as kudampuli, its dried fruit rind is a souring agent in South Indian cooking.")
sp("passion-fruit", "Passion Fruit", "Passiflora edulis", "Passifloraceae", C_FRUIT, "Evergreen climbing vine", FS, "Moderate",
   ["Fruit", "Pergolas", "Ornamental"], "Southern Brazil, Paraguay & Argentina", "Passiflora edulis",
   "A vigorous climber with intricate flowers and aromatic fruit. Quickly covers fences and pergolas.", "باشن فروت")
sp("moringa", "Moringa (Drumstick Tree)", "Moringa oleifera", "Moringaceae", C_HERB, "Fast-growing deciduous tree", FS, "Low",
   ["Edible leaves & pods", "Medicinal"], "Northern India", "Moringa oleifera",
   "A nutritious, fast-growing tree whose leaves, pods and seeds are all edible. Extremely drought tolerant.", "مورينجا")

# ---------------- CITRUS ----------------
sp("orange", "Sweet Orange", "Citrus × sinensis", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Juice", "Home orchards"], "Southern China", "Orange (fruit)",
   "Grafted sweet orange trees including Navel (Abu Surra), Valencia and Basra types, with fragrant blossom and juicy fruit.", "برتقال")
sp("mandarin", "Mandarin & Tangerine", "Citrus reticulata", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Home orchards"], "Southern China & Vietnam", "Mandarin orange",
   "Easy-peel citrus including clementines and Murcott tangerines. Compact trees with sweet, aromatic fruit.", "يوسفي")
sp("lemon", "Lemon", "Citrus × limon", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Culinary", "Home orchards"], "Northeast India, Myanmar & China", "Lemon",
   "Productive lemon trees, from Eureka and American types to local Omani lemons, fruiting through much of the year.", "ليمون")
sp("lime", "Lime", "Citrus × latifolia", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Culinary"], "Southeast Asia", "Persian lime",
   "Seedless Thai lime trees bearing juicy green fruit. Heat-loving and very productive.", "ليم")
sp("kaffir-lime", "Kaffir Lime (Makrut)", "Citrus hystrix", "Rutaceae", C_CITRUS, "Evergreen shrub / small tree", FS, "Moderate",
   ["Culinary leaves", "Fruit"], "Southeast Asia", "Kaffir lime",
   "Grown for its intensely aromatic double leaves and bumpy fruit, essential in Thai and Southeast Asian cooking.")
sp("grapefruit", "Grapefruit", "Citrus × paradisi", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Juice"], "Caribbean (Barbados)", "Grapefruit",
   "Red-fleshed grapefruit cultivars such as Ruby Red and Flame, prized for sweetness and colour.", "جريب فروت")
sp("pomelo", "Pomelo", "Citrus maxima", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit"], "Southeast Asia", "Pomelo",
   "The largest citrus fruit, with thick rind and sweet, mild segments. Includes the 'Cocktail' pomelo hybrid.", "بوملي")
sp("kumquat", "Kumquat", "Citrus japonica", "Rutaceae", C_CITRUS, "Evergreen shrub", FS, "Moderate",
   ["Fruit", "Containers", "Ornamental"], "Southern China", "Kumquat",
   "A compact, ornamental citrus with small golden fruits eaten whole, sweet skin and all. Ideal for pots.", "كمكوات")
sp("bitter-orange", "Bitter Orange (Narenj)", "Citrus × aurantium", "Rutaceae", C_CITRUS, "Evergreen tree", FS, "Moderate",
   ["Rootstock", "Ornamental", "Culinary"], "Southeast Asia", "Bitter orange",
   "A hardy, fragrant citrus used as a vigorous rootstock and as an ornamental avenue tree. Fruit is used in marmalades and flavourings.", "نارنج")
sp("sweet-lime", "Sweet Lime (Mosambi)", "Citrus limetta", "Rutaceae", C_CITRUS, "Evergreen fruit tree", FS, "Moderate",
   ["Fruit", "Juice"], "Southern Iran & Mediterranean", "Citrus limetta",
   "Low-acid citrus with mild, sweet juice, hugely popular in the Gulf and South Asia.", "ليمون حلو")
sp("citron", "Citron (Utrujj)", "Citrus medica", "Rutaceae", C_CITRUS, "Evergreen shrub / small tree", FS, "Moderate",
   ["Fruit", "Culinary", "Heritage"], "Northeast India & Southeast Asia", "Citron",
   "One of the original citrus species, with large, fragrant, thick-rinded fruit long valued in the region.", "أترج")

# ---------------- TROPICAL & SPECIALTY ----------------
sp("cocoa", "Cocoa Tree", "Theobroma cacao", "Malvaceae", C_TROP, "Evergreen understorey tree", PS, "Regular",
   ["Cocoa beans", "Specialty crop"], "Amazon basin, South America", "Theobroma cacao",
   "A flagship specialty crop at Al Raheeb. Greenhouse-grown cocoa of the three classic groups - Forastero, Criollo and Trinitario - plus fine-flavour Porcelana, raised under controlled conditions.", "كاكاو")
sp("coffee-arabica", "Arabica Coffee", "Coffea arabica", "Rubiaceae", C_TROP, "Evergreen shrub", PS, "Regular",
   ["Coffee beans", "Specialty crop"], "Highlands of Ethiopia & South Sudan", "Coffea arabica",
   "Specialty arabica coffee plants including prized Geisha, Bourbon and Typica, and modern disease-resistant Colombian selections, grown under shade in our greenhouses.", "بن عربي")
sp("coffee-robusta", "Robusta Coffee", "Coffea canephora", "Rubiaceae", C_TROP, "Evergreen shrub", PS, "Regular",
   ["Coffee beans", "Specialty crop"], "Central & West Africa", "Coffea canephora",
   "A vigorous, heat-tolerant coffee species producing full-bodied beans with higher caffeine.", "بن روبوستا")
sp("black-pepper", "Black Pepper", "Piper nigrum", "Piperaceae", C_TROP, "Evergreen climbing vine", PS, "Regular",
   ["Spice", "Specialty crop"], "Western Ghats, India", "Black pepper",
   "The 'king of spices', a climbing vine producing peppercorns. Grown on supports in humid, shaded conditions.", "فلفل أسود")
sp("cinnamon", "True Cinnamon", "Cinnamomum verum", "Lauraceae", C_TROP, "Evergreen tree", FSP, "Regular",
   ["Spice", "Aromatic"], "Sri Lanka", "Cinnamomum verum",
   "Ceylon cinnamon, the source of true cinnamon bark, with aromatic leaves and attractive red new growth.", "قرفة")
sp("agarwood", "Agarwood (Oud)", "Aquilaria malaccensis", "Thymelaeaceae", C_TROP, "Evergreen tree", PS, "Regular",
   ["Aromatic resin", "Heritage"], "South & Southeast Asia", "Aquilaria malaccensis",
   "The tree behind oud, one of the most treasured fragrances in Arabian culture. A rare specialty tree.", "عود")

# ---------------- PALMS & CYCADS ----------------
sp("date-palm", "Date Palm", "Phoenix dactylifera", "Arecaceae", C_PALM, "Palm", FS, "Moderate",
   ["Fruit", "Landscaping", "Heritage"], "Arabian Peninsula & North Africa", "Date palm",
   "The emblem of Emirati agriculture and heritage. Tissue-quality offshoots of selected cultivars for fruit production and landscape avenues.", "نخيل التمر")
sp("coconut", "Coconut Palm", "Cocos nucifera", "Arecaceae", C_PALM, "Palm", FS, "Regular",
   ["Fruit", "Coastal landscaping"], "Indo-Pacific", "Coconut",
   "Yellow coconut palms for tropical and coastal landscapes, producing drinking coconuts.", "جوز الهند")
sp("washingtonia", "Mexican Fan Palm", "Washingtonia robusta", "Arecaceae", C_PALM, "Palm", FS, "Low",
   ["Landscaping", "Avenues"], "Baja California & NW Mexico", "Washingtonia robusta",
   "A tall, slender, fast-growing fan palm widely used for avenues and skyline planting. Very heat and drought tolerant.", "واشنطونيا")
sp("areca-palm", "Areca Palm", "Dypsis lutescens", "Arecaceae", C_PALM, "Clumping palm", FSP, "Moderate",
   ["Landscaping", "Indoor", "Screening"], "Madagascar", "Dypsis lutescens",
   "A graceful clustering palm with golden stems and feathery fronds, ideal for screens, courtyards and interiors.", "نخيل الأريكا")
sp("royal-palm", "Royal Palm", "Roystonea regia", "Arecaceae", C_PALM, "Palm", FS, "Regular",
   ["Landscaping", "Avenues"], "Cuba, Florida & Central America", "Roystonea regia",
   "A majestic palm with a smooth, column-like grey trunk and bright green crownshaft. A statement for grand entrances.", "النخيل الملكي")
sp("european-fan-palm", "European Fan Palm", "Chamaerops humilis", "Arecaceae", C_PALM, "Clumping fan palm", FS, "Low",
   ["Landscaping", "Containers"], "Western Mediterranean", "Chamaerops humilis",
   "A compact, multi-stemmed fan palm that is extremely hardy, drought tolerant and perfect for smaller gardens.")
sp("sago-palm", "Sago Palm (Cycad)", "Cycas revoluta", "Cycadaceae", C_PALM, "Cycad", FSP, "Low",
   ["Landscaping", "Containers", "Ornamental"], "Southern Japan", "Cycas revoluta",
   "An ancient, slow-growing cycad with glossy, symmetrical fronds. A classic architectural accent plant.", "سيكاس")

# ---------------- NATIVE & DESERT ----------------
sp("ghaf", "Ghaf Tree", "Prosopis cineraria", "Fabaceae", C_NATIVE, "Evergreen tree", FS, "Very low",
   ["Native landscaping", "Shade", "Sand stabilisation"], "Arabia, Iran to India", "Prosopis cineraria",
   "The National Tree of the UAE. Deep-rooted and extraordinarily drought tolerant, it stays green through the harshest summers and supports desert biodiversity.", "غاف")
sp("sidr", "Sidr (Christ's Thorn Jujube)", "Ziziphus spina-christi", "Rhamnaceae", C_NATIVE, "Evergreen tree", FS, "Low",
   ["Native landscaping", "Shade", "Fruit", "Bee forage"], "North & East Africa, Arabia & Middle East", "Ziziphus spina-christi",
   "A revered native tree of Arabia, famous as the source of premium sidr honey. Hardy, long-lived and tolerant of heat and salinity.", "سدر")
sp("neem", "Neem", "Azadirachta indica", "Meliaceae", C_NATIVE, "Evergreen tree", FS, "Low",
   ["Shade", "Avenues", "Medicinal"], "Indian subcontinent", "Azadirachta indica",
   "A fast-growing, drought-hardy shade tree that is a staple of UAE streetscapes. Valued for its medicinal and natural pest-repellent properties.", "نيم")
sp("acacia-nilotica", "Gum Arabic Tree (Qarad)", "Vachellia nilotica", "Fabaceae", C_NATIVE, "Evergreen thorny tree", FS, "Very low",
   ["Native landscaping", "Windbreak", "Shade"], "Africa, Middle East & Indian subcontinent", "Vachellia nilotica",
   "A hardy acacia with golden ball-shaped flowers, well adapted to arid soils and used for shade, shelter belts and land restoration.", "قرض (سنط)")
sp("desert-date", "Desert Date (Higlig)", "Balanites aegyptiaca", "Zygophyllaceae", C_NATIVE, "Evergreen thorny tree", FS, "Very low",
   ["Native landscaping", "Fruit", "Shade"], "Africa & Arabian Peninsula", "Balanites aegyptiaca",
   "An exceptionally tough desert tree with edible date-like fruit and oil-rich seeds. Thrives in the driest conditions.", "هجليج")
sp("argan", "Argan Tree", "Argania spinosa", "Sapotaceae", C_NATIVE, "Evergreen tree", FS, "Very low",
   ["Oil", "Drought landscaping"], "Southwestern Morocco", "Argania",
   "The source of precious argan oil. A gnarled, drought-defying tree well suited to arid landscapes.", "أركان")
sp("hopbush", "Hopbush", "Dodonaea viscosa", "Sapindaceae", C_NATIVE, "Evergreen shrub", FS, "Low",
   ["Hedging", "Screening", "Native landscaping"], "Pantropical, incl. Arabia", "Dodonaea viscosa",
   "A tough, fast-growing shrub for hedges and windbreaks, found wild in the UAE's Hajar Mountains.", "شجيرة الدودونيا")
sp("parkinsonia", "Jerusalem Thorn", "Parkinsonia aculeata", "Fabaceae", C_NATIVE, "Semi-evergreen small tree", FS, "Very low",
   ["Drought landscaping", "Ornamental"], "The Americas", "Parkinsonia aculeata",
   "A light, airy tree with green bark and fragrant yellow flowers. Thrives in heat, drought and saline soils.", "باركنسونيا")
sp("baobab", "African Baobab", "Adansonia digitata", "Malvaceae", C_NATIVE, "Deciduous tree", FS, "Low",
   ["Specimen tree", "Fruit"], "Tropical Africa", "Adansonia digitata",
   "The iconic 'tree of life' with a massive water-storing trunk. A remarkable specimen tree for parks and estates.", "باوباب")

# ---------------- SHADE & FLOWERING TREES ----------------
sp("cassia-fistula", "Golden Shower Tree", "Cassia fistula", "Fabaceae", C_SHADE, "Deciduous flowering tree", FS, "Low to moderate",
   ["Flowering", "Avenues", "Shade"], "Indian subcontinent & Southeast Asia", "Cassia fistula",
   "Spectacular cascades of golden-yellow flowers in early summer make this one of the most loved flowering trees in the UAE.", "خيار شنبر")
sp("delonix", "Royal Poinciana", "Delonix regia", "Fabaceae", C_SHADE, "Deciduous flowering tree", FS, "Moderate",
   ["Flowering", "Shade", "Parks"], "Madagascar", "Delonix regia",
   "Also called the flame tree, with a wide umbrella canopy smothered in scarlet blooms. A superb shade tree.", "بونسيانا")
sp("peltophorum", "Yellow Flame Tree", "Peltophorum pterocarpum", "Fabaceae", C_SHADE, "Evergreen flowering tree", FS, "Low to moderate",
   ["Flowering", "Shade", "Avenues"], "Southeast Asia & northern Australia", "Peltophorum pterocarpum",
   "A fast-growing shade tree with fern-like leaves and upright plumes of fragrant yellow flowers followed by copper pods.", "بلتوفورم")
sp("bauhinia", "Orchid Tree", "Bauhinia purpurea", "Fabaceae", C_SHADE, "Semi-evergreen flowering tree", FS, "Moderate",
   ["Flowering", "Ornamental"], "South & Southeast Asia", "Bauhinia purpurea",
   "Distinctive two-lobed leaves and large orchid-like pink-purple flowers. A beautiful small garden tree.", "خف الجمل")
sp("tabebuia", "Pink Trumpet Tree", "Tabebuia rosea", "Bignoniaceae", C_SHADE, "Deciduous flowering tree", FS, "Moderate",
   ["Flowering", "Avenues"], "Mexico to Venezuela & Ecuador", "Tabebuia rosea",
   "Covered in clouds of pink trumpet flowers in spring. A stunning avenue and feature tree.", "تابيبويا")
sp("ceiba", "Silk Floss Tree", "Ceiba speciosa", "Malvaceae", C_SHADE, "Deciduous flowering tree", FS, "Low to moderate",
   ["Flowering", "Specimen tree"], "South America", "Ceiba speciosa",
   "A dramatic tree with a green, spiny bottle-shaped trunk and large pink hibiscus-like flowers.", "شجرة الحرير")
sp("melia", "Chinaberry (Persian Lilac)", "Melia azedarach", "Meliaceae", C_SHADE, "Deciduous shade tree", FS, "Low",
   ["Shade", "Flowering"], "Indomalaya & Australasia", "Melia azedarach",
   "A fast-growing shade tree with fragrant lilac flowers in spring and golden berries in winter.", "زنزلخت")
sp("ficus-religiosa", "Bodhi Tree (Sacred Fig)", "Ficus religiosa", "Moraceae", C_SHADE, "Semi-evergreen tree", FS, "Moderate",
   ["Shade", "Specimen tree"], "Indian subcontinent & Indochina", "Ficus religiosa",
   "A broad, long-lived shade tree with elegant heart-shaped leaves ending in a long drip tip.")
sp("banyan", "Banyan", "Ficus benghalensis", "Moraceae", C_SHADE, "Evergreen tree", FS, "Moderate",
   ["Shade", "Parks", "Specimen tree"], "Indian subcontinent", "Ficus benghalensis",
   "A massive spreading shade tree famous for its aerial prop roots. Ideal for large parks and estates.", "بانيان")
sp("ficus-altissima", "Council Tree (Lofty Fig)", "Ficus altissima", "Moraceae", C_SHADE, "Evergreen tree", FS, "Moderate",
   ["Shade", "Landscaping"], "South & Southeast Asia", "Ficus altissima",
   "A large evergreen fig with glossy, leathery leaves, widely used for shade and greening in urban landscapes.")
sp("terminalia", "Indian Almond (Sea Almond)", "Terminalia catappa", "Combretaceae", C_SHADE, "Deciduous shade tree", FS, "Moderate",
   ["Shade", "Coastal planting"], "Tropical Asia & the Pacific", "Terminalia catappa",
   "A salt-tolerant coastal tree with tiered branches and large leaves that turn red before falling. Excellent shade.", "لوز هندي")
sp("pongamia", "Pongamia (Karanja)", "Pongamia pinnata", "Fabaceae", C_SHADE, "Semi-evergreen tree", FS, "Low",
   ["Shade", "Avenues", "Windbreak"], "Tropical Asia & Australia", "Millettia pinnata",
   "A tough, fast-growing shade tree with glossy leaves and lilac flower sprays, tolerant of drought and salinity.", "بونجاميا")
sp("eucalyptus", "River Red Gum", "Eucalyptus camaldulensis", "Myrtaceae", C_SHADE, "Evergreen tree", FS, "Low",
   ["Windbreak", "Shade"], "Australia", "Eucalyptus camaldulensis",
   "A fast-growing, tall evergreen with smooth mottled bark, widely planted for windbreaks and shelter belts.", "يوكاليبتوس")
sp("bamboo", "Common Bamboo", "Bambusa vulgaris", "Poaceae", C_SHADE, "Clumping giant grass", FS, "Regular",
   ["Screening", "Tropical landscaping"], "Indochina & Southern China", "Bambusa vulgaris",
   "A fast-growing clumping bamboo for tall, lush green screens and tropical-style gardens.", "خيزران")
sp("araucaria", "Norfolk Island Pine", "Araucaria heterophylla", "Araucariaceae", C_SHADE, "Evergreen conifer", FS, "Moderate",
   ["Specimen tree", "Coastal planting"], "Norfolk Island (Australia)", "Araucaria heterophylla",
   "A symmetrical, tiered conifer with a distinctive Christmas-tree form. Tolerates coastal winds and salt.", "أروكاريا")
sp("plumeria", "Frangipani", "Plumeria rubra", "Apocynaceae", C_SHADE, "Deciduous flowering small tree", FS, "Low",
   ["Flowering", "Fragrance", "Ornamental"], "Mexico, Central America, Colombia & Venezuela", "Plumeria rubra",
   "Intensely fragrant waxy flowers in red, pink and white. A heat-loving, low-water feature tree.", "فتنة (بلوميريا)")

# ---------------- SHRUBS, CLIMBERS & ORNAMENTALS ----------------
sp("peacock-flower", "Peacock Flower", "Caesalpinia pulcherrima", "Fabaceae", C_ORN, "Evergreen flowering shrub", FS, "Low",
   ["Flowering", "Hedging", "Ornamental"], "Tropical Americas", "Caesalpinia pulcherrima",
   "A dazzling shrub with fiery red, orange and yellow flowers almost all year. Loves heat and needs little water.", "زهرة الطاووس")
sp("bougainvillea", "Bougainvillea", "Bougainvillea glabra", "Nyctaginaceae", C_ORN, "Evergreen flowering climber / shrub", FS, "Low",
   ["Flowering", "Climbers", "Hedging"], "Brazil", "Bougainvillea glabra",
   "The quintessential UAE flowering plant, with vivid paper-like bracts. Available as climbers and shaped standards.", "جهنمية")
sp("jasmine", "Pink Jasmine", "Jasminum polyanthum", "Oleaceae", C_ORN, "Evergreen climber", FSP, "Moderate",
   ["Fragrance", "Climbers", "Ornamental"], "China (Yunnan & Sichuan)", "Jasminum polyanthum",
   "A twining climber bearing masses of sweetly scented white flowers opening from pink buds.", "ياسمين")
sp("lipstick-plant", "Lipstick Plant", "Aeschynanthus radicans", "Gesneriaceae", C_ORN, "Trailing epiphyte", BRIGHT, "Moderate",
   ["Indoor", "Hanging baskets"], "Malaysia & Indonesia", "Aeschynanthus radicans",
   "A trailing tropical plant with glossy leaves and tubular red flowers emerging from dark 'lipstick' calyces.")
sp("anthurium", "Anthurium", "Anthurium andraeanum", "Araceae", C_ORN, "Evergreen tropical perennial", BRIGHT, "Moderate",
   ["Indoor", "Ornamental"], "Colombia & Ecuador", "Anthurium andraeanum",
   "Glossy heart-shaped leaves and long-lasting waxy flowers. A premium indoor plant.", "أنثوريوم")

# ---------------- HERBS & MEDICINAL ----------------
sp("aloe-vera", "Aloe Vera", "Aloe vera", "Asphodelaceae", C_HERB, "Succulent perennial", FS, "Very low",
   ["Medicinal", "Succulent landscaping"], "Arabian Peninsula", "Aloe vera",
   "A soothing medicinal succulent native to the Arabian Peninsula. Thrives on minimal water.", "صبار (ألوفيرا)")
sp("butterfly-pea", "Butterfly Pea", "Clitoria ternatea", "Fabaceae", C_HERB, "Perennial climbing vine", FS, "Moderate",
   ["Herbal tea", "Natural dye", "Climbers"], "Tropical Asia", "Clitoria ternatea",
   "Brilliant blue flowers used for colour-changing herbal teas and natural food colouring.", "بازلاء الفراشة")
sp("mexican-mint", "Mexican Mint (Indian Borage)", "Coleus amboinicus", "Lamiaceae", C_HERB, "Succulent perennial herb", FSP, "Low",
   ["Culinary", "Medicinal", "Ground cover"], "Southern & Eastern Africa", "Coleus amboinicus",
   "A fragrant, fleshy-leaved herb with an oregano-like aroma, used in cooking and traditional remedies.")
sp("giloy", "Giloy (Heart-leaved Moonseed)", "Tinospora cordifolia", "Menispermaceae", C_HERB, "Deciduous climbing shrub", FSP, "Low",
   ["Medicinal", "Climbers"], "India & tropical Asia", "Tinospora cordifolia",
   "A climbing shrub with heart-shaped leaves, highly valued in Ayurvedic tradition.")

FEATURED = ["mango", "cocoa", "date-palm", "ghaf", "pomegranate", "coffee-arabica", "sidr", "olive"]
