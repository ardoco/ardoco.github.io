---
# Words shared by a publication entry (/publications/, via PubEntry) and a
# conference page (/c/<slug>). The home page does not load this file.
labels:
  # the chips on an entry; `details` is followed by an arrow
  details: 'Details'
  doi: 'DOI'
  # the entry's `url`, shown when it has no DOI
  link: 'Link'
  bibtex: 'BibTeX'
  # before the `conferenceName` on a conference page
  publishedAt: 'Published at'
  toBePublishedAt: 'To be published at'
  alsoPresented: 'Also presented at'
  # above the chips of the approaches a conference page names
  related: 'This publication is related to:'
# A conference page's link keys → their names. A key with no row renders as
# typed; a slides key `<venue>_<pdf|pptx>` is derived — see slideLabel() in
# src/lib/conferences.ts.
linkLabels:
  arxiv: 'arXiv'
  ieee: 'IEEE Xplore'
  acm: 'ACM DL'
  springer: 'Springer'
  kitopen: 'KITopen'
  zenodo: 'Zenodo'
  repo: 'GitHub'
  pptx: 'PPTX'
  pdf: 'PDF'
---
