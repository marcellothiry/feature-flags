import {EnvironmentName, FeatureFlags, FlagName, UserGroups} from '@fflags/types';

export class RestLoader {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async load(environmentName: EnvironmentName): Promise<FeatureFlags | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/${environmentName}`);
      const fflags = await response.json();
      if (!fflags || Object.keys(fflags).length === 0) {
        this.handleError(new Error('Empty flags'));
        return;
      }
      const cachedFlags: FeatureFlags = new Map<FlagName, UserGroups>;
      for (const fflagName in fflags) {
        cachedFlags.set(fflagName, fflags[fflagName]);
      }
      return cachedFlags;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: any): void {
    console.log(`${new Date}: ${error}`);
  }
}