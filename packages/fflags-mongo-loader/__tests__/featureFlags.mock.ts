import {FFlagModel} from '../src/index.js';

export const mockedFeatureFlagsInDB = [
  {
    name: 'flag1',
    description: 'flag1',
    environments: {
      staging: {
        userGroups: {
          newFeatureAccess: {
            enabled: true,
            value: 100,
          },
          oldFeatureAccess: {
            enabled: false,
            value: 200,
          }
        }
      },
      production: {
        userGroups: {
          newFeatureAccess: {
            enabled: false,
            value: 300,
          },
          oldFeatureAccess: {
            enabled: true,
            value: 400,
          }
        }
      }
    }
  },
  {
    name: 'flag2',
    description: 'flag2',
    environments: {
      staging: {
        userGroups: {
          newFeatureAccess: {
            enabled: false,
            value: 400,
          },
          oldFeatureAccess: {
            enabled: true,
            value: 300,
          }
        }
      },
      production: {
        userGroups: {
          newFeatureAccess: {
            enabled: true,
            value: 200,
          },
          oldFeatureAccess: {
            enabled: false,
            value: 100,
          }
        }
      }
    }
  }
];

export const populateMockDB = async () => {
  for (const flag of mockedFeatureFlagsInDB) {
    await FFlagModel.create(flag);
  }
};