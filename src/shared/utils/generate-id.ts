import { v7 } from "uuid";

// Every id in the app, on the server and in the browser: a UUIDv7 (RFC 9562), which sorts by when
// it was made and needs nothing shared between the instances that make them
export const generateId = () => v7();
