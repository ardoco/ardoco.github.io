---
title: SWATTR
description: SWATTR – TLR between Software Architecture Documentation and Software Architecture Models.
permalink: /approaches/swattr/
importance: 1
layout: approach
repositories:
  - name: Implementation
    url: https://github.com/ardoco/tlr
  - name: Replication Package (ECSA 2021)
    url: https://github.com/ardoco/SWATTR
---

![SWATTR Overview](/assets/img/approaches/ecsa21-swattr.svg){:width="100%" style="border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

SWATTR (SoftWare Architecture Text Trace link Recovery) is an agent-based framework for linking textual architecture documentation (SAD) and formal models (SAM).
Rather than focusing on a single algorithm, SWATTR defines a pipeline with multiple stages where different "agents" can operate.
First it extracts and preprocesses text from the SAD and components from the architecture model.
Next, it uses NLP and heuristics to identify architecture elements (like component names) mentioned in the text.
Finally, it connects these identified text elements to model elements to form trace links.

- Pipeline stages: The framework is extendable, meaning you can plug in different strategies at each step. For example, one agent might use term matching to find components in sentences, while another uses more advanced similarity measures. All results are aggregated to produce the final links.
- Results: SWATTR was evaluated on three case studies and achieved a weighted average F1-score of about 0.72 for trace recovery. This was a strong performance (outperforming simple baselines by ~0.24 F1) and demonstrated the benefit of the multi-stage approach.
