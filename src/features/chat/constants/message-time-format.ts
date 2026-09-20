// A message is minutes old at most, so it says the time of day and nothing more
export const MESSAGE_TIME_FORMAT = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});
