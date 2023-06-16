import {EnvironmentName, FeatureFlagContent, FlagName, UserGroupName} from '@fflags/types';
import {Model, model, Schema} from 'mongoose';

export type FeatureFlagContentInDB = FeatureFlagContent

export type UserGroupsInDB = {
  userGroups: Map<UserGroupName, FeatureFlagContentInDB>
}

export type FeatureFlagInDB = {
  id: string,
  name: FlagName
  description: string
  environments: Map<EnvironmentName, UserGroupsInDB>
  createdAt: Date
  updatedAt: Date
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

const transform = (doc: any, ret: any): FeatureFlagInDB => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
};

const fflagsSchema = new Schema<FeatureFlagInDB>(
  {
    name: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    environments: {
      type: Map,
      of: userGroupsSchema,
    },
  },
  {
    _id: true,
    timestamps: true,
    toJSON: {transform},
  }
);

export type FeatureFlagDocument = FeatureFlagInDB & Document

export const FFlagModel: Model<FeatureFlagDocument> = model<FeatureFlagDocument>('fflags', fflagsSchema);