import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import {FeatureFlags, UserGroups} from '@fflags/types';
import {MongoDBLoader} from '../src/index.js';
import {mockedFeatureFlagsInDB, populateMockDB} from './featureFlags.mock.js';

describe('MongoDBLoader', async () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await populateMockDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  const runGroupTest = (actualGroups: UserGroups, expectedGroups: UserGroups) => {
    expect(actualGroups).toBeDefined();
    expect(actualGroups.newFeatureAccess).toBeDefined();
    expect(actualGroups.newFeatureAccess.enabled).eq(expectedGroups.newFeatureAccess.enabled);
    expect(actualGroups.newFeatureAccess.value).eql(expectedGroups.newFeatureAccess.value);
    expect(actualGroups.oldFeatureAccess).toBeDefined();
    expect(actualGroups.oldFeatureAccess.enabled).eq(expectedGroups.oldFeatureAccess.enabled);
    expect(actualGroups.oldFeatureAccess.value).eql(expectedGroups.oldFeatureAccess.value);
  };

  test('should load correctly from production', async () => {
    const flags: FeatureFlags = await MongoDBLoader.load('production');
    expect(flags.size).eq(2);
    runGroupTest(flags.get('flag1'), mockedFeatureFlagsInDB[0].environments.production.userGroups);
    runGroupTest(flags.get('flag2'), mockedFeatureFlagsInDB[1].environments.production.userGroups);
  });

  test('should load correctly from staging', async () => {
    const flags: FeatureFlags = await MongoDBLoader.load('staging');
    expect(flags.size).eq(2);
    runGroupTest(flags.get('flag1'), mockedFeatureFlagsInDB[0].environments.staging.userGroups);
    runGroupTest(flags.get('flag2'), mockedFeatureFlagsInDB[1].environments.staging.userGroups);
  });
});