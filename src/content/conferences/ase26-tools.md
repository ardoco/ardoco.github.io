---
title: 'The ARDoCo Tool Landscape: REST API, TraceView, and TraceViz for Architecture Traceability'
publication: keim_ardoco_2026
authors:
  - jan_keim
  - dominik_fuchss
  - sophie_corallo
  - tobias_hey
  - julian_winter
  - kevin_feichtinger
year: 2026
featured: true
inPress: true
navLabel: ArDoCo Tools @ASE 2026
navOrder: 1
pubShortName: ASE 2026
conferenceName: 41st IEEE/ACM International Conference on Automated Software Engineering (ASE 2026) — Tools and Datasets Track
conferenceUrl: https://conf.researchr.org/home/ase-2026
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

<ul class="tool-landscape">
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #2a9d8f" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01"/></svg>
    <strong>ARDoCo REST API</strong> — exposes four TLR pipelines (SAD-SAM, SAM-Code, SAD-Code, and SAD-SAM-Code) via HTTP endpoints with asynchronous execution and caching.<br>
    <span class="tool-links">
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> <a href="https://rest.ardoco.de">Service</a>
      &nbsp;&middot;&nbsp;
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg> <a href="https://github.com/ardoco/rest">GitHub</a>
    </span>
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #23a1e0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>
    <strong>TraceView</strong> — a browser-based frontend with a guided wizard and interactive multi-panel exploration of recovered trace links and inconsistencies.<br>
    <span class="tool-links">
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> <a href="https://tv.ardoco.de">Service</a>
      &nbsp;&middot;&nbsp;
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg> <a href="https://github.com/ardoco/traceview-v2">GitHub</a>
    </span>
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #007acc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
    <strong>TraceViz</strong> — a VS Code extension that overlays trace links directly onto documentation inside the IDE. A preliminary study confirmed that this in-IDE visualization improves developer comprehension during software understanding tasks.<br>
    <span class="tool-links">
      <svg class="ti" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg> <a href="https://github.com/ardoco/traceviz">GitHub</a>
    </span>
  </li>
</ul>

## Screencast

<div class="video">
  <iframe
    src="https://www.youtube.com/embed/IOTEPZQ3tVs"
    title="The ARDoCo Tool Landscape Screencast"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
