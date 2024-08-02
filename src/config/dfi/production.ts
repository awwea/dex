import { AppConfig } from '../types';
import { commonConfig } from './common';

const config: AppConfig = {
  ...commonConfig,
  mode: 'production',
  network: {
    ...commonConfig.network,
    rpc: {
      url: 'https://chain.daofinance.me/rpc',
    },
  },
  sentryDSN: '',
};
export default config;
