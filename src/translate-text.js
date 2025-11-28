/**
 * Shipi18n Node.js Example - Text Translation
 *
 * Demonstrates translating plain text strings.
 *
 * Run with: npm run translate:text
 */

import 'dotenv/config';
import { Shipi18n } from '@shipi18n/api';

async function main() {
  const apiKey = process.env.SHIPI18N_API_KEY;
  if (!apiKey || apiKey === 'sk_live_your_api_key_here') {
    console.error('Error: Please set your SHIPI18N_API_KEY in .env file');
    process.exit(1);
  }

  const shipi18n = new Shipi18n({ apiKey });

  console.log('Text Translation Example');
  console.log('========================\n');

  // Single text translation
  const singleText = 'Welcome to our application!';
  console.log(`Single text: "${singleText}"`);
  console.log('Translating to Japanese, Korean, and Chinese...\n');

  try {
    const singleResult = await shipi18n.translateText({
      content: singleText,
      sourceLanguage: 'en',
      targetLanguages: ['ja', 'ko', 'zh'],
    });

    console.log('Results:');
    for (const lang of ['ja', 'ko', 'zh']) {
      const translations = singleResult[lang];
      if (Array.isArray(translations) && translations.length > 0) {
        console.log(`  ${lang}: "${translations[0].translated}"`);
      }
    }

    // Multiple text translation
    console.log('\n---\n');
    const multipleTexts = [
      'Hello, how are you?',
      'Thank you for your purchase.',
      'Please contact support if you need help.',
    ];

    console.log('Multiple texts:');
    multipleTexts.forEach((t, i) => console.log(`  ${i + 1}. "${t}"`));
    console.log('\nTranslating to Spanish...\n');

    const multiResult = await shipi18n.translateText({
      content: multipleTexts,
      sourceLanguage: 'en',
      targetLanguages: ['es'],
    });

    console.log('Spanish translations:');
    const esTranslations = multiResult.es;
    if (Array.isArray(esTranslations)) {
      esTranslations.forEach((t, i) => {
        console.log(`  ${i + 1}. "${t.translated}"`);
      });
    }
  } catch (error) {
    console.error('Translation failed:', error.message);
    process.exit(1);
  }
}

main();
