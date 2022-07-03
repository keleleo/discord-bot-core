import { GuildMember, PermissionString } from 'discord.js';

import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';

export function requiredPermissionCheck(
  member: GuildMember,
  icommand: ICommand
) {
  let rp: PermissionString[] | undefined = icommand.requiredPermissions;
  if (!rp || rp == []) return true;
  if (!member) return false;
  if (member.permissions.has('ADMINISTRATOR')) return true;

  let r: boolean = true;
  rp.forEach((p) => {
    if (!member.permissions.has(p)) r = false;
  });
  return r;
}
