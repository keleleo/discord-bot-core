import { ICallbackObject } from './ICallbackObject';

export interface ICallbackErrorObject<T = any> extends ICallbackObject<T>{
  errorType:ErrorType
}

export enum ErrorType{
  owner,
  dm,
  permission,
  requiredPermission,
  test,
  notfound
}
