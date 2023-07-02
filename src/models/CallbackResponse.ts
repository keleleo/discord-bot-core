export type CallbackResponse =
  | string
  | number
  | Promise<string | number>
  | null
  | undefined;
