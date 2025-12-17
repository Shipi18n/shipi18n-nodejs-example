# Shipi18n Node.js Example

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub last commit](https://img.shields.io/github/last-commit/Shipi18n/shipi18n-nodejs-example)](https://github.com/Shipi18n/shipi18n-nodejs-example)
[![CI](https://github.com/Shipi18n/shipi18n-nodejs-example/actions/workflows/ci.yml/badge.svg)](https://github.com/Shipi18n/shipi18n-nodejs-example/actions)

A Node.js example demonstrating how to use the [@shipi18n/api](https://www.npmjs.com/package/@shipi18n/api) package to translate i18n files.

> **Get started in 30 seconds**: Sign up at [shipi18n.com](https://shipi18n.com) to get your free API key instantly. No credit card required!

---

## Features

This example demonstrates:

- **JSON translation** - Translate nested JSON objects
- **Text translation** - Translate plain text strings
- **File translation** - Read, translate, and save locale files
- **i18next support** - Full support for namespaces, pluralization, and placeholders
- **Multiple languages** - Translate to many languages in a single API call
- **Skip keys** - Keep brand names, state codes, or config values untranslated

---

## Prerequisites

- Node.js 18+ installed
- Free API key from [shipi18n.com](https://shipi18n.com)

---

## Quick Start

### 1. Get your free API key

Visit [shipi18n.com](https://shipi18n.com) and sign up:

- **Free tier**: 100 translation keys, 3 languages
- **No credit card required**
- **Instant access**

### 2. Clone the repository

```bash
git clone https://github.com/shipi18n/shipi18n-nodejs-example.git
cd shipi18n-nodejs-example
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your API key

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
SHIPI18N_API_KEY=sk_live_your_api_key_here
```

### 5. Run the examples

```bash
# Main example - translate locales/en.json
npm start

# Individual examples
npm run translate:json       # JSON object translation
npm run translate:text       # Plain text translation
npm run translate:file       # File-based translation
npm run translate:i18next    # i18next-style translation
npm run translate:skip-keys  # Skip keys from translation
```

---

## Project Structure

```
shipi18n-nodejs-example/
├── src/
│   ├── index.js               # Main example (translate locale file)
│   ├── translate-json.js      # JSON object translation
│   ├── translate-text.js      # Plain text translation
│   ├── translate-file.js      # File-based translation
│   ├── translate-i18next.js   # i18next-style translation
│   └── translate-skip-keys.js # Skip keys from translation
├── locales/
│   └── en.json                # Sample English locale file
├── output/                    # Generated translation files
├── __tests__/
│   └── shipi18n.test.js       # Test suite
├── .env.example               # Environment template
├── package.json
└── README.md
```

---

## Examples

### JSON Translation

```javascript
import { Shipi18n } from '@shipi18n/api';

const shipi18n = new Shipi18n({
  apiKey: process.env.SHIPI18N_API_KEY,
});

const result = await shipi18n.translateJSON({
  content: {
    greeting: 'Hello',
    farewell: 'Goodbye',
  },
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr', 'de'],
});

console.log(result.es); // { greeting: 'Hola', farewell: 'Adiós' }
console.log(result.fr); // { greeting: 'Bonjour', farewell: 'Au revoir' }
console.log(result.de); // { greeting: 'Hallo', farewell: 'Auf Wiedersehen' }
```

### Text Translation

```javascript
const result = await shipi18n.translateText({
  content: 'Welcome to our application!',
  sourceLanguage: 'en',
  targetLanguages: ['ja', 'ko', 'zh'],
});

// result.ja = [{ original: '...', translated: 'アプリケーションへようこそ！' }]
```

### i18next Translation with Pluralization

```javascript
const result = await shipi18n.translateI18next({
  content: {
    common: {
      welcome: 'Welcome, {{name}}!',
      items_one: 'You have {{count}} item',
      items_other: 'You have {{count}} items',
    },
  },
  sourceLanguage: 'en',
  targetLanguages: ['es', 'ru'],
});

// Spanish (2 plural forms)
console.log(result.es.common.items_one);   // 'Tienes {{count}} artículo'
console.log(result.es.common.items_other); // 'Tienes {{count}} artículos'

// Russian (4 plural forms - automatically generated!)
console.log(result.ru.common.items_one);   // '{{count}} элемент'
console.log(result.ru.common.items_few);   // '{{count}} элемента'
console.log(result.ru.common.items_many);  // '{{count}} элементов'
console.log(result.ru.common.items_other); // '{{count}} элементов'
```

### File Translation

```javascript
import { readFile, writeFile } from 'fs/promises';

// Read source file
const sourceContent = await readFile('locales/en.json', 'utf-8');
const sourceJSON = JSON.parse(sourceContent);

// Translate
const result = await shipi18n.translateJSON({
  content: sourceJSON,
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr', 'de'],
});

// Save translated files
for (const lang of ['es', 'fr', 'de']) {
  await writeFile(`locales/${lang}.json`, JSON.stringify(result[lang], null, 2));
}
```

### Skip Keys from Translation

Keep brand names, US state codes, or config values untranslated:

```javascript
const result = await shipi18n.translateJSON({
  content: {
    greeting: 'Hello',
    brandName: 'Acme Inc',
    states: {
      CA: 'California',
      NY: 'New York',
      TX: 'Texas',
    },
    config: {
      api: { key: 'abc123', secret: 'xyz789' },
    },
  },
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr'],
  // Skip exact key paths
  skipKeys: ['brandName', 'config.api.secret'],
  // Skip using glob patterns
  skipPaths: ['states.*'],
});

// Skipped keys remain in English:
console.log(result.es.brandName);     // 'Acme Inc' (unchanged)
console.log(result.es.states.CA);     // 'California' (unchanged)
console.log(result.es.greeting);      // 'Hola' (translated)

// Check what was skipped:
if (result.skipped) {
  console.log(`Skipped ${result.skipped.count} keys:`, result.skipped.keys);
  // Skipped 5 keys: ['brandName', 'states.CA', 'states.NY', 'states.TX', 'config.api.secret']
}
```

**Pattern Matching:**
| Pattern | Matches |
|---------|---------|
| `states.CA` | Exact path only |
| `states.*` | `states.CA`, `states.NY`, `states.TX` (single level) |
| `config.*.secret` | `config.api.secret`, `config.db.secret` |
| `**.internal` | Any path ending with `.internal` |

---

## Placeholder Preservation

Shipi18n automatically preserves placeholders in your translations:

| Format | Example | Preserved |
|--------|---------|-----------|
| i18next | `{{name}}`, `{{count}}` | Yes |
| React Intl | `{name}`, `{count}` | Yes |
| Printf | `%s`, `%d`, `%@` | Yes |
| Ruby | `%{name}` | Yes |

```javascript
const result = await shipi18n.translateJSON({
  content: { greeting: 'Hello, {{name}}! You have {{count}} messages.' },
  sourceLanguage: 'en',
  targetLanguages: ['es'],
  preservePlaceholders: true, // default: true
});

// result.es = { greeting: 'Hola, {{name}}! Tienes {{count}} mensajes.' }
```

---

## Supported Languages

Over 100 languages supported. Common codes:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `zh` | Chinese |
| `ja` | Japanese |
| `ko` | Korean |
| `ar` | Arabic |
| `ru` | Russian |
| `hi` | Hindi |

---

## Error Handling

```javascript
import { Shipi18n, Shipi18nError } from '@shipi18n/api';

try {
  const result = await shipi18n.translateJSON({ ... });
} catch (error) {
  if (error instanceof Shipi18nError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
    console.error(`Code: ${error.code}`);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `MISSING_API_KEY` | API key not provided |
| `INVALID_API_KEY` | API key is invalid |
| `QUOTA_EXCEEDED` | Monthly limit reached |
| `RATE_LIMITED` | Too many requests |
| `TIMEOUT` | Request timed out |
| `NETWORK_ERROR` | Connection failed |

---

## Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## Pricing

| Tier | Price | Keys | Languages | Rate Limit |
|------|-------|------|-----------|------------|
| **FREE** | $0/mo | 100 | 3 | 10 req/min |
| **STARTER** | $9/mo | 500 | 10 | 60 req/min |
| **PRO** | $29/mo | 10,000 | 100+ | 300 req/min |

---

## Documentation & Resources

📚 **Full Documentation:** [shipi18n.com/integrations/nodejs](https://shipi18n.com/integrations/nodejs)

| Resource | Link |
|----------|------|
| **Getting Started** | [shipi18n.com](https://shipi18n.com) |
| **API Reference** | [shipi18n.com/api](https://shipi18n.com/api) |
| **i18next Best Practices** | [shipi18n.com/integrations/react](https://shipi18n.com/integrations/react) |
| **Blog & Tutorials** | [shipi18n.com/blog](https://shipi18n.com/blog) |

---

## Related Packages

| Package | Description |
|---------|-------------|
| [@shipi18n/api](https://www.npmjs.com/package/@shipi18n/api) | Node.js SDK for programmatic use |
| [@shipi18n/cli](https://www.npmjs.com/package/@shipi18n/cli) | CLI tool for translating files |
| [vite-plugin-shipi18n](https://www.npmjs.com/package/vite-plugin-shipi18n) | Vite plugin for build-time translation |
| [i18next-shipi18n-backend](https://www.npmjs.com/package/i18next-shipi18n-backend) | i18next backend for dynamic loading |
| [shipi18n-github-action](https://github.com/marketplace/actions/shipi18n-auto-translate) | GitHub Action for CI/CD |

## Other Examples

- [Vue Example](https://github.com/Shipi18n/shipi18n-vue-example) - Vue 3 + vue-i18n integration

---

## License

MIT License

---

<p align="center">
  <a href="https://shipi18n.com">shipi18n.com</a> ·
  <a href="https://github.com/Shipi18n">GitHub</a> ·
  <a href="https://shipi18n.com/pricing">Pricing</a>
</p>
