import {describe, expect, Mock, test, vi} from 'vitest';
import {RestLoader} from '../src/index.js';

describe('RestLoader', () => {
  const BASE_URL = 'http://localhost:3000/api/fflags/caching';

  global.fetch = vi.fn();

  const createFetchResponse = (data?: any) => ({
    json: () => new Promise((resolve) => resolve(data))
  });

  const expectedFlags = {
    'flag1': {
      'newFeatureAccess': {
        'enabled': true,
        'value': 100
      },
      'oldFeatureAccess': {
        'enabled': false,
        'value': 200
      }
    }
  };

  test('successfully gets the flags from the endpoint', async () => {
    (fetch as Mock).mockResolvedValue(createFetchResponse(expectedFlags));
    const loader = new RestLoader(BASE_URL);
    const fflags = await loader.load('staging');
    expect(fflags?.get('flag1')).eql(expectedFlags.flag1);
  });

  test('should fail trying to get the flags (invalid data)', async () => {
    (fetch as Mock).mockResolvedValue(createFetchResponse());
    const loader = new RestLoader(BASE_URL);
    const fflags = await loader.load('staging');
    expect(fflags).undefined;
  });
});