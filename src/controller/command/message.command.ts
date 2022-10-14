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
import { ILoadedCommandList } from '../../models/ILoadedCommands';
import { Options } from '../../models/Options';
import { dmCheck } from '../../utils/dm.check';
import { ownerCheck } from '../../utils/owner.check';
import { permissionCheck } from '../../utils/permissions.check';
import { requiredPermissionCheck } from '../../utils/requiredPermissions.check';
import { testOnlyCheck } from '../../utils/testeOnly.check';

function getCommandFromMessage(
  message: Message,
  client: Client,
  options: Options,
  loadedCommands: ILoadedCommandList
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
  let command: string = args[0].replace(options.prefix, '').toLowerCase();
  const iCommand: ICommand = loadedCommands[command];

  return iCommand;
}

function messageToCallback(message: Message, ops: Options): ICallbackObject {
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
    custom: ops.custom,
  };
}

async function callMessageCommand(
  iCommand: ICommand,
  iCallback: ICallbackObject
) {
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
  loadedCommands: ILoadedCommandList
) {
  const iCommand = getCommandFromMessage(
    message,
    client,
    options,
    loadedCommands
  );

  if (iCommand) {
    // this message is a command
    if (!iCommand || iCommand.slash == true) return;

    const iCallback = messageToCallback(message, options);
    if (!dmCheck(iCallback, iCommand)) return;
    if (!ownerCheck(iCallback.user, iCommand, client)) return;
    if (!permissionCheck(iCallback.member, iCommand)) return;
    if (!requiredPermissionCheck(iCallback.member, iCommand)) return;
    if (!testOnlyCheck(iCallback, iCommand, options)) return;
    await callMessageCommand(iCommand, iCallback);
  }
}
