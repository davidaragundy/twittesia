// What the browser gets of the session: the fields the UI renders, never the token
export type Session = {
  user: {
    id: string;
    name: string;
    username: string;
    displayUsername: string;
    // When the identity stops working, in milliseconds since the epoch
    expiresAt: number;
  };
  session: { id: string };
};
