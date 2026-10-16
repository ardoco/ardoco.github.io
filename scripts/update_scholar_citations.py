#!/usr/bin/env python3
"""Refresh src/data/citations.yml from Google Scholar.

Usage:
    python3 -m pip install -r requirements.txt
    python3 scripts/update_scholar_citations.py             # fetch counts
    python3 scripts/update_scholar_citations.py --discover  # suggest missing ids

A paper is read on its first author's profile; when the first author has no
`scholar` id in src/data/authors.yml, on the first co-author's who has one.
`google_scholar_id` in papers.bib is the article id on *that* profile, and
citations.yml is keyed `USER:ARTICLE`.

Fetching reads each profile's publication list once. A profile that fails
keeps its previous counts, and `last_updated` only moves when all succeed.
--discover matches titles against the profile listing and prints suggested
`google_scholar_id` values; it never writes papers.bib.

Scholar rate-limits hard and has no API, so a run that cannot finish exits 0
and leaves the file alone.
"""

import argparse
import os
import signal
import sys
import time
from datetime import datetime

try:
    import yaml
    from scholarly import scholarly
except ImportError as exc:
    sys.exit(f"{exc.name} is not installed: python3 -m pip install -r requirements.txt")

from update_bib import normalize, parse_entries

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIB_FILE = os.path.join(ROOT, "src", "data", "papers.bib")
AUTHORS_FILE = os.path.join(ROOT, "src", "data", "authors.yml")
PEOPLE_FILE = os.path.join(ROOT, "src", "data", "people.yml")
OUTPUT_FILE = os.path.join(ROOT, "src", "data", "citations.yml")

# Below the workflow's own `timeout`, so the script, not SIGKILL, ends the run.
TIME_BUDGET_SECONDS = int(os.environ.get("SCHOLAR_TIME_BUDGET", "270"))
ATTEMPTS = 3


class ScholarUnavailable(Exception):
    """Out of time budget. Expected, not a failure."""


def load_yaml(path):
    with open(path, encoding="utf-8") as fh:
        return yaml.safe_load(fh) or {}


def scholar_users():
    """Normalised "first last" -> Scholar user id, incl. people.yml surname aliases."""
    authors = load_yaml(AUTHORS_FILE)
    users = {}
    for author in authors.values():
        if author.get("scholar"):
            users[normalize(author["name"])] = author["scholar"]
    for person in load_yaml(PEOPLE_FILE).values():
        author = authors.get(person["author"], {})
        if author.get("scholar"):
            first = author["name"].split()[0]
            for surname in person["surnames"]:
                users[normalize(f"{first} {surname}")] = author["scholar"]
    return users


def bib_names(field):
    names = []
    for name in field.split(" and "):
        last, _, first = name.partition(",")
        names.append(normalize(f"{first} {last}" if first else last))
    return names


def load_papers():
    """Bib entries as dicts: key, title, user (the profile they are read on), article."""
    users = scholar_users()
    with open(BIB_FILE, encoding="utf-8") as fh:
        entries = parse_entries(fh.read())
    papers = []
    for entry in entries:
        fields = entry.fields()
        # First author's profile, else the first co-author's who has one.
        user = next((users[n] for n in bib_names(fields.get("author", "")) if n in users), None)
        papers.append(
            {
                "key": entry.key,
                "title": fields.get("title", entry.key),
                "user": user,
                "article": fields.get("google_scholar_id") or None,
            }
        )
    return papers


def fetch_profile(user):
    """Article id -> {title, year, citations} for one profile; None if Scholar fails."""
    for attempt in range(ATTEMPTS):
        try:
            author = scholarly.fill(scholarly.search_author_id(user), sections=["publications"])
            listing = {}
            for pub in author.get("publications", []):
                pub_id = pub.get("author_pub_id") or pub.get("pub_id") or ""
                if ":" not in pub_id:
                    continue
                bib = pub.get("bib", {})
                listing[pub_id.split(":", 1)[1]] = {
                    "title": bib.get("title", ""),
                    "year": str(bib.get("pub_year", "")),
                    "citations": int(pub.get("num_citations", 0)),
                }
            print(f"{user}: {len(listing)} publications")
            return listing
        except ScholarUnavailable:
            raise
        except Exception as exc:
            wait = 15 * 2**attempt
            print(f"{user}: attempt {attempt + 1}/{ATTEMPTS} failed ({exc})")
            if attempt + 1 < ATTEMPTS:
                time.sleep(wait)
    return None


def same_title(bib_title, scholar_title):
    """Normalised equality, or a long enough prefix (a dropped subtitle)."""
    a, b = sorted([normalize(bib_title), normalize(scholar_title)], key=len)
    return a == b or (len(a) >= 20 and b.startswith(a))


def discover(papers):
    listings = {}
    claimed = set()
    for paper in papers:
        user = paper["user"]
        if not user:
            print(f"{paper['key']}: no author has a scholar id in authors.yml")
            continue
        if user not in listings:
            listings[user] = fetch_profile(user)
        listing = listings[user]
        if listing is None:
            print(f"{paper['key']}: could not read profile {user}")
            continue
        # Article ids are per profile, and the same id can be another paper elsewhere.
        current = listing.get(paper["article"])
        if current and same_title(paper["title"], current["title"]):
            if (user, paper["article"]) in claimed:
                print(f"{paper['key']}: same Scholar record as another entry; remove its id")
            claimed.add((user, paper["article"]))
            continue
        if current:
            print(f"{paper['key']}: {paper['article']} is \"{current['title']}\" on profile {user}")
        matches = [a for a, p in listing.items() if same_title(paper["title"], p["title"])]
        match = next((a for a in matches if (user, a) not in claimed), None)
        if not matches:
            print(f"{paper['key']}: no title match on profile {user}")
        elif match is None:
            # Scholar merged it with another entry, e.g. an SE abstract of a full paper.
            print(f"{paper['key']}: same Scholar record as another entry ({matches[0]}); left without an id")
        else:
            claimed.add((user, match))
            cites = listing[match]["citations"]
            print(f"{paper['key']}: google_scholar_id = {{{match}}}  # {user}, {cites} citations")


def fetch(papers):
    today = datetime.now().strftime("%Y-%m-%d")
    existing = load_yaml(OUTPUT_FILE) if os.path.exists(OUTPUT_FILE) else {}
    old_papers = existing.get("papers") or {}
    last_updated = (existing.get("metadata") or {}).get("last_updated")
    if last_updated == today:
        print("citations.yml is already up to date.")
        return

    wanted = {}
    for paper in papers:
        if paper["user"] and paper["article"]:
            wanted.setdefault(paper["user"], []).append(paper)

    new_papers = {}
    complete = True
    for user, user_papers in wanted.items():
        listing = fetch_profile(user)
        for paper in user_papers:
            key = f"{user}:{paper['article']}"
            if listing is None:
                if key in old_papers:
                    new_papers[key] = old_papers[key]
            elif same_title(paper["title"], listing.get(paper["article"], {}).get("title", "")):
                new_papers[key] = listing[paper["article"]]
            else:
                print(f"{paper['key']}: {paper['article']} is not this paper on {user}; run --discover")
        complete = complete and listing is not None

    if new_papers == old_papers:
        print("No changes in citation data.")
        return

    signal.alarm(0)  # no deadline may interrupt a half-written file
    data = {
        "metadata": {"last_updated": today if complete or not last_updated else last_updated},
        "papers": new_papers,
    }
    with open(OUTPUT_FILE, "w", encoding="utf-8") as fh:
        yaml.dump(data, fh, width=1000, sort_keys=True, allow_unicode=True)
    print(f"Wrote {len(new_papers)} papers to {os.path.relpath(OUTPUT_FILE, ROOT)}")
    if not complete:
        print("Some profiles failed; kept their previous counts and the old date.")


def _budget_exceeded(signum, frame):
    raise ScholarUnavailable()


def main():
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--discover", action="store_true", help="print suggested google_scholar_id values")
    ap.add_argument("keys", nargs="*", help="with --discover: only these BibTeX keys")
    args = ap.parse_args()

    # SIGALRM is our own deadline; SIGTERM is what `timeout` sends.
    signal.signal(signal.SIGALRM, _budget_exceeded)
    signal.signal(signal.SIGTERM, _budget_exceeded)
    signal.alarm(TIME_BUDGET_SECONDS)
    scholarly.set_timeout(15)
    scholarly.set_retries(1)

    papers = load_papers()
    if args.discover and args.keys:
        papers = [p for p in papers if p["key"] in args.keys]
    try:
        discover(papers) if args.discover else fetch(papers)
    except ScholarUnavailable:
        print(f"Scholar did not answer within {TIME_BUDGET_SECONDS}s; nothing written.")


if __name__ == "__main__":
    main()
