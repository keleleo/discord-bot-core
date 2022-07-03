import { User, Client } from 'discord.js';

import { ICommand } from '../models/ICommand';

export function ownerCheck(
  user: User,
  icommand: ICommand,
  client: Client
): boolean {
  if (!icommand.ownerOnly) return true;
  if (client.application?.owner)
    return user.id == client.application?.owner?.id;
  return false;
}
