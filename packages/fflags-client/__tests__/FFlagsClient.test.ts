import {describe, expect, test} from 'vitest';
import {FFlagsClient} from '../src/index.js';
import {fflagsTypes} from '@fflags/types';

describe('FFlagsClient', () => {
  test('start', () => {
    const expected = 'Hello from fflagsClient';
    const actual = FFlagsClient.start();
    expect(actual).eq(expected);
  });

  test('start + fflagsTypes', () => {
    const expected = 'Hello from fflagsClient' + 'Hello from fflagsTypes';
    const actual = FFlagsClient.start() + fflagsTypes();
    expect(actual).eq(expected);
  });
});
