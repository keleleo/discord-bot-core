import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import { ErrorType } from '../enums/ErrorType';

export interface ICallback {
  channel?: TextChannel | null;
  message?: Message | null;
  errorType?: ErrorType | null;
  interaction: CommandInteraction | null;
  options: CommandInteractionOptionResolver | null;
  guild: Guild | null;
  guildMember: GuildMember | null;
  args: string[];
  text: string;
  user: User;
}
