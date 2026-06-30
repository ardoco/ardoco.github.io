---
layout: publication
permalink: /c/ase26
title: "The ARDoCo Tool Landscape: REST API, TraceView, and TraceViz for Architecture Traceability"
description:
publication: keim_ardoco_2026
featured: true
year: 2026
pub_short_name: "ASE 2026"
authors:
  - jan_keim
  - dominik_fuchss
  - sophie_corallo
  - tobias_hey
  - julian_winter
  - kevin_feichtinger
conference_name: "41st IEEE/ACM International Conference on Automated Software Engineering (ASE 2026) — Tools and Datasets Track"
conference_url: https://conf.researchr.org/home/ase-2026
in_press: true
links:
  paper:
    arxiv: https://arxiv.org/abs/2606.28064
---

## Abstract

**Context and Problem.**
Software development produces interrelated artifacts like software architecture documentation (SAD), software architecture models (SAMs), and source code, whose relationships are essential for maintenance and consistency checking.
However, automatically recovering links between these artifacts (traceability link recovery (TLR)) remains difficult to deploy in practice.
**Method and Aim.**
We present an accessible tool landscape for ARDoCo's TLR approaches: the ARDoCo REST API exposes four TLR pipelines (SAD-SAM, SAM-Code, SAD-Code, and SAD-SAM-Code) via HTTP endpoints with asynchronous execution and caching; TraceView is a browser-based frontend with a guided wizard and interactive multi-panel exploration of recovered links and inconsistencies; and TraceViz, which is a VS Code extension that overlays trace links directly onto documentation in the IDE.
**Results and Conclusion.**
All three components are publicly deployed and usable.
A preliminary study for TraceViz's in-IDE visualization confirmed that it improves developer comprehension during software understanding tasks.
The tool landscape makes state-of-the-art TLR accessible to architects, developers, and tool integrators.
**Video.**
We provide a screencast of our ARDoCo Tool Landscape and how it is used [here](#screencast).

## The Tool Landscape

The ARDoCo tool landscape makes state-of-the-art traceability link recovery (TLR) accessible through three publicly deployed, openly available components:

<ul class="tool-landscape" style="list-style: none; padding-left: 0;">
  <li style="margin-bottom: 1.1rem;">
    <i class="fa-solid fa-server fa-fw" style="color: #2a9d8f;"></i>
    <strong>ARDoCo REST API</strong> — exposes four TLR pipelines (SAD-SAM, SAM-Code, SAD-Code, and SAD-SAM-Code) via HTTP endpoints with asynchronous execution and caching.<br>
    <span style="display: inline-block; margin-left: 1.9em;">
      <i class="fa-solid fa-arrow-up-right-from-square fa-fw"></i> <a href="https://rest.ardoco.de">Service</a>
      &nbsp;&middot;&nbsp;
      <i class="fa-brands fa-github fa-fw"></i> <a href="https://github.com/ardoco/rest">GitHub</a>
    </span>
  </li>
  <li style="margin-bottom: 1.1rem;">
    <i class="fa-solid fa-window-maximize fa-fw" style="color: #23a1e0;"></i>
    <strong>TraceView</strong> — a browser-based frontend with a guided wizard and interactive multi-panel exploration of recovered trace links and inconsistencies.<br>
    <span style="display: inline-block; margin-left: 1.9em;">
      <i class="fa-solid fa-arrow-up-right-from-square fa-fw"></i> <a href="https://tv.ardoco.de">Service</a>
      &nbsp;&middot;&nbsp;
      <i class="fa-brands fa-github fa-fw"></i> <a href="https://github.com/ardoco/traceview-v2">GitHub</a>
    </span>
  </li>
  <li style="margin-bottom: 1.1rem;">
    <i class="fa-solid fa-code fa-fw" style="color: #007acc;"></i>
    <strong>TraceViz</strong> — a VS Code extension that overlays trace links directly onto documentation inside the IDE. A preliminary study confirmed that this in-IDE visualization improves developer comprehension during software understanding tasks.<br>
    <span style="display: inline-block; margin-left: 1.9em;">
      <i class="fa-brands fa-github fa-fw"></i> <a href="https://github.com/ardoco/traceviz">GitHub</a>
    </span>
  </li>
</ul>

## Screencast

<div class="rounded z-depth-1" style="position: relative; width: 100%; padding-top: 56.25%; margin-top: 1rem; overflow: hidden; border-radius: 8px;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    src="https://www.youtube.com/embed/IOTEPZQ3tVs"
    title="The ARDoCo Tool Landscape Screencast"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>
