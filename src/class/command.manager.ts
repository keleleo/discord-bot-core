import { CommandInvoker } from './command.invoker';
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientApplication,
  CommandInteraction,
  Interaction,
  Message,
} from 'discord.js';

import { ICommand } from '../models/ICommand';
import { Options } from '../models/Options';

import { findAllFiles } from '../utils/findAllFiles';

export class CommandManager {
  private app!: ClientApplication;

  private options: Options;
  private client: Client;

  commandMap = new Map<String, ICommand>();

  constructor(_client: Client, _options: Options) {
    this.client = _client;
    this.options = _options;
  }

  public async init() {
    this.app = await this.client.application?.fetch()!;
    await this.loadCommands();
  }

  private createSlashCommandData(
    command: ICommand
  ): ApplicationCommandDataResolvable {
    let slash: ApplicationCommandDataResolvable = {
      description: command.description,
      name: command.name?.toLowerCase() || 'error',
      options: command.options,
    };
    return slash;
  }

  private getCommandByPath(path: string): ICommand | null {
    try {
      const commandFile: any = require(path);
      const command: ICommand = commandFile['default'];
      if (!command.name) {
        console.error(`${path}. name error`);
        return null;
      }
      return command;
    } catch (err) {
      console.error(`Fail to load: ${path}`);
      return null;
    }
  }

  private addCommandToMap(command: ICommand, path: string) {
    const name: string = command.name.toLowerCase();
    if (this.commandMap.has(name)) {
      console.error(`command name ${name} duplicated. ${path}`);
      return;
    }
    this.commandMap.set(name, command);
  }

  private sendSlashCommands(slash: any[]) {
    if (slash && slash.length > 0) {
      this.app?.commands.set(slash);
    }
  }

  private async loadCommands() {
    if (!this.options.commandsDir) return;

    const filesPath: string[] = await findAllFiles(this.options.commandsDir);

    let slash: any[] = [];
    for await (let file of filesPath) {
      const command = this.getCommandByPath(file);

      if (!command) {
        return;
      }

      this.addCommandToMap(command, file);

      if (command.slash) {
        slash.push(this.createSlashCommandData(command));
      }
    }
    this.sendSlashCommands(slash);
  }

  isCommandFormat(message: Message): boolean {
    if (message.author.id === this.client.user?.id) return false;
    const args = message.content.split(' ');
    if (!args || args[0].indexOf(this.options.prefix) != 0) {
      return false;
    }

    return true;
  }

  getCommandNameFromMessage(message: Message): string {
    const args = message.content.split(' ');
    let name: string = args[0].replace(this.options.prefix, '');

    return name;
  }

  getCommand(name: string): ICommand | undefined {
    const iCommand = this.commandMap.get(name);
    return iCommand;
  }

  public onMessageCreate(message: Message) {
    if (!this.isCommandFormat(message)) return;
    const name = this.getCommandNameFromMessage(message);
    const command = this.getCommand(name);
    if (!command) return;
    new CommandInvoker(message, command, this.client, this.options);
  }

  public onInteractionCreate(interaction: CommandInteraction) {
    const name = interaction.commandName;
    const command = this.getCommand(name);
    if (!command) return;
    new CommandInvoker(interaction, command, this.client, this.options);
  }
}
