// A path the upload route names for a file: a UUIDv7 and the extension of its type. Nothing about
// who uploaded it is in the path, which is public; the browser sends it back to attach the file.
export const MEDIA_PATHNAME_PATTERN =
  /^media\/[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]{2,5}$/;
