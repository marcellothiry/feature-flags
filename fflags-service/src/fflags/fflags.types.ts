import {EnvironmentName, FlagName, UserGroups} from '@fflags/types';

export type CachingParams = {
  environmentName: EnvironmentName
}

export type FlagIdParams = {
  fflagId: string
}

export type FFlag = {
  name: FlagName
  description: string
  environments: Record<EnvironmentName, UserGroups>
}

export type FFlags = Record<FlagName, FFlag>

export type AuditableFFlag = FFlag & {
  createdAt: Date
  updatedAt: Date
}

export type CreateFFlagBodyRequest = FFlag;

export type CreateFFlagBodyResponse = AuditableFFlag & {
  id: string
}

export type UpdateFFlagBodyRequest = CreateFFlagBodyResponse;

export type UpdateFFlagBodyResponse = UpdateFFlagBodyRequest

export type GetFFlagBodyResponse = UpdateFFlagBodyRequest
