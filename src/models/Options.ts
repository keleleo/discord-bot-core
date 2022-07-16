export interface Options {
  prefix: string;
  comandsDir?: string;
  featuresDir?: string;
  testServer?: string[];
  ignoreBots?: boolean;
  mongoUri?: string;
  dbOptions?: {};
  event?:any;
}
