// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-approaches",
          title: "approaches",
          description: "Approaches within ARDoCo",
          section: "Navigation",
          handler: () => {
            window.location.href = "/approaches/";
          },
        },{id: "dropdown-ase-2026",
              title: "ASE 2026",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/ase26";
              },
            },{id: "dropdown-icsa-2026",
              title: "ICSA 2026",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/icsa26";
              },
            },{id: "dropdown-aire-2025",
              title: "AIRE 2025",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/aire25";
              },
            },{id: "dropdown-icse-2025-se-2026",
              title: "ICSE 2025 / SE 2026",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/icse25";
              },
            },{id: "dropdown-refsq-2025",
              title: "REFSQ 2025",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/refsq25";
              },
            },{id: "dropdown-icsa-2025-se-2026",
              title: "ICSA 2025 / SE 2026",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/icsa25";
              },
            },{id: "dropdown-gi-fachgruppe-architekturen-2024",
              title: "GI-Fachgruppe Architekturen 2024",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/fg-arch24";
              },
            },{id: "dropdown-icse-2024-se-2025",
              title: "ICSE 2024 / SE 2025",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/icse24";
              },
            },{id: "dropdown-icsa-2023-se-2024",
              title: "ICSA 2023 / SE 2024",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/icsa23";
              },
            },{id: "dropdown-ecsa-2021",
              title: "ECSA 2021",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/c/ecsa21";
              },
            },{id: "nav-publications",
          title: "publications",
          description: "publications that are related to ARDoCo",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of ARDoCo",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "approaches-arcotl",
          title: 'ArCoTL',
          description: "ArCoTL – TLR between Software Architecture Models and Code.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/arcotl/";
            },},{id: "approaches-ardocode",
          title: 'ArDoCode',
          description: "ArDoCode – TLR between Software Architecture Documentation and Code.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/ardocode/";
            },},{id: "approaches-exarch",
          title: 'ExArch',
          description: "ExArch – LLM-based Architecture Component Name Extraction for TLR between Software Architecture Documentation and Code.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/exarch/";
            },},{id: "approaches-inconsistency-detection",
          title: 'Inconsistency Detection',
          description: "Documentation-Model-Inconsistency-Analysis pipeline.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/inconsistency-detection/";
            },},{id: "approaches-lissa",
          title: 'LiSSA',
          description: "LiSSA – LLM/RAG-based TLR.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/lissa/";
            },},{id: "approaches-swattr",
          title: 'SWATTR',
          description: "SWATTR – TLR between Software Architecture Documentation and Software Architecture Models.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/swattr/";
            },},{id: "approaches-transarc",
          title: 'TransArC',
          description: "TransArC – TLR between Software Architecture Documentation, Models, and Code.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/transarc/";
            },},{id: "approaches-ardoco-tv",
          title: 'ARDoCo-TV',
          description: "Trace View: a viewer for trace links.",
          section: "Approaches",handler: () => {
              window.location.href = "/approaches/tv/";
            },},{id: "conferences-beyond-retrieval-a-study-of-using-llm-ensembles-for-candidate-filtering-in-requirements-traceability",
          title: 'Beyond Retrieval: A Study of Using LLM Ensembles for Candidate Filtering in Requirements...',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/aire25";
            },},{id: "conferences-the-ardoco-tool-landscape-rest-api-traceview-and-traceviz-for-architecture-traceability",
          title: 'The ARDoCo Tool Landscape: REST API, TraceView, and TraceViz for Architecture Traceability',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/ase26";
            },},{id: "conferences-trace-link-recovery-for-software-architecture-documentation",
          title: 'Trace Link Recovery for Software Architecture Documentation',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/ecsa21";
            },},{id: "conferences-llm-gestützte-softwarearchitektur-eine-neue-ära",
          title: 'LLM-gestützte Softwarearchitektur: Eine neue Ära?',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/fg-arch24";
            },},{id: "conferences-detecting-inconsistencies-in-software-architecture-documentation-using-traceability-link-recovery",
          title: 'Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/icsa23";
            },},{id: "conferences-enabling-architecture-traceability-by-llm-based-architecture-component-name-extraction",
          title: 'Enabling Architecture Traceability by LLM-based Architecture Component Name Extraction',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/icsa25";
            },},{id: "conferences-architecture-in-the-cradle-early-warning-of-architectural-decay-with-archguard",
          title: 'Architecture in the Cradle: Early Warning of Architectural Decay with ArchGuard',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/icsa26";
            },},{id: "conferences-recovering-trace-links-between-software-documentation-and-code",
          title: 'Recovering Trace Links Between Software Documentation And Code',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/icse24";
            },},{id: "conferences-lissa-toward-generic-traceability-link-recovery-through-retrieval-augmented-generation",
          title: 'LiSSA: Toward Generic Traceability Link Recovery through Retrieval-Augmented Generation',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/icse25";
            },},{id: "conferences-requirements-traceability-link-recovery-via-retrieval-augmented-generation",
          title: 'Requirements Traceability Link Recovery via Retrieval-Augmented Generation',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/refsq25";
            },},{id: "conferences-detecting-inconsistencies-in-software-architecture-documentation-using-traceability-link-recovery",
          title: 'Detecting Inconsistencies in Software Architecture Documentation Using Traceability Link Recovery',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/se24";
            },},{id: "conferences-recovering-trace-links-between-software-documentation-and-code",
          title: 'Recovering Trace Links Between Software Documentation And Code',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/se25";
            },},{id: "conferences-exarch-enabling-architecture-traceability-by-llm-based-architecture-component-name-extraction",
          title: 'ExArch: Enabling Architecture Traceability by LLM-based Architecture Component Name Extraction',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/se26-exarch";
            },},{id: "conferences-linking-software-system-artifacts-toward-generic-traceability-link-recovery-through-retrieval-augmented-generation",
          title: 'Linking Software System Artifacts: Toward Generic Traceability Link Recovery through Retrieval-Augmented Generation',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/se26-lissa";
            },},{id: "conferences-who-39-s-who-llm-assisted-software-traceability-with-architecture-entity-recognition",
          title: 'Who&amp;#39;s Who? LLM-assisted Software Traceability with Architecture Entity Recognition',
          description: "",
          section: "Conferences",handler: () => {
              window.location.href = "/c/taas26";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
