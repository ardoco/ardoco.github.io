---
title: ArDoCode
description: ArDoCode – TLR between Software Architecture Documentation and Code.
permalink: /approaches/ardocode/
importance: 5
layout: approach
---

![ArCoTL Overview](/assets/img/approaches/icse24-ardocode.svg){:width="100%" style="border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

ArDoCode is a simpler variant of trace recovery that treats source code itself as the "model".
Instead of first building a formal model, ArDoCode directly matches architecture document content with code elements using the same heuristics designed for linking docs to models.
In practice, it extracts key terms from the documentation and tries to align them with names in the code (e.g. class or module names) as if the code were the model.

- Key idea: Apply the SWATTR approach without an explicit SAM by interpreting the codebase as a model. For example, if the doc mentions a component "WebUI" and there is a WebUI package in code, ArDoCode will link them.
- Effectiveness: Because it skips the formal modeling step, ArDoCode is easier to apply but less precise. In evaluations, ArDoCode achieved a weighted F1 of only ~0.62, substantially lower than the full TransArC method. It serves mainly as a baseline and demonstrates that without structured models, the TLR performance drops.

See our [ICSE 2024 publication page](/c/icse24) for details, links, and resources.
