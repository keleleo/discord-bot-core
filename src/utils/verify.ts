import { Client } from 'discord.js';

import { ErrorType } from '../models/ICallbackErrorObject';
import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';
import { Options } from '../models/Options';
import { dmCheck } from './dm.check';
import { ownerCheck } from './owner.check';
import { permissionCheck } from './permissions.check';
import { requiredPermissionCheck } from './requiredPermissions.check';
import { testOnlyCheck } from './testOnly.check';

export function verify(
  iCallback: ICallbackObject<any>,
  iCommand: ICommand<any>,
  client: Client,
  options: Options
): ErrorType | undefined {
  if (!dmCheck(iCallback, iCommand)) return ErrorType.dm;
  if (!ownerCheck(iCallback.user, iCommand, client)) return ErrorType.owner;
  if (!permissionCheck(iCallback.member, iCommand)) return ErrorType.permission;
  if (!requiredPermissionCheck(iCallback.member, iCommand))
    return ErrorType.requiredPermission;
  if (!testOnlyCheck(iCallback, iCommand, options)) return ErrorType.test;

  return;
}
