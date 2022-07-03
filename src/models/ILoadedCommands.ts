import { BotController } from './..';
import { ICommand } from './ICommand';

export interface ILoadedCommandList {
  [key: string]: ILoadedCommand;
}
export interface ILoadedCommand {
  iCommand: ICommand;
  instance: BotController;
}
