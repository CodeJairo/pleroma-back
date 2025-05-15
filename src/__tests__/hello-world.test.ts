import { describe, test, expect } from '@jest/globals';

describe('Hello World', () => {
  test('should return "Hello, World!"', () => {
    expect('Hello, World!').toBe('Hello, World!');
  });
});
