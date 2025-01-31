---
layout: page
permalink: /c/refsq25
title: "Requirements Traceability Link Recovery via Retrieval-Augmented Generation"
description:
publication: # hey_requirements_2025
---

by Tobias Hey <a href="https://orcid.org/0000-0003-0381-1020"><i class="fa-brands fa-orcid"></i></a>, Dominik Fuchß <a href="https://orcid.org/0000-0001-6410-6769"><i class="fa-brands fa-orcid"></i></a>, Jan Keim <a href="https://orcid.org/0000-0002-8899-7081"><i class="fa-brands fa-orcid"></i></a>, and Anne Koziolek <a href="https://orcid.org/0000-0002-1593-3394"><i class="fa-brands fa-orcid"></i></a>

To be published at the [31st International Working Conference on Requirements Engineering: Foundation for Software Quality](https://2025.refsq.org/).

![Approach Overview](/assets/img/refsq25-approach.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

## Abstract

**[Context and Motivation]**
In software development, various interrelated artifacts are created.
Access to information on the relation between these artifacts eases understanding of the system and enables tasks such as change impact and software reusability analyses.
Manual trace link creation is labor-intensive and costly, and thus is often missing in projects.
Automation could enhance the development and maintenance efficiency.

**[Question/Problem]**
Current methods for automatically recovering traceability links between different types of requirements do not achieve the necessary performance to be applied in practice, or require pre-existing links for machine learning.

**[Principal Ideas and Results]**
We propose to address this limitation by \method{leveraging large language models (LLMs) with retrieval-augmented generation (RAG) for inter-requirements traceability link recovery.}
In an empirical evaluation on six benchmark datasets, we show that chain-of-thought prompting can be beneficial, open-source models perform comparably to proprietary ones, and that the approach can outperform state-of-the-art and baseline approaches.

**[Contribution]** This work presents an approach for inter-requirements traceability link recovery using RAG and provides the first empirical evidence of its performance.

## Links

- Paper on [KITopen](https://publikationen.bibliothek.kit.edu/1000178589)
- Replication Package on [Zenodo](https://doi.org/10.5281/zenodo.14779457) and the corresponding [GitHub repository](https://github.com/ArDoCo/ReplicationPackage-REFSQ25_Requirements-TLR-via-RAG)
