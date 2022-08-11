import { Client } from 'discord.js';

import commandController from './controller/command.controller';
import EventController from './controller/event.controller';
import featureController from './controller/feature.controller';
import { Options } from './models/Options';

export class BotController<T = any> {
  options: Options<T>;
  constructor(client: Client, options: Options<T>) {
    this.options = options;
    this.init(client,options)
  }
  async init(client: Client, options: Options) {
    await commandController(options, client, this);
    await featureController(options, client);
    await EventController(client, options);
  }
  async destroyAllSlashCommands(client: Client): Promise<void> {
    const app = await client.application?.fetch();

    // app?.commands.set([]);
    const commands = await app?.commands.fetch();

    commands?.forEach((command) => {
      command.delete();
      console.log('Deleted:',command.name);
    });
  }
}
