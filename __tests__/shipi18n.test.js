/**
 * Tests for Shipi18n Node.js Example
 *
 * These tests verify the example code patterns and @shipi18n/api usage.
 * Note: Tests use mocked API responses to avoid actual API calls.
 */

import { jest } from '@jest/globals';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Shipi18n API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('translateJSON', () => {
    it('should translate JSON content to multiple languages', async () => {
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          es: { greeting: 'Hola', farewell: 'Adiós' },
          fr: { greeting: 'Bonjour', farewell: 'Au revoir' },
        }),
      });

      // Dynamic import to get fresh module with mocked fetch
      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateJSON({
        content: { greeting: 'Hello', farewell: 'Goodbye' },
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr'],
      });

      expect(result.es).toEqual({ greeting: 'Hola', farewell: 'Adiós' });
      expect(result.fr).toEqual({ greeting: 'Bonjour', farewell: 'Au revoir' });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should preserve nested structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          es: {
            common: { welcome: 'Bienvenido' },
            auth: { login: 'Iniciar sesión' },
          },
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateJSON({
        content: {
          common: { welcome: 'Welcome' },
          auth: { login: 'Log in' },
        },
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(result.es.common).toEqual({ welcome: 'Bienvenido' });
      expect(result.es.auth).toEqual({ login: 'Iniciar sesión' });
    });

    it('should preserve placeholders', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          es: { greeting: 'Hola, {{name}}!' },
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateJSON({
        content: { greeting: 'Hello, {{name}}!' },
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        preservePlaceholders: true,
      });

      expect(result.es.greeting).toBe('Hola, {{name}}!');
    });
  });

  describe('translateText', () => {
    it('should translate single text string', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          es: [{ original: 'Hello', translated: 'Hola' }],
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateText({
        content: 'Hello',
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(result.es[0].translated).toBe('Hola');
    });

    it('should translate array of texts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          es: [
            { original: 'Hello', translated: 'Hola' },
            { original: 'Goodbye', translated: 'Adiós' },
          ],
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateText({
        content: ['Hello', 'Goodbye'],
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(result.es).toHaveLength(2);
      expect(result.es[0].translated).toBe('Hola');
      expect(result.es[1].translated).toBe('Adiós');
    });
  });

  describe('translateI18next', () => {
    it('should handle pluralization', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ru: {
            items_one: '{{count}} элемент',
            items_few: '{{count}} элемента',
            items_many: '{{count}} элементов',
            items_other: '{{count}} элементов',
          },
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      const result = await client.translateI18next({
        content: {
          items_one: '{{count}} item',
          items_other: '{{count}} items',
        },
        sourceLanguage: 'en',
        targetLanguages: ['ru'],
      });

      // Russian should have more plural forms
      expect(result.ru.items_one).toBeDefined();
      expect(result.ru.items_few).toBeDefined();
      expect(result.ru.items_many).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error for missing API key', async () => {
      const { Shipi18n } = await import('@shipi18n/api');

      expect(() => new Shipi18n({ apiKey: '' })).toThrow();
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          message: 'Invalid API key',
          code: 'INVALID_API_KEY',
        }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'invalid-key' });

      await expect(
        client.translateJSON({
          content: { greeting: 'Hello' },
          sourceLanguage: 'en',
          targetLanguages: ['es'],
        })
      ).rejects.toThrow('Invalid API key');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      await expect(
        client.translateJSON({
          content: { greeting: 'Hello' },
          sourceLanguage: 'en',
          targetLanguages: ['es'],
        })
      ).rejects.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should use default base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ es: {} }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'test-api-key' });

      await client.translateJSON({
        content: {},
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.shipi18n.com'),
        expect.any(Object)
      );
    });

    it('should use custom base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ es: {} }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.api.com',
      });

      await client.translateJSON({
        content: {},
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.api.com'),
        expect.any(Object)
      );
    });

    it('should send API key in headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ es: {} }),
      });

      const { Shipi18n } = await import('@shipi18n/api');
      const client = new Shipi18n({ apiKey: 'my-secret-key' });

      await client.translateJSON({
        content: {},
        sourceLanguage: 'en',
        targetLanguages: ['es'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-api-key': 'my-secret-key',
          }),
        })
      );
    });
  });
});

describe('Utility Functions', () => {
  describe('countKeys', () => {
    // Test the countKeys function pattern used in index.js
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

    it('should count flat object keys', () => {
      expect(countKeys({ a: 1, b: 2, c: 3 })).toBe(3);
    });

    it('should count nested object keys', () => {
      const obj = {
        common: { a: 1, b: 2 },
        auth: { c: 3 },
      };
      expect(countKeys(obj)).toBe(3);
    });

    it('should count deeply nested keys', () => {
      const obj = {
        level1: {
          level2: {
            level3: { a: 1 },
          },
          b: 2,
        },
        c: 3,
      };
      expect(countKeys(obj)).toBe(3);
    });

    it('should return 0 for empty object', () => {
      expect(countKeys({})).toBe(0);
    });
  });
});
