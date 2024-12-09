---
layout: page
permalink: /c/icse24
title: Recovering Trace Links Between Software Documentation And Code
description:
---

by [Jan Keim](https://orcid.org/0000-0002-8899-7081), [Sophie Corallo](https://orcid.org/0000-0002-1531-2977), [Dominik Fuchß](https://orcid.org/0000-0001-6410-6769), [Tobias Hey](https://orcid.org/0000-0003-0381-1020), [Tobias Telge](https://orcid.org/0009-0002-6700-6426), and [Anne Koziolek](https://orcid.org/0000-0002-1593-3394)

Published at the [46th International Conference on Software Engineering (ICSE 2024), April 14-20 2024](https://conf.researchr.org/home/icse-2024)

<p align="center">
	<img src="/assets/img/approach_overview_icse24.svg" alt="Approach Overview"/>
</p>

## Abstract

_Introduction_
Software development involves creating various artifacts at different levels of abstraction and establishing relationships between them is essential.
Traceability link recovery (TLR) automates this process, enhancing software quality by aiding tasks like maintenance and evolution.
However, automating TLR is challenging due to semantic gaps resulting from different levels of abstraction.
While automated TLR approaches exist for requirements and code, architecture documentation lacks tailored solutions, hindering the preservation of architecture knowledge and design decisions.

_Methods_
This paper presents our approach TransArC for TLR between architecture documentation and code, using component-based architecture models as intermediate artifacts to bridge the semantic gap.
We create transitive trace links by combining the existing approach ArDoCo for linking architecture documentation to models with our novel approach ArCoTL for linking architecture models to code.

_Results_
We evaluate our approaches with five open-source projects, comparing our results to baseline approaches.
The model-to-code TLR approach achieves an average F1-score of 0.98, while the documentation-to-code TLR approach achieves a promising average F1-score of 0.82, significantly outperforming baselines.

_Conclusion_
Combining two specialized approaches with an intermediate artifact shows promise for bridging the semantic gap.
In future research, we will explore further possibilities for such transitive approaches.

## Links

- Paper (Open Access) on [ACM](https://doi.org/10.1145/3597503.363913) or [KITopen](https://doi.org/10.5445/IR/1000165692)
- Replication Package on [Zenodo](https://doi.org/10.5281/zenodo.10411853) and the corresponding [GitHub repository](https://github.com/ArDoCo/Replication-Package-ICSE24_Recovering-Trace-Links-Between-Software-Documentation-And-Code)
- Slides as [pptx](/assets/pdf/presentation_icse24.pptx) or [pdf](/assets/pdf/presentation_icse24.pdf)

## Cite this paper

```bibtex
@inproceedings{keim_recovering_2024,
  abbr              = {ICSE},
  author            = {Keim, Jan and Corallo, Sophie and Fuch\ss{}, Dominik and Hey, Tobias and Telge, Tobias and Koziolek, Anne},
  title             = {Recovering Trace Links Between Software Documentation And Code},
  year              = {2024},
  isbn              = {9798400702174},
  publisher         = {Association for Computing Machinery},
  address           = {New York, NY, USA},
  url               = {https://doi.org/10.1145/3597503.3639130},
  doi               = {10.1145/3597503.3639130},
  abstract          = {Introduction Software development involves creating various artifacts at different levels of abstraction and establishing relationships between them is essential. Traceability link recovery (TLR) automates this process, enhancing software quality by aiding tasks like maintenance and evolution. However, automating TLR is challenging due to semantic gaps resulting from different levels of abstraction. While automated TLR approaches exist for requirements and code, architecture documentation lacks tailored solutions, hindering the preservation of architecture knowledge and design decisions. Methods This paper presents our approach TransArC for TLR between architecture documentation and code, using component-based architecture models as intermediate artifacts to bridge the semantic gap. We create transitive trace links by combining the existing approach ArDoCo for linking architecture documentation to models with our novel approach ArCoTL for linking architecture models to code.Results We evaluate our approaches with five open-source projects, comparing our results to baseline approaches. The model-to-code TLR approach achieves an average F1-score of 0.98, while the documentation-to-code TLR approach achieves a promising average F1-score of 0.82, significantly outperforming baselines. Conclusion Combining two specialized approaches with an intermediate artifact shows promise for bridging the semantic gap. In future research, we will explore further possibilities for such transitive approaches.},
  booktitle         = {Proceedings of the IEEE/ACM 46th International Conference on Software Engineering},
  articleno         = {215},
  numpages          = {13},
  location          = {Lisbon, Portugal},
  series            = {ICSE '24}
}
```
