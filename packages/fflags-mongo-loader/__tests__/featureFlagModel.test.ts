import {describe, expect, test} from 'vitest';
import {FFlagModel} from '../src/index.js';
import {mockedFeatureFlagsInDB} from './featureFlags.mock.js';
import {useMockedDB} from './useMockedDB.mock.js';

describe('FeatureFlagModel', async () => {
  useMockedDB();

  test('toJSON()', async () => {
    const flagToSave = mockedFeatureFlagsInDB[0];
    flagToSave.name = 'flag3';
    const newFFlag = (await FFlagModel.create(flagToSave)).toJSON();
    expect(newFFlag.id).toBeDefined();
    expect(newFFlag.name).eq('flag3');
    expect(newFFlag.environments).eql(flagToSave.environments);
    expect(newFFlag.createdAt).toBeDefined();
    expect(newFFlag.updatedAt).toBeDefined();
  });
});