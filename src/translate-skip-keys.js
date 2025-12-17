/**
 * Skip Keys Example
 *
 * This example demonstrates how to exclude specific keys or patterns
 * from translation - useful for brand names, US state codes, or
 * config values that should remain untranslated.
 *
 * Run: npm run translate:skip-keys
 */

import 'dotenv/config';
import { Shipi18n } from '@shipi18n/api';

const shipi18n = new Shipi18n({
  apiKey: process.env.SHIPI18N_API_KEY,
});

async function main() {
  console.log('Skip Keys Translation Example\n');
  console.log('='.repeat(50));

  // Content with keys that should NOT be translated
  const content = {
    // Regular translatable content
    greeting: 'Hello',
    farewell: 'Goodbye',
    welcome: 'Welcome to our app!',

    // Brand name - should NOT be translated
    brandName: 'Acme Inc',
    company: {
      name: 'Acme Corporation',
      tagline: 'Building the future', // This CAN be translated
    },

    // US State names - should NOT be translated (keep in English)
    states: {
      CA: 'California',
      NY: 'New York',
      TX: 'Texas',
      FL: 'Florida',
    },

    // Config values - some should NOT be translated
    config: {
      api: {
        endpoint: 'https://api.example.com', // Should NOT translate
        timeout: '30 seconds', // CAN be translated
      },
      internal: {
        debug: 'Debug mode enabled', // Should NOT translate
      },
    },
  };

  console.log('\nSource content (English):');
  console.log(JSON.stringify(content, null, 2));

  console.log('\n' + '-'.repeat(50));
  console.log('Translating to Spanish and French...');
  console.log('Skipping: brandName, company.name, states.*, config.api.endpoint, *.internal.*');
  console.log('-'.repeat(50) + '\n');

  try {
    const result = await shipi18n.translateJSON({
      content,
      sourceLanguage: 'en',
      targetLanguages: ['es', 'fr'],
      // Skip exact key paths
      skipKeys: ['brandName', 'company.name', 'config.api.endpoint'],
      // Skip using glob patterns
      skipPaths: ['states.*', '*.internal.*'],
    });

    // Show Spanish result
    console.log('Spanish (es):');
    console.log(JSON.stringify(result.es, null, 2));

    console.log('\n' + '-'.repeat(50) + '\n');

    // Show French result
    console.log('French (fr):');
    console.log(JSON.stringify(result.fr, null, 2));

    // Show skipped keys info
    if (result.skipped) {
      console.log('\n' + '='.repeat(50));
      console.log(`Skipped ${result.skipped.count} key(s) from translation:`);
      result.skipped.keys.forEach((key) => {
        console.log(`  - ${key}`);
      });
    }

    console.log('\n' + '='.repeat(50));
    console.log('Notice how:');
    console.log('  - brandName remains "Acme Inc"');
    console.log('  - company.name remains "Acme Corporation"');
    console.log('  - All state names remain in English');
    console.log('  - config.api.endpoint is untranslated');
    console.log('  - config.internal.debug is untranslated');
    console.log('  - BUT company.tagline IS translated');
    console.log('  - AND config.api.timeout IS translated');
  } catch (error) {
    console.error('Translation failed:', error.message);
    process.exit(1);
  }
}

main();
