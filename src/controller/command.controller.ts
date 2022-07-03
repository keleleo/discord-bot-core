import {
  Client,
  ClientApplication,
  CommandInteraction,
  Message,
} from 'discord.js';
import fs from 'fs';

import { BotController } from '..';
import { ICommand } from '../models/ICommand';
import { ILoadedCommands } from '../models/ILoadedCommands';
import { Options } from '../models/Options';
import { messageOnMessageCreate } from './command/message.command';
import {
  createSlashCommand,
  slashInteractionCreate,
} from './command/slash.command';

var loadedCommands: ILoadedCommands = {};
var options: Options;
var client: Client;
export default async (
  _options: Options,
  _client: Client,
  _instance: BotController
) => {
  if (!_options) return;
  if (!_options.comandsDir) return;
  options = _options;
  client = _client;
  console.log('Loading commands..');

  const app: ClientApplication = await _client.application?.fetch()!;

  const commands = fs.readdirSync(_options.comandsDir);

  console.log(`Fiended ${commands.length} command(s).`);

  let slashs: any[] = [];

  commands.forEach((file) => {
    const commandFile: any = require(_options.comandsDir + '/' + file);

    let iCommand: ICommand = commandFile['default'];
    loadedCommands[iCommand.name] = {
      iComand: iCommand,
      instance: _instance,
    };

    if (iCommand.slash) {
      if (app) {
        slashs.push(createSlashCommand(iCommand));
      } else {
        console.log('Create slash command error: Client Application undefined');
      }
    }
  });
  console.log(`${slashs.length} Slash(s) command.`);
  if (slashs && slashs.length > 0) {
    app?.commands.set(slashs);
  }
};

//#region Events
export function onMessageCreate(message: Message) {
  messageOnMessageCreate(message, client, options, loadedCommands);
}

export function onInteractionCreate(interaction: CommandInteraction) {
  slashInteractionCreate(interaction, options, loadedCommands);
}
//#endregion
