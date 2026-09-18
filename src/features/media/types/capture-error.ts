// Why a camera or microphone isn't showing: the browser can't do it here, the person or their
// browser said no, there is no such device, or something else went wrong
export type CaptureError = "unsupported" | "blocked" | "missing" | "failed";
