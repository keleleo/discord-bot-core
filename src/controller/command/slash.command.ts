import { ILoadedCommands } from '../../models/ILoadedCommands';
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

export function createSlashCommand(
  command: ICommand
): ApplicationCommandDataResolvable {
  let slash: ApplicationCommandDataResolvable = {
    description: command.description,
    name: command.name || 'error',
    options: command.options,
  };
  return slash;
}

export async function callInteractionCommand(
  iCallback: ICallbackObject,
  loadedCommands: ILoadedCommands
) {
  const loadedCommand = loadedCommands[iCallback.interaction.commandName];
  if (loadedCommand) {
    if (loadedCommand.iComand.callback) {
      let res: any = await loadedCommand.iComand.callback(iCallback);

      if (res && (typeof res == 'string' || typeof res == 'number')) {
        iCallback.interaction.reply({
          content: res.toString(),
          ephemeral: true,
        });
      }
    }
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
  };
}

export function slashInteractionCreate(
  interaction: CommandInteraction,
  options: Options,
  loadedCommands: ILoadedCommands
) {
  if (interaction.isCommand()) {
    const callbackObject = interactionToCallback(interaction, options);
    callInteractionCommand(callbackObject, loadedCommands);
  }
}
