import { Client } from 'discord.js';

import commandController from './controller/command.controller';
import EventController from './controller/event.controller';
import featureController from './controller/feature.controller';
import { Options } from './models/Options';

export class BotController {
  options: Options;
  constructor(client: Client, options: Options) {
    this.options = options;
    commandController(options, client, this);
    featureController(options, client);
    EventController(client, options);
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
