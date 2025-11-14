---
layout: publication
permalink: /c/aire25
title: "Beyond Retrieval: A Study of Using LLM Ensembles for Candidate Filtering in Requirements Traceability"
description:
publication: fuchss_beyond_2025
authors:
  - dominik_fuchss
  - stefan_schwedt
  - jan_keim
  - tobias_hey
approaches:
  - LiSSA
links:
  - name: Paper (KITopen)
    url: https://publikationen.bibliothek.kit.edu/1000183058
  - name: Paper (IEEE Xplore)
    url: https://ieeexplore.ieee.org/document/11190238
  - name: Replication Package (Zenodo)
    url: https://doi.org/10.5281/zenodo.15837231
  - name: Replication Package (GitHub)
    url: https://github.com/ardoco/Replication-Package-AIRE25_Beyond-Retrieval-Using-LLM-Ensembles-for-Candidate-Filtering-in-Req-TLR
  - name: Slides (PPTX)
    url: /assets/pdf/presentation_aire25.pptx
  - name: Slides (PDF)
    url: /assets/pdf/presentation_aire25.pdf
---

Published at the [33rd International Requirements Engineering Conference Workshops (REW)](https://aire-ws.github.io/aire25/).

![AIRE25 Overview](/assets/img/approaches/aire25-aire.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

## Abstract

**[Introduction]**
Requirements traceability is essential in software development, supporting tasks such as system understanding and change impact analysis.
Traceability link recovery (TLR) methods, including those using large language models (LLMs) or retrieval-augmented generation (RAG), often rely on information retrieval (IR) to identify candidate artifact pairs.
They are sensitive to hyperparameters (e.g., top-k, similarity thresholds) that require extensive, project-specific tuning.

**[Methods]**
We propose an inter-requirements TLR approach that uses an ensemble of small LLMs (or small language models (SLM)) to incrementally reduce the search space, aiming to replace IR-based candidate selection.
We first analyze the sensitivity of IR methods to hyperparameters, then evaluate the ability of small LLMs to filter unrelated requirement pairs, and compare their performance when integrated into a TLR approach.
The evaluation includes five projects from the requirements engineering community.

**[Results]**
We find that IR performance heavily depends on project-specific hyperparameter tuning.
Furthermore, small LLMs effectively reduce the candidate space with minimal loss of recall.
While our LLM-based ensemble approach achieves comparable F2-scores to IR methods, it lags in precision.

**[Conclusion]**
This work provides insights into the capabilities of small LLMs as a filter in inter-requirements TLR.
Moreover, it provides insights into the performance of traditional IR techniques for TLR and their dependency on hyperparameters.
