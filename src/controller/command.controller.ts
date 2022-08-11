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

var loadedCommands: ILoadedCommandList = {};
var options: Options;
var client: Client;
export default async (
  _options: Options,
  _client: Client,
  _instance: BotController
) => {
  if (!_options) return;
  if (!_options.comandsDir) return;
  console.log('Loading commands..');

  options = _options;
  client = _client;

  const app: ClientApplication = await _client.application?.fetch()!;

  const commands = fs.readdirSync(_options.comandsDir);

  let slashs: any[] = [];

  for await (let file of commands) {
    const verifyPath = await fs.statSync(_options.comandsDir + '/' + file);
    if (verifyPath.isFile()) {
      const commandFile: any = require(_options.comandsDir + '/' + file);

      let iCommand: ICommand = commandFile['default'];
      try {
        loadedCommands[iCommand.name.toLowerCase()] = {
          iCommand: iCommand,
          instance: _instance,
        };

        if (iCommand.slash) {
          if (app) {
            slashs.push(createSlashCommand(iCommand));
          } else {
            console.log(file, 'Client Application undefined');
            return;
          }
        }
      } catch (err) {
        console.log(file, ' - Error on load command');
      }
    }
  }

  if (slashs && slashs.length > 0) {
    app?.commands.set(slashs);
  }
  console.log('All command are loaded');
};

//#region Events
export function onMessageCreate(message: Message) {
  messageOnMessageCreate(message, client, options, loadedCommands);
}

export function onInteractionCreate(interaction: CommandInteraction) {
  slashInteractionCreate(interaction, client, options, loadedCommands);
}
//#endregion
