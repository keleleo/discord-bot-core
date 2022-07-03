import { BotController } from '..';
import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';

export function testOnlyCheck(
  iCallback: ICallbackObject,
  iCommand: ICommand,
  instance: BotController
): boolean {
  if (!iCommand.testOnly) return true;

  if (!instance.options.testServer) return false;
  if (!iCallback.guild) return false;
  return instance.options.testServer.includes(iCallback.guild.id.toString());
}
