// Exactly one emoji as Unicode defines them, skin tones and ZWJ sequences included. Built with
// RegExp because the v flag is newer than the compile target.
export const SINGLE_EMOJI_PATTERN = new RegExp("^\\p{RGI_Emoji}$", "v");
