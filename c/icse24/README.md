<p align="center"> 
	<img alt="ArDoCo" src="../../logo.png" height="210"/>
</p>

# Recovering Trace Links Between Software Documentation And Code 
by [Jan Keim](https://orcid.org/0000-0002-8899-7081), [Sophie Corallo](https://orcid.org/0000-0002-1531-2977), [Dominik Fuchß](https://orcid.org/0000-0001-6410-6769), [Tobias Hey](https://orcid.org/0000-0003-0381-1020), [Tobias Telge](https://orcid.org/0009-0002-6700-6426), and [Anne Koziolek](https://orcid.org/0000-0002-1593-3394)

Published at the [46th International Conference on Software Engineering (ICSE 2024), April 14-20 2024](https://conf.researchr.org/home/icse-2024)

<p align="center">
	<img src="./approach_overview.svg" alt="Approach Overview"/>
</p>

## Abstract
*Introduction* 
Software development involves creating various artifacts at different levels of abstraction and establishing relationships between them is essential. 
Traceability link recovery (TLR) automates this process, enhancing software quality by aiding tasks like maintenance and evolution. 
However, automating TLR is challenging due to semantic gaps resulting from different levels of abstraction. 
While automated TLR approaches exist for requirements and code, architecture documentation lacks tailored solutions, hindering the preservation of architecture knowledge and design decisions.

*Methods* 
This paper presents our approach TransArC for TLR between architecture documentation and code, using component-based architecture models as intermediate artifacts to bridge the semantic gap. 
We create transitive trace links by combining the existing approach ArDoCo for linking architecture documentation to models with our novel approach ArCoTL for linking architecture models to code.

*Results* 
We evaluate our approaches with five open-source projects, comparing our results to baseline approaches. 
The model-to-code TLR approach achieves an average F1-score of 0.98, while the documentation-to-code TLR approach achieves a promising average F1-score of 0.82, significantly outperforming baselines.

*Conclusion* 
Combining two specialized approaches with an intermediate artifact shows promise for bridging the semantic gap. 
In future research, we will explore further possibilities for such transitive approaches.

## Links
- Paper on [KITopen](https://doi.org/10.5445/IR/1000165692)
- Replication Package on [Zenodo](https://doi.org/10.5281/zenodo.10411853) and the corresponding [GitHub repository](https://github.com/ArDoCo/Replication-Package-ICSE24_Recovering-Trace-Links-Between-Software-Documentation-And-Code)
- Slides will be uploaded soon


