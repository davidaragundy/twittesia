import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Badge } from "@/shared/components/ui/badge";

import { LANDING_PREVIEW_POSTS } from "@/features/landing/constants/landing-preview-posts";

// A glimpse of the feed, drawn the way the real one is: every post with the time it has left
export const LandingPreview = () => (
  <figure className="mx-auto flex w-full max-w-lg flex-col gap-2 rounded-4xl bg-muted/40 p-3 sm:p-4">
    {LANDING_PREVIEW_POSTS.map((post) => (
      <div key={post.seed} className="flex gap-3 rounded-3xl bg-background p-4 sm:gap-4 sm:p-5">
        <SeededAvatar seed={post.seed} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm">
              <span className="font-semibold">{post.name}</span>
              <span className="text-muted-foreground"> · {post.time}</span>
            </p>
            <Badge variant="ghost">Gone in {post.endsIn}</Badge>
          </div>
          <p className="text-sm leading-relaxed sm:text-base">{post.content}</p>
          <div className="flex gap-1.5">
            {post.reactions.map((reaction) => (
              <Badge key={reaction.emoji} variant="secondary">
                {reaction.emoji} {reaction.count}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ))}
    <figcaption className="sr-only">An example of the feed, with made-up posts</figcaption>
  </figure>
);
