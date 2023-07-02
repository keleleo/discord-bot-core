import {
  ChannelType,
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  Interaction,
  Message,
  PermissionResolvable,
  PermissionsBitField,
  TextChannel,
  User,
} from 'discord.js';
import { ICommand } from '../models/ICommand';
import { ErrorType } from '../enums/ErrorType';
import { Options } from '../models/Options';
import { ICallback } from '../models/ICallback';

export class CommandInvoker {
  guild: Guild | null;
  user: User;
  guildMember: GuildMember | null;

  constructor(
    public origem: Message | CommandInteraction,
    public command: ICommand,
    public client: Client,
    public options: Options
  ) {
    this.guild = this.getGuild();
    this.user = this.getUser();
    this.guildMember = this.getGuildMember();
    this.call();
  }

  call() {
    const error = this.getError();
    if (error && !this.command.callbackError) return;

    const callback: ICallback = this.createCallback(error);
    this.callCommand(callback);
  }

  async callCommand(callback: ICallback) {
    const func = callback.errorType
      ? this.command.callbackError
      : this.command.callback;
    if (!func) return;
    const response = await func(callback);
    if (response == undefined || response == null) return;
    this.sendAutoResponse(response);
  }

  sendAutoResponse(res: string | number) {
    if (this.origem instanceof Message) {
      this.origem.reply(res.toString());
    } else if (this.origem instanceof CommandInteraction) {
      this.origem.reply({
        content: res.toString(),
        ephemeral: true,
      });
    }
  }

  createCallback(error: ErrorType | undefined): ICallback {
    const channel = this.getChannel();
    let interaction: CommandInteraction | null = null;
    let message: Message | null = null;
    let args = [];

    if (this.origem instanceof Message) {
      message = this.origem;
      args = message.content.split(' ');
    } else if (this.origem instanceof CommandInteraction) {
      interaction = this.origem;
    }

    return {
      options: null,
      user: this.user,
      guild: this.guild,
      channel,
      interaction: interaction,
      args: [],
      message: null,
      text: '',
      guildMember: this.guildMember,
    };
  }

  getError(): ErrorType | undefined {
    if (!this.testOnlyCheck()) return ErrorType.test;
    if (!this.dmCheck()) return ErrorType.dm;
    if (!this.ownerCheck()) return ErrorType.owner;
    if (!this.anyPermissionCheck()) return ErrorType.anyPermission;
    if (!this.everyPermissionCheck()) return ErrorType.everyPermission;
    if (!this.testOnlyCheck()) return ErrorType.test;

    return;
  }

  testOnlyCheck(): boolean {
    if (!this.command.testOnly) return true;
    if (!this.options.testServer) return false;
    if (!this.guild) return false;
    return this.options.testServer.includes(this.guild.id.toString());
  }

  dmCheck(): boolean {
    if (!this.command.dm || this.command.dm == 'both') return true;
    return (this.guild == null) == this.command.dm;
  }

  ownerCheck(): boolean {
    if (!this.command.ownerOnly) return true;
    if (this.client.application?.owner)
      return this.user.id == this.client.application?.owner?.id;
    return false;
  }

  anyPermissionCheck() {
    if (!this.command.anyPermissio) return true;

    const permissions = this.getPermissions();
    if (!permissions) return false;
    return (
      permissions.has('Administrator') ||
      this.command.anyPermissio.some((v) => permissions.has(v))
    );
  }

  everyPermissionCheck() {
    const rp = this.command.everyPermissions;
    if (!rp) return true;
    const permissions = this.getPermissions();
    if (!this.guildMember || !permissions) return false;

    return (
      permissions.has('Administrator') || rp.every((v) => permissions.has(v))
    );
  }

  getChannel(): TextChannel | null {
    return this.origem.channel?.type == ChannelType.GuildText
      ? this.origem.channel
      : null;
  }

  getGuild(): Guild | null {
    return this.origem.guild;
  }

  getUser(): User {
    if (this.origem instanceof Message) {
      return this.origem.author;
    } else {
      return this.origem.user;
    }
  }

  getGuildMember(): GuildMember | null {
    if (this.origem instanceof Message) {
      return this.origem.member;
    } else {
      return this.origem.guild?.members.cache.get(this.user.id) || null;
    }
  }

  getPermissions(): PermissionsBitField | undefined {
    return this.guildMember?.permissions;
  }
}
