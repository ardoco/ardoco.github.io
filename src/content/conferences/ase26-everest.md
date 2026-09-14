---
title: The EVerest Dataset for Secure Software Engineering
publication: corallo_everest_2026
authors:
  - sophie_corallo
  - debora_grupp
  - dominik_fuchss
  - jan_keim
  - frederik_reiche
  - tobias_hey
  - anne_koziolek
year: 2026
featured: true
inPress: true
navLabel: EVerest Dataset @ASE 2026
navOrder: 2
pubShortName: ASE 2026
conferenceName: 41st IEEE/ACM International Conference on Automated Software Engineering (ASE 2026) — Tools and Datasets Track
conferenceUrl: https://conf.researchr.org/home/ase-2026
links:
  paper:
    arxiv: https://arxiv.org/abs/2605.07814
  replication:
    zenodo: https://doi.org/10.5281/zenodo.21157836
---

## Abstract

**Context and Problem.**
End-to-end security verification, from requirements through architecture to code, requires datasets that span all three artifact types with fine-grained security labels.
No existing dataset provides this combination.
**Method and Aim.**
We present the EVerest dataset, a multi-artifact resource based on EVerest, an industry-driven open-source software stack for electric vehicle charging stations.
The dataset includes 84 manually elicited security requirements annotated with security objectives, 1,445 fine-grained security elements (components, entities, data, data flows, states, etc.), acceptance windows, coreferences, and architectural trace links, as well as the EVerest software architecture model, source code, and natural language documentation.
**Results and Conclusion.**
It enables research on security requirements classification, named entity recognition, architectural trace linking, and design-time or code-level security verification.
During dataset creation, a real security weakness (CWE-1295) was identified, disclosed to the project maintainers, and subsequently fixed.
The dataset is publicly available under the Apache License 2.0.
**Video.**
We provide a screencast of the EVerest dataset [here](#screencast).

## The Dataset

The EVerest dataset spans all artifacts needed for end-to-end security verification, derived from [EVerest](https://lfenergy.org/projects/everest/), an industry-driven open-source software stack for electric vehicle charging stations hosted by LF Energy:

<ul class="tool-landscape">
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #2a9d8f" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h2M3 12h2M3 18h2M9 6h12M9 12h12M9 18h12"/></svg>
    <strong>Security Requirements</strong> — 84 requirements, elicited from the EVerest community via questionnaire and refined to the architectural level in developer interviews. They are annotated with security objectives (confidentiality, integrity, availability, and authentication) and 1,445 fine-grained security elements — components, entities, data, states, nodes, connections, data flows, activities, and control flows — including acceptance windows, references, and coreferences.
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #23a1e0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="7" height="5" rx="1"/><rect x="15" y="15" width="7" height="5" rx="1"/><path d="M9 6.5h4a2 2 0 0 1 2 2v9"/></svg>
    <strong>Software Architecture Model</strong> — a Palladio component model of the EVerest core with 29 components, 34 interfaces, and 144 service effect specifications, plus an assembly model, a deployment scenario, and a usage model covering 14 scenarios. Requirement-to-architecture trace links connect the annotated security elements to model element IDs.
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #007acc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
    <strong>Source Code</strong> — the EVerest source code snapshot the model was derived from (commit <code>177a8e6</code>, 3rd June 2024): roughly 50 kloc across more than 500 files in C++, C, JavaScript, Python, and Rust.
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #e9a13b" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/></svg>
    <strong>Natural Language Documentation</strong> — the user-facing EVerest project documentation, including the architecture excerpts used to broaden the dataset's applicability, together with the labeling guidelines, element definitions, and examples.
  </li>
  <li>
    <svg class="ti" width="20" height="20" style="--ti: #c1121f" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
    <strong>A Real Security Weakness</strong> — during dataset creation, a concrete security weakness was identified in EVerest using <a href="https://doi.org/10.1145/3832783.3834604">xDECAF</a>. Requirement 5 stipulates that "[…] tokens used for authentication should not be stored in plain text in log files or persistent storage […]", which the source code of the dataset snapshot violates (line 13 of <code>auth_token_providerImpl.cpp</code> in the <code>PN532TokenProvider</code> module). The weakness (CWE-1295) was disclosed to PIONIX GmbH and remedied shortly thereafter, confirming the dataset's real-world relevance.
  </li>
</ul>

Together, these artifacts support research on security requirements classification, named entity recognition, architectural trace linking, and design-time as well as code-level security verification within a single resource.

## Screencast

<div class="video">
  <iframe
    src="https://www.youtube.com/embed/pnn1uqpomvQ"
    title="The EVerest Dataset for Secure Software Engineering Screencast"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
