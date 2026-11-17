"""Rules that map messy inventory rows (plant name + variety + source) to catalogue species, varieties and origin countries.
Edit these when new plants or suppliers appear in the stock sheet."""
import json, re


def origin_of(src):
    s = src.lower()
    out = []
    if not s or s in ('n / a',) or any(k in s for k in ['procurement', 'mr lll', 'from market', 'green stock', 'unknown rootstock']):
        return []
    foreign = [
        ('egypt', 'Egypt'), ('مصر', 'Egypt'), ('mohandes', 'Egypt'), ('muhandash', 'Egypt'),
        ('israel', 'Israel'), ('isreal', 'Israel'), ('haskelberg', 'Israel'),
        ('brazil', 'Brazil'), ('india', 'India'), ('indonesia', 'Indonesia'), ('uganda', 'Uganda'),
        ('thailand', 'Thailand'), ('jordan', 'Jordan'), ('bahrain', 'Bahrain'), ('oman', 'Oman'),
        ('saudi', 'Saudi Arabia'), ('morocc', 'Morocco'), ('mroco', 'Morocco'),
    ]
    for k, v in foreign:
        if k in s and v not in out:
            out.append(v)
    if 'uae' in s:
        out.insert(0, 'UAE')
    if not out:
        if 'narenj' in s:
            return []
        out = ['UAE']
    # sources like "Saudi / EFALP" or "Egypt / EFALP" are imports held at EFALP -> keep import country only
    return out

def title(s):
    return ' '.join(w if w.isupper() and len(w) <= 4 else w.capitalize() for w in s.split())

MANGO_MAP = [
    ('alphonso', 'Alphonso'), ('dab', 'Dabsha'), ('langr', 'Langra'), ('chaunsa', 'Chaunsa'),
    ('miyazaki', 'Miyazaki'), ('kohithur', 'Kohitur'), ('hakugin', 'Hakugin'), ('maya', 'Maya'),
    ('golek', 'Golek'), ('mahacanok', 'Mahachanok'), ('maha chinook', 'Mahachanok'), ('lily', 'Lily'),
    ('osteen', 'Osteen'), ('thufahee', 'Tufahi'), ('siddique', 'Siddique'), ('aston', 'Aston'),
    ('tommy', 'Tommy Atkins'), ('nam dok mai', 'Nam Dok Mai'), ('sukari', 'Sukkari'), ('sukkari mumtaz', 'Sukkari'),
    ('radha puri', 'Rajapuri'), ('rajapuri', 'Rajapuri'), ('yasmina', 'Yasmina'),
    ('shaan e khuda', 'Shan-e-Khuda'), ('sindhri', 'Sindhri'), ('fadli', 'Fadli'), ('zebdia', 'Zebdia'),
    ('amrapali', 'Amrapali'), ('naomi', 'Naomi'), ('kent', 'Kent'), ('keitt', 'Keitt'), ('badami', 'Badami'),
    ('safeeda', 'Safeeda'), ('anwar ratool', 'Anwar Ratol'), ('dasheri', 'Dashehari'), ('desheri', 'Dashehari'),
    ('kaiser', 'Kesar'), ('neelam', 'Neelam'), ('himsagar', 'Himsagar'), ('banganapalli', 'Banganapalli'),
    ('totapuri', 'Totapuri'), ('oweiss', 'Owais'), ('qirat', 'Qirat'), ('thai seedles', 'Thai Seedless'),
    ('palmer', 'Palmer'), ('crismon', None), ('chilli', None),
]

def mango_variety(v):
    s = v.lower()
    if 'rootstock' in s and 'grafted' not in s and 'qirat normal' not in s:
        return None
    if 'root stock' in s and 'grafted' not in s:
        return None
    for k, lab in MANGO_MAP:
        if k in s:
            return lab
    return None

def first(s, pairs):
    for k, lab in pairs:
        if k in s:
            return lab
    return None

def classify(r):
    p, v = r['plant'], r['variety']
    t = (p + ' ' + v).lower()
    vl = v.lower()
    if 'cacao' in t or 'cocoa' in t:
        return 'cocoa', first(t, [('porcelana', 'Porcelana'), ('forestero', 'Forastero'), ('criollo', 'Criollo'),
                                  ('trinitario', 'Trinitario'), ('amazon', 'Amazonian')])
    if 'coffe' in t or 'cofee' in t:
        if 'robusta' in t:
            return 'coffee-robusta', None
        return 'coffee-arabica', first(t, [('castillo', 'Castillo'), ('colombia', 'Variedad Colombia'), ('typica', 'Typica'),
                                           ('santos', 'Santos'), ('tabi', 'Tabi'), ('bourbon', 'Bourbon'), ('geisha', 'Geisha'),
                                           ('cenicafe', 'Cenicafé 1'), ('papaya', 'Papayo')])
    if 'oud' in t or 'aquilaria' in t:
        return 'agarwood', None
    if 'mango' in t or 'mangifera' in t:
        return 'mango', mango_variety(v if 'mango' in p.lower() or 'mangifera' in p.lower() else p + ' ' + v)
    if 'pomegran' in t or 'punica' in t:
        return 'pomegranate', first(t, [('omani', 'Omani (Jebel Akhdar)'), ('oman', 'Omani (Jebel Akhdar)'), ('jabel al ak', 'Omani (Jebel Akhdar)'),
                                        ('yem', 'Yemeni'), ('yaman', 'Yemeni'), ('saudi', 'Saudi'), ('shanny', 'Shani'),
                                        ('indian', 'Indian'), ('akko', 'Akko 13'), ('wonderful', 'Wonderful'),
                                        ('purple queen', 'Purple Queen'), ('moller', 'Mollar de Elche'), ('mollar', 'Mollar de Elche'),
                                        ('morrocco', 'Moroccan')])
    if 'cherry brazil' in t or 'eugenia' in t:
        return 'surinam-cherry', None
    if 'barbados' in t:
        return 'barbados-cherry', None
    if 'morus' in t:
        return 'mulberry', None
    if 'neem' in t or 'azad' in t:
        return 'neem', None
    if 'bamb' in t:
        return 'bamboo', None
    if 'aloe' in t:
        return 'aloe-vera', None
    if 'banana' in t or 'mussa' in t:
        return 'banana', first(t, [('blue java', 'Blue Java'), ('red banana', 'Red Banana')])
    if 'thai' in t and ('sidr' in t or 'ziziphus' in t):
        return 'thai-ber', 'Thai Sidr (grafted)' if 'grafted' in t else None
    if 'jujub' in t or 'jububa' in t:
        return 'jujube', None
    if 'sidr' in t or 'sidar' in t or 'ziziphus' in t or 'lote tree' in t:
        return 'sidr', first(t, [('taufahee', 'Tufahi'), ('round', 'Round-fruited'), ('oblong', 'Oblong-fruited'), ('local', 'Local')])
    if 'ghaf' in t or 'prosopis' in t or 'posopis' in t:
        return 'ghaf', None
    if 'phoenix' in t or 'date palm' in t:
        return 'date-palm', first(t, [('owaidi', 'Owaidi (Iraqi)'), ('helwa', 'Helwa')])
    if 'jack' in t or 'artoc' in t:
        return 'jackfruit', 'Thai' if 'thai' in t else None
    if 'washingtonia' in t or 'mexican pal' in t:
        return 'washingtonia', None
    if 'caesalpinia' in t or 'peacok' in t or 'peacock' in t:
        return 'peacock-flower', None
    if 'malabar' in t or 'garcinia' in t:
        return 'malabar-tamarind', None
    if 'pithecellobium' in t:
        return None, None
    if 'tamarind' in t:
        return 'tamarind', None
    if 'cassia' in t or 'golden shower' in t:
        return 'cassia-fistula', None
    if 'papaya' in t:
        return 'papaya', None
    if 'dodonaea' in t:
        return 'hopbush', None
    if 'persica' in t or 'nectr' in t:
        return 'nectarine', None
    if 'plum' in t and 'plumeria' not in t:
        return 'plum', None
    if 'ficus carica' in t or 'fig' in t:
        return 'fig', first(t, [('mawaazi', 'Mawazi Black'), ('french', 'Black French'), ('bahari', 'Bahari'), ('ghani', 'Ghani')])
    if 'tinospora' in t:
        return 'giloy', None
    if 'morinda' in t and 'guava' in t:
        return None, None
    if 'noni' in t or 'morinda' in t:
        return 'noni', None
    if re.search(r'\b(olea|olia|oliea|olive)', t):
        return 'olive', first(t, [('toufahi', 'Toffahi'), ('koroneiki', 'Koroneiki'), ('coratina', 'Coratina'), ('ezeji', 'Aggezi'),
                                  ('grossa', 'Grossa'), ('arbosana', 'Arbosana'), ('grignan', 'Grignan')])
    if 'morinda' in t and 'guava' in t:
        return None, None
    if 'noni' in t or 'morinda' in t:
        return 'noni', None
    if 'aeschynanthus' in t:
        return 'lipstick-plant', None
    if 'passiflora' in t:
        return 'passion-fruit', None
    if 'piper' in t:
        return 'black-pepper', None
    # ---- citrus ----
    if 'hystrix' in t:
        return 'kaffir-lime', None
    if 'kumquat' in t:
        return 'kumquat', None
    if 'pomelo' in t:
        return 'pomelo', 'Cocktail'
    if 'grapefru' in t:
        return 'grapefruit', first(t, [('flame', 'Flame'), ('ruby', 'Ruby Red'), ('rubby', 'Ruby Red'), ('red', 'Ruby Red')])
    if 'clementine' in t or 'climentina' in t:
        return 'mandarin', 'Clementine Michal' if 'michal' in t else 'Clementine'
    if 'murcott' in t:
        return 'mandarin', 'Murcott Tangerine'
    if 'tangerine' in t:
        return 'mandarin', 'Tangerine'
    if 'limetta' in t:
        return 'sweet-lime', 'Mosambi'
    if 'tring' in t:
        return 'citron', None
    if 'bitter orange' in t or 'aurantium' in t:
        return 'bitter-orange', 'Narenj (var. amara)' if 'amara' in t else None
    if 'mandarin' in t or 'mandarian' in t or 'reticulata' in t or 'recticulata' in t or 'nobilis' in t or 'givaudan' in t or 'gardenia' in t:
        return 'mandarin', 'Moroccan Mandarin' if 'morocco' in t else None
    if 'lime' in t:
        return 'lime', 'Thai Seedless' if 'thai' in t else None
    if 'lemon' in t:
        return 'lemon', first(t, [('eureka', 'Eureka'), ('american', 'American'), ('china', 'China'), ('lebanese', 'Lebanese'),
                                  ('oman', 'Omani'), ('shamon', 'Omani')])
    if 'citrus' in t or 'orange' in t:
        return 'orange', first(t, [('valencia', 'Valencia'), ('navel', 'Navel (Abu Surra)'), ('naval', 'Navel (Abu Surra)'),
                                   ('abu surah', 'Navel (Abu Surra)'), ('white villa', 'Navel (Abu Surra)'), ('basra', 'Basra'),
                                   ('brazilian', 'Brazilian')])
    if 'grape' in t or 'vitis' in t:
        if 'rootstock' in t:
            return 'grape', None
        return 'grape', first(t, [('arra15 sweeties', 'ARRA Sweeties'), ('arra 15 sweeties', 'ARRA Sweeties'), ('arra', 'ARRA 15'),
                                  ('thomson', 'Thompson Seedless'), ('thompson', 'Thompson Seedless'), ('lady finger', 'White Lady Finger'),
                                  ('allison', 'Allison'), ('crimson', 'Crimson Seedless'), ('flame', 'Flame Seedless'),
                                  ('romen ruby', 'Ruby Roman'), ('sugra', 'Superior Seedless (Sugraone)')])
    if 'cattleyanum' in t or 'strawb' in t:
        return 'strawberry-guava', None
    if 'guava' in t or 'guajava' in t or 'guva' in t:
        return 'guava', first(t, [('vnr', 'VNR'), ('vietamese', 'Vietnamese'), ('thailand', 'Thai'), ('ben- dov', 'Ben Dov'),
                                  ('black', 'Black'), ('red', 'Red')])
    if 'custard' in t or 'annona' in t:
        return 'sugar-apple', None
    if 'cinnamom' in t:
        return 'cinnamon', None
    if 'plumeria' in t:
        return 'plumeria', 'Red'
    if 'diospyros' in t or 'black sapot' in t:
        return 'black-sapote', None
    if 'adansonia' in t:
        return 'baobab', None
    if 'ceiba' in t:
        return 'ceiba', None
    if 'pear' in t or 'pyrus' in t:
        return 'pear', None
    if 'apricot' in t:
        return 'apricot', None
    if 'tinospora' in t:
        return 'giloy', None
    if 'eucal' in t:
        return 'eucalyptus', None
    if 'apple' in t or 'malus' in t:
        return 'apple', None
    if 'carob' in t:
        return 'carob', None
    if 'terminal' in t or 'sea almond' in t:
        return 'terminalia', None
    if 'cycas' in t:
        return 'sago-palm', None
    if 'chamaerops' in t or 'european fan' in t:
        return 'european-fan-palm', None
    if 'bogainvillea' in t or 'bougain' in t:
        return 'bougainvillea', None
    if 'pongamia' in t or 'karanja' in t:
        return 'pongamia', None
    if 'melia' in t:
        return 'melia', None
    if 'religiosa' in t or 'bodhi' in t:
        return 'ficus-religiosa', None
    if 'clausena' in t:
        return 'wampee', None
    if 'acca' in t or 'feijoa' in t:
        return 'feijoa', None
    if 'dimocarpus' in t or 'longan' in t:
        return 'longan', None
    if 'chikoo' in t or 'sapodila' in t or 'manilkara' in t:
        return 'sapodilla', None
    if 'clitoria' in t:
        return 'butterfly-pea', None
    if 'cocos' in t or 'ccos' in t or 'coconut' in t:
        return 'coconut', 'Yellow' if 'yellow' in t else None
    if 'plectranthus' in t:
        return 'mexican-mint', None
    if 'anthurium' in t:
        return 'anthurium', None
    if 'dypsis' in t:
        return 'areca-palm', None
    if 'selenicereus' in t or 'dragon' in t:
        return 'dragon-fruit', None
    if 'roystonea' in t:
        return 'royal-palm', None
    if 'avocado' in t:
        return 'avocado', first(t, [('etinger', 'Ettinger'), ('pinkerton', 'Pinkerton')])
    if 'parkinsonia' in t:
        return 'parkinsonia', None
    if 'arucarya' in t:
        return 'araucaria', None
    if 'cashew' in t:
        return 'cashew', None
    if 'balanites' in t or 'higlig' in t or 'higlij' in t:
        return 'desert-date', None
    if 'walnut' in t:
        return 'walnut', None
    if 'muringa' in t:
        return 'moringa', None
    if 'argania' in t:
        return 'argan', None
    if 'peltophorum' in t:
        return 'peltophorum', None
    if 'delonix' in t:
        return 'delonix', None
    if 'acacia' in t:
        return 'acacia-nilotica', None
    if 'buhinia' in t:
        return 'bauhinia', None
    if 'altisima' in t:
        return 'ficus-altissima', None
    if 'bengh' in t:
        return 'banyan', None
    if 'jusmin' in t:
        return 'jasmine', None
    if 'tabebuia' in t:
        return 'tabebuia', None
    return None, None

