import { z } from "zod";

import { mediaUploadSchema } from "@/features/media/schemas/media-upload-schema";
import { MAX_POST_MEDIA } from "@/features/posts/constants/max-post-media";
import { createPostFormSchema } from "@/features/posts/schemas/create-post-form-schema";

export const createPostSchema = createPostFormSchema
  .extend({
    media: z
      .array(mediaUploadSchema)
      .max(MAX_POST_MEDIA, { message: `A post can carry at most ${MAX_POST_MEDIA} files` }),
  })
  .refine((post) => post.content.length > 0 || post.media.length > 0, {
    message: "Write something or attach a file",
  });
