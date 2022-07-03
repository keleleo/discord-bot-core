import { GuildMember } from 'discord.js';

import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';

export function permissionCheck(
  member: GuildMember,
  icommand: ICommand
) {
  if (!icommand.permissions || icommand.permissions == []) return true;

  if (member.permissions.has('ADMINISTRATOR')) return true;
  if (!member) return false;

  let r: boolean = false;
  icommand.permissions.forEach((p) => {
    if (member.permissions.has(p)) r = true;
  });

  return r;
}
