import {
  Client,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';

import { ICallbackObject } from '../../models/ICallbackObject';
import { ICommand } from '../../models/ICommand';
import { ILoadedCommands } from '../../models/ILoadedCommands';
import { Options } from '../../models/Options';
import { BotController } from './../..';

export function getCommandFromMessage(
  message: Message,
  client: Client,
  options: Options,
  loadedCommands: ILoadedCommands
): ICommand | undefined {
  //convert message content to array

  const args = message.content.split(' ');

  const user = message.author;
  //Check if the author is the bot
  if (user.id === client.user?.id) return;
  //Checks if the first argument matches a command
  if (!args || args[0].indexOf(options.prefix) != 0) {
    return;
  }
  let command: string = args[0].replace(options.prefix, '');
  const iCommand: any = loadedCommands[command]?.iComand;

  if (!iCommand || iCommand.slash == true) return;
  //Returns the first argument without the prefix
  return iCommand;
}

export function messageToCallback(
  message: Message,
  ops: Options
): ICallbackObject {
  const user: User = message.author;
  const guild: Guild | null = message.guild;
  const channel: TextChannel | null =
    message.channel.type == 'GUILD_TEXT' ? message.channel : null;
  const prefix: string = ops.prefix;
  const args: string[] = message.content.split(' ');
  const text: string = args.slice(1, args.length).join(' ');
  const member: GuildMember = message.member!;
  const interaction: any = null;
  const options: any = null;
  return {
    options,
    user,
    guild,
    channel: channel as TextChannel,
    interaction: interaction,
    args,
    message,
    prefix,
    text,
    member,
  };
}

export async function callMessageCommand(
  iCommand: ICommand,
  iCallback: ICallbackObject,
  instance: BotController
) {
  if (!iCommand || iCommand.slash == true) return;

  if (iCommand.testOnly) {
    if (!instance.options.testServer) return;
    if (!iCallback.guild) return;
    if (
      instance.options.testServer.indexOf(iCallback.guild.id.toString()) == -1
    )
      return;
  }
  if (iCommand.callback != null) {
    const res = await iCommand.callback(iCallback);

    if (typeof res == 'string' || typeof res == 'number') {
      iCallback.message?.reply(res.toString());
    }
  }
}

export async function messageOnMessageCreate(
  message: Message,
  client: Client,
  options: Options,
  loadedCommands: ILoadedCommands
) {
  const command = getCommandFromMessage(
    message,
    client,
    options,
    loadedCommands
  );
  if (command) {
    // this message is a command
    const callbackObject = messageToCallback(message, options);
    await callMessageCommand(
      command,
      callbackObject,
      loadedCommands[command.name].instance
    );
  }
}
