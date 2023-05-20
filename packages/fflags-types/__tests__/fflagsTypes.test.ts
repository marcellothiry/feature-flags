import {beforeAll, describe, expect, test} from 'vitest';
import {FeatureFlagContent, FeatureFlags, FlagName, UserGroupName, UserGroups} from '../src/index.js';

describe('fflagsTypes', () => {
  let flags: FeatureFlags;

  const mockUserGroups = (newAcess: boolean, oldAccess: boolean): UserGroups => ({
    newFeatureAccess: {
      enabled: newAcess,
    },
    oldFeatureAccess: {
      enabled: oldAccess,
    },
  });

  const mockFeatureFlags = (): FeatureFlags => {
    const flags: FeatureFlags = new Map<FlagName, UserGroups>();
    flags.set('flag1', mockUserGroups(true, false));
    flags.set('flag2', mockUserGroups(false, true));
    return flags;
  };

  const getFlag = (flagName: FlagName, userGroupName: UserGroupName): FeatureFlagContent | undefined => {
    const groups = flags.get(flagName);
    return groups ? groups[userGroupName] : undefined;
  };

  beforeAll(() => {
    flags = mockFeatureFlags();
  });

  test('should retrieve an existing flag from the cached data', () => {
    const actual1 = getFlag('flag1', 'newFeatureAccess');
    const actual2 = getFlag('flag1', 'oldFeatureAccess');
    const actual3 = getFlag('flag2', 'newFeatureAccess');
    const actual4 = getFlag('flag2', 'oldFeatureAccess');
    expect(actual1).eql({enabled: true});
    expect(actual2).eql({enabled: false});
    expect(actual3).eql({enabled: false});
    expect(actual4).eql({enabled: true});
  });

  test('should fail to retrieve a non-existing flag from the cached data', () => {
    const actual1 = getFlag('flag', 'newFeatureAccess');
    const actual2 = getFlag('flag', 'oldFeatureAccess');
    expect(actual1).undefined;
    expect(actual2).undefined;
  });

  test('should fail to retrieve a flag using a non-existent group', () => {
    const actual1 = getFlag('flag1', 'featureAccess');
    const actual2 = getFlag('flag1', 'featureAccess');
    expect(actual1).undefined;
    expect(actual2).undefined;
  });
});
