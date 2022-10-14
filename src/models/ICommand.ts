import { ICallbackErrorObject } from './ICallbackErrorObject';
import { ApplicationCommandOptionData, PermissionString } from 'discord.js';

import { ICallbackObject } from './ICallbackObject';

export interface ICommand<T = any> {
  name: string;
  description: string;
  callback?(obj: ICallbackObject<T>): any;
  error?(obj: ICallbackErrorObject<T>): any;
  slash?: boolean | 'both';
  // requireRoles?: boolean;
  testOnly?: boolean;
  requiredPermissions?: PermissionString[];
  permissions?: PermissionString[];
  ownerOnly?: boolean;
  dm?: boolean | 'both';
  options?: ApplicationCommandOptionData[];
}
