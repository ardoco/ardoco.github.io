---
layout: publication
permalink: /c/icsa23
title: Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery
description:
publication: keim_detecting_2023
authors:
  - jan_keim
  - sophie_corallo
  - dominik_fuchss
  - anne_koziolek
approaches:
  - SWATTR
  - "Inconsistency Detection"
conference_name: "20th IEEE International Conference on Software Architecture (ICSA 2023)"
conference_url: https://icsa-conferences.org/2023/
published: true
links:
  paper:
    ieee: https://doi.org/10.1109/ICSA56044.2023.00021
    kitopen: https://doi.org/10.5445/IR/1000158208
  replication:
    zenodo: https://doi.org/10.5281/zenodo.7555194
    repo: https://github.com/ardoco/DetectingInconsistenciesInSoftwareArchitectureDocumentationUsingTraceabilityLinkRecovery
  slides:
    icsa23_pdf: /assets/pdf/presentation_23_ICSA_InconsistencyDetection.pdf
    se24_pdf: /assets/pdf/presentation_24_SE_InconsistencyDetection.pdf
additional_presentations:
  - name: Software Engineering 2024 (SE24)
    url: https://se2024.se.jku.at/
---

![Inconsistency Detection Overview](/assets/img/approaches/icsa23-inconsistency.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

## Abstract

Documenting software architecture is important for a system’s success. Software architecture documentation (SAD) makes information about the system available and eases comprehensibility. There are different forms of SADs like natural language texts and formal models with different benefits and different purposes. However, there can be inconsistent information in different SADs for the same system. Inconsistent documentation then can cause flaws in development and maintenance. To tackle this, we present an approach for inconsistency detection in natural language SAD and formal architecture models. We make use of traceability link recovery (TLR) and extend an existing approach. We utilize the results from TLR to detect unmentioned (i.e., model elements without natural language documentation) and missing model elements (i.e., described but not modeled elements). In our evaluation, we measure how the adaptations on TLR affected its performance. Moreover, we evaluate the inconsistency detection. We use a benchmark with multiple open source projects and compare the results with existing and baseline approaches. For TLR, we achieve an excellent F1-score of 0.81, significantly outperforming the other approaches by at least 0.24. Our approach also achieves excellent results (accuracy: 0.93) for detecting unmentioned model elements and good results for detecting missing model elements (accuracy: 0.75). These results also significantly outperform competing baselines. Although we see room for improvements, the results show that detecting inconsistencies using TLR is promising.
