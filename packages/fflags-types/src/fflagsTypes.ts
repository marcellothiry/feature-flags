export type FeatureFlagContent = {
  enabled: boolean
  value?: unknown
}

export type FlagName = string

export type UserGroupName = string

export type UserGroups = Record<UserGroupName, FeatureFlagContent>

export type FeatureFlags = Map<FlagName, UserGroups>

export type EnvironmentName = string

export type FeatureFlagsLoader = (environmentName: EnvironmentName) => Promise<FeatureFlags>

export type FeatureFlagsStartingOptions = {
  environmentName: EnvironmentName
  autoRefresh: boolean
  refreshIntervalInSeconds?: number
  featureFlagsLoader: FeatureFlagsLoader
}