/**
 * Shipi18n Node.js Example - Main Entry Point
 *
 * This example demonstrates how to use the @shipi18n/api package
 * to translate i18n files in a Node.js application.
 *
 * Run with: npm start
 */

import 'dotenv/config';
import { Shipi18n } from '@shipi18n/api';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, '..', 'locales');
const outputDir = join(__dirname, '..', 'output');

async function main() {
  // Validate API key
  const apiKey = process.env.SHIPI18N_API_KEY;
  if (!apiKey || apiKey === 'sk_live_your_api_key_here') {
    console.error('Error: Please set your SHIPI18N_API_KEY in .env file');
    console.error('Get your free API key at https://shipi18n.com');
    process.exit(1);
  }

  // Initialize the client
  const shipi18n = new Shipi18n({
    apiKey,
    baseUrl: process.env.SHIPI18N_API_URL || 'https://ydjkwckq3f.execute-api.us-east-1.amazonaws.com',
  });

  console.log('Shipi18n Node.js Example');
  console.log('========================\n');

  try {
    // Read the source locale file
    const sourceFile = join(localesDir, 'en.json');
    const sourceContent = await readFile(sourceFile, 'utf-8');
    const sourceJSON = JSON.parse(sourceContent);

    console.log('Source file: locales/en.json');
    console.log(`Keys to translate: ${countKeys(sourceJSON)}`);
    console.log('Target languages: Spanish (es), French (fr), German (de)\n');

    // Translate to multiple languages
    console.log('Translating...\n');

    const result = await shipi18n.translateJSON({
      content: sourceJSON,
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr', 'de'],
      preservePlaceholders: true,
      enablePluralization: true,
    });

    // Create output directory
    await mkdir(outputDir, { recursive: true });

    // Save translated files
    const languages = ['es', 'fr', 'de'];
    for (const lang of languages) {
      if (result[lang]) {
        const outputFile = join(outputDir, `${lang}.json`);
        await writeFile(outputFile, JSON.stringify(result[lang], null, 2));
        console.log(`Saved: output/${lang}.json`);
      }
    }

    console.log('\nTranslation complete!');
    console.log('\nSample translations (Spanish):');
    console.log('------------------------------');

    const esResult = result.es;
    if (esResult && typeof esResult === 'object') {
      const common = esResult.common;
      if (common && typeof common === 'object') {
        console.log(`welcome: "${common.welcome}"`);
        console.log(`goodbye: "${common.goodbye}"`);
      }
      const dashboard = esResult.dashboard;
      if (dashboard && typeof dashboard === 'object') {
        console.log(`greeting: "${dashboard.greeting}"`);
        console.log(`items_one: "${dashboard.items_one}"`);
        console.log(`items_other: "${dashboard.items_other}"`);
      }
    }

    // Show warnings if any
    if (result.warnings && Array.isArray(result.warnings) && result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((w) => console.log(`  - ${w.message}`));
    }

    // Show namespace info if detected
    if (result.namespaceInfo) {
      console.log('\nNamespace Info:');
      console.log(`  Detected: ${result.namespaceInfo.detected}`);
      if (result.namespaceInfo.namespaces) {
        console.log('  Namespaces:');
        result.namespaceInfo.namespaces.forEach((ns) => {
          console.log(`    - ${ns.name}: ${ns.keyCount} keys`);
        });
      }
    }
  } catch (error) {
    console.error('Translation failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

function countKeys(obj, count = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count = countKeys(obj[key], count);
    } else {
      count++;
    }
  }
  return count;
}

main();
