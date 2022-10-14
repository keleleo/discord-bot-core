import { CommandController } from './controller/command.controller';
import { Client } from 'discord.js';

import featureController from './controller/feature.controller';
import { Options } from './models/Options';

export class BotController<T = any> {
  options: Options<T>;
  commandController: CommandController;

  constructor(client: Client, options: Options<T>) {
    this.options = options;
    this.commandController = new CommandController(client, options);
    this.init(client, options);
  }
  async init(client: Client, options: Options) {
    await this.commandController.init();
    await featureController(options, client);
  }
  async destroyAllSlashCommands(client: Client): Promise<void> {
    const app = await client.application?.fetch();

    const commands = await app?.commands.fetch();

    commands?.forEach((command) => {
      command.delete();
      console.log('Deleted:', command.name);
    });
  }
}
