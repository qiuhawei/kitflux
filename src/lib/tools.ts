export type ToolCategory =
  | "json"
  | "video"
  | "ai"
  | "text"
  | "developer"
  | "security"
  | "time";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  keywords: string[];
  category: ToolCategory;
  /** One-line blurb for dense portal cards */
  blurb?: string;
  guide: {
    heading: string;
    intro: string;
    steps: string[];
    tips: string[];
  };
  faq: { question: string; answer: string }[];
};

export const categories: Record<
  ToolCategory,
  { label: string; description: string }
> = {
  ai: {
    label: "AI Tools",
    description:
      "ChatGPT & Claude token counters, prompt builders, and API cost estimators — private in your browser",
  },
  json: {
    label: "JSON Tools",
    description: "Format, convert, compare, and decode JSON in your browser",
  },
  video: {
    label: "Video Tools",
    description: "YouTube & TikTok covers, embeds, URL parsing, and local file info",
  },
  text: {
    label: "Text",
    description: "Count, transform, and generate text",
  },
  developer: {
    label: "Developer",
    description: "Encode, inspect, and transform data",
  },
  security: {
    label: "Security",
    description: "Generate and hash secrets in your browser",
  },
  time: {
    label: "Time",
    description: "Convert timestamps and dates",
  },
};

export const categoryOrder: ToolCategory[] = [
  "ai",
  "json",
  "video",
  "developer",
  "text",
  "security",
  "time",
];

export const tools: ToolDefinition[] = [
  {
    slug: "ai-token-counter",
    name: "AI Token Counter for ChatGPT, Claude & Gemini",
    shortName: "AI Token Counter",
    description:
      "Free AI token counter for ChatGPT, Claude, and Gemini. Estimate prompt and reply tokens in your browser before you hit send — private, no signup, nothing uploaded.",
    blurb: "ChatGPT / Claude / Gemini token estimate",
    keywords: [
      "ai token counter",
      "chatgpt token counter",
      "claude token counter",
      "gemini token counter",
      "openai tokenizer",
      "gpt token calculator",
      "prompt token counter",
      "llm token estimator",
      "how many tokens is my prompt",
      "context length calculator",
    ],
    category: "ai",
    guide: {
      heading: "How to count ChatGPT and Claude tokens",
      intro:
        "Large language models meter usage in tokens, not words. A token is a chunk of text the model reads or writes — often a short word or part of a longer word. Counting tokens before you send a prompt helps you stay under context limits, cut cost, and avoid truncated replies. This free AI token counter runs entirely in your browser for ChatGPT-style, Claude-style, and Gemini-style estimates.",
      steps: [
        "Paste your system prompt, user message, or model reply into the box.",
        "Choose the model family closest to what you use (GPT, Claude, or Gemini).",
        "Read the estimated tokens plus word and character counts.",
        "Shorten verbose instructions if you are near a context or budget limit.",
        "Copy a trimmed version of the prompt back into ChatGPT, Claude, or your API client.",
      ],
      tips: [
        "English often averages ~4 characters per token for GPT-family models; Chinese and code can differ.",
        "System prompts, tool schemas, and chat history all consume tokens in real APIs.",
        "For invoice-critical billing, double-check with the vendor’s official tokenizer.",
        "Pair this tool with the AI Cost Calculator to turn token counts into dollar estimates.",
      ],
    },
    faq: [
      {
        question: "Is this the official OpenAI tiktoken tokenizer?",
        answer:
          "No. It is a fast local approximation for planning. Official libraries may return a slightly different number for the same text.",
      },
      {
        question: "Does my prompt get uploaded to a server?",
        answer:
          "No. Token estimation runs in your browser. Fluxkit does not send your prompt text to our servers for this tool.",
      },
      {
        question: "Why do ChatGPT and Claude show different token counts?",
        answer:
          "Each model family uses its own tokenizer. The same sentence can produce different token totals across GPT, Claude, and Gemini.",
      },
      {
        question: "Can I use this for GPT-4o, o1, or Claude 3.5?",
        answer:
          "Yes as a planning estimate. Pick the closest model family; treat the result as guidance before you send a production request.",
      },
      {
        question: "How do tokens relate to price?",
        answer:
          "APIs usually charge separately for input and output tokens. Use our AI Cost Calculator after you know average sizes per request.",
      },
    ],
  },
  {
    slug: "prompt-builder",
    name: "AI Prompt Builder for ChatGPT & Claude",
    shortName: "Prompt Builder",
    description:
      "Free AI prompt builder for ChatGPT and Claude. Turn a vague idea into a clear role + task + constraints prompt you can paste into any LLM — local and private.",
    blurb: "Templates for ChatGPT & Claude prompts",
    keywords: [
      "prompt generator",
      "chatgpt prompt template",
      "ai prompt builder",
      "prompt engineering tool",
      "claude prompt generator",
      "chatgpt prompt maker",
      "llm prompt template",
      "system prompt builder",
    ],
    category: "ai",
    guide: {
      heading: "How to write stronger ChatGPT prompts",
      intro:
        "Vague prompts get vague answers. A reliable pattern is role + task + input + constraints + output format. This AI prompt builder fills that structure so you can paste straight into ChatGPT, Claude, Gemini, or an API — without uploading your draft to our servers.",
      steps: [
        "Choose a template (rewrite, explain, code review, or SEO outline).",
        "Add your topic or paste the source text.",
        "Optionally add constraints such as tone, audience, or length.",
        "Copy the finished prompt into your AI chat or API call.",
        "Iterate: keep what worked and tighten one constraint at a time.",
      ],
      tips: [
        "Be specific about the audience and forbidden behaviors (for example: no fluff).",
        "Ask for a reusable format: bullets, JSON, or a table.",
        "After drafting, run the AI Token Counter to see if the prompt is too long.",
      ],
    },
    faq: [
      {
        question: "Will this call ChatGPT for me?",
        answer:
          "No. It only builds the prompt text locally. You paste it into ChatGPT, Claude, or another model yourself.",
      },
      {
        question: "Can I edit the result?",
        answer:
          "Yes. Copy it, then tweak any line before sending. Templates are starting points.",
      },
      {
        question: "Which template should I start with?",
        answer:
          "Use Rewrite for messy drafts, Explain for learning, Code review for pull requests, and SEO outline for articles.",
      },
      {
        question: "Is prompt engineering still useful?",
        answer:
          "Yes. Clear role, constraints, and output format still improve reliability even on stronger models.",
      },
    ],
  },
  {
    slug: "ai-cost-calculator",
    name: "AI API Cost Calculator (OpenAI & Claude)",
    shortName: "AI Cost Calculator",
    description:
      "Free LLM API cost calculator for OpenAI and Claude-style pricing. Estimate spend from input/output tokens and request volume before you ship.",
    blurb: "Estimate OpenAI & Claude API spend",
    keywords: [
      "openai cost calculator",
      "chatgpt api pricing calculator",
      "claude api cost calculator",
      "llm cost estimator",
      "token pricing calculator",
      "gpt-4o cost calculator",
      "ai api budget planner",
      "gemini api cost",
    ],
    category: "ai",
    guide: {
      heading: "How to estimate ChatGPT and Claude API spend",
      intro:
        "API bills scale with tokens and traffic. Use this AI cost calculator with your expected prompt and completion sizes to forecast cost per day or per feature launch — then trim prompts with the token counter if needed.",
      steps: [
        "Select a model price tier closest to what you use.",
        "Enter average input and output tokens per request.",
        "Set how many requests you expect (day, week, or launch).",
        "Read total cost, input/output split, and cost per request.",
        "Adjust volume or model tier until the budget fits.",
      ],
      tips: [
        "Cache repeated prompts and shorten system instructions to cut input tokens.",
        "Cheaper models are often enough for classification and drafts.",
        "Prices change — treat results as planning estimates, not invoices.",
        "Count real sample prompts with the AI Token Counter first for better inputs.",
      ],
    },
    faq: [
      {
        question: "Are these official OpenAI prices?",
        answer:
          "No. Tiers are planning defaults. Always confirm current rates on the vendor’s pricing page.",
      },
      {
        question: "Does this include image or audio models?",
        answer:
          "This calculator focuses on text token pricing. Multimodal billing can use different meters.",
      },
      {
        question: "How do I get better token inputs?",
        answer:
          "Use our AI Token Counter on sample prompts, or log usage from your API dashboard.",
      },
      {
        question: "Should I budget for retries and tool calls?",
        answer:
          "Yes. Failed requests, tool/function calls, and long agent loops can multiply token use — add a buffer.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortName: "JSON Formatter",
    description:
      "Online JSON parser like a clean studio: format, compress, escape, validate, and browse a tree view. Runs in your browser — nothing uploaded.",
    blurb: "Pretty-print, minify, escape, and tree view",
    keywords: [
      "json formatter",
      "json online",
      "json validator",
      "json parser",
      "json tree",
      "pretty print json",
      "minify json",
      "json beautifier",
    ],
    category: "json",
    guide: {
      heading: "How to format and validate JSON",
      intro:
        "JSON (JavaScript Object Notation) is a common format for APIs, config files, and browser storage. Invalid commas, quotes, or brackets break parsers. This formatter checks syntax locally and rewrites the document with consistent indentation so you can read and share it safely.",
      steps: [
        "Paste your JSON into the input area, or load the sample to try the workflow.",
        "Click Format to pretty-print with indentation, or Minify to compress to one line for payloads.",
        "If the JSON is invalid, read the error message, fix the syntax, and format again.",
        "Copy the output when you are ready to paste it into an editor, API client, or ticket.",
      ],
      tips: [
        "Property names and string values must use double quotes in standard JSON.",
        "Trailing commas after the last item in an object or array are invalid in JSON.",
        "Minified JSON is ideal for network payloads; formatted JSON is better for reviews and diffs.",
      ],
    },
    faq: [
      {
        question: "Is my JSON uploaded to a server?",
        answer:
          "No. Formatting and validation happen locally in your browser. Your data never leaves your device.",
      },
      {
        question: "Can I minify JSON as well?",
        answer:
          "Yes. Use Format for readable indentation or Minify to compress JSON into a single line.",
      },
      {
        question: "Why does valid-looking JSON still fail?",
        answer:
          "Common causes include single quotes, comments, trailing commas, or NaN/undefined values that are not part of the JSON standard.",
      },
    ],
  },
  {
    slug: "json-validate",
    name: "JSON Validator",
    shortName: "JSON Validator",
    description:
      "Check whether a string is valid JSON and see its top-level type, key count, or array length — entirely in your browser.",
    blurb: "Syntax check with type and size summary",
    keywords: ["json validator", "validate json", "json checker", "json lint"],
    category: "json",
    guide: {
      heading: "How to validate JSON",
      intro:
        "Before you ship a payload or paste config into an app, confirm it parses as JSON. This tool reports validity and a short structural summary without uploading your data.",
      steps: [
        "Paste the JSON text into the input box.",
        "Click Validate.",
        "If it fails, fix the reported syntax issue and try again.",
        "If it passes, review the type and size summary, then copy if needed.",
      ],
      tips: [
        "Comments and trailing commas are not valid in standard JSON.",
        "Use the full JSON studio when you also need formatting or a tree view.",
      ],
    },
    faq: [
      {
        question: "Does validation upload my data?",
        answer: "No. Parsing runs locally in your browser.",
      },
      {
        question: "What does the summary show?",
        answer:
          "For valid JSON it reports the top-level type and, when useful, object key count or array length.",
      },
    ],
  },
  {
    slug: "json-minify",
    name: "JSON Minify / Compress",
    shortName: "JSON Minify",
    description:
      "Compress JSON into a single line for APIs and storage. Removes whitespace while keeping valid structure.",
    blurb: "One-line compress for API payloads",
    keywords: ["json minify", "json compress", "minify json", "json compact"],
    category: "json",
    guide: {
      heading: "How to minify JSON",
      intro:
        "Pretty JSON is easy to read; minified JSON is smaller on the wire. Paste formatted JSON and compress it for requests, cookies, or embedded configs.",
      steps: [
        "Paste formatted or messy JSON.",
        "Click Minify.",
        "Copy the single-line output into your API client or config.",
      ],
      tips: [
        "Minifying does not change values — only whitespace and formatting.",
        "Invalid JSON cannot be minified until syntax errors are fixed.",
      ],
    },
    faq: [
      {
        question: "Is minified JSON still valid?",
        answer: "Yes. It is the same document without extra spaces and newlines.",
      },
      {
        question: "Can I expand it again?",
        answer: "Use the JSON Formatter tool or studio to pretty-print it.",
      },
    ],
  },
  {
    slug: "json-sort",
    name: "JSON Sort Keys",
    shortName: "JSON Sort",
    description:
      "Recursively sort object keys alphabetically so diffs and reviews stay stable. Arrays keep order; nested objects are sorted too.",
    blurb: "Alphabetical key sort, nested",
    keywords: ["json sort", "sort json keys", "json key order", "normalize json"],
    category: "json",
    guide: {
      heading: "How to sort JSON keys",
      intro:
        "Unstable key order makes code reviews noisy. Sorting keys recursively produces a canonical layout for comparison and storage.",
      steps: [
        "Paste your JSON object or array.",
        "Click Sort keys.",
        "Copy the normalized output for diffs or commits.",
      ],
      tips: [
        "Array item order is preserved; only object keys are sorted.",
        "Sorting does not change values — only key order.",
      ],
    },
    faq: [
      {
        question: "Are nested objects sorted?",
        answer: "Yes. Sorting walks the whole tree.",
      },
      {
        question: "Do arrays get reordered?",
        answer: "No. Array order stays the same.",
      },
    ],
  },
  {
    slug: "json-yaml",
    name: "JSON to YAML",
    shortName: "JSON → YAML",
    description:
      "Convert JSON to readable YAML for Kubernetes, CI configs, and docs. Conversion runs locally in your browser.",
    blurb: "JSON to YAML for configs",
    keywords: ["json to yaml", "yaml converter", "json yaml", "convert json yaml"],
    category: "json",
    guide: {
      heading: "How to convert JSON to YAML",
      intro:
        "Many ops tools prefer YAML. Paste JSON and get indented YAML without installing a CLI.",
      steps: [
        "Paste valid JSON.",
        "Click To YAML.",
        "Copy the YAML into your manifest or config file.",
      ],
      tips: [
        "Strings with special characters are quoted automatically.",
        "Empty objects and arrays become {} and [].",
      ],
    },
    faq: [
      {
        question: "Is YAML uploaded?",
        answer: "No. Conversion is local.",
      },
      {
        question: "Can I convert YAML back to JSON?",
        answer:
          "This page focuses on JSON → YAML. Paste YAML into a dedicated YAML parser if you need the reverse.",
      },
    ],
  },
  {
    slug: "json-csv",
    name: "JSON to CSV",
    shortName: "JSON → CSV",
    description:
      "Turn a JSON array of objects into CSV with unioned headers. Useful for spreadsheets and quick exports.",
    blurb: "Array of objects → CSV table",
    keywords: ["json to csv", "csv converter", "json export csv", "array to csv"],
    category: "json",
    guide: {
      heading: "How to convert JSON to CSV",
      intro:
        "Spreadsheets expect rows. Feed an array of flat objects and export a CSV with a header row built from all keys.",
      steps: [
        "Paste a JSON array of objects.",
        "Click To CSV.",
        "Copy the result into Excel, Sheets, or a .csv file.",
      ],
      tips: [
        "Missing keys become empty cells.",
        "Values with commas or quotes are escaped per CSV rules.",
      ],
    },
    faq: [
      {
        question: "What shape of JSON works?",
        answer: "A non-empty array where every item is an object.",
      },
      {
        question: "Are nested objects supported?",
        answer:
          "Nested values are stringified. Prefer flat objects for clean spreadsheet columns.",
      },
    ],
  },
  {
    slug: "json-diff",
    name: "JSON Diff / Compare",
    shortName: "JSON Diff",
    description:
      "Compare two JSON documents and list path-level changes. Spot missing keys, value edits, and array shifts.",
    blurb: "Path-level left vs right compare",
    keywords: ["json diff", "compare json", "json compare", "json difference"],
    category: "json",
    guide: {
      heading: "How to compare JSON",
      intro:
        "When two API responses disagree, a path list is faster than eye-scanning. Paste left and right JSON to see every change.",
      steps: [
        "Paste the original JSON on the left.",
        "Paste the new JSON on the right.",
        "Click Compare and read the path-level diff.",
      ],
      tips: [
        "Identical documents report “No differences”.",
        "Sort keys first if order-only noise is distracting.",
      ],
    },
    faq: [
      {
        question: "Is this a visual side-by-side merge?",
        answer: "It lists path changes as text so you can copy them into tickets or reviews.",
      },
      {
        question: "Does comparison leave my machine?",
        answer: "No. Diffing runs in the browser.",
      },
    ],
  },
  {
    slug: "json-to-ts",
    name: "JSON to TypeScript",
    shortName: "JSON → TS",
    description:
      "Infer a TypeScript type from a JSON sample. Handy for typing API responses quickly.",
    blurb: "Infer TypeScript type from sample",
    keywords: [
      "json to typescript",
      "json to ts",
      "typescript interface generator",
      "infer type from json",
    ],
    category: "json",
    guide: {
      heading: "How to generate a TypeScript type",
      intro:
        "Paste a representative JSON payload and get a starting `Root` type. Refine unions and optionals by hand for production types.",
      steps: [
        "Paste sample JSON from an API or fixture.",
        "Click To TypeScript.",
        "Copy the type into your project and tighten nullability as needed.",
      ],
      tips: [
        "Arrays infer from the first element — use a rich sample.",
        "Treat output as a draft, not a full schema.",
      ],
    },
    faq: [
      {
        question: "Does it create interfaces or types?",
        answer: "It emits an `export type Root = …` alias.",
      },
      {
        question: "Are optional fields detected?",
        answer:
          "Not automatically. Missing keys in some samples still need manual `?` markers.",
      },
    ],
  },
  {
    slug: "json-escape",
    name: "JSON Escape String",
    shortName: "JSON Escape",
    description:
      "Escape raw text into a JSON string literal — quotes, newlines, and control characters handled for you.",
    blurb: "Escape text as a JSON string",
    keywords: ["json escape", "escape json string", "json stringify", "escape quotes"],
    category: "json",
    guide: {
      heading: "How to escape a JSON string",
      intro:
        "Embedding text inside JSON needs proper escaping. This tool wraps your input with JSON.stringify so quotes and newlines stay valid.",
      steps: [
        "Paste the raw string (not necessarily JSON).",
        "Click Escape.",
        "Copy the quoted JSON string into your document or code.",
      ],
      tips: [
        "Output includes surrounding quotes — that is intentional for JSON strings.",
        "Use the studio Escape action when working on a whole JSON document.",
      ],
    },
    faq: [
      {
        question: "Is this the same as Format?",
        answer:
          "No. Escape turns arbitrary text into one JSON string value; Format pretty-prints a full JSON document.",
      },
      {
        question: "Can I unescape?",
        answer: "Paste a JSON string into a JSON.parse workflow or the JSON studio unescape action.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortName: "JWT Decoder",
    description:
      "Decode JWT header and payload (Base64URL) without verifying the signature. Inspect claims locally.",
    blurb: "Decode header & payload claims",
    keywords: ["jwt decoder", "decode jwt", "jwt debugger", "json web token decode"],
    category: "json",
    guide: {
      heading: "How to decode a JWT",
      intro:
        "JWTs are three Base64URL parts. This decoder shows header and payload as JSON so you can inspect claims — it does not verify signatures.",
      steps: [
        "Paste a JWT (header.payload.signature).",
        "Click Decode JWT.",
        "Read the header and payload JSON.",
      ],
      tips: [
        "Never paste production secrets into untrusted sites; this tool stays local.",
        "Signature verification requires the signing key and is out of scope here.",
      ],
    },
    faq: [
      {
        question: "Does this verify the signature?",
        answer: "No. It only decodes. Treat decoded claims as untrusted until verified.",
      },
      {
        question: "Is the token uploaded?",
        answer: "No. Decoding runs in your browser.",
      },
    ],
  },
  {
    slug: "youtube-thumbnail",
    name: "YouTube Thumbnail Downloader",
    shortName: "YouTube Thumbnail",
    description:
      "Free YouTube thumbnail downloader — grab max-res and HQ cover images from any public video URL. Runs in your browser; does not download video files.",
    blurb: "Free YouTube cover / thumbnail download",
    keywords: [
      "youtube thumbnail downloader",
      "youtube thumbnail",
      "download youtube thumbnail",
      "youtube cover image",
      "yt thumbnail",
    ],
    category: "video",
    guide: {
      heading: "How to download a YouTube thumbnail",
      intro:
        "YouTube publishes public thumbnail images for each video ID. Paste a watch, Shorts, or youtu.be link to list available sizes and open/save the cover — without ripping the video stream.",
      steps: [
        "Paste a YouTube URL or 11-character video ID.",
        "Click Get thumbnails.",
        "Open the size you need and save the image.",
      ],
      tips: [
        "maxresdefault is not available for every video; fall back to hqdefault.",
        "This tool never fetches or saves the MP4/WebM stream.",
      ],
    },
    faq: [
      {
        question: "Can I download the full YouTube video here?",
        answer:
          "No. Full-video rippers violate YouTube terms and often break AdSense policies. Use official YouTube features or content you own.",
      },
      {
        question: "Is the video uploaded to Fluxkit?",
        answer: "No. Only public thumbnail URLs are derived from the video ID in your browser.",
      },
    ],
  },
  {
    slug: "youtube-embed",
    name: "YouTube Embed Code Generator",
    shortName: "YouTube Embed",
    description:
      "Generate a responsive YouTube iframe embed with optional start time. Official embeds only — no unofficial downloaders.",
    blurb: "Official YouTube iframe embed + start time",
    keywords: [
      "youtube embed generator",
      "youtube iframe",
      "embed youtube video",
      "youtube start time",
    ],
    category: "video",
    guide: {
      heading: "How to embed a YouTube video",
      intro:
        "Sites should use YouTube’s official embed player. Paste a link, set an optional start second, and copy the iframe HTML.",
      steps: [
        "Paste the YouTube URL.",
        "Optionally set a start time in seconds.",
        "Click Generate embed and copy the HTML.",
      ],
      tips: [
        "Prefer embeds over downloading when you just need playback on a page.",
        "Respect the creator’s embedding settings — some videos disallow embeds.",
      ],
    },
    faq: [
      {
        question: "Why not a video downloader?",
        answer:
          "Downloading YouTube streams without permission infringes copyright and platform rules. Embeds are the supported way to play videos on other sites.",
      },
    ],
  },
  {
    slug: "tiktok-cover",
    name: "TikTok Cover & Info",
    shortName: "TikTok Cover",
    description:
      "Free TikTok cover image and metadata lookup via official oEmbed. Get title, author, and thumbnail — not an MP4 downloader.",
    blurb: "Free TikTok cover + title via oEmbed",
    keywords: [
      "tiktok thumbnail",
      "tiktok cover download",
      "tiktok oembed",
      "download tiktok cover",
      "tiktok video info",
    ],
    category: "video",
    guide: {
      heading: "How to get a TikTok cover",
      intro:
        "TikTok exposes public oEmbed data for many posts. Paste a public video link to fetch title, author, and cover image. Video file download is intentionally not offered.",
      steps: [
        "Paste a public TikTok video URL.",
        "Click Fetch cover & info.",
        "Open/save the cover image if available.",
      ],
      tips: [
        "Private or region-blocked posts may fail.",
        "Do not use ripper sites if you care about AdSense approval.",
      ],
    },
    faq: [
      {
        question: "Can I download the TikTok video file?",
        answer:
          "No. This tool only uses TikTok’s public oEmbed metadata and cover. Ripping the video violates TikTok terms and copyright rules.",
      },
      {
        question: "Why did fetch fail?",
        answer:
          "The post may be private, deleted, or blocked from oEmbed. Try another public link.",
      },
    ],
  },
  {
    slug: "vimeo-thumbnail",
    name: "Vimeo Thumbnail Downloader",
    shortName: "Vimeo Thumbnail",
    description:
      "Fetch a Vimeo video’s public cover image and title through oEmbed. Free cover download — not a Vimeo stream ripper.",
    blurb: "Free Vimeo cover via oEmbed",
    keywords: ["vimeo thumbnail", "vimeo cover", "download vimeo thumbnail", "vimeo oembed"],
    category: "video",
    guide: {
      heading: "How to get a Vimeo thumbnail",
      intro:
        "Public Vimeo videos expose cover art through oEmbed. Paste a vimeo.com link to preview and save the thumbnail.",
      steps: [
        "Paste a public Vimeo URL.",
        "Click Get Vimeo cover.",
        "Open/save the thumbnail image.",
      ],
      tips: ["Password-protected or private videos will not return oEmbed data."],
    },
    faq: [
      {
        question: "Does this download the Vimeo MP4?",
        answer: "No. Only public cover metadata is fetched.",
      },
    ],
  },
  {
    slug: "video-url-parser",
    name: "Video URL Parser",
    shortName: "Video URL Parser",
    description:
      "Detect platform and extract IDs from YouTube, TikTok, Vimeo, and Bilibili links. Handy before thumbnail or embed tools.",
    blurb: "Parse YouTube / TikTok / Vimeo / Bilibili URLs",
    keywords: [
      "youtube url parser",
      "tiktok url parser",
      "extract youtube id",
      "video link parser",
    ],
    category: "video",
    guide: {
      heading: "How to parse a video URL",
      intro:
        "Paste a share link to see which platform it is and which ID was extracted. Useful when cleaning messy mobile share URLs.",
      steps: ["Paste the URL.", "Click Parse URL.", "Copy the JSON result."],
      tips: ["Short links like youtu.be and vm.tiktok.com are supported when resolvable from the URL itself."],
    },
    faq: [
      {
        question: "Which platforms are supported?",
        answer: "YouTube, TikTok, Vimeo, and Bilibili video URLs.",
      },
    ],
  },
  {
    slug: "local-video-info",
    name: "Local Video File Info",
    shortName: "Local Video Info",
    description:
      "Inspect a video file on your device: duration, resolution, type, and size. Nothing is uploaded — great for checking your own exports.",
    blurb: "Duration & size for files you already own",
    keywords: [
      "video file info",
      "video duration checker",
      "mp4 info",
      "local video metadata",
    ],
    category: "video",
    guide: {
      heading: "How to inspect a local video",
      intro:
        "When you already own the file (exports, screen recordings, licensed stock), check duration and resolution in the browser without uploading.",
      steps: [
        "Click Choose video file.",
        "Pick an MP4, WebM, MOV, or similar from your device.",
        "Read duration, resolution, and size — optionally copy the JSON.",
      ],
      tips: [
        "This is the right tool for videos you created or have rights to use.",
        "Browser codecs may not read every container (some MKV builds fail).",
      ],
    },
    faq: [
      {
        question: "Is my file uploaded?",
        answer: "No. Metadata is read locally via the browser’s video element.",
      },
      {
        question: "Can this pull videos from YouTube?",
        answer: "No. Choose a file that is already on your computer.",
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortName: "Password Generator",
    description:
      "Create strong, random passwords with adjustable length and character sets. Generated with the Web Crypto API.",
    keywords: [
      "password generator",
      "strong password",
      "random password",
      "secure password generator",
    ],
    category: "security",
    guide: {
      heading: "How to create a strong password",
      intro:
        "Reusable or short passwords are easy to guess or crack. A strong password is long, random, and unique for each account. This generator builds passwords in your browser using cryptographically strong randomness from the Web Crypto API.",
      steps: [
        "Choose a length of at least 16 characters for important accounts.",
        "Enable lowercase, uppercase, numbers, and symbols unless a site forbids a character set.",
        "Click Generate until you get a password you can store in a password manager.",
        "Copy once, paste into your password manager, and avoid sending it by chat or email.",
      ],
      tips: [
        "Prefer a password manager over memorizing dozens of unique passwords.",
        "Do not reuse the same password across banking, email, and social accounts.",
        "If a site limits symbols, generate again with fewer character sets rather than shortening length.",
      ],
    },
    faq: [
      {
        question: "Are generated passwords stored?",
        answer:
          "No. Passwords are created locally with crypto.getRandomValues and are never sent to a server.",
      },
      {
        question: "What makes a strong password?",
        answer:
          "Use at least 16 characters with a mix of uppercase, lowercase, numbers, and symbols. Avoid reusing passwords.",
      },
      {
        question: "Is this safer than making one up myself?",
        answer:
          "Usually yes. Humans tend to pick memorable patterns. Random generation removes those patterns.",
      },
    ],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortName: "Word Counter",
    description:
      "Count words, characters, sentences, and reading time as you type. Useful for essays, captions, and drafts with length limits.",
    keywords: [
      "word counter",
      "character counter",
      "word count tool",
      "reading time calculator",
    ],
    category: "text",
    guide: {
      heading: "How to use the word counter",
      intro:
        "Many assignments, forms, and social platforms enforce word or character limits. This counter updates as you type so you can trim or expand before submitting. Reading time uses a simple average suitable for general English prose.",
      steps: [
        "Paste or type your draft into the text area.",
        "Check words, characters (with and without spaces), sentences, and paragraphs.",
        "Use reading time as a rough guide for blog posts, scripts, or study notes.",
        "Edit the text until you meet your limit, then copy it back to your document.",
      ],
      tips: [
        "Platforms count characters differently (for example, some count URLs as fixed lengths).",
        "Sentence detection uses punctuation such as periods, question marks, and exclamation points.",
        "For academic work, follow your instructor’s counting rules if they differ from this tool.",
      ],
    },
    faq: [
      {
        question: "How is reading time calculated?",
        answer:
          "We estimate reading time at about 200 words per minute, a common average for English prose.",
      },
      {
        question: "Does it count spaces?",
        answer:
          "Yes. You get both character counts with and without spaces, plus word and sentence totals.",
      },
      {
        question: "Are hyphenated words counted as one word?",
        answer:
          "Yes. Text split on whitespace treats hyphenated compounds as a single word.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortName: "UUID Generator",
    description:
      "Generate UUID v4 identifiers in bulk for databases, APIs, and testing. Copy one or many with a click.",
    keywords: [
      "uuid generator",
      "guid generator",
      "uuid v4",
      "random uuid",
    ],
    category: "developer",
    guide: {
      heading: "When to use UUID v4",
      intro:
        "A UUID (Universally Unique Identifier) is a 128-bit value often written as 36 characters with hyphens. Version 4 UUIDs are random and are widely used as primary keys, request IDs, and test fixtures when you do not need time-ordered IDs.",
      steps: [
        "Set how many UUIDs you need (up to 100).",
        "Click Generate to create a fresh list.",
        "Copy all IDs for fixtures, seed data, or API examples.",
        "Paste them into your database script, test file, or ticket.",
      ],
      tips: [
        "UUID v4 collision risk is extremely low for normal application volumes.",
        "If you need sortable IDs, consider ULID or UUID v7 instead of v4.",
        "Keep IDs opaque in URLs; do not encode private meaning into them.",
      ],
    },
    faq: [
      {
        question: "Which UUID version is generated?",
        answer:
          "This tool generates UUID version 4 (random) using the browser crypto API when available.",
      },
      {
        question: "Can I generate multiple UUIDs?",
        answer:
          "Yes. Choose how many IDs you need and copy them all at once as a newline-separated list.",
      },
      {
        question: "Is a UUID the same as a GUID?",
        answer:
          "GUID usually refers to Microsoft’s implementation of the same UUID concept. The string format is compatible for most practical uses.",
      },
    ],
  },
  {
    slug: "base64",
    name: "Base64 Encode & Decode",
    shortName: "Base64",
    description:
      "Encode text to Base64 or decode Base64 back to plain text. Useful for tokens, data URIs, and debugging.",
    keywords: [
      "base64 encode",
      "base64 decode",
      "base64 converter",
      "base64 tool",
    ],
    category: "developer",
    guide: {
      heading: "How Base64 encoding works",
      intro:
        "Base64 converts binary or text into a limited alphabet of letters, digits, plus, slash, and padding. It is common in data URLs, basic auth headers, and some API fields. It is transport encoding, not confidentiality.",
      steps: [
        "Paste plain text to encode, or paste a Base64 string to decode.",
        "Click Encode or Decode.",
        "Copy the output into your application, header, or documentation.",
        "If decoding fails, remove line breaks or whitespace and try again.",
      ],
      tips: [
        "Never treat Base64 as encryption; anyone can decode it.",
        "URL-safe Base64 variants replace + and / and may omit padding.",
        "Large binary files are better handled in dedicated offline tools than in a text box.",
      ],
    },
    faq: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is encoding, not encryption. Anyone can decode it. Do not use it to hide secrets.",
      },
      {
        question: "Why do I get an error when decoding?",
        answer:
          "The input may not be valid Base64. Check for missing padding, spaces, or truncated strings.",
      },
      {
        question: "Does this support Unicode text?",
        answer:
          "Yes. Text is converted with URI-safe handling so common Unicode characters survive encode and decode.",
      },
    ],
  },
  {
    slug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    shortName: "Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and back. Supports seconds and milliseconds.",
    keywords: [
      "unix timestamp converter",
      "epoch converter",
      "timestamp to date",
      "epoch time",
    ],
    category: "time",
    guide: {
      heading: "Understanding Unix timestamps",
      intro:
        "A Unix timestamp counts seconds (or milliseconds) since 1970-01-01 00:00:00 UTC, also called the Unix epoch. Logs, databases, and APIs often store time this way because it is compact and timezone-independent.",
      steps: [
        "Paste a timestamp to convert it into local time, UTC, and ISO-8601.",
        "Or enter a date string to get seconds and milliseconds since the epoch.",
        "Use “Use now” when you need the current epoch second quickly.",
        "Copy the ISO or numeric value into logs, queries, or documentation.",
      ],
      tips: [
        "Values with about 13 digits are usually milliseconds; 10 digits are usually seconds.",
        "Always confirm whether an API expects seconds or milliseconds before shipping.",
        "ISO-8601 strings with a Z suffix are UTC; local display still depends on your device timezone.",
      ],
    },
    faq: [
      {
        question: "Seconds or milliseconds?",
        answer:
          "Values with 13+ digits are treated as milliseconds. Shorter values are treated as seconds.",
      },
      {
        question: "What timezone is shown?",
        answer:
          "Results show both your local timezone and UTC so you can compare easily.",
      },
      {
        question: "What is the Unix epoch?",
        answer:
          "It is midnight UTC on 1 January 1970. Positive timestamps count forward from that instant.",
      },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    shortName: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, kebab-case, Title Case, and more in one click.",
    keywords: [
      "case converter",
      "camelcase converter",
      "snake case converter",
      "kebab case",
    ],
    category: "text",
    guide: {
      heading: "Choosing the right text case",
      intro:
        "Naming conventions keep code and filenames consistent. JavaScript often uses camelCase, Python prefers snake_case, and CSS or URLs commonly use kebab-case. This converter splits words on spaces, hyphens, underscores, and case changes, then rebuilds them in the style you select.",
      steps: [
        "Paste a phrase, variable name, or heading.",
        "Select the target case style.",
        "Copy the converted result into your code or document.",
        "Repeat with another style if you need multiple variants for APIs and UI labels.",
      ],
      tips: [
        "camelCase starts lowercase; PascalCase capitalizes every word segment.",
        "UPPER_SNAKE is common for constants and environment variable names.",
        "Title Case is for headings; it is not a programming identifier style.",
      ],
    },
    faq: [
      {
        question: "Which cases are supported?",
        answer:
          "camelCase, PascalCase, snake_case, kebab-case, UPPER_SNAKE, Title Case, and Sentence case.",
      },
      {
        question: "Will it change my meaning?",
        answer:
          "Only separators and letter casing change. Words stay in the same order.",
      },
      {
        question: "How are words detected?",
        answer:
          "The tool splits on spaces, underscores, hyphens, dots, and transitions from lowercase to uppercase.",
      },
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    shortName: "Hash Generator",
    description:
      "Create SHA-1, SHA-256, and SHA-512 hashes from any text using the Web Crypto API. Local and private.",
    keywords: [
      "hash generator",
      "sha256 generator",
      "sha512 hash",
      "checksum tool",
    ],
    category: "security",
    guide: {
      heading: "What a cryptographic hash is for",
      intro:
        "A hash function maps input to a fixed-length digest. The same input always produces the same digest, but you cannot practically reverse a digest back to the original text. Hashes are used for checksums, integrity checks, and content addressing—not for storing recoverable passwords without a proper password-hashing scheme.",
      steps: [
        "Enter the text you want to hash.",
        "Choose SHA-1, SHA-256, or SHA-512.",
        "Copy the hexadecimal digest for comparison or documentation.",
        "Compare digests from two sources to confirm the content matches.",
      ],
      tips: [
        "Prefer SHA-256 or SHA-512 for new designs; SHA-1 is legacy and weaker.",
        "For user passwords, use dedicated algorithms such as Argon2, bcrypt, or scrypt with salting.",
        "Changing even one character produces a completely different digest.",
      ],
    },
    faq: [
      {
        question: "Can I reverse a hash?",
        answer:
          "No. Cryptographic hashes are one-way. This tool is for checksums and verification, not decryption.",
      },
      {
        question: "Which algorithms are available?",
        answer:
          "SHA-1, SHA-256, and SHA-512 via the browser Web Crypto API. Prefer SHA-256 or stronger for new work.",
      },
      {
        question: "Is hashing the same as encryption?",
        answer:
          "No. Encryption is designed to be reversible with a key. Hashing is designed to be one-way.",
      },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encode & Decode",
    shortName: "URL Encoder",
    description:
      "Percent-encode query strings and decode URL-encoded text. Handy when debugging APIs and links.",
    keywords: [
      "url encode",
      "url decode",
      "percent encoding",
      "query string encoder",
    ],
    category: "developer",
    guide: {
      heading: "Why URLs need percent-encoding",
      intro:
        "URLs can only safely carry a limited set of characters. Spaces, ampersands, equals signs, and non-ASCII text must be percent-encoded (for example, space becomes %20) so servers and browsers parse query strings correctly.",
      steps: [
        "Paste the raw query value or full fragment you need to encode.",
        "Click Encode to produce a percent-encoded string.",
        "Or paste an encoded string and click Decode to read it.",
        "Copy the result into your URL, redirect, or API test.",
      ],
      tips: [
        "Encode parameter values; avoid double-encoding an already encoded string.",
        "An ampersand (&) separates parameters—encode it inside values or the query will split incorrectly.",
        "This tool uses encodeURIComponent / decodeURIComponent semantics common in web apps.",
      ],
    },
    faq: [
      {
        question: "When should I URL-encode?",
        answer:
          "Encode reserved characters in query parameters so servers parse them correctly.",
      },
      {
        question: "Is this the same as Base64?",
        answer:
          "No. URL encoding percent-escapes characters for URLs. Base64 is a different binary-to-text scheme.",
      },
      {
        question: "Why did decoding throw an error?",
        answer:
          "Malformed sequences such as a lone % or invalid hex digits cannot be decoded. Fix the string and try again.",
      },
    ],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    shortName: "Lorem Ipsum",
    description:
      "Generate placeholder paragraphs, sentences, or words for mockups and wireframes in seconds.",
    keywords: [
      "lorem ipsum generator",
      "placeholder text",
      "dummy text generator",
      "lorem ipsum",
    ],
    category: "text",
    guide: {
      heading: "Using placeholder text in design",
      intro:
        "Lorem Ipsum is scrambled Latin-like filler used since typesetting days to focus on layout without meaningful copy distracting the eye. Designers and developers use it in wireframes, CMS demos, and print proofs before final writing is ready.",
      steps: [
        "Choose paragraphs, sentences, or words.",
        "Set how much placeholder text you need.",
        "Copy the generated text into your mockup or prototype.",
        "Replace it with real copy before launch so accessibility and translation stay accurate.",
      ],
      tips: [
        "Filler text can hide layout bugs that only appear with short or long real sentences—test both.",
        "Screen readers will read Lorem Ipsum aloud; remove it from production pages.",
        "For locale testing, use realistic sample copy in the target language when possible.",
      ],
    },
    faq: [
      {
        question: "Can I choose paragraph count?",
        answer:
          "Yes. Pick how many paragraphs, sentences, or words you need, then copy the result.",
      },
      {
        question: "Is classic Lorem Ipsum used?",
        answer:
          "Yes. Output is based on the traditional Lorem Ipsum passage used in design and typography.",
      },
      {
        question: "Should Lorem Ipsum stay on a live site?",
        answer:
          "No. Replace placeholder copy before publishing so visitors and search engines see real content.",
      },
    ],
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getRelatedTools(slug: string, limit = 4) {
  const current = getTool(slug);
  if (!current) return tools.slice(0, limit);

  const sameCategory = tools.filter(
    (tool) => tool.slug !== slug && tool.category === current.category,
  );
  const others = tools.filter(
    (tool) => tool.slug !== slug && tool.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
