/**
 * Shipi18n Node.js Example - i18next Translation
 *
 * Demonstrates translating i18next-style JSON with:
 * - Namespaces (common, auth, etc.)
 * - Pluralization (_one, _other suffixes)
 * - Placeholders ({{name}}, {{count}})
 * - ICU MessageFormat
 *
 * Run with: npm run translate:i18next
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

  console.log('i18next Translation Example');
  console.log('===========================\n');

  // i18next-style content with namespaces and pluralization
  const content = {
    common: {
      welcome: 'Welcome, {{name}}!',
      items_one: 'You have {{count}} item in your cart',
      items_other: 'You have {{count}} items in your cart',
      save: 'Save',
      cancel: 'Cancel',
    },
    checkout: {
      title: 'Checkout',
      total: 'Total: {{amount}}',
      shipping: 'Shipping to {{address}}',
      payment: 'Payment method',
      complete: 'Complete purchase',
    },
    errors: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      minLength: 'Must be at least {{min}} characters',
    },
  };

  console.log('Source (i18next format):');
  console.log(JSON.stringify(content, null, 2));
  console.log('\nTranslating to Spanish (es) and Russian (ru)...');
  console.log('(Russian has more plural forms: one, few, many, other)\n');

  try {
    const result = await shipi18n.translateI18next({
      content,
      sourceLanguage: 'en',
      targetLanguages: ['es', 'ru'],
    });

    console.log('Spanish (es):');
    console.log(JSON.stringify(result.es, null, 2));

    console.log('\nRussian (ru):');
    console.log(JSON.stringify(result.ru, null, 2));

    // Show namespace detection info
    if (result.namespaceInfo) {
      console.log('\nNamespace Detection:');
      console.log(`  Detected: ${result.namespaceInfo.detected}`);
      if (result.namespaceInfo.namespaces) {
        result.namespaceInfo.namespaces.forEach((ns) => {
          console.log(`  - ${ns.name}: ${ns.keyCount} keys`);
        });
      }
    }

    // Note about Russian pluralization
    console.log('\nNote: Russian uses 4 plural forms:');
    console.log('  - one: 1, 21, 31... (1 элемент)');
    console.log('  - few: 2-4, 22-24... (2 элемента)');
    console.log('  - many: 5-20, 25-30... (5 элементов)');
    console.log('  - other: decimals (1.5 элементов)');
  } catch (error) {
    console.error('Translation failed:', error.message);
    process.exit(1);
  }
}

main();
