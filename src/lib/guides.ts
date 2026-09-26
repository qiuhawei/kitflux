export type GuideArticle = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  readingMinutes: number;
  relatedToolSlugs: string[];
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faq: { question: string; answer: string }[];
};

export const guides: GuideArticle[] = [
  {
    slug: "chatgpt-token-counter-guide",
    title: "ChatGPT Token Counter Guide: Budget Prompts Before You Hit Send",
    description:
      "Learn what tokens are, why ChatGPT/Claude counts differ, and how to estimate prompt size privately in your browser with Fluxkit AI Lab.",
    keywords: [
      "chatgpt token counter",
      "what is a token chatgpt",
      "prompt token budget",
      "claude vs gpt tokens",
    ],
    updated: "2026-09-26",
    readingMinutes: 6,
    relatedToolSlugs: ["ai-lab", "ai-token-counter", "ai-cost-calculator"],
    sections: [
      {
        heading: "Tokens are how models meter text",
        paragraphs: [
          "ChatGPT, Claude, and Gemini do not bill by words. They meter chunks called tokens — short pieces of text that may be a whole word, part of a word, punctuation, or whitespace. Context windows and API prices are defined in tokens, so guessing from word count alone is unreliable.",
          "A practical workflow is: draft the prompt, estimate tokens for the model family you use, then shorten system instructions or history before you send. That is the gap Fluxkit AI Lab fills — draft, compare, and cost in one private workspace.",
        ],
      },
      {
        heading: "Why GPT and Claude estimates disagree",
        paragraphs: [
          "Each lab family uses a different tokenizer. The same English sentence can produce different token totals on GPT-style versus Claude-style models. Code, URLs, and non-English text often tokenize less efficiently than plain prose.",
          "Fluxkit shows GPT, Claude, and Gemini estimates side-by-side for the same draft so you can see the spread before you pick a vendor or trim the prompt.",
        ],
        bullets: [
          "Use the matching family when planning API spend.",
          "Treat browser estimates as planning numbers — official tokenizers win for invoices.",
          "Long tool schemas and chat history count too, not just the latest user message.",
        ],
      },
      {
        heading: "A private workflow that beats clone counters",
        paragraphs: [
          "Most “token counter” sites are a single text box. Useful, but incomplete. Builders usually need three answers at once: Is this prompt clear? How big is it on GPT vs Claude? What will 100 requests cost?",
          "Open AI Lab, apply a template or paste your draft, read the compare cards, then set request volume for a spend forecast. Save locally if you want to revisit — nothing is uploaded for these calculations.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a browser token counter exact?",
        answer:
          "No. It is a fast approximation for planning. Official libraries and API usage dashboards are the source of truth for billing.",
      },
      {
        question: "Do I need an OpenAI API key to count tokens on Fluxkit?",
        answer:
          "No. Fluxkit estimates run locally in your browser without calling model APIs.",
      },
    ],
  },
  {
    slug: "estimate-openai-api-cost",
    title: "How to Estimate OpenAI & Claude API Cost Before You Ship",
    description:
      "A practical method to forecast LLM spend: measure input tokens, assume output size, multiply by requests, and sanity-check with Fluxkit’s cost tools.",
    keywords: [
      "openai api cost calculator",
      "claude api cost",
      "estimate llm spend",
      "gpt-4o pricing planner",
    ],
    updated: "2026-09-26",
    readingMinutes: 7,
    relatedToolSlugs: ["ai-lab", "ai-cost-calculator", "ai-token-counter"],
    sections: [
      {
        heading: "Cost is tokens × price × volume",
        paragraphs: [
          "Text LLM APIs usually charge separately for input and output tokens. Your monthly bill is roughly: (avg input tokens × input price + avg output tokens × output price) × requests. Miss any one of those inputs and the forecast is fiction.",
          "Start from real prompts. Paste a production-like system prompt and user message into AI Lab, note the family token estimate, then set an output ratio (replies are often 20–100%+ of input for chat; agents can be higher).",
        ],
      },
      {
        heading: "Budget buffers teams forget",
        paragraphs: [
          "Retries, tool/function calls, evaluation runs, and long multi-turn threads multiply tokens. If you plan launch-day traffic, add a buffer — many teams use 1.5× to 3× on early forecasts.",
          "Also compare model tiers. A smaller model with a slightly longer prompt can still be cheaper than a frontier model with a short prompt. AI Lab’s side-by-side tokens plus price chips make that tradeoff visible quickly.",
        ],
        bullets: [
          "Price lists change — re-check vendor pages before locking a budget.",
          "Cache static system prompts server-side when the vendor supports it.",
          "Measure with sample traffic, then revisit the calculator.",
        ],
      },
      {
        heading: "Ship a cheaper prompt, not just a cheaper model",
        paragraphs: [
          "The highest-leverage cut is often deleting unused instructions, examples, and retrieved context. After trimming, re-run the token compare. If cost is still high, step down a model tier for classification-like tasks and keep the larger model for hard reasoning.",
        ],
      },
    ],
    faq: [
      {
        question: "Does Fluxkit use live OpenAI prices?",
        answer:
          "No. Price tiers are planning defaults. Always confirm current rates on the provider’s pricing page.",
      },
      {
        question: "Can I estimate cost without uploading prompts?",
        answer:
          "Yes. Fluxkit’s calculators run locally. You can also enter token counts manually on the dedicated cost tool.",
      },
    ],
  },
  {
    slug: "gpt-vs-claude-tokens",
    title: "GPT vs Claude Tokens: Why Counts Differ (and What To Do)",
    description:
      "Understand why the same prompt shows different token estimates on GPT and Claude, and how to plan context and cost without guessing.",
    keywords: [
      "gpt vs claude tokens",
      "claude tokenizer vs tiktoken",
      "compare llm tokens",
      "prompt size chatgpt claude",
    ],
    updated: "2026-09-26",
    readingMinutes: 5,
    relatedToolSlugs: ["ai-lab", "ai-token-counter", "prompt-builder"],
    sections: [
      {
        heading: "Different tokenizers, same English sentence",
        paragraphs: [
          "OpenAI-style models and Anthropic’s Claude do not split text identically. A compact English paragraph might be close across families; dense code, markdown tables, or CJK text can diverge more. That is normal — not a bug in your counter.",
          "When people say “this prompt is 2k tokens,” ask: on which tokenizer? Fluxkit AI Lab answers by showing GPT, Claude, and Gemini cards for one draft.",
        ],
      },
      {
        heading: "Planning rules of thumb",
        paragraphs: [
          "If you are shipping on one vendor, optimize against that family’s estimate. If you are evaluating two vendors, compare both on the same prompt before you rewrite for length.",
          "For shared docs and tickets, paste the AI Lab summary (tokens + assumed output + cost) so teammates see assumptions instead of a single magic number.",
        ],
        bullets: [
          "Prefer one draft → multi-model compare over three separate websites.",
          "Keep a short “golden prompt” fixture for regression checks when you change templates.",
          "Use share links (#prompt=) to send a draft without uploading it to Fluxkit servers.",
        ],
      },
    ],
    faq: [
      {
        question: "Which estimate should I trust for billing?",
        answer:
          "The vendor’s official tokenizer and usage dashboard. Browser estimates are for planning and comparison.",
      },
      {
        question: "Can I share a prompt comparison without emailing a doc?",
        answer:
          "Yes. AI Lab can encode the draft into the URL hash so a teammate opens the same text locally in their browser.",
      },
    ],
  },
  {
    slug: "reduce-chatgpt-api-cost",
    title: "How to Reduce ChatGPT & Claude API Cost Without Killing Quality",
    description:
      "Concrete levers to cut LLM spend: shorter prompts, smarter model tiers, caching, and output caps — with a Fluxkit AI Lab checklist.",
    keywords: [
      "reduce chatgpt api cost",
      "lower claude api bill",
      "llm cost optimization",
      "cheap gpt-4o mini prompts",
    ],
    updated: "2026-09-26",
    readingMinutes: 8,
    relatedToolSlugs: ["ai-lab", "ai-cost-calculator", "prompt-builder"],
    sections: [
      {
        heading: "Cut tokens before you cut quality",
        paragraphs: [
          "Most teams jump straight to a cheaper model. Often the faster win is deleting dead weight: unused system rules, duplicate examples, full HTML dumps, and chat history that is no longer relevant. Every token you remove multiplies across every request.",
          "Paste a real production prompt into Fluxkit AI Lab, note the GPT/Claude/Gemini estimates, trim, then re-check. If the draft still works in a quick smoke test, you saved money without changing vendors.",
        ],
      },
      {
        heading: "Match the model to the job",
        paragraphs: [
          "Classification, extraction, and formatting rarely need a frontier model. Keep large models for hard reasoning and use mini/haiku tiers for high-volume mundane work. AI Lab’s price chips make the gap obvious once you set request volume.",
        ],
        bullets: [
          "Route easy traffic to a small model; escalate only on low confidence.",
          "Cap max output tokens — long answers are often the silent cost killer.",
          "Cache static system prompts when the provider supports prompt caching.",
        ],
      },
      {
        heading: "Measure, then lock a budget",
        paragraphs: [
          "After you trim and tier, run the cost calculator with realistic request counts (including retries and evals). Share an AI Lab hash link with the team so everyone sees the same draft assumptions — not a spreadsheet guess.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the biggest LLM cost lever?",
        answer:
          "Usually prompt and context size at volume. Model tier is second. Output length is third and often underestimated.",
      },
      {
        question: "Can Fluxkit change my live OpenAI bill?",
        answer:
          "No. It helps you plan and compare. Billing still happens on the provider after you ship.",
      },
    ],
  },
  {
    slug: "private-ai-token-counter",
    title: "Private AI Token Counter: Count Tokens Without Uploading Prompts",
    description:
      "Why browser-local token estimates matter for secret prompts, and how Fluxkit AI Lab compares GPT/Claude/Gemini counts privately.",
    keywords: [
      "private token counter",
      "count chatgpt tokens offline",
      "browser token counter",
      "no upload prompt counter",
    ],
    updated: "2026-09-26",
    readingMinutes: 5,
    relatedToolSlugs: ["ai-lab", "ai-token-counter"],
    sections: [
      {
        heading: "Prompts can contain secrets",
        paragraphs: [
          "Customer names, API keys in examples, unreleased product copy, and internal strategy often live inside drafts. Pasting that text into a random online counter means you trust that site’s logs, CDN, and ads stack.",
          "Fluxkit’s token tools are designed to run in your browser. Estimates happen locally so you can check size without sending the draft to Fluxkit for tokenization.",
        ],
      },
      {
        heading: "Privacy plus a workflow",
        paragraphs: [
          "A private single text box is good. A private workspace is better: draft with templates, compare families, forecast cost, keep local history, and share via #prompt= hash links that decode on the recipient’s device.",
          "That combination is the differentiation versus clone “token counter” pages that only expose one number.",
        ],
        bullets: [
          "Use AI Lab for full drafts; use the focused token counter when you only need one estimate.",
          "Treat browser estimates as planning — vendor dashboards remain billing truth.",
          "Clear local history on shared machines if drafts are sensitive.",
        ],
      },
    ],
    faq: [
      {
        question: "Does Fluxkit store my prompt on a server?",
        answer:
          "Token and cost estimates are computed in the browser. Hash share links put the draft in the URL fragment, which browsers do not send to the server on navigation.",
      },
      {
        question: "Is offline counting exact?",
        answer:
          "It is an approximation for planning. For invoice-grade counts, use the provider’s tokenizer.",
      },
    ],
  },
  {
    slug: "prompt-token-budget",
    title: "How to Set a Prompt Token Budget for RAG, Agents, and Chat",
    description:
      "A simple framework to allocate tokens across system prompt, retrieval, history, and output — then validate with Fluxkit AI Lab.",
    keywords: [
      "prompt token budget",
      "rag context window budget",
      "agent token allocation",
      "chatgpt context limit planning",
    ],
    updated: "2026-09-26",
    readingMinutes: 7,
    relatedToolSlugs: ["ai-lab", "ai-token-counter", "prompt-builder"],
    sections: [
      {
        heading: "Split the window into jobs",
        paragraphs: [
          "A context window is a budget. If retrieval eats 80% and history eats the rest, the model has no room for a useful answer. Decide up front: system instructions, tools/schemas, retrieved chunks, conversation history, and reserved output.",
          "Write those slices as percentages or hard caps (for example: 10% system, 50% RAG, 20% history, 20% output reserve). Then measure real text — do not trust word-count guesses.",
        ],
      },
      {
        heading: "Validate with one draft",
        paragraphs: [
          "Assemble a worst-case prompt (long system + top-k chunks + multi-turn history) in AI Lab. Compare GPT/Claude/Gemini estimates. If you are over budget on the family you ship, shrink retrieval first, then history, then instructions.",
        ],
        bullets: [
          "Prefer fewer high-signal chunks over dumping an entire corpus.",
          "Summarize old turns instead of replaying full transcripts.",
          "Rebuild the prompt with the Prompt Builder template, then re-measure.",
        ],
      },
      {
        heading: "Revisit when models change",
        paragraphs: [
          "New model tiers change both price and practical context. Keep a golden fixture prompt and re-run it in AI Lab whenever you switch vendors or raise top-k. Share the hash link in the PR so reviewers see the budget impact.",
        ],
      },
    ],
    faq: [
      {
        question: "How large should the system prompt be?",
        answer:
          "As small as it can be while staying reliable. Many products waste hundreds of tokens on unused rules. Measure, delete, and re-test.",
      },
      {
        question: "Do RAG chunks count as input tokens?",
        answer:
          "Yes. Retrieved text is input. It often dominates cost more than the user question itself.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesForTool(toolSlug: string, limit = 3) {
  return guides
    .filter((guide) => guide.relatedToolSlugs.includes(toolSlug))
    .slice(0, limit);
}
