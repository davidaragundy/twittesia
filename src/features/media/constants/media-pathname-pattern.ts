// A path the browser proposes for an upload: a random id it cannot collide with, and the
// extension of its type. Nothing about who uploaded it is in the path, which is public.
export const MEDIA_PATHNAME_PATTERN = /^media\/[A-Za-z0-9_-]{21}\.[a-z0-9]{2,5}$/;
