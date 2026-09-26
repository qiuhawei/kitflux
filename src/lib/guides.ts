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
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
