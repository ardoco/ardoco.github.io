---
title: Trace Link Recovery for Software Architecture Documentation
publication: keim_tracelink_2021
authors:
  - jan_keim
  - sophie_corallo
  - dominik_fuchss
  - claudius_kocher
  - janek_speit
  - anne_koziolek
approaches:
  - swattr
year: 2021
featured: true
navLabel: ECSA 2021
navOrder: 11
pubShortName: ECSA 2021
conferenceName: 15th European Conference on Software Architecture (ECSA 2021)
conferenceUrl: https://conf.researchr.org/home/ecsa-2021
figure:
  src: /assets/img/approaches/ecsa21-swattr.svg
  alt: SWATTR Overview
  plate: false
links:
  paper:
    springer: https://doi.org/10.1007/978-3-030-86044-8_7
    kitopen: https://doi.org/10.5445/IR/1000138399
  replication:
    zenodo: https://doi.org/10.5281/zenodo.4730621
    repo: https://github.com/ardoco/SWATTR
---

## Abstract

Software Architecture Documentation often consists of different artifacts.
On the one hand, there is informal textual documentation.
On the other hand, there are formal models of the system.
Finding related information in multiple artifacts with different level of formality is often not easy.
Therefore, trace links between these can help to understand the system.
In this paper, we propose an extendable, agent-based framework for creating trace links between textual software architecture documentation and models.
Our framework SWATTR offers different pipeline stages to extract text and model information, identify elements in text, and connect these elements to model elements.
In each stage, multiple agents can be used to capture necessary information to automatically create trace links.
We evaluate the performance of our approach with three case studies and compare our results to baseline approaches.
The results for our approach are good to excellent with a weighted average F1-Score of 0.72 over all case studies.
Moreover, our approach outperforms the baseline approaches on non-weighted average by at least 0.24 (weighted 0.31).
