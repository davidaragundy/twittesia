import { useTogglePostReactionMutation } from "@/features/posts/hooks/use-toggle-post-reaction-mutation";
import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

interface Props {
  postId: string;
}

export const usePostReactions = ({ postId }: Props) => {
  const { mutate } = useTogglePostReactionMutation();

  return { toggle: (reaction: PostReactionKey) => mutate({ postId, reaction }) };
};
