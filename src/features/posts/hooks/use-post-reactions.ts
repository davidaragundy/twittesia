import { useTogglePostReactionMutation } from "@/features/posts/hooks/use-toggle-post-reaction-mutation";

interface Props {
  postId: string;
}

export const usePostReactions = ({ postId }: Props) => {
  const { mutate } = useTogglePostReactionMutation();

  return { toggle: (emoji: string) => mutate({ postId, emoji }) };
};
