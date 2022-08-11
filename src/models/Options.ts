export interface Options<T = any> {
  prefix: string;
  comandsDir?: string;
  featuresDir?: string;
  testServer?: string[];
  ignoreBots?: boolean;
  mongoUri?: string;
  dbOptions?: {};
  custom?: T;
}
