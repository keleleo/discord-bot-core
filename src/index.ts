import { Client, ClientOptions, Interaction, Message } from 'discord.js';

import { Options } from './models/Options';
import { CommandManager } from './class/command.manager';
import fs from 'fs';
import { findAllFiles } from './utils/findAllFiles';

export class BotCore {
  client: Client;
  options: Options;
  commandController: CommandManager;

  constructor(token: string, coreConfig: Options, options: ClientOptions) {
    this.options = coreConfig;
    this.client = new Client(options);
    this.commandController = new CommandManager(this.client, this.options);

    this.client.on('ready', async () => {
      this.addEventListener();

      await this.commandController.init();
      await this.loadFeatures();
    });

    this.client.login(token);
  }

  // async destroyAllSlashCommands(client: Client): Promise<void> {
  //   const app = await client.application?.fetch();

  //   const commands = await app?.commands.fetch();

  //   commands?.forEach((command: any) => {
  //     command.delete();
  //     console.log('Deleted:', command.name);
  //   });
  // }

  async loadFeatures() {
    if (!this.options.featuresDir) return;
    console.log('Loading feature(s)...');
    const featuresPath: string[] = await findAllFiles(this.options.featuresDir);
    for await (let file of featuresPath) {
      this.loadFeature(file);
    }
    console.log('Feature are loaded');
  }

  async loadFeature(path: string) {
    const verifyPath = await fs.statSync(path);
    if (verifyPath.isFile()) {
      const featureFile = require(path);
      const featureMethod = featureFile['default'];
      if (featureMethod) {
        await featureMethod(this.client);
      } else console.log(`Error on load ${path}, default method notfound`);
    }
  }

  private addEventListener() {
    this.client.on('messageCreate', (message: Message) => {
      this.commandController.onMessageCreate(message);
    });
    this.client.on('interactionCreate', (interaction: any) => {
      this.commandController.onInteractionCreate(interaction);
    });
  }
}
