---
title: ArTEMiS
description: ArTEMiS – LLM-based Architecture Entity Recognition for TLR between Software Architecture Documentation and Models.
importance: 6
group: tlr
artifacts: [['SAD', 'SAM']]
figure:
  src: /assets/img/approaches/taas26-artemis.svg
  alt: ArTEMiS Overview
  plate: true
publications: [fuchss_whos_2026]
repositories:
  - name: Implementation
    url: https://github.com/ardoco/ardoco
  - name: Named Architecture Entity Recognition library
    url: https://github.com/ardoco/named-architecture-entity-recognition
  - name: Replication Package (TAAS)
    url: https://github.com/ardoco/Replication-Package-TAAS25_LLM-assisted-Software-Traceability-with-Architecture-Entity-Recognition
---

ArTEMiS (Architecture Traceability with Entity Matching via Semantic inference) links software architecture documentation (SAD) to software architecture models (SAM) using an LLM.
A specialized, LLM-based named entity recognition finds the architecture entities mentioned in the SAD, including coreferences and alternative names, and matches them to the elements of the SAM.
It replaces the text stages of [SWATTR](/approaches/swattr/) through the NER connection generator and is built on the Named Architecture Entity Recognition (NAER) library.
ArTEMiS was introduced in the TAAS journal extension of the [ExArch](/approaches/exarch/) paper, "Who's Who? LLM-assisted Software Traceability with Architecture Entity Recognition".

- How it works: A first prompt asks the LLM to name the architecturally relevant components in the SAD, with their alternative names and the lines that mention them. The names of the SAM elements are given as positive examples. A second prompt converts this output to JSON. The identified entities are then matched to the SAM elements by string similarity and embedding similarity.
- Hybrids: ArTEMiS can also stand in for SWATTR in larger pipelines that link the SAD to code. ArTEMiS in ExArch uses an LLM-generated SAM, and ArTEMiS in TransArC uses a manual SAM.
- Results: With GPT-5, ArTEMiS achieved an average F1 of 0.81 for SAD-SAM links, slightly above SWATTR (0.80), and a higher average recall (0.85 vs. 0.77). Integrated into TransArC, it raised the average F1 for SAD-code links from 0.80 to 0.85 and the average recall from 0.77 to 0.87. TransArC with ExArch (GPT-4o) and ArTEMiS (GPT-5) reached a weighted average F1 of 0.87, the best of the approaches that need no manual SAM (ArDoCode: 0.62).
