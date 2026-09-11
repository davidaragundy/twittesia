// What a server action or query returns when it can fail. Callers branch on `error.code`,
// which is typed to the codes the function declares; `message` is only for people to read.
export type ActionResponse<TData, TCode extends string> =
  | { data: TData; error: null }
  | { data: null; error: { code: TCode; message: string } };
