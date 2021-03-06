import { BotController } from './../../index';
import { ILoadedCommand } from './../../models/ILoadedCommands';
import { ILoadedCommandList } from '../../models/ILoadedCommands';
import {
  ApplicationCommandDataResolvable,
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  User,
} from 'discord.js';

import { ICallbackObject } from '../../models/ICallbackObject';
import { ICommand } from '../../models/ICommand';
import { Options } from '../../models/Options';
import { dmCheck } from '../../utils/dm.check';
import { ownerCheck } from '../../utils/owner.check';
import { testOnlyCheck } from '../../utils/testeOnly.check';
import { requiredPermissionCheck } from '../../utils/requiredPermissions.check';
import { permissionCheck } from '../../utils/permissions.check';

export function createSlashCommand(
  command: ICommand
): ApplicationCommandDataResolvable {
  if (command.name != command.name.toLowerCase()) {
    console.error(
      `Slash fail: {${command.name}} -> {${command.name.toLowerCase()}}`
    );
    command.name = command.name.toLowerCase();
  }
  let slash: ApplicationCommandDataResolvable = {
    description: command.description,
    name: command.name || 'error',
    options: command.options,
  };
  return slash;
}

export async function callInteractionCommand(
  iCallback: ICallbackObject,
  command: ILoadedCommand,
  client: Client
) {
  if (!command.iCommand.callback) return;

  let res: any = await command.iCommand.callback(iCallback);

  if (res && (typeof res == 'string' || typeof res == 'number')) {
    iCallback.interaction.reply({
      content: res.toString(),
      ephemeral: true,
    });
  }
}

export function interactionToCallback(
  interaction: CommandInteraction,
  ops: Options
): ICallbackObject {
  const user: User = interaction.user!;
  const guild: Guild | null = interaction.guild;
  const channel: TextChannel | null =
    interaction.channel?.type == 'GUILD_TEXT'
      ? (interaction.channel as TextChannel)
      : null;
  const prefix: string = ops.prefix;
  const member: GuildMember = interaction.member as GuildMember;
  const args: string[] = [];
  const text: string = '';
  const message: any = null;
  const options: any = interaction.options;
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
    event:ops.event
  };
}

export function slashInteractionCreate(
  interaction: CommandInteraction,
  client: Client,
  options: Options,
  commandList: ILoadedCommandList
) {
  if (interaction.isCommand()) {
    const iCallback = interactionToCallback(interaction, options);
    const command: ILoadedCommand =
      commandList[iCallback.interaction.commandName];

    if (!command) return;

    let instance: BotController = command.instance;
    if (!command) return;
    if (!permissionCheck(iCallback.member, command.iCommand)) return;
    if (!requiredPermissionCheck(iCallback.member, command.iCommand)) return;
    if (!testOnlyCheck(iCallback, command.iCommand, instance)) return;
    if (!dmCheck(iCallback, command.iCommand)) return;
    if (!ownerCheck(iCallback.user, command.iCommand, client)) return;

    callInteractionCommand(iCallback, command, client);
  }
}
