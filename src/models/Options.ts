export interface Options<T = any> {
  prefix: string;
  commandsDir?: string;
  featuresDir?: string;
  testServer?: string[];
  ignoreBots?: boolean;
  custom?: T;
}
