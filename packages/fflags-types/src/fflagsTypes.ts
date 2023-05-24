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

// eslint-disable-next-line
type AnyArgs = any[]

// eslint-disable-next-line
export type AnyFunction = (...args: AnyArgs) => any

export type FeatureFunction<Args extends AnyArgs, Result> = (...args: Args) => Result

export type OverrideFunction<F extends AnyFunction> = (flag: FeatureFlagContent, ...args: Parameters<F>) =>
  boolean | Promise<boolean>

export type FeatureFlagsSwitchParams<F extends AnyFunction> = {
  flagName: FlagName
  userGroupName: UserGroupName,
  on: FeatureFunction<Parameters<F>, ReturnType<F>>
  off: FeatureFunction<Parameters<F>, ReturnType<F>>
  override?: OverrideFunction<F>
}
