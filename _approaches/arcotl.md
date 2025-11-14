---
title: ArCoTL
description: ArCoTL – TLR between Software Architecture Models and Code.
permalink: /approaches/arcotl/
importance: 2
layout: approach
repositories:
  - name: Implementation
    url: https://github.com/ardoco/tlr
  - name: Replication Package (ICSE 2024)
    url: https://github.com/ardoco/Replication-Package-ICSE24_Recovering-Trace-Links-Between-Software-Documentation-And-Code
---

![ArCoTL Overview](/assets/img/approaches/icse24-transarc.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

ArCoTL (Architecture–Code Trace Links) focuses on linking a given architecture model (SAM) to the source code.
It assumes you have a formal model of the system's components and interfaces, and wants to find the corresponding code.
ArCoTL transforms both the architecture model and the code into intermediate representations (e.g. simplified graphs) and then applies various heuristics to match elements.
These heuristics include standalone rules and dependent rules (which consider relationships) plus filters to refine the links.

- How it works: Starting from a SAM and the codebase, ArCoTL builds simplified model and code representations. It then uses text similarity, naming conventions, and dependency heuristics to propose links between each model component and code artifact.
- Effectiveness: ArCoTL turned out to be very effective on its own. In experiments, the model-to-code step (ArCoTL) achieved an average F1 of ~0.98.
