// Navigating anywhere else closes whatever was open: a slot keeps showing its last page on a
// client navigation it doesn't match, so every other path matches this one
export default function CatchAll() {
  return null;
}
