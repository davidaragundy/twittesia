// The __Host- prefix makes the browser refuse the cookie unless it is Secure, set by this host
// alone and for every path, so no subdomain can plant or read it. Browsers only accept it over
// HTTPS, so local development uses the bare name.
export const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-twittesia-session" : "twittesia-session";
