// What the landing page says for each reason /start sent someone back
export const START_ERROR_COPY: Record<string, { title: string; description: string }> = {
  "rate-limited": {
    title: "Too many new identities",
    description: "Your network has started a lot of them lately. Try again in an hour.",
  },
  failed: {
    title: "Couldn't start",
    description: "Please try again in a moment.",
  },
};
