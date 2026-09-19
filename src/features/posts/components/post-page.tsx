import { notFound, redirect } from "next/navigation";

import { getSession } from "@/features/auth/queries/get-session";
import { PostDetail } from "@/features/posts/components/post-detail";
import { getPost } from "@/features/posts/queries/get-post";
import { getPostPath } from "@/features/posts/utils/get-post-path";

interface Props {
  params: Promise<{ username: string; postId: string }>;
}

// Reads the request, so render it inside a <Suspense> boundary
export async function PostPage({ params }: Props) {
  const { username, postId } = await params;
  const session = await getSession();
  const { data: post, error } = await getPost({ postId, viewerId: session?.user.id });

  if (error?.code === "POST_NOT_FOUND" || (!error && !post.author)) notFound();

  // Any other failure goes to the route's error boundary, which offers a retry
  if (error) throw new Error(error.message);

  // A handle in the URL that isn't the author's points to the real one
  if (post.author && post.author.username !== username) {
    redirect(getPostPath({ username: post.author.username, postId }));
  }

  return <PostDetail initialPost={post} />;
}
