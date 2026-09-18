import { z } from "zod";

export const mediaKindSchema = z.enum(["image", "video", "audio"]);
