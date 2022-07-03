import {
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
  Interaction,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js';

export interface ICallbackObject {
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
}
