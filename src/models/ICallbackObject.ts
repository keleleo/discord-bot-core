import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';

export interface ICallbackObject<T = any> {
  channel: TextChannel;
  message: Message;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
  args: string[];
  text: string;
  prefix: string;
  user: User;
  guild: Guild | null;
  member: GuildMember;
  custom?: T;
}
