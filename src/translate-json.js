/**
 * Shipi18n Node.js Example - JSON Translation
 *
 * Demonstrates translating a JSON object with nested structure.
 *
 * Run with: npm run translate:json
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

  console.log('JSON Translation Example');
  console.log('========================\n');

  const content = {
    greeting: 'Hello',
    farewell: 'Goodbye',
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save changes',
    },
    messages: {
      success: 'Your changes have been saved',
      error: 'Something went wrong',
    },
  };

  console.log('Source JSON:');
  console.log(JSON.stringify(content, null, 2));
  console.log('\nTranslating to Spanish and French...\n');

  try {
    const result = await shipi18n.translateJSON({
      content,
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr'],
    });

    console.log('Spanish (es):');
    console.log(JSON.stringify(result.es, null, 2));

    console.log('\nFrench (fr):');
    console.log(JSON.stringify(result.fr, null, 2));
  } catch (error) {
    console.error('Translation failed:', error.message);
    process.exit(1);
  }
}

main();
