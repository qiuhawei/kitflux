export type ToolCategory = "ai" | "text" | "developer" | "security" | "time";

export type ToolDefinition = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  keywords: string[];
  category: ToolCategory;
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
    label: "AI",
    description: "Token estimates, prompts, and API cost planning",
  },
  text: {
    label: "Text",
    description: "Count, transform, and generate text",
  },
  developer: {
    label: "Developer",
    description: "Format, encode, and inspect data",
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

export const tools: ToolDefinition[] = [
  {
    slug: "ai-token-counter",
    name: "AI Token Counter",
    shortName: "AI Token Counter",
    description:
      "Estimate tokens for ChatGPT, Claude, and Gemini prompts in your browser. Plan context length before you hit send.",
    keywords: [
      "ai token counter",
      "chatgpt token counter",
      "claude token count",
      "openai tokenizer",
      "prompt token calculator",
    ],
    category: "ai",
    guide: {
      heading: "How to estimate AI tokens",
      intro:
        "Large language models bill and limit usage by tokens, not words. Exact counts depend on each model’s tokenizer. This tool gives a fast browser-side estimate so you can budget prompts and replies.",
      steps: [
        "Paste your prompt or the model’s reply into the box.",
        "Pick the model family that best matches what you use.",
        "Read the estimated token count, words, and characters.",
        "Shorten the prompt if you are near a context limit.",
      ],
      tips: [
        "English text is often ~4 characters per token for GPT-style models; other languages can differ.",
        "System prompts and tool schemas also consume tokens in real APIs.",
        "For billing-critical work, verify with the vendor’s official tokenizer.",
      ],
    },
    faq: [
      {
        question: "Is this the official OpenAI tokenizer?",
        answer:
          "No. It is an approximation that runs locally. Official libraries may return a slightly different number.",
      },
      {
        question: "Does my text get uploaded?",
        answer:
          "No. Counting happens in your browser. Nothing is sent to our servers for this tool.",
      },
      {
        question: "Why estimate tokens at all?",
        answer:
          "Token limits and API pricing are based on tokens. Estimating early prevents truncated answers and surprise bills.",
      },
    ],
  },
  {
    slug: "prompt-builder",
    name: "AI Prompt Builder",
    shortName: "Prompt Builder",
    description:
      "Build clear ChatGPT and Claude prompts from templates — role, task, constraints, and output format in one click.",
    keywords: [
      "prompt generator",
      "chatgpt prompt template",
      "ai prompt builder",
      "prompt engineering tool",
      "claude prompt",
    ],
    category: "ai",
    guide: {
      heading: "How to build a stronger prompt",
      intro:
        "Vague prompts get vague answers. A reliable pattern is role + task + input + constraints + output format. This builder fills that structure so you can paste straight into ChatGPT, Claude, or Gemini.",
      steps: [
        "Choose a template (rewrite, explain, code review, or SEO outline).",
        "Add your topic or paste the source text.",
        "Optionally add constraints such as tone or length.",
        "Copy the finished prompt into your AI chat or API.",
      ],
      tips: [
        "Be specific about the audience and the forbidden behaviors (for example: no fluff).",
        "Ask for a format you can reuse: bullets, JSON, or a table.",
        "Iterate: keep what worked and tighten one constraint at a time.",
      ],
    },
    faq: [
      {
        question: "Will this call an AI model for me?",
        answer:
          "No. It only builds the prompt text locally. You paste it into ChatGPT or another model yourself.",
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
    ],
  },
  {
    slug: "ai-cost-calculator",
    name: "AI API Cost Calculator",
    shortName: "AI Cost Calculator",
    description:
      "Estimate OpenAI and Claude-style API costs from input/output tokens and request volume. Plan budgets before you ship.",
    keywords: [
      "openai cost calculator",
      "chatgpt api pricing calculator",
      "claude api cost",
      "llm cost estimator",
      "token pricing calculator",
    ],
    category: "ai",
    guide: {
      heading: "How to estimate LLM API spend",
      intro:
        "API bills scale with tokens and traffic. Use this calculator with your expected prompt and completion sizes to forecast cost per day or per feature launch.",
      steps: [
        "Select a model price tier closest to what you use.",
        "Enter average input and output tokens per request.",
        "Set how many requests you expect.",
        "Read total cost, input/output split, and cost per request.",
      ],
      tips: [
        "Cache repeated prompts and shorten system instructions to cut input tokens.",
        "Cheaper models are often enough for classification and drafts.",
        "Prices change — treat results as planning estimates, not invoices.",
      ],
    },
    faq: [
      {
        question: "Are these official live prices?",
        answer:
          "They are approximate list prices for planning. Always confirm on the provider’s pricing page before budgeting.",
      },
      {
        question: "Does this include image or fine-tuning fees?",
        answer:
          "No. It focuses on text input/output token pricing for chat-style APIs.",
      },
      {
        question: "How do I know my token counts?",
        answer:
          "Use our AI Token Counter on sample prompts, or log usage from your API dashboard.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortName: "JSON Formatter",
    description:
      "Paste messy JSON and instantly format, minify, or validate it. Runs entirely in your browser — nothing is uploaded.",
    keywords: [
      "json formatter",
      "json validator",
      "pretty print json",
      "minify json",
      "json beautifier",
    ],
    category: "developer",
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
