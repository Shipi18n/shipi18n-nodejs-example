/**
 * Shipi18n Node.js Example - File Translation
 *
 * Demonstrates reading a JSON file, translating it, and saving the results.
 *
 * Run with: npm run translate:file
 */

import 'dotenv/config';
import { Shipi18n } from '@shipi18n/api';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const apiKey = process.env.SHIPI18N_API_KEY;
  if (!apiKey || apiKey === 'sk_live_your_api_key_here') {
    console.error('Error: Please set your SHIPI18N_API_KEY in .env file');
    process.exit(1);
  }

  const shipi18n = new Shipi18n({ apiKey });

  console.log('File Translation Example');
  console.log('========================\n');

  // Configuration
  const inputFile = process.argv[2] || join(__dirname, '..', 'locales', 'en.json');
  const targetLanguages = process.argv[3]?.split(',') || ['es', 'fr', 'de'];
  const outputDir = join(__dirname, '..', 'output');

  console.log(`Input file: ${basename(inputFile)}`);
  console.log(`Target languages: ${targetLanguages.join(', ')}`);
  console.log(`Output directory: output/\n`);

  try {
    // Read source file
    const sourceContent = await readFile(inputFile, 'utf-8');
    const sourceJSON = JSON.parse(sourceContent);

    console.log('Translating...');
    const startTime = Date.now();

    // Translate
    const result = await shipi18n.translateJSON({
      content: sourceJSON,
      sourceLanguage: 'en',
      targetLanguages,
      preservePlaceholders: true,
      enablePluralization: true,
    });

    const duration = Date.now() - startTime;
    console.log(`Completed in ${duration}ms\n`);

    // Create output directory
    await mkdir(outputDir, { recursive: true });

    // Save translated files
    console.log('Saved files:');
    for (const lang of targetLanguages) {
      if (result[lang]) {
        const outputFile = join(outputDir, `${lang}.json`);
        await writeFile(outputFile, JSON.stringify(result[lang], null, 2));
        console.log(`  - output/${lang}.json`);
      }
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('Translation failed:', error.message);
    process.exit(1);
  }
}

main();
