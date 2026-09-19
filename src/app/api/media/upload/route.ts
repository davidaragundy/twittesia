import { getSession } from "@/features/auth/queries/get-session";
import { createMediaUploadHandler } from "@/features/media/utils/create-media-upload-handler";

// Composes the two features here, so media never imports auth: it is handed the identity rather
// than looking it up, and stays free for auth to depend on
export const { GET, POST } = createMediaUploadHandler({
  getUploaderId: async () => (await getSession())?.user.id ?? null,
});
