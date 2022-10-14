import { BotController } from '..';
import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';
import { Options } from '../models/Options';

export function testOnlyCheck(
  iCallback: ICallbackObject,
  iCommand: ICommand,
  options: Options
): boolean {
  if (!iCommand.testOnly) return true;

  if (!options.testServer) return false;
  if (!iCallback.guild) return false;
  return options.testServer.includes(iCallback.guild.id.toString());
}
