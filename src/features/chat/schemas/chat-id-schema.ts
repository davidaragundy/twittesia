import { z } from "zod";

// Every id in the app is a UUID, and a chat's is the only thing standing between a stranger and
// the right to knock on it, so anything else is refused before it reaches the store
export const chatIdSchema = z.uuid();
