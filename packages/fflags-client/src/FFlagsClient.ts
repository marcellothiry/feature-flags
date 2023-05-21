import {
  EnvironmentName,
  FeatureFlagContent,
  FeatureFlags,
  FeatureFlagsLoader,
  FeatureFlagsStartingOptions,
  FlagName,
  UserGroupName,
  UserGroups
} from '@fflags/types';

const DEFAULT_DURATION = 5 * 60; // 5 min

export class FFlagsClient {
  private readonly environmentName: EnvironmentName;
  private readonly loader: FeatureFlagsLoader;
  private flags: FeatureFlags = new Map<FlagName, UserGroups>;
  private intervalId: NodeJS.Timer | undefined;

  static async start(options: FeatureFlagsStartingOptions): Promise<FFlagsClient> {
    const client = new FFlagsClient(options);
    await client.refresh();
    return client;
  }

  stop() {
    clearInterval(this.intervalId);
  }

  async refresh(): Promise<void> {
    this.flags = await this.loader(this.environmentName);
  }

  getFlag(flagName: FlagName, userGroupName: UserGroupName): FeatureFlagContent | undefined {
    const userGroups = this.flags.get(flagName);
    if (!userGroups) return;
    const flag = userGroups[userGroupName];
    if (!flag) return;
    return JSON.parse(JSON.stringify(flag)) as FeatureFlagContent;
  }

  isFlagEnabled(flagName: FlagName, userGroupName: UserGroupName): boolean {
    const flag = this.getFlag(flagName, userGroupName);
    return !flag ? false : flag.enabled;
  }

  private constructor(options: FeatureFlagsStartingOptions) {
    this.environmentName = options.environmentName;
    this.loader = options.featureFlagsLoader;
    if (options.autoRefresh) {
      this.startPolling(options.refreshIntervalInSeconds ?? DEFAULT_DURATION);
    }
  }

  private startPolling(intervalInSeconds: number) {
    // setInterval delay expects value in ms
    this.intervalId = setInterval(() => void this.refresh(), intervalInSeconds * 1000);
  }
}
