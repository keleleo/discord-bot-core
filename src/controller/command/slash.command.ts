import {
  ErrorType,
  ICallbackErrorObject,
} from './../../models/ICallbackErrorObject';
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
import { ILoadedCommandList } from '../../models/ILoadedCommands';
import { Options } from '../../models/Options';
import { dmCheck } from '../../utils/dm.check';
import { ownerCheck } from '../../utils/owner.check';
import { permissionCheck } from '../../utils/permissions.check';
import { requiredPermissionCheck } from '../../utils/requiredPermissions.check';
import { testOnlyCheck } from '../../utils/testOnly.check';
import { verify } from '../../utils/verify';

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
  iCommand: ICommand,
  client: Client
) {
  if (!iCommand.callback) return;

  let res: any = await iCommand.callback(iCallback);

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
    custom: ops.custom,
  };
}

export function slashInteractionCreate(
  interaction: CommandInteraction,
  client: Client,
  options: Options,
  commandList: ILoadedCommandList
) {
  if (!interaction.isCommand()) return;

  const iCommand = commandList[interaction.commandName];
  if (!iCommand || iCommand.slash == false) return;
  const iCallback = interactionToCallback(interaction, options);

  const error: ErrorType | undefined = verify(
    iCallback,
    iCommand,
    client,
    options
  );
  if (error) callInteractionCommandError(iCommand, iCallback, error);
  else callInteractionCommand(iCallback, iCommand, client);
}

async function callInteractionCommandError(
  iCommand: ICommand,
  iCallback: ICallbackObject,
  error: ErrorType
) {
  const ICallbackError: ICallbackErrorObject = {
    ...iCallback,
    errorType: error,
  };
  if (!iCommand.error) return;
  const res = iCommand.error(ICallbackError);
  if (typeof res == 'string' || typeof res == 'number') {
    iCallback.interaction.reply({
      content: res.toString(),
      ephemeral: true,
    });
  }
}
