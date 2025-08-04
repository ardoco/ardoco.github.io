---
title: LiSSA
description: LiSSA – LLM/RAG-based TLR.
permalink: /approaches/lissa/
importance: 6
layout: approach
---

![LiSSA Overview](/assets/img/approaches/icse25-lissa.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

LiSSA (Linking Software System Artifacts) is a retrieval-augmented, LLM-based approach that aims to be generic across artifact types.
The key idea is to use a Large Language Model (LLM) together with information retrieval (IR) to find trace links.
For a given source artifact (e.g. a requirement or a sentence in documentation), LiSSA first uses IR techniques to retrieve a small set of potentially relevant target artifacts (code files, model elements, etc.).
It then queries the LLM with the retrieved context to generate or suggest the most likely trace link.

- Scope: LiSSA was tested on multiple tasks including requirements→code, documentation→code, and architecture-docs→models. The same RAG process is applied in each case, making it a one-size-fits-many solution.
- Effectiveness: In experiments, LiSSA significantly outperformed state-of-the-art tools on the code-centric tasks. For example, it showed much higher accuracy when linking requirements to code than prior methods.

LiSSA is primarily associated with our [ICSE 2025 publication page](/c/icse25), but is also related to our [REFSQ 2025 publication page](/c/refsq25). See these pages for details, links, and resources.
