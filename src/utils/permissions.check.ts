import { GuildMember } from 'discord.js';

import { ICommand } from '../models/ICommand';

export function permissionCheck(member: GuildMember, iCommand: ICommand) {
  if (!iCommand.permissions) return true;

  if (member.permissions.has('ADMINISTRATOR')) return true;
  if (!member) return false;

  let r: boolean = false;
  iCommand.permissions.forEach((p) => {
    if (member.permissions.has(p)) r = true;
  });

  return r;
}
