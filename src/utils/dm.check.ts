import { ICallbackObject } from '../models/ICallbackObject';
import { ICommand } from '../models/ICommand';

export function dmCheck(
  callback: ICallbackObject,
  command: ICommand
): boolean {
  if ((command.dm == undefined && command.dm == null) || command.dm == 'both')
    return true;
  if (callback.message) return (callback.message.guild == null) == command.dm;
  if (callback.interaction) return (callback.interaction.guild ==null) == command.dm
    return true
}
