import { BrandName } from '@vertex-protocol/web-ui';
import envBrandName from 'common/environment/envBrandName';

export type DataEnv =
  | 'local'
  | 'vertexTestnet'
  | 'vertexMainnet'
  | 'blitzTestnet'
  | 'blitzMainnet';

export interface BaseClientEnv {
  // Determines supported chains to interact with
  dataEnv: DataEnv;
  // Determines app branding
  brandName: BrandName;
  // Enables any WIP / experimental features
  enableExperimentalFeatures: boolean;
}

const dataEnv: DataEnv =
  (process.env.NEXT_PUBLIC_DATA_ENV as DataEnv) ?? 'vertexTestnet';

const brandName = envBrandName;

export const baseClientEnv: BaseClientEnv = {
  enableExperimentalFeatures:
    process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_FEATURES === 'true' ?? false,
  dataEnv,
  brandName,
};
