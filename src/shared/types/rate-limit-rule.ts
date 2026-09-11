export type RateLimitRule = {
  // Length of the window, in seconds
  window: number;
  // Requests allowed in one window
  max: number;
};
