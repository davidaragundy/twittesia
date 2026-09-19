// Who someone is on Twittesia, for as long as it lasts
export type Identity = {
  id: string;
  handle: string;
  name: string;
  // Milliseconds since the epoch
  createdAt: number;
};
