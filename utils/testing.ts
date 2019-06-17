import NowInitSvelte from '../src/index';
import { Config } from '@oclif/config';

export function New(): NowInitSvelte {
  const root = process.cwd();
  return new NowInitSvelte([], new Config({ root }));
}
