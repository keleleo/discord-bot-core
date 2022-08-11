import { ApplicationCommandOptionData, PermissionString } from 'discord.js';

import { ICallbackObject } from './ICallbackObject';

export interface ICommand<T = any> {
  name: string;
  category: string;
  description: string;
  callback?(obj: ICallbackObject<T>): any;
  error?(obj: any): any;
  slash?: boolean | 'both';
  // requireRoles?: boolean;
  testOnly?: boolean;
  // minArgs?: number;
  // maxArgs?: number;
  requiredPermissions?: PermissionString[];
  permissions?: PermissionString[];
  ownerOnly?: boolean;
  dm?: boolean | 'both';
  options?: ApplicationCommandOptionData[];
}
