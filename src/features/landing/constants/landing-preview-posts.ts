// What the landing shows of a feed: made up, and marked as an example where it is shown
export const LANDING_PREVIEW_POSTS = [
  {
    seed: "sleepy-otter",
    name: "Sleepy Otter",
    time: "2m",
    endsIn: "23h 58m",
    content: "Said something I'd never say on my main. Tomorrow it's gone, and so am I.",
    reactions: [
      { emoji: "😂", count: 12 },
      { emoji: "🔥", count: 4 },
    ],
  },
  {
    seed: "brave-toast",
    name: "Brave Toast",
    time: "5h",
    endsIn: "19h 02m",
    content: "No followers, no history, no archive. Just today.",
    reactions: [{ emoji: "❤️", count: 31 }],
  },
] as const;
