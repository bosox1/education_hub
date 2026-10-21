#!/usr/bin/env python3
"""
Одноразовий конвертер старого HTML-сайту (collegeifnmu.co.uk webcopy) у дані для React.

  python3 scripts/convert_legacy.py <шлях-до-старого-репо>

Створює:
  src/data/catalog.json      — список матеріалів і розділів хабу
  src/data/pages.json        — тексти «Про нас», «Автори», подкасти тощо
  public/content/<id>.json   — очищений HTML кожного матеріалу
  public/media/...           — лише ті картинки/файли, на які є посилання (картинки стиснуті)
  public/_redirects          — 301 зі старих адрес *.html на нові
"""
import json, os, re, sys, shutil, posixpath, urllib.parse
from collections import OrderedDict
from bs4 import BeautifulSoup, NavigableString, Comment
from PIL import Image

SRC = os.path.abspath(sys.argv[1])
OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MEDIA_DIR = os.path.join(OUT, 'public', 'media')
CONTENT_DIR = os.path.join(OUT, 'public', 'content')
STUDENT_GUIDE = 'https://studentguide.ifnmu.edu.ua/'

media_needed = {}      # legacy rel path -> public url
missing = set()
warnings = []

def read(rel):
    with open(os.path.join(SRC, rel), encoding='utf-8-sig', errors='replace') as f:
        return BeautifulSoup(f.read(), 'html.parser')

def clean_text(s):
    return re.sub(r'\s+', ' ', s or '').strip()

def tidy_title(s):
    s = clean_text(s).rstrip('.').strip()
    letters = [ch for ch in s if ch.isalpha()]
    if letters and sum(ch.isupper() for ch in letters) / len(letters) > 0.7:
        low = s.lower()
        # абревіатури лишаємо великими
        for ab in re.findall(r'\b[A-ZА-ЯІЇЄҐ]{2,6}\b', s):
            if ab in ('ЄДКІ', 'ЧЗПП', 'ПЗПП', 'АЗД', 'ПХОР', 'BLS', 'ATLS', 'ОЕФ', 'ЛФ', 'NEST', 'ТССС', 'НМТ'):
                low = re.sub(r'\b' + ab.lower() + r'\b', ab, low)
        s = low[:1].upper() + low[1:]
    return s

def norm(s):
    return re.sub(r'[^\wа-яіїєґ]+', '', clean_text(s).lower())

# ---------- маршрути ----------
def material_id(rel):
    d, f = posixpath.split(rel)
    name = posixpath.splitext(f)[0].replace('_', '-')
    if d == 'eduHubPages':
        return name
    if d == 'Stomatology':
        return 'stom-' + name
    if d == 'Pharmacy':
        return 'pharm-' + name
    return None

STATIC_ROUTES = {
    'index.html': '/', 'index.htm': '/', 'edu_hub.html': '/hub',
    'nurse.html': '/hub/nursing', 'stomatology.html': '/hub/dentistry',
    'pharmacy.html': '/hub/pharmacy', 'farmacy.html': '/hub/pharmacy',
    'about_us.html': '/about', 'work.html': '/vacancies',
    'nmt.html': '/nmt', 'nmt/nmt_guide.html': '/nmt',
    'army/index.html': '/tccc', 'Stomatology/podcasts.html': '/hub/dentistry/podcasts',
    'eduHubPages/authors.html': '/authors',
}

def route_for(rel):
    if rel in STATIC_ROUTES:
        return STATIC_ROUTES[rel]
    if rel.startswith('StudentGit'):
        return STUDENT_GUIDE
    mid = material_id(rel)
    if mid and os.path.exists(os.path.join(SRC, rel)):
        return '/material/' + mid
    return None

def safe_name(p):
    d, f = posixpath.split(p)
    base, ext = posixpath.splitext(f)
    base = re.sub(r'[^\w.\-]+', '-', base, flags=re.ASCII).strip('-') or 'file'
    return posixpath.join(d, base + ext.lower())

def media(rel):
    """Реєструє файл для копіювання та повертає публічну адресу."""
    rel = posixpath.normpath(rel)
    if not os.path.isfile(os.path.join(SRC, rel)):
        missing.add(rel)
        return None
    if rel not in media_needed:
        media_needed[rel] = '/media/' + safe_name(rel)
    return media_needed[rel]

def resolve(page_rel, url):
    """Повертає (тип, значення): ('ext', url) | ('route', path) | ('media', url) | ('missing', rel)"""
    url = re.sub(r'\s+', '', url or '')
    if not url or url.startswith('#') or url.startswith('javascript'):
        return ('none', None)
    if re.match(r'^(https?:)?//', url) or url.startswith('mailto:') or url.startswith('tel:'):
        if url.startswith('//'):
            url = 'https:' + url
        # колишні абсолютні посилання на старий домен
        m = re.match(r'^https?://(www\.)?collegeifnmu\.co\.uk/?(.*)$', url)
        if m:
            return resolve('index.html', m.group(2) or 'index.html')
        return ('ext', url)
    path = urllib.parse.unquote(url.split('#')[0].split('?')[0])
    rel = posixpath.normpath(posixpath.join(posixpath.dirname(page_rel), path))
    if rel.endswith('.html') or rel.endswith('.htm') or rel.endswith('/'):
        r = route_for(rel)
        if r:
            return ('route', r)
        missing.add(rel)
        return ('missing', rel)
    m = media(rel)
    return ('media', m) if m else ('missing', rel)

def yt_id(src):
    m = re.search(r'youtube(?:-nocookie)?\.com/embed/([\w-]{6,})', src or '')
    return m.group(1) if m else None

# ---------- очищення HTML матеріалу ----------
KEEP_ATTRS = {
    'a': ['href'], 'img': ['src', 'alt'], 'iframe': ['src', 'title', 'allow', 'allowfullscreen'],
    'td': ['colspan', 'rowspan'], 'th': ['colspan', 'rowspan'], 'audio': ['controls'],
    'source': ['src', 'type'], 'ol': ['start'],
}
BUTTON_CLASSES = {'button', 'table_nav', 'link_button', 'prezentation_link', 'virtual_button', 'button_group_bttn'}
DROP_TAGS = ['script', 'style', 'noscript', 'link', 'meta', 'form', 'input', 'textarea']
UNWRAP_TAGS = ['span', 'font', 'center', 'header', 'main', 'article', 'section', 'u']

def clean_material(soup, page_rel):
    w = soup.select_one('.wrapper') or soup.body
    for t in w.find_all(string=lambda s: isinstance(s, Comment)):
        t.extract()
    for t in w.find_all(DROP_TAGS):
        t.decompose()
    for t in w.select('.nav, .burger_menu, footer'):
        t.decompose()

    # кнопка всередині посилання -> посилання-кнопка
    for a in w.find_all('a'):
        cls = set(a.get('class') or [])
        if a.find('button') or cls & BUTTON_CLASSES:
            a['data-btn'] = '1'
        for b in a.find_all('button'):
            b.unwrap()
    for b in w.find_all('button'):
        b.name = 'span'

    # заголовок
    h1s = w.find_all('h1')
    title = tidy_title(h1s[0].get_text()) if h1s else ''
    if h1s:
        h1s[0].decompose()
        for h in h1s[1:]:
            h.name = 'h2'

    videos = []
    for f in w.find_all('iframe'):
        src = f.get('src', '')
        vid = yt_id(src)
        if vid:
            videos.append(vid)
            src = f'https://www.youtube-nocookie.com/embed/{vid}'
        f.attrs = {'src': src, 'title': f.get('title') or 'Відео', 'loading': 'lazy',
                   'allow': 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
                   'allowfullscreen': ''}
        wrap = soup.new_tag('div', attrs={'class': 'embed'})
        f.wrap(wrap)

    for img in w.find_all('img'):
        kind, val = resolve(page_rel, img.get('src'))
        if kind in ('media', 'ext'):
            img.attrs = {'src': val, 'alt': img.get('alt', ''), 'loading': 'lazy'}
        else:
            img.decompose()

    for src in w.find_all('source'):
        kind, val = resolve(page_rel, src.get('src'))
        if kind == 'media':
            src['src'] = val

    for a in w.find_all('a'):
        is_btn = a.get('data-btn')
        kind, val = resolve(page_rel, a.get('href'))
        attrs = {}
        if kind == 'ext' or kind == 'media':
            attrs = {'href': val, 'target': '_blank', 'rel': 'noopener'}
        elif kind == 'route':
            attrs = {'href': val, 'data-internal': '1'}
            if val.startswith('http'):
                attrs = {'href': val, 'target': '_blank', 'rel': 'noopener'}
        else:
            a.unwrap()
            continue
        if is_btn:
            attrs['class'] = 'btn'
        if not clean_text(a.get_text()) and not a.find('img'):
            attrs.setdefault('class', 'btn')
            a.string = 'Відкрити'
        a.attrs = attrs

    # таблиці: перший рядок -> заголовок, обгортка для прокрутки
    for table in w.find_all('table'):
        rows = table.find_all('tr')
        if rows:
            first = rows[0]
            cells = first.find_all(['td', 'th'], recursive=False)
            txt = ' '.join(clean_text(c.get_text()) for c in cells)
            if cells and len(txt) < 140 and not first.find('img'):
                for c in cells:
                    c.name = 'th'
                    for p in c.find_all('p'):
                        p.unwrap()
        for el in table.find_all(['pre']):
            el.name = 'span'
        wrap = soup.new_tag('div', attrs={'class': 'table-wrap'})
        table.wrap(wrap)

    # атрибути
    for t in w.find_all(True):
        if t.name in ('a', 'img', 'iframe') or (t.name == 'div' and t.get('class') in (['embed'], ['table-wrap'])):
            continue
        keep = KEEP_ATTRS.get(t.name, [])
        t.attrs = {k: v for k, v in t.attrs.items() if k in keep}
    for t in w.find_all(UNWRAP_TAGS):
        if t.name == 'span':
            t.insert_after(' ')
        t.unwrap()
    # div без класу -> розгорнути
    for d in w.find_all('div'):
        if not d.get('class'):
            d.unwrap()
    # порожні абзаци/заголовки
    for t in w.find_all(['p', 'h2', 'h3', 'h4', 'li', 'b', 'strong', 'i']):
        if not clean_text(t.get_text()) and not t.find(['img', 'iframe', 'a', 'audio']):
            t.decompose()
    # дубльовані рядки (у старих таблицях текст двох колонок часом однаковий) лишаємо як є
    html = w.decode_contents()
    html = re.sub(r'[ \t\r\f\v]+', ' ', html)
    html = re.sub(r'\s*\n\s*', ' ', html)
    html = re.sub(r'(</(?:p|h2|h3|h4|li|tr|table|div|ul|ol)>)', r'\1\n', html)
    html = html.replace(' ', ' ').strip()
    text = clean_text(BeautifulSoup(html, 'html.parser').get_text(' '))
    return title, html, videos, text

def describe(soup, html):
    s = BeautifulSoup(html, 'html.parser')
    for p in s.find_all('p'):
        t = clean_text(p.get_text())
        if len(t) > 40:
            return t[:220] + ('…' if len(t) > 220 else '')
    return ''

def detect_lang(text):
    cyr = len(re.findall(r'[а-яіїєґ]', text.lower()))
    lat = len(re.findall(r'[a-z]', text.lower()))
    return 'en' if lat > cyr * 1.5 else 'uk'

# ---------- 1. Матеріали ----------
materials = OrderedDict()
pages = []
for d in ['eduHubPages', 'Stomatology', 'Pharmacy']:
    for f in sorted(os.listdir(os.path.join(SRC, d)), key=lambda x: (len(x), x)):
        rel = f'{d}/{f}'
        if not f.endswith('.html') or rel in STATIC_ROUTES:
            continue
        pages.append(rel)

os.makedirs(CONTENT_DIR, exist_ok=True)
for rel in pages:
    soup = read(rel)
    mid = material_id(rel)
    title, html, videos, text = clean_material(soup, rel)
    head_title = clean_text(soup.title.get_text()) if soup.title else ''
    if not title:
        title = tidy_title(head_title)
    has_table = '<table' in html
    m = {
        'id': mid, 'legacy': rel, 'title': title,
        'desc': describe(soup, html),
        'videos': len(videos), 'thumb': f'https://i.ytimg.com/vi/{videos[0]}/hqdefault.jpg' if videos else None,
        'algorithm': has_table, 'lang': detect_lang(title + ' ' + text[:600]),
        'files': len(re.findall(r'href="/media/[^"]+\.(?:pdf|docx?|pptx?)"', html)),
    }
    materials[mid] = m
    with open(os.path.join(CONTENT_DIR, f'{mid}.json'), 'w', encoding='utf-8') as fp:
        json.dump({'id': mid, 'title': title, 'html': html}, fp, ensure_ascii=False)

# ---------- 2. Розділи хабу ----------
def parse_listing(rel):
    soup = read(rel)
    items = []
    for block in soup.select('.eduHub > div'):
        cls = ' '.join(block.get('class') or [])
        if 'eduHub_block' not in cls:
            continue
        a = block.find('a')
        if not a:
            continue
        kind, target = resolve(rel, a.get('href'))
        banner_txt = ''
        bb = block.select_one('[class^=eduHub_block_banner] p')
        if bb:
            banner_txt = clean_text(bb.get_text())
        info = block.select_one('[class^=eduHub_info]')
        info_ps = [clean_text(p.get_text()) for p in (info.find_all('p') if info else [])]
        info_ps = [p for p in info_ps if p]
        img = None
        bimg = block.select_one('.banner img')
        if bimg:
            k, v = resolve(rel, bimg.get('src'))
            img = v if k == 'media' else None
        flavor = None
        if 'canada' in str(block):
            flavor = 'canada'; img = img or media('img/canada_banner.jpg')
        if 'army' in cls:
            flavor = 'tccc'; img = img or media('img/soldier.png')
        if 'podcasts' in cls:
            flavor = 'podcasts'
        banner_txt = tidy_title(banner_txt)
        info_ps = [tidy_title(p) for p in info_ps]
        if banner_txt:
            title = banner_txt
            sub = info_ps[0] if info_ps and norm(info_ps[0]) != norm(banner_txt) else ''
        elif len(info_ps) >= 2:
            title, sub = info_ps[-1], ' · '.join(info_ps[:-1])
        else:
            title, sub = (info_ps[0] if info_ps else ''), ''
        entry = {'href': target if kind in ('route', 'ext') else None, 'external': kind == 'ext' or (kind == 'route' and target.startswith('http')), 'title': title, 'subtitle': sub, 'image': img, 'flavor': flavor}
        if kind == 'route' and target.startswith('/material/'):
            mid = target.split('/')[-1]
            entry['material'] = mid
            m = materials[mid]
            if not title:
                entry['title'] = m['title']
        if flavor == 'podcasts':
            entry['title'] = 'Подкасти з ортопедичної стоматології'
            entry['subtitle'] = '19 випусків: лекції, розмови з професорами та практиками'
            entry['image'] = media('Stomatology/podcasts/banner.jpg')
        if kind not in ('route', 'ext'):
            warnings.append(f'{rel}: посилання «{a.get("href")}» не знайдено — блок «{title}» пропущено')
            continue
        if any(i['href'] == entry['href'] for i in items):
            warnings.append(f'{rel}: повтор «{entry["title"]}» ({entry["href"]}) — пропущено')
            continue
        items.append(entry)
    intro = []
    ai = soup.select_one('.authors_info')
    if ai:
        intro = [clean_text(p.get_text()) for p in ai.find_all('p') if clean_text(p.get_text())]
    return items, intro

sections = OrderedDict()
for key, rel, name, code in [
    ('nursing', 'nurse.html', 'Медсестринство', '223'),
    ('dentistry', 'stomatology.html', 'Стоматологія', '221'),
    ('pharmacy', 'pharmacy.html', 'Фармація', '226'),
]:
    items, intro = parse_listing(rel)
    sections[key] = {'key': key, 'name': name, 'code': code, 'items': items, 'intro': intro}

# до якого розділу належить матеріал (для «назад»)
for key, sec in sections.items():
    for it in sec['items']:
        mid = it.get('material')
        if mid:
            materials[mid].setdefault('sections', [])
            if key not in materials[mid]['sections']:
                materials[mid]['sections'].append(key)
            if it.get('image') and not materials[mid].get('image'):
                materials[mid]['image'] = it['image']

# посилання між матеріалами (ЄДКІ -> підсторінки тощо), що не потрапили в жоден список
orphans = [k for k, m in materials.items() if not m.get('sections')]

# ---------- 3. Окремі сторінки ----------
def texts(el):
    return [clean_text(p.get_text()) for p in el.find_all('p') if clean_text(p.get_text())]

about = {}
s = read('about_us.html')
c = s.select_one('section.content')
blocks = []
cur = None
for el in c.find_all(['h2', 'p', 'img']):
    if el.name == 'h2':
        cur = {'title': clean_text(el.get_text()), 'paras': [], 'images': [], 'people': []}
        blocks.append(cur)
    elif cur is None:
        continue
    elif el.name == 'img':
        if 'up-arrow' in el.get('src', ''):
            continue
        k, v = resolve('about_us.html', el.get('src'))
        if v:
            cur['images'].append(v)
    else:
        t = clean_text(el.get_text())
        if not t:
            continue
        if len(t) < 40 and len(t.split()) <= 4:
            cur['people'].append(t)
        else:
            cur['paras'].append(t)
about['blocks'] = blocks
about['portraits'] = {
    'Павло Павлович Звонар': media('img/firstdirector.png'),
    'Юрій Володимирович Боцюрко': media('img/seconddirektor.png'),
    'Бульбук Олександр Іванович': media('img/father.png'),
}

authors = []
s = read('eduHubPages/authors.html')
for art in s.select('.wrapper main article'):
    img = art.find('img')
    k, v = resolve('eduHubPages/authors.html', img.get('src') if img else '')
    h = art.find('h3')
    title = re.sub(r'^\d+\.\s*', '', clean_text(h.get_text())) if h else ''
    names = [t for t in texts(art) if t]
    authors.append({'title': title, 'text': ' '.join(names), 'image': v if k == 'media' else None})

podcasts = []
s = read('Stomatology/podcasts.html')
for p in s.select('.podcast'):
    src = p.find('source').get('src')
    path = posixpath.normpath(posixpath.join('Stomatology', urllib.parse.unquote(src)))
    fname = posixpath.basename(path)
    podcasts.append({'title': clean_text(p.find('p').get_text()), 'file': '/media/podcasts/' + re.sub(r'\s*\(\d+\)', '', fname)})

def links(el, page):
    out = []
    for a in el.find_all('a'):
        k, v = resolve(page, a.get('href'))
        if k in ('ext', 'media', 'route'):
            out.append({'label': clean_text(a.get_text()), 'href': v})
    return out

nmt = {}
s = read('nmt/nmt_guide.html')
nmt['cards'] = []
for t in s.select('.try_nmt'):
    nmt['cards'].append({'title': clean_text(t.h2.get_text()), 'text': ' '.join(texts(t)), 'href': links(t, 'nmt/nmt_guide.html')[0]['href']})
nmt['resources'] = links(s.select_one('.usefull_resources'), 'nmt/nmt_guide.html')
nmt['rules'] = links(s.select_one('.new_rules'), 'nmt/nmt_guide.html')

work = []
s = read('work.html')
for it in s.select('.work__item'):
    k, v = resolve('work.html', it.img.get('src'))
    work.append({'title': clean_text(it.h2.get_text()), 'image': v, 'href': it.a.get('href')})
work_intro = texts(s.select_one('.work_banner_info'))

s = read('army/index.html')
tccc = {
    'title': clean_text(s.h1.get_text()),
    'text': clean_text(s.select_one('.header_cont_info p').get_text()),
    'more': s.select_one('.header_cont_info a').get('href').strip(),
    'uk': s.select_one('main a').get('href'),
    'image': media('army/img/main_img.png'),
    'cover': media('army/img/banner_bg.jpg'),
    'soldier': media('army/img/soldier.png') or media('img/soldier.png'),
}

s = read('edu_hub.html')
hub = {
    'directions': {clean_text(b.h1.get_text()): clean_text(b.p.get_text()) for b in s.select('.header__block')},
    'audience': [clean_text(li.get_text()).rstrip(',.') for li in s.select('main ul li')],
    'quote': clean_text(s.select_one('.cytata_info p').get_text()),
    'quoteAuthor': clean_text(s.select_one('.cytata_info h2').get_text()),
    'quotePhoto': media('img/father.jpg'),
}

home = {
    'slides': [media(f'img/slider_img_{i}.jpg') for i in range(1, 5)],
    'logo': media('img/logo.jpg'), 'ifnmuLogo': media('img/IFNMU_logo.jpg'),
    'hubLogo': media('img/edu_hub_logo.png'), 'favicon': media('img/logo.png'),
    'banners': {'nursing': media('img/nurse_banner.jpg'), 'dentistry': media('img/dental_banner.jpg'), 'pharmacy': media('img/farmacy_banner.jpg')},
    'hubBanner': media('img/edu_hub_banner.jpg'),
    'authorsImg': media('img/authors.jpg'),
}

pages_json = {'about': about, 'authors': authors, 'podcasts': podcasts, 'nmt': nmt,
              'work': {'intro': work_intro, 'items': work}, 'tccc': tccc, 'hub': hub, 'home': home}

os.makedirs(os.path.join(OUT, 'src', 'data'), exist_ok=True)
with open(os.path.join(OUT, 'src', 'data', 'catalog.json'), 'w', encoding='utf-8') as fp:
    json.dump({'sections': sections, 'materials': materials, 'orphans': orphans}, fp, ensure_ascii=False, indent=1)
with open(os.path.join(OUT, 'src', 'data', 'pages.json'), 'w', encoding='utf-8') as fp:
    json.dump(pages_json, fp, ensure_ascii=False, indent=1)

# ---------- 4. Медіа ----------
MAX_W = 1800
def copy_media(rel, url):
    src = os.path.join(SRC, rel)
    dst = os.path.join(OUT, 'public', url.lstrip('/'))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    ext = os.path.splitext(rel)[1].lower()
    before = os.path.getsize(src)
    if ext in ('.jpg', '.jpeg', '.png', '.webp') and before > 150_000:
        try:
            im = Image.open(src)
            im.load()
            if im.width > MAX_W:
                im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
            if ext in ('.jpg', '.jpeg'):
                im.convert('RGB').save(dst, 'JPEG', quality=80, optimize=True, progressive=True)
            elif ext == '.webp':
                im.save(dst, 'WEBP', quality=80)
            else:
                im.save(dst, 'PNG', optimize=True)
            if os.path.getsize(dst) < before:
                return
        except Exception as e:
            warnings.append(f'не вдалося стиснути {rel}: {e}')
    shutil.copyfile(src, dst)

if os.path.isdir(MEDIA_DIR):
    for root, dirs, files in os.walk(MEDIA_DIR):
        for f in files:
            if not f.endswith('.mp3'):
                os.remove(os.path.join(root, f))
for rel, url in media_needed.items():
    copy_media(rel, url)

# ---------- 5. Редиректи ----------
lines = ['# Старі адреси сайту -> нові сторінки (згенеровано scripts/convert_legacy.py)']
legacy = list(STATIC_ROUTES.items()) + [(m['legacy'], '/material/' + k) for k, m in materials.items()]
for rel, route in legacy:
    if route == '/' and rel.startswith('index'):
        lines.append(f'/{rel}  /  301')
        continue
    lines.append(f'/{urllib.parse.quote(rel)}  {route}  301')
lines.append('/StudentGit/*  ' + STUDENT_GUIDE + '  301')
for rel, url in media_needed.items():
    old = '/' + urllib.parse.quote(rel)
    if old != url:
        lines.append(f'{old}  {url}  301')
lines.append('/Stomatology/podcasts/*  /media/podcasts/:splat  301')
lines.append('/media/podcasts/pod9%20(2).mp3  /media/podcasts/pod9.mp3  301')
lines.append('/media/podcasts/pod10%20(2).mp3  /media/podcasts/pod10.mp3  301')
lines.append('/*  /index.html  200')
with open(os.path.join(OUT, 'public', '_redirects'), 'w', encoding='utf-8') as fp:
    fp.write('\n'.join(lines) + '\n')

print(f'матеріалів: {len(materials)}, без розділу: {len(orphans)}')
for k, s in sections.items():
    print(f'  {k}: {len(s["items"])} блоків')
print(f'медіафайлів: {len(media_needed)}')
print('відсутні файли:', sorted(missing))
for w in warnings:
    print('!', w)
