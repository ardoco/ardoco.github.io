---
title: ARDoCo Tools
description: The ARDoCo tool landscape – the REST API, TraceView, and TraceViz make ARDoCo's TLR approaches accessible.
importance: 9
group: tools
figure:
  src: /assets/img/approaches/ase26-landscape.svg
  alt: ARDoCo tool landscape
  plate: true
  thumb: /assets/img/approaches/ase26-traceview.png
gallery:
  - src: /assets/img/approaches/ase26-traceview.png
    alt: TraceView screenshot
    caption: TraceView in the browser
    plate: false
  - src: /assets/img/approaches/ase26-traceviz.png
    alt: TraceViz screenshot
    caption: TraceViz in VS Code
    plate: false
repositories:
  - name: REST API
    url: https://github.com/ardoco/REST
  - name: TraceView
    url: https://github.com/ardoco/traceview-v2
  - name: TraceViz
    url: https://github.com/ardoco/traceviz
  - name: TraceView v1 (Legacy)
    url: https://github.com/ardoco/traceview-v1
  - name: Replication Package (ASE 2026)
    url: https://github.com/ardoco/Replication-Package-ASE26_Ardoco-Tool-Landscape
---

The ARDoCo tool landscape makes the traceability link recovery approaches publicly usable.
The REST API exposes them over HTTP, and two frontends, TraceView in the browser and TraceViz in VS Code, show the recovered links.
It is described in our ASE 2026 tools paper.

- REST API: A Spring Boot service at [rest.ardoco.de](https://rest.ardoco.de) that runs SWATTR, ArDoCode, ArCoTL and TransArC via HTTP endpoints, with asynchronous execution and caching.
- TraceView: A browser-based frontend at [tv.ardoco.de](https://tv.ardoco.de) with a guided wizard for uploading artifacts and choosing a pipeline. It shows the links between SAD, SAM and code side by side, together with the TEAM and MEAT inconsistencies.
- TraceViz: A VS Code extension that marks SAD lines with gutter markers and lets you jump from a sentence to the linked code files and back. It gets its SAD-to-code links from the REST API or LiSSA, or imports them from a CSV file.
