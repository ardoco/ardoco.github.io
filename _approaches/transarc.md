---
title: TransArC
description: TransArC – TLR between Software Architecture Documentation, Models, and Code.
permalink: /approaches/transarc/
importance: 3
layout: approach
---

![TransArC Overview](/assets/img/approaches/icse24-transarc.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

TransArC is a transitive trace link recovery approach that connects architecture documents to code via an intermediate architecture model.
It first uses an existing method (SWATTR) to connect the textual architecture documentation and component-based architecture model (SAM), then applies a new method (ArCoTL) to link the model elements to code.
In other words, TransArC builds a bridge: document ⟶ model ⟶ code.
This two-step strategy helps bridge the semantic gap between informal text and code.

- How it works: TransArC extracts combines the two link sets of trace links, namely SWATTR and ArCoTL, to produce trace links transitively from documentation to code.
- Results: In experiments on five systems, TransArC achieved a high average F1 score (~0.82) for recovering documentation-to-code links, significantly outperforming baseline methods. This shows that combining the two specialized steps yields much more accurate links than simpler approaches.
