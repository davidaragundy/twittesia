interface Props {
  username: string;
  postId: string;
}

export const getPostPath = ({ username, postId }: Props) => `/${username}/posts/${postId}`;
