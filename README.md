<p align="center"> 
	<img alt="ArDoCo" src="logo.png" height="210"/>
</p>

# [ArDoCo - Architecture Documentation Consistency](https://github.com/ArDoCo)
In this research project, we aim to provide consistency analyses between different kind of documentation, namely formal models and informal (textual) documentation.

Documenting the architecture of a software system is important, especially to capture reasoning and design decisions. A lot of tacit knowledge is easily lost when the documentation is incomplete, resulting in threats for the software system’s success and increased costs. However, software architecture documentation is often missing or outdated. One explanation for this phenomenon is the tedious and costly process of creating documentation in comparison to (perceived) low beneﬁts. With our project, we want to step forward in our long-term vision, where we plan to persist information from any sources, e.g. from whiteboard discussions, to avoid losing crucial information about a system. A core problem in this vision is the possible inconsistency of information from different sources. A major challenge of ensuring consistency is the consistency between formal artefacts, i.e. models, and informal documentation. We plan to address consistency analyses between models and textual natural language artefacts using natural language understanding and plan to include knowledge bases to improve these analyses. After extracting information out of the natural language documents, we plan to create traceability links and check whether statements within the textual documentation are consistent with the software architecture models.

ArDoCo is actively developed by researchers of the _[Modelling for Continuous Software Engineering (MCSE) group](https://mcse.kastel.kit.edu)_ of _[KASTEL - Institute of Information Security and Dependability](https://kastel.kit.edu)_ at the [KIT](https://www.kit.edu).

## Important Links
- [Project website](https://mcse.kastel.kit.edu/Projects_ArDoCo.php) at the research group's website
- [Publications](https://mcse.kastel.kit.edu/Projects_ArDoCo.php?tab=%5B577%5D#tabpanel-577) at the project website
- [GitHub organization](https://github.com/ArDoCo)
- Central code repository [ArDoCo/Core](https://github.com/ArDoCo/Core)
- [Poster with the initial idea](./InitialPoster.md) from the ICSA2019 NEMI track.

## Relevant and Recent Publications
- [Paper at ICSE 2024](./c/icse24): "Recovering Trace Links Between Software Documentation And Code" by Jan Keim, Sophie Corallo, Dominik Fuchß, Tobias Hey, Tobias Telge, and Anne Koziolek
- [Paper at ICSA 2023](./c/icsa23): "Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery" by Jan Keim, Sophie Corallo, Dominik Fuchß, and Anne Koziolek
- [Paper at ICSA 2021](./c/icsa21): "Trace Link Recovery for Software Architecture Documentation" by Jan Keim, Sophie Corallo, Dominik Fuchß, Claudius Kocher, Janek Speit and Anne Koziolek

## Initial Idea Poster (2019)
Although slightly outdated, the poster below from the [ICSA2019 NEMI track](https://swk-www.informatik.uni-hamburg.de/~icsa2019/index.html) underlines our main goals for checking consistency between formal architecture artefacts like [Palladio Component Models](https://www.palladio-simulator.com/science/palladio_component_model/) and informal software architecture artefacts in the form of textual software architecture documentation. For more details, check the [paper](http://sdqweb.ipd.kit.edu/publications/pdfs/keim2019nemi.pdf) as well as the [publications page](https://mcse.kastel.kit.edu/Projects_564.php).
![Poster](./icsa2019_poster.png "Poster")
