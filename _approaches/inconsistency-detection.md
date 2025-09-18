---
title: Inconsistency Detection
description: Documentation-Model-Inconsistency-Analysis pipeline.
permalink: /approaches/inconsistency-detection/
importance: 8
layout: approach
---

![Approach Overview](/assets/img/approaches/icsa23-inconsistency.svg){:width="100%" style="background-color: white; border-radius: 8px; padding: 10px; display: block; margin: 0 auto;"}

The ArDoCo inconsistency detection approach uses trace link recovery to detect inconsistencies between natural-language architecture documentation and formal models.
It identifies two kinds of issues:

(a) Unmentioned Model Elements (UMEs): components or interfaces that appear in the model but are never described in the documentation;
(b) Missing Model Elements (MMEs): elements mentioned in the text that do not exist in the model.

The method runs a TLR procedure (namely SWATTR) and then flags any model element with no corresponding text link (a UME) or any sentence that refers to a non-modeled item (an MME).

- Detection strategy: Use the TLR results as a bridge. After linking as many sentences to model elements as possible, any "orphan" model nodes or text mentions indicate a consistency gap. For example, if the model has a "Cache" component with no sentence linked, that is a UME; if the doc talks about "Common" but the model lacks it, that is an MME.
- Results: The approach achieved an excellent F1 (0.81) for the underlying trace recovery. For inconsistency detection, it attained ~93% accuracy in identifying UMEs and ~75% for MMEs, significantly better than naive baselines. These results suggest that using trace links is a promising way to find documentation-model mismatches.
