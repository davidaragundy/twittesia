import { handlePurgeRequest } from "@/features/posts/utils/handle-purge-request";

// Long enough for the batches this run allows, short enough to never overlap the next day's run
export const maxDuration = 60;

export const GET = handlePurgeRequest;
