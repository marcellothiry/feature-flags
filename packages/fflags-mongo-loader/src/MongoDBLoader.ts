import {EnvironmentName, FeatureFlagContent, FeatureFlags, FlagName, UserGroupName, UserGroups} from '@fflags/types';
import {FFlagModel} from './featureFlagModel.js';

export class MongoDBLoader {
  static async load(environmentName: EnvironmentName): Promise<FeatureFlags> {
    const filter = {[`environments.${environmentName}`]: {'$exists': true}};
    const projection = `name environments.${environmentName}`;
    const flagsInDB = await FFlagModel.find(filter, projection).exec();
    const cachedFlags: FeatureFlags = new Map<FlagName, UserGroups>;
    for (const flagInDB of flagsInDB) {
      const environment = flagInDB.environments.get(environmentName);
      const userGroupsInDB = environment?.userGroups;
      if (!userGroupsInDB) continue;
      cachedFlags.set(flagInDB.name, this.toRecord(userGroupsInDB));
    }
    return cachedFlags;
  }

  private static toRecord(groupsIn: Map<UserGroupName, FeatureFlagContent>): UserGroups {
    let groupsOut: Record<UserGroupName, FeatureFlagContent> = {};
    for (const [userGroupName, flagContent] of groupsIn) {
      groupsOut[userGroupName] = flagContent;
    }
    return groupsOut;
  }
}