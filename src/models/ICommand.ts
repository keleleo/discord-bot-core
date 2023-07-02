import { ApplicationCommandOptionData, PermissionResolvable } from 'discord.js';

import { ICallback } from './ICallback';
import { CallbackResponse } from './CallbackResponse';

export interface ICommand {
  name: string;
  description: string;
  callback(callback: ICallback): CallbackResponse;
  callbackError?(callback: ICallback): CallbackResponse;
  slash?: boolean | 'both';
  testOnly?: boolean;
  everyPermissions?: PermissionResolvable[];
  anyPermissio?: PermissionResolvable[];
  ownerOnly?: boolean;
  dm?: boolean | 'both';
  options?: ApplicationCommandOptionData[];
}
