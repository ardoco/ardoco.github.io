---
layout: publication
permalink: /c/icsa26
title: "Architecture in the Cradle: Early Warning of Architectural Decay with ArchGuard"
description:
publication: liu_architecture_2026
featured: true
year: 2026
pub_short_name: "ICSA 2026"
authors:
  - haoyu_liu
  - dominik_fuchss
  - sophie_corallo
  - maximilian_hummel
  - jan_keim
  - tobias_hey
conference_name: "23rd IEEE International Conference on Software Architecture (ICSA 2026)"
conference_url: https://conf.researchr.org/home/icsa-2026/
in_press: true
links:
  paper:
    kitopen: https://publikationen.bibliothek.kit.edu/1000191263
  replication:
    zenodo: https://doi.org/10.5281/zenodo.18891082
    repo: https://github.com/ardoco/Replication-Package-ICSA26_Architecture-in-the-Cradle
---

![ArchGuard Overview](/assets/img/approaches/icsa26-archguard.svg){:width="75%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

## Abstract

Architectural decay can manifest as the evolution of architectural smells, degrading integrity, and increasing maintenance costs.
Existing techniques capture smells post hoc or predict on component level, acting too late or on too coarse a granularity.
We investigate if the risk of introducing architectural smells can already be predicted when issues are opened.
Thus, we propose an issue-level prediction approach that utilizes the semantic representations of Large Language Models (LLMs).

To enable training and evaluation, we construct a dataset from three GitLab-hosted projects by linking issues to smells via smell-inducing changes.
On this dataset, we train classifiers to identify high-risk issues and conduct an empirical study comparing seven different representations and nine classifiers.

Our best-performing classifier (SVM with OpenAI embeddings) achieves F1-scores of up to 0.506, with a recall of about 0.74.
This means that our approach can identify approximately 74% of smell-inducing issues before implementation begins.
When design alternatives are still being considered. Our approach provides early warnings of potential architectural risks.
This work shifts from reactive remediation to proactive quality assurance, raising awareness of potential architectural risks.
