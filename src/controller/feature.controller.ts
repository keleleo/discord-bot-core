import { Options } from '../models/Options';
import fs from 'fs';
import { Client } from 'discord.js';
export default async (_options: Options,_client:Client) => {
  if (!_options || !_options.featuresDir) return;

  console.log('Loading feature(s)...');

  const features = fs.readdirSync(_options.featuresDir);

  features.forEach((file) => {
    const feature = require(_options.featuresDir + '/' + file);
    const featureF = feature['default'];
    if (featureF) featureF(_client);
  });
};
