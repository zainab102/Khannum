#!/usr/bin/env python3
"""Fetch real book covers into images/covers/<slug>.jpg.

Sources, in order of preference:
  1. Known-good direct URLs (hand-verified).
  2. OpenLibrary search -> covers.openlibrary.org.

Any book we can't confidently match keeps its placeholder; the shop owner can
drop their own photo into images/covers/<slug>.jpg later (same filename).
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
COVERS_DIR = os.path.join(HERE, "..", "images", "covers")
BOOKS_JS = os.path.join(HERE, "..", "js", "books.js")

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15")

# Hand-verified direct cover URLs (title -> url).
KNOWN = {
    "Namal": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1483526434i/22673665.jpg",
    "Peer-e-Kamil": "https://upload.wikimedia.org/wikipedia/en/4/47/Pir-e-Kamil.jpg",
}

# Extra search hints (title -> "query string") for tricky titles.
HINTS = {
    "Peer-e-Kamil": "peer e kamil umera ahmed",
    "Aabehayat": "aab e hayat umera ahmed",
    "La Hasil": "la hasil umera ahmed",
    "Amar Bail": "amar bail umera ahmed",
    "Man-o-Salwa": "man o salwa umera ahmed",
    "Shehr-e-Zaat": "shehr e zaat umera ahmed",
    "Zindagi Gulzar Hai": "zindagi gulzar hai umera ahmed",
    "Mushaf (New Edition)": "mushaf nimra ahmed",
    "JKP (New Edition)": "jannat ke pattay nimra ahmed",
    "Halim": "haalim nimra ahmed",
    "Paras": "paras nimra ahmed",
    "Raja Gidh": "raja gidh bano qudsia",
    "Kayi Chand Thy Sar-e-Aasman": "kai chand thay sar e aasman",
}


def slugify(title):
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def parse_books(text):
    books = []
    for m in re.finditer(r'\{\s*id:\s*(\d+),\s*title:\s*"((?:[^"\\]|\\.)*)"[^}]*?category:\s*"((?:[^"\\]|\\.)*)"', text):
        books.append({
            "id": int(m.group(1)),
            "title": m.group(2).replace('\\"', '"'),
            "category": m.group(3),
        })
    return books


def http_get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://www.goodreads.com/"})
    with urllib.request.urlopen(req, timeout=25) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def openlibrary_cover(title, author_hint):
    q = HINTS.get(title, title)
    if author_hint and author_hint.lower() not in q.lower() and " " in author_hint:
        q = f"{q} {author_hint}"
    url = ("https://openlibrary.org/search.json?q="
           + urllib.parse.quote(q)
           + "&limit=6&fields=title,author_name,cover_i,language")
    try:
        docs = json.loads(http_get(url)).get("docs", [])
    except Exception as e:
        print(f"    ! search failed: {e}")
        return None
    # Prefer results that have a cover; favour urdu-language editions.
    with_cover = [d for d in docs if d.get("cover_i")]
    with_cover.sort(key=lambda d: 0 if "urd" in (d.get("language") or []) else 1)
    if not with_cover:
        return None
    cid = with_cover[0]["cover_i"]
    return f"https://covers.openlibrary.org/b/id/{cid}-L.jpg"


def download(url, dest):
    try:
        data = http_get(url, binary=True)
    except Exception as e:
        print(f"    ! download failed: {e}")
        return False
    # OpenLibrary returns a tiny 1x1 / blank for missing covers; guard on size.
    if len(data) < 3000:
        print(f"    ! image too small ({len(data)} bytes), skipping")
        return False
    with open(dest, "wb") as f:
        f.write(data)
    print(f"    -> saved {dest} ({len(data)//1024} KB)")
    return True


def main():
    os.makedirs(COVERS_DIR, exist_ok=True)
    with open(BOOKS_JS) as f:
        books = parse_books(f.read())
    if not books:
        print("No books parsed!")
        sys.exit(1)

    matched, missing = [], []
    author_categories = {"Umaira Ahmed", "Nemrah Ahmed"}
    for b in books:
        title = b["title"]
        slug = slugify(title)
        dest = os.path.join(COVERS_DIR, slug + ".jpg")
        if os.path.exists(dest):
            print(f"[skip] {title} (already have {slug}.jpg)")
            matched.append(title)
            continue
        print(f"[fetch] {title}")
        ok = False
        if title in KNOWN:
            ok = download(KNOWN[title], dest)
        if not ok:
            hint = b["category"] if b["category"] in author_categories else ""
            url = openlibrary_cover(title, hint)
            if url:
                print(f"    openlibrary: {url}")
                ok = download(url, dest)
            time.sleep(0.4)
        (matched if ok else missing).append(title)

    print("\n==== SUMMARY ====")
    print(f"Covers saved: {len(matched)}")
    print(f"Still placeholder ({len(missing)}): " + ", ".join(missing))


if __name__ == "__main__":
    main()
