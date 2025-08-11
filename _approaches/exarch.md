---
title: "ExArch"
description: "ExArch – LLM-based Architecture Component Name Extraction for TLR between Software Architecture Documentation and Code."
permalink: /approaches/exarch/
importance: 4
layout: approach
---

![ExArch Overview](/assets/img/approaches/icsa25-transarc.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

ExArch extends the TransArC idea by using an LLM to generate a simple architecture mode (SAM).
In this approach, instead of requiring a hand-made SAM, a large language model (such as GPT-4) is prompted to extract or invent the main component names from the SAD (and optionally from code).
These names serve as a minimal architecture model (i.e. a list of components).
Then, as in TransArC, these LLM-derived components are matched to code.
The goal is to bridge the SAD–code gap without manual modeling.

- How it works: Given the software architecture text and the codebase, the system asks the LLM to list likely component names. That list of names forms a "Simple Software Architecture Model" (SSAM). Finally, code elements with matching names or descriptions are linked to the documentation. This pipeline avoids needing an explicit UML model.
- Effectiveness: ExArch achieved very competitive results. Using GPT-4o, it obtained a weighted F1 of about 0.86, nearly as good as the original TransArC with a hand-made model (F1 0.87). It also substantially outperformed the ArDoCode baseline (which scored ~0.62). This shows that LLMs can automatically infer the key architectural components.
