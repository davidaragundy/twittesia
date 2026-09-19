import { getSession } from "@/features/auth/queries/get-session";
import { handleMediaUploadRequest } from "@/features/media/utils/handle-media-upload-request";

// Composes the two features here, so media never imports auth: it is handed the identity rather
// than looking it up, and stays free for auth to depend on

export const POST = async (request: Request) => {
  const session = await getSession();

  return handleMediaUploadRequest({ request, userId: session?.user.id ?? null });
};
