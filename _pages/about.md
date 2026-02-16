---
layout: about
title: about
permalink: /
subtitle:
no_title: true
---

![ARDoCo Logo](/assets/img/logo.png){:height="210" style="display: block; margin: 0 auto;"}

# [ARDoCo - Automating Requirements and Documentation Comprehension](https://github.com/ardoco)

<!-- NEVER CHANGE THIS LINE B. It is used as delimiter for the page at mcse.kastel.kit.edu -->

ARDoCo (Automating Requirements and Documentation Comprehension) is a research project focused on traceability link recovery and consistency analysis between software artifacts. The project connects architecture documentation and models while identifying missing or deviating elements (inconsistencies). An element can be any representable item of the model, like a component or a relation.

Our recent approaches, such as [LiSSA](/approaches/lissa/), leverage Large Language Models (LLMs) and Information Retrieval (IR) to enable more generic and effective traceability link recovery across various artifact types, including requirements-to-code, documentation-to-code, and architecture-to-code tracing. We also leverage LLMs for specialized tasks, such as [ExArch](/approaches/exarch/) which uses LLM-based architecture component name extraction to identify and link architectural elements. You can find our different approaches, including [LiSSA](/approaches/lissa/), [ExArch](/approaches/exarch/), and others, on the [approaches](/approaches/) page or read more about them using the info button on the [publications](/publications/) page.

Documenting the architecture of a software system is important, especially to capture reasoning and design decisions. However, documentation is often incomplete, outdated, or missing, leading to loss of crucial knowledge and increased risks. Our long-term vision is to persist information from various sources, such as whiteboard discussions, to avoid losing essential system knowledge. A key challenge is ensuring consistency between formal artifacts (e.g., models) and informal documentation. We address this by applying natural language understanding and knowledge bases to analyze consistency and create traceability links between models and textual artifacts.

<!-- NEVER CHANGE THIS LINE E. It is used as delimiter for the page at mcse.kastel.kit.edu -->

ARDoCo is actively developed by researchers of the _[Modelling for Continuous Software Engineering (MCSE) group](https://mcse.kastel.kit.edu)_ of _[KASTEL - Institute of Information Security and Dependability](https://kastel.kit.edu)_ at the [KIT](https://www.kit.edu).

## Important Links

- [Open student theses](https://mcse.kastel.kit.edu/projects_ardoco.php?tab=%5B661%5D#tabpanel-661)
- [People](/people/) who are involved in the project
- Central code repository [ardoco/ardoco](https://github.com/ardoco/ardoco)

## Relevant and Recent Publications

{% include featured_publications.liquid %}
