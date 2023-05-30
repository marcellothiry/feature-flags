import {EnvironmentName, FeatureFlagContent, FlagName, UserGroupName} from '@fflags/types';
import {Model, model, Schema} from 'mongoose';

export type FeatureFlagContentInDB = FeatureFlagContent

export type UserGroupsInDB = {
  userGroups: Map<UserGroupName, FeatureFlagContentInDB>
}

export type FeatureFlagInDB = {
  name: FlagName
  description: string
  environments: Map<EnvironmentName, UserGroupsInDB>
}

const flagContentSchema = new Schema<FeatureFlagContentInDB>(
  {
    enabled: {type: Boolean, default: false},
    value: {type: Object},
  },
  {
    _id: false,
  }
);

const userGroupsSchema = new Schema<UserGroupsInDB>(
  {
    userGroups: {
      type: Map,
      of: flagContentSchema,
    },
  },
  {
    _id: false,
  }
);

const fflagsSchema = new Schema<FeatureFlagInDB>(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    environments: {
      type: Map,
      of: userGroupsSchema,
    },
  },
  {
    _id: true,
    timestamps: true
  }
);

export type FeatureFlagDocument = FeatureFlagInDB & Document

export const FFlagModel: Model<FeatureFlagDocument> = model<FeatureFlagDocument>('fflags', fflagsSchema);