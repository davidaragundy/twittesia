import { z } from "zod";

import { MAX_COMMENT_MEDIA } from "@/features/comments/constants/max-comment-media";
import { commentFormSchema } from "@/features/comments/schemas/comment-form-schema";
import { mediaUploadSchema } from "@/features/media/schemas/media-upload-schema";

export const createCommentSchema = commentFormSchema
  .extend({
    postId: z.string().min(1),
    media: z.array(mediaUploadSchema).max(MAX_COMMENT_MEDIA, {
      message: `A comment can carry at most ${MAX_COMMENT_MEDIA} file`,
    }),
  })
  .refine((comment) => comment.content.length > 0 || comment.media.length > 0, {
    message: "Write something or attach a file",
  });
