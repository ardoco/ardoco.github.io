---
title: ArCoTL
description: ArCoTL – TLR between Software Architecture Models and Code.
importance: 2
group: tlr
artifacts: [['SAM', 'Code']]
figure:
  src: /assets/img/approaches/icse24-arcotl.svg
  alt: ArCoTL heuristic computation graph
  plate: true
repositories:
  - name: Implementation
    url: https://github.com/ardoco/ardoco
  - name: Replication Package (ICSE 2024)
    url: https://github.com/ardoco/Replication-Package-ICSE24_Recovering-Trace-Links-Between-Software-Documentation-And-Code
---

ArCoTL (Architecture–Code Trace Links) focuses on linking a given architecture model (SAM) to the source code.
It assumes you have a formal model of the system's components and interfaces, and wants to find the corresponding code.
ArCoTL transforms both the architecture model and the code into intermediate representations (e.g. simplified graphs) and then applies various heuristics to match elements.
These heuristics are organized as a computation graph: standalone heuristics, dependent heuristics (which build on the results of others), aggregators that combine their results, and filters that refine the links.

- How it works: Starting from a SAM and the codebase, ArCoTL builds simplified model and code representations. Standalone heuristics look at the component name, package, interface name, methods, and path. Dependent heuristics use inheritance, ambiguous packages, common words, component relations, and interface provision. Aggregators (best, max, first) combine these results, and filters refine them to propose links between each model component and code artifact.
- Effectiveness: ArCoTL turned out to be very effective on its own. In experiments, the model-to-code step (ArCoTL) achieved an average F1 of ~0.98.
