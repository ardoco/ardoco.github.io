---
# /approaches/: the approach map, one section per group of approaches, then the
# datasets. Each approach's own words are its file in src/content/approaches/,
# each dataset's its entry in src/data/datasets.yml. The section headings stay
# in src/pages/approaches/index.astro.
title: 'approaches'
description: 'The approaches developed in ARDoCo: traceability link recovery and inconsistency detection between requirements, architecture documentation, models and code, the tools built on them, and the datasets they are evaluated on.'
lede: 'Each approach connects a different pair of artifacts — requirements, architecture documentation, architecture models, source code — and many of them compose. The map shows which approach links what; below, they are grouped by what they are for.'
# Under each section's heading, keyed by section.
intros:
  map: 'The four kinds of artifact ARDoCo connects, and the approaches that connect them. Each label leads to its approach.'
  tlr: 'Recovering trace links: which sentence, model element or requirement corresponds to which part of the system.'
  consistency: 'Using trace links to find where documentation and models disagree.'
  tools: 'Tools that put trace links in front of developers.'
  datasets: 'The benchmarks the approaches are evaluated on, published for anyone to reuse.'
labels:
  # the link on each card, before its arrow
  more: 'Learn more'
  # a dataset's two links: to the data, and to the paper that introduces it
  dataset: 'Dataset'
  paper: 'Paper'
  # The map's four nodes: the short name, as in the `artifacts` tags on the
  # cards, and the line under it.
  nodeRequirements: 'Requirements'
  nodeRequirementsSub: 'in natural language'
  nodeSad: 'SAD'
  nodeSadSub: 'architecture documentation'
  nodeSam: 'SAM'
  nodeSamSub: 'architecture model'
  nodeCode: 'Code'
  nodeCodeSub: 'source code'
---
