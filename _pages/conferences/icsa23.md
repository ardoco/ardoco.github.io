---
layout: page
permalink: /c/icsa23
title: Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery
description:
---

by [Jan Keim](https://orcid.org/0000-0002-8899-7081), [Sophie Corallo](https://orcid.org/0000-0002-1531-2977), [Dominik Fuchß](https://orcid.org/0000-0001-6410-6769), and [Anne Koziolek](https://orcid.org/0000-0002-1593-3394)

Published at the [20th IEEE International Conference on Software Architecture (ICSA 2023), March 13-17 2023](https://icsa-conferences.org/2023/).

Additional presentation at the [Software Engineering 2024 (SE24)](https://se2024.se.jku.at/), the symposium of the German Computer Science Societiy (Gesellschaft für Informatik (GI)) together with the Austrian Computer Society.

![Approach Overview](/assets/img/approach_overview_icsa23.svg){:width="100%"}

## Abstract

Documenting software architecture is important for a system’s success. Software architecture documentation (SAD) makes information about the system available and eases comprehensibility. There are different forms of SADs like natural language texts and formal models with different benefits and different purposes. However, there can be inconsistent information in different SADs for the same system. Inconsistent documentation then can cause flaws in development and maintenance. To tackle this, we present an approach for inconsistency detection in natural language SAD and formal architecture models. We make use of traceability link recovery (TLR) and extend an existing approach. We utilize the results from TLR to detect unmentioned (i.e., model elements without natural language documentation) and missing model elements (i.e., described but not modeled elements). In our evaluation, we measure how the adaptations on TLR affected its performance. Moreover, we evaluate the inconsistency detection. We use a benchmark with multiple open source projects and compare the results with existing and baseline approaches. For TLR, we achieve an excellent F1-score of 0.81, significantly outperforming the other approaches by at least 0.24. Our approach also achieves excellent results (accuracy: 0.93) for detecting unmentioned model elements and good results for detecting missing model elements (accuracy: 0.75). These results also significantly outperform competing baselines. Although we see room for improvements, the results show that detecting inconsistencies using TLR is promising.

## Links

- Paper on [IEEE Xplore](https://doi.org/10.1109/ICSA56044.2023.00021) and on [KITopen](https://doi.org/10.5445/IR/1000158208)
- Replication Package on [Zenodo](https://doi.org/10.5281/zenodo.7555194) and the corresponding [GitHub repository](https://github.com/ArDoCo/DetectingInconsistenciesInSoftwareArchitectureDocumentationUsingTraceabilityLinkRecovery)
- [Slides (ICSA23)](/assets/pdf/presentation_23_ICSA_InconsistencyDetection.pdf)
- [Slides (SE24)](/assets/pdf/presentation_24_SE_InconsistencyDetection.pdf)

## Cite this paper

```bibtex
@inproceedings{keim_detecting_2023,
  abbr              = {ICSA},
  author            = {Keim, Jan and Corallo, Sophie and Fuchß, Dominik and Koziolek, Anne},
  booktitle         = {2023 IEEE 20th International Conference on Software Architecture (ICSA)},
  title             = {Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery},
  year              = {2023},
  volume            = {},
  number            = {},
  pages             = {141-152},
  doi               = {10.1109/ICSA56044.2023.00021}
}
```
