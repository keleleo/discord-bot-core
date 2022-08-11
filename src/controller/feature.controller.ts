import { Options } from '../models/Options';
import fs from 'fs';
import { Client } from 'discord.js';
export default async (_options: Options, _client: Client) => {
  if (!_options || !_options.featuresDir) return;
  console.log('Loading feature(s)...');
  const features = fs.readdirSync(_options.featuresDir);
  for await (let file of features) {
    const verifyPath = await fs.statSync(_options.featuresDir + '/' + file);
    if (verifyPath.isFile()) {
      const feature = require(_options.featuresDir + '/' + file);
      const featureF = feature['default'];
      if (featureF) await featureF(_client, _options.custom);
      else
        console.log(`Error on load ${file} feature, default method notfound`);
    }
  }
  console.log('All feature are loaded');
};
