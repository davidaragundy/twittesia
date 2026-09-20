// One thing someone said, as the room shows it. It exists in the two open pages and nowhere else:
// nothing on a server, and nothing in this browser once the page is gone.
export type ChatMessage = {
  id: string;
  body: string;
  sentAt: Date;
  isMine: boolean;
  // Whether the other page acknowledged it. Nobody there means it was lost, which is the deal.
  isDelivered: boolean;
};
