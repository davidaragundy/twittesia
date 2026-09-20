// Someone asking to be let into a chat, as the person who has the invite
export type Knock = {
  identityId: string;
  handle: string;
  name: string;
  knockedAt: Date;
};
