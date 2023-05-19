import {describe, expect, test} from 'vitest';
import {fflagsTypes} from '../src/index.js';

describe('fflagsTypes', () => {
  test('fflagsTypes', () => {
    const expected = 'Hello from fflagsTypes';
    const actual = fflagsTypes();
    expect(actual).eq(expected);
  });
});
