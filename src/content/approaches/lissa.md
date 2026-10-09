---
title: LiSSA
description: LiSSA – LLM/RAG-based TLR.
importance: 7
group: tlr
artifacts:
  - ['Requirements', 'Code']
  - ['Requirements', 'Requirements']
  - ['SAD', 'Code']
  - ['SAD', 'SAM']
figure:
  src: /assets/img/approaches/icse25-lissa.svg
  alt: LiSSA Overview
  plate: true
gallery:
  - src: /assets/img/approaches/aire25-aire.svg
    alt: AIRE 2025 Overview
    caption: 'Beyond Retrieval: A Study of Using LLM Ensembles for Candidate Filtering in Requirements Traceability (AIRE 2025)'
    plate: true
repositories:
  - name: Implementation
    url: https://github.com/ardoco/lissa
  - name: Replication Package (ICSE 2025)
    url: https://github.com/ardoco/Replication-Package-ICSE25_LiSSA-Toward-Generic-Traceability-Link-Recovery-through-RAG
  - name: Replication Package (REFSQ 2025)
    url: https://github.com/ardoco/Replication-Package-REFSQ25_Requirements-TLR-via-RAG
  - name: Replication Package (AIRE 2025)
    url: https://github.com/ardoco/Replication-Package-AIRE25_Beyond-Retrieval-Using-LLM-Ensembles-for-Candidate-Filtering-in-Req-TLR
---

LiSSA (Linking Software System Artifacts) is a retrieval-augmented, LLM-based approach that aims to be generic across artifact types.
The key idea is to use a Large Language Model (LLM) together with information retrieval (IR) to find trace links.
For a given source artifact (e.g. a requirement or a sentence in documentation), LiSSA first uses IR techniques to retrieve a small set of potentially relevant target artifacts (code files, model elements, etc.).
It then queries the LLM with the retrieved context to generate or suggest the most likely trace link.

- Scope: LiSSA was tested on multiple tasks including requirements→code, documentation→code, and architecture-docs→models. The same RAG process is applied in each case.
- Effectiveness: LiSSA is most effective on requirements-related tasks. For requirements→code it significantly outperformed the state-of-the-art approaches. For documentation→code it achieved better F1-scores than the state of the art on smaller projects, but underperformed on larger ones. For architecture documentation→models it did not outperform the state of the art. Further research is needed before RAG-based approaches are applicable in practice.
- REFSQ 2025: Building on that strength, LiSSA was applied to requirements-to-requirements TLR via RAG, evaluated on six benchmark datasets. Chain-of-thought prompting can be beneficial, and open-source models perform comparably to proprietary ones.
- AIRE 2025: An ensemble of small LLMs (chaining, majority voting) replaces IR for candidate filtering in requirements TLR. It reduces the candidate space with high recall, but lags in precision.
