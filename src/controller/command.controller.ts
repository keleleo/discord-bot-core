import {
  Client,
  ClientApplication,
  CommandInteraction,
  Message,
} from 'discord.js';
import fs from 'fs';

import { BotController } from '..';
import { ICommand } from '../models/ICommand';
import { ILoadedCommandList } from '../models/ILoadedCommands';
import { Options } from '../models/Options';
import { messageOnMessageCreate } from './command/message.command';
import {
  createSlashCommand,
  slashInteractionCreate,
} from './command/slash.command';

export class CommandController {
  private options: Options;
  private client: Client;
  //----------------
  files: string[] = [];
  loadedCommands: ILoadedCommandList = {};

  constructor(_client: Client, _options: Options) {
    this.client = _client;
    this.options = _options;
  }

  public async init() {
    await this.findAllFiles();
    await this.loadCommands();
    this.addEventListener();
  }

  private async findAllFiles() {
    const path = this.options.commandsDir;
    if (!path) return;

    let folders: string[] = [path];

    var verifiedFolders = [];
    while (folders.length != 0) {
      let current = folders.pop();
      if (!current) return;
      verifiedFolders.push(current);

      let pathsT: string[] = fs.readdirSync(current);

      for await (let p of pathsT) {
        let verify = await fs.statSync(current + '/' + p);
        if (verify.isFile()) {
          this.files.push(current + '/' + p);
        } else {
          folders.push(current + '/' + p);
        }
      }
    }
  }

  private async loadCommands() {
    const app: ClientApplication = await this.client.application?.fetch()!;

    let slash: any[] = [];

    for await (let file of this.files) {
      const commandFile: any = require(file);

      let iCommand: ICommand = commandFile['default'];
      try {
        if (!iCommand) {
          console.error(`Warning: ${file}`);
          return;
        }
        if (!iCommand.name) {
          console.error(`${file}. name error`);
          return;
        }
        const name: string = iCommand.name.toLowerCase();

        if (this.loadedCommands[name]) {
          console.error(`command name ${name} duplicated. ${file}`);
          return;
        }
        this.loadedCommands[name] = iCommand;

        if (iCommand.slash) {
          if (app) {
            slash.push(createSlashCommand(iCommand));
          } else {
            console.log(file, 'Client Application undefined');
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (slash && slash.length > 0) {
      app?.commands.set(slash);
    }
    console.log('All command are loaded');
  }

  private addEventListener() {
    this.client.on('messageCreate', (m: Message) => {
      messageOnMessageCreate(m, this.client, this.options, this.loadedCommands);
    });
    this.client.on('interactionCreate', (i: any) => {
      slashInteractionCreate(i, this.client, this.options, this.loadedCommands);
    });
  }
}
