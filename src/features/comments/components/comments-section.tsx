import { getSession } from "@/features/auth/queries/get-session";
import { CommentComposer } from "@/features/comments/components/comment-composer";
import { Comments } from "@/features/comments/components/comments";
import { getCommentsPage } from "@/features/comments/queries/get-comments-page";

interface Props {
  params: Promise<{ postId: string }>;
}

// Reads the request, so render it inside a <Suspense> boundary
export async function CommentsSection({ params }: Props) {
  const { postId } = await params;
  const session = await getSession();
  const { data, error } = await getCommentsPage({ postId, viewerId: session?.user.id });

  return (
    <section
      id="comments"
      aria-labelledby="comments-title"
      className="flex scroll-mt-24 flex-col gap-8"
    >
      <h2 id="comments-title" className="text-lg font-semibold tracking-tight">
        Comments
      </h2>

      {session && (
        <CommentComposer postId={postId} viewerHandle={session.user.username ?? session.user.id} />
      )}

      {error ? (
        <p className="text-sm text-muted-foreground">Couldn&apos;t load the comments.</p>
      ) : (
        <Comments postId={postId} initialPage={data} />
      )}
    </section>
  );
}
