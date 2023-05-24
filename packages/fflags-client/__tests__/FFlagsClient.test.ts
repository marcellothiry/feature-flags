import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi} from 'vitest';
import {FFlagsClient} from '../src/index.js';
import {
  EnvironmentName,
  FeatureFlagContent,
  FeatureFlags,
  FeatureFlagsSwitchParams,
  FlagName,
  UserGroups
} from '@fflags/types';

describe('FFlagsClient', () => {
  describe('Refresh interval', () => {
    const FIVE_SECONDS = 5000;
    let mockLoader;

    beforeAll(() => {
      vi.useFakeTimers();
    });

    beforeEach(() => {
      mockLoader = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    test('should call the loader according to the provided interval', async () => {
      const client = await FFlagsClient.start({
        environmentName: 'staging',
        autoRefresh: true,
        refreshIntervalInSeconds: 5,
        featureFlagsLoader: mockLoader
      });
      expect(mockLoader.mock.calls.length).eq(1);
      vi.advanceTimersByTime(FIVE_SECONDS);
      expect(mockLoader.mock.calls.length).eq(2);
      vi.advanceTimersByTime(FIVE_SECONDS);
      expect(mockLoader.mock.calls.length).eq(3);
      client.stop();
    });

    test('should call the loader just once', async () => {
      const client = await FFlagsClient.start({
        environmentName: 'staging',
        autoRefresh: false,
        featureFlagsLoader: mockLoader
      });
      expect(mockLoader.mock.calls.length).eq(1);
      vi.advanceTimersByTime(FIVE_SECONDS);
      expect(mockLoader.mock.calls.length).eq(1);
      client.stop();
    });
  });

  describe('Flag management', () => {
    let client: FFlagsClient;

    const mockUserGroups = (newAccess: boolean, oldAccess: boolean): UserGroups => ({
      newFeatureAccess: {
        enabled: newAccess,
        value: {a: true, b: 'newAccess'},
      },
      oldFeatureAccess: {
        enabled: oldAccess,
        value: {a: false, b: 'oldAccess'},
      },
    });

    const mockLoader = async (_environmentName: EnvironmentName): Promise<FeatureFlags> => {
      const flags: FeatureFlags = new Map<FlagName, UserGroups>();
      flags.set('flag1', mockUserGroups(true, false));
      flags.set('flag2', mockUserGroups(false, true));
      return flags;
    };

    beforeAll(async () => {
      client = await FFlagsClient.start({
        environmentName: 'staging',
        autoRefresh: false,
        featureFlagsLoader: mockLoader
      });
    });

    describe('getFlag', () => {
      test('should get the flag for the newFeatureAccess group', () => {
        const actualFlag1 = client.getFlag('flag1', 'newFeatureAccess');
        const actualFlag2 = client.getFlag('flag2', 'newFeatureAccess');
        expect(actualFlag1?.enabled).true;
        expect(actualFlag2?.enabled).false;
        expect(actualFlag1?.value).eql({a: true, b: 'newAccess'});
        expect(actualFlag2?.value).eql({a: true, b: 'newAccess'});
      });

      test('should get the flag for the oldFeatureAccess group', () => {
        const actualFlag1 = client.getFlag('flag1', 'oldFeatureAccess');
        const actualFlag2 = client.getFlag('flag2', 'oldFeatureAccess');
        expect(actualFlag1?.enabled).false;
        expect(actualFlag2?.enabled).true;
        expect(actualFlag1?.value).eql({a: false, b: 'oldAccess'});
        expect(actualFlag2?.value).eql({a: false, b: 'oldAccess'});
      });

      test('should fail to get the flag for a non-existent name', () => {
        const actualFlag = client.getFlag('flag', 'oldFeatureAccess');
        expect(actualFlag).undefined;
      });

      test('should fail to get the flag for a non-existent group', () => {
        const actualFlag = client.getFlag('flag1', 'featureAccess');
        expect(actualFlag).undefined;
      });
    });

    describe('isFlagEnabled', () => {
      test('should return true when the flag content is enabled', () => {
        const actual = client.isFlagEnabled('flag1', 'newFeatureAccess');
        expect(actual).true;
      });

      test('should return false when the flag content is disabled', () => {
        const actual = client.isFlagEnabled('flag1', 'oldFeatureAccess');
        expect(actual).false;
      });

      test('should return false when the flag does not exist', () => {
        const actual = client.isFlagEnabled('flag', 'oldFeatureAccess');
        expect(actual).false;
      });
    });

    describe('switching features', () => {
      describe('getFeature', () => {
        const newFeature = (a: string, b: number): string => `new ${a}, ${b}`;

        const oldFeature = (a: string, b: number): string => `old ${a}, ${b}`;

        const override = (flag: FeatureFlagContent) =>
          (f: FeatureFlagContent, a: string, b: number): boolean => {
            expect(f).eql(flag);
            return !flag.enabled;
          };

        test('should return the new feature', () => {
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName: 'flag1',
            userGroupName: 'newFeatureAccess',
            on: newFeature,
            off: oldFeature
          };
          const feature = client.getFeature(switchParams);
          const actual = feature('test', 123);
          const expected = 'new test, 123';
          expect(actual).eq(expected);
        });

        test('should return the old feature', () => {
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName: 'flag2',
            userGroupName: 'oldFeatureAccess',
            on: oldFeature,
            off: newFeature
          };
          const feature = client.getFeature(switchParams);
          const actual = feature('test', 123);
          const expected = 'old test, 123';
          expect(actual).eq(expected);
        });

        test('should return the old feature (new is override)', () => {
          const flagName = 'flag1';
          const userGroupName = 'newFeatureAccess';
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName,
            userGroupName,
            on: newFeature,
            off: oldFeature,
            override: override(client.getFlag(flagName, userGroupName))
          };
          const feature = client.getFeature(switchParams);
          const actual = feature('test', 123);
          const expected = 'old test, 123';
          expect(actual).eq(expected);
        });

        test('should return the new feature (old is override)', () => {
          const flagName = 'flag2';
          const userGroupName = 'oldFeatureAccess';
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName,
            userGroupName,
            on: oldFeature,
            off: newFeature,
            override: override(client.getFlag(flagName, userGroupName))
          };
          const feature = client.getFeature(switchParams);
          const actual = feature('test', 123);
          const expected = 'new test, 123';
          expect(actual).eq(expected);
        });
      });

      describe('getAsyncFeature', () => {
        const newFeature = async (a: string, b: number): Promise<string> => `new ${a}, ${b}`;

        const oldFeature = async (a: string, b: number): Promise<string> => `old ${a}, ${b}`;

        const override = (flag: FeatureFlagContent) =>
          async (f: FeatureFlagContent, a: string, b: number): Promise<boolean> => {
            expect(f).eql(flag);
            return new Promise((resolve) => {
              setTimeout(() => resolve(!flag.enabled), 5);
            });
          };

        test('should return the new feature', async () => {
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName: 'flag1',
            userGroupName: 'newFeatureAccess',
            on: newFeature,
            off: oldFeature
          };
          const feature = client.getFeature(switchParams);
          const actual = await feature('test', 123);
          const expected = 'new test, 123';
          expect(actual).eq(expected);
        });

        test('should return the old feature', async () => {
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName: 'flag2',
            userGroupName: 'oldFeatureAccess',
            on: oldFeature,
            off: newFeature
          };
          const feature = client.getFeature(switchParams);
          const actual = await feature('test', 123);
          const expected = 'old test, 123';
          expect(actual).eq(expected);
        });

        test('should return the old feature (new is override)', async () => {
          const flagName = 'flag1';
          const userGroupName = 'newFeatureAccess';
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName,
            userGroupName,
            on: newFeature,
            off: oldFeature,
            override: override(client.getFlag(flagName, userGroupName))
          };
          const feature = client.getAsyncFeature(switchParams);
          const actual = await feature('test', 123);
          const expected = 'old test, 123';
          expect(actual).eq(expected);
        });

        test('should return the new feature (old is override)', async () => {
          const flagName = 'flag2';
          const userGroupName = 'oldFeatureAccess';
          const switchParams: FeatureFlagsSwitchParams<typeof oldFeature> = {
            flagName,
            userGroupName,
            on: oldFeature,
            off: newFeature,
            override: override(client.getFlag(flagName, userGroupName))
          };
          const feature = client.getAsyncFeature(switchParams);
          const actual = await feature('test', 123);
          const expected = 'new test, 123';
          expect(actual).eq(expected);
        });
      });
    });
  });
});
