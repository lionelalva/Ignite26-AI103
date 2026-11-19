// Study content for each AI-103 domain. Source: Microsoft Learn study guide,
// "Skills measured as of April 16, 2026". Always re-check the live guide before the exam.
window.GUIDE_URL = "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103";
window.DOMAINS = [
  { id: "d1", name: "Plan and manage an Azure AI solution", weight: "25–30%",
    groups: [
      { title: "Choose the appropriate Foundry services", items: [
        "Choose a model per task: LLM, small language model, multimodal, Foundry Tools",
        "Choose services for generation, grounding, vector search, agent workflows, multimodal processing",
        "Choose a retrieval and indexing method",
        "Choose memory, tool and knowledge integration services for agents" ] },
      { title: "Set up AI solutions in Foundry", items: [
        "Design Azure infrastructure for AI apps and agents",
        "Choose deployment options; configure model and agent deployments",
        "Integrate Foundry projects with CI/CD" ] },
      { title: "Manage, monitor, and secure AI systems", items: [
        "Manage quotas, scaling, rate limits and cost",
        "Monitor performance, drift, safety events, grounding quality",
        "Monitor ingestion quality, index health, relevance",
        "Security: managed identity, private networking, keyless credentials, role policies" ] },
      { title: "Implement responsible AI", items: [
        "Safety filters, guardrails, risk detection, content moderation",
        "Evaluators, safety evaluations, explanation tooling",
        "Auditing: trace logging, provenance metadata, approval workflows",
        "Govern agents: oversight modes, constraints, tool-access controls" ] }
    ],
    keyPoints: [
      "Prefer managed identity + Entra ID RBAC over API keys; add private endpoints and disable public access for network isolation.",
      "429 = rate limit. Backoff and honor Retry-After; use quota increases or provisioned throughput for predictable capacity.",
      "Match model size to task: small models for narrow high-volume work, larger/reasoning models for complex tasks.",
      "Hybrid (keyword + vector) search with a semantic ranker is the usual best retrieval default.",
      "Prompt Shields covers user prompt attacks and indirect (document) attacks.",
      "Gate CI/CD on evaluation results; trace everything (OpenTelemetry / Application Insights) for audit." ],
    links: [["Azure AI services", "https://learn.microsoft.com/en-us/azure/ai-services/"], ["Azure OpenAI", "https://learn.microsoft.com/en-us/azure/ai-services/openai/"]] },

  { id: "d2", name: "Implement generative AI and agentic solutions", weight: "30–35%",
    groups: [
      { title: "Build generative applications", items: [
        "Deploy and consume LLMs, small, code and multimodal models",
        "Implement RAG; design workflows, tool-augmented flows, multistep reasoning",
        "Evaluate: fabrications, relevance, quality, safety",
        "Use Foundry SDKs and connect an app to a Foundry project" ] },
      { title: "Build agents", items: [
        "Define roles, goals, conversation tracking, tool schemas",
        "Retrieval, function calling, conversation memory",
        "Tools: APIs, knowledge stores, search, Content Understanding, custom functions",
        "Multi-agent orchestration; autonomous / semi-autonomous workflows with approvals",
        "Monitor deployed agents, evaluate behavior, error analysis" ] },
      { title: "Optimize and operationalize", items: [
        "Prompt engineering and parameter tuning",
        "Reflection, chain-of-thought evaluation, self-critique loops",
        "Observability: tracing, token analytics, safety signals, latency breakdowns",
        "Orchestrate multiple models, flows, or hybrid LLM + rules engines" ] }
    ],
    keyPoints: [
      "RAG = retrieve, augment prompt, generate. Groundedness checks support in context; relevance checks the question was answered.",
      "Function calling: the model proposes name + JSON args; your runtime executes and returns results.",
      "Tool names, descriptions and schemas drive tool selection. Improve them before anything else.",
      "Use structured outputs (JSON schema) for reliable machine-readable results.",
      "Tune one of temperature or top_p, not both. Low temperature for determinism.",
      "Put hard business rules in deterministic code. Add step limits and approval gates to autonomous agents.",
      "DefaultAzureCredential gives keyless auth locally and in Azure." ],
    links: [["Azure OpenAI", "https://learn.microsoft.com/en-us/azure/ai-services/openai/"], ["Azure AI Search", "https://learn.microsoft.com/en-us/azure/search/"]] },

  { id: "d3", name: "Implement computer vision solutions", weight: "10–15%",
    groups: [
      { title: "Image and video generation", items: [
        "Generate images / videos from prompts and reference media",
        "Inpainting, mask-based edits, prompt-driven modification; edit generated video",
        "Select platform generation and editing controls" ] },
      { title: "Multimodal understanding", items: [
        "Analyze visual context with multimodal models; concise vs detailed captions",
        "Visual QA grounded in evidence; alt-text per accessibility guidelines",
        "Content Understanding: visual characteristics, video segments, single-task and pro-mode pipelines",
        "Identify objects, components or regions in images/video" ] },
      { title: "Responsible AI for multimodal content", items: [
        "Classify unsafe visual content",
        "Detect indirect prompt injection via embedded text in images",
        "Visual policy rules: watermarks, prohibited symbols, brand usage" ] }
    ],
    keyPoints: [
      "Inpainting = edit only the masked region according to a prompt.",
      "Treat text inside images as untrusted data (indirect prompt injection risk).",
      "Content Understanding analyzers turn images and video into structured output.",
      "Ground visual answers in visible evidence and allow 'cannot tell'." ],
    links: [["Azure AI Vision", "https://learn.microsoft.com/en-us/azure/cognitive-services/computer-vision/"], ["Video Indexer", "https://learn.microsoft.com/en-us/azure/azure-video-indexer/"]] },

  { id: "d4", name: "Implement text analysis solutions", weight: "10–15%",
    groups: [
      { title: "Language model text analysis", items: [
        "Extract entities, topics, summaries, structured JSON",
        "Detect sentiment, tone, safety issues, sensitive content",
        "Translate with Azure Translator or LLM-powered flows",
        "Customize outputs for domain tasks (compliance summaries, extraction)" ] },
      { title: "Speech solutions", items: [
        "Speech-to-text and text-to-speech for agents",
        "Speech as an agent modality, including custom speech models",
        "Multimodal reasoning from audio inputs",
        "Translate speech with language models and Foundry Tools" ] }
    ],
    keyPoints: [
      "Structured outputs for extraction; PII detection to redact sensitive data.",
      "Translator for deterministic and document translation; LLMs when tone/domain adaptation matters.",
      "Custom speech / phrase lists fix domain-term misrecognition.",
      "Audio-capable multimodal models can reason over audio directly." ],
    links: [["Azure AI Language", "https://learn.microsoft.com/en-us/azure/cognitive-services/luis/"], ["Azure AI Speech", "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/"]] },

  { id: "d5", name: "Implement information extraction solutions", weight: "10–15%",
    groups: [
      { title: "Retrieval and grounding pipelines", items: [
        "Ingest and index documents, images, audio, video",
        "Semantic, hybrid and vector search for grounding",
        "Enrichment with built-in or custom skills (text, images, layout)",
        "RAG ingestion flow with OCR; connect retrieval to workflows and agent tools" ] },
      { title: "Extract content from documents", items: [
        "Multimodal pipelines: OCR + layout analysis + field extraction",
        "Clean grounded representations for agents and RAG with Content Understanding",
        "Analyzers producing structured or markdown output" ] }
    ],
    keyPoints: [
      "Indexer + data source + skillset = automated ingestion and enrichment (OCR for scanned content).",
      "Vector search needs embeddings in a vector field; semantic ranker reranks results.",
      "Chunk with structure and overlap; expose retrieval to agents as a tool.",
      "Prebuilt models for common docs (invoices); custom analyzers for custom field schemas." ],
    links: [["Azure AI Search", "https://learn.microsoft.com/en-us/azure/search/"], ["Document Intelligence", "https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/"]] }
];
