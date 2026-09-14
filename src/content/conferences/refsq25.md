---
title: Requirements Traceability Link Recovery via Retrieval-Augmented Generation
publication: hey_requirements_2025
authors:
  - tobias_hey
  - dominik_fuchss
  - jan_keim
  - anne_koziolek
approaches:
  - lissa
year: 2025
featured: true
navLabel: REFSQ 2025
navOrder: 6
pubShortName: REFSQ 2025
conferenceName: '31st International Working Conference on Requirements Engineering: Foundation for Software Quality (REFSQ 2025)'
conferenceUrl: https://2025.refsq.org/
figure:
  src: /assets/img/approaches/refsq25-refsq.svg
  alt: REFSQ25 Overview
  plate: true
links:
  paper:
    kitopen: https://publikationen.bibliothek.kit.edu/1000179817
    springer: https://doi.org/10.1007/978-3-031-88531-0_27
  replication:
    zenodo: https://doi.org/10.5281/zenodo.14779457
    repo: https://github.com/ardoco/ReplicationPackage-REFSQ25_Requirements-TLR-via-RAG
---

## Abstract

**[Context and Motivation]**
In software development, various interrelated artifacts are created.
Access to information on the relation between these artifacts eases understanding of the system and enables tasks such as change impact and software reusability analyses.
Manual trace link creation is labor-intensive and costly, and thus is often missing in projects.
Automation could enhance the development and maintenance efficiency.

**[Question/Problem]**
Current methods for automatically recovering traceability links between different types of requirements do not achieve the necessary performance to be applied in practice, or require pre-existing links for machine learning.

**[Principal Ideas and Results]**
We propose to address this limitation by leveraging large language models (LLMs) with retrieval-augmented generation (RAG) for inter-requirements traceability link recovery.
In an empirical evaluation on six benchmark datasets, we show that chain-of-thought prompting can be beneficial, open-source models perform comparably to proprietary ones, and that the approach can outperform state-of-the-art and baseline approaches.

**[Contribution]** This work presents an approach for inter-requirements traceability link recovery using RAG and provides the first empirical evidence of its performance.
