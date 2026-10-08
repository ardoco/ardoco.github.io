---
# The home page. Its heading and the line under it are `title` and `tagline` in
# site/site.md; it sets no title or description of its own. The body is the
# introduction, which an external page at mcse.kastel.kit.edu scrapes: it sits
# between the two NEVER CHANGE comments in src/pages/index.astro. The other
# rich blocks are home/affiliation.md, home/poster.md and home/links.md.
#
# The hero's buttons.
labels:
  approaches: 'Explore approaches'
  publications: 'Publications'
  github: 'GitHub'
  # under the approach map, linking the full /approaches/ page
  allApproaches: 'All approaches, tools and datasets'
  # before the mailing list, the last row under "Important links"
  contact: 'Contact us at'
# Under a section's heading, and after its list.
intros:
  publications: 'Each link leads to a page with details about the corresponding publication.'
plurals:
  # after a featured paper with talks elsewhere; the venues follow
  presentations:
    { one: 'with additional presentation at', other: 'with additional presentations at' }
---

ARDoCo (Automating Requirements and Documentation Comprehension) is a research project focused on traceability link recovery and consistency analysis between software artifacts. The project connects architecture documentation and models while identifying missing or deviating elements (inconsistencies). An element can be any representable item of the model, like a component or a relation.

Our recent approaches, such as [LiSSA](/approaches/lissa/), leverage Large Language Models (LLMs) and Information Retrieval (IR) to enable more generic and effective traceability link recovery across various artifact types, including requirements-to-code, documentation-to-code, and architecture-to-code tracing. We also leverage LLMs for specialized tasks, such as [ExArch](/approaches/exarch/) which uses LLM-based architecture component name extraction to identify and link architectural elements. You can find our different approaches, including [LiSSA](/approaches/lissa/), [ExArch](/approaches/exarch/), and others, on the [approaches](/approaches/) page or read more about them using the details link on the [publications](/publications/) page.

Documenting the architecture of a software system is important, especially to capture reasoning and design decisions. However, documentation is often incomplete, outdated, or missing, leading to loss of crucial knowledge and increased risks. Our long-term vision is to persist information from various sources, such as whiteboard discussions, to avoid losing essential system knowledge. A key challenge is ensuring consistency between formal artifacts (e.g., models) and informal documentation. We address this by applying natural language understanding and knowledge bases to analyze consistency and create traceability links between models and textual artifacts.
