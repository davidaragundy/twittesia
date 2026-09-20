"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface Props {
  // Rendered on the server and passed through, so both tabs are ready before either is opened
  posts: React.ReactNode;
  comments: React.ReactNode;
}

export const ProfileTabs = ({ posts, comments }: Props) => (
  <Tabs defaultValue="posts">
    <TabsList className="mb-6 self-center">
      <TabsTrigger value="posts">Posts</TabsTrigger>
      <TabsTrigger value="comments">Comments</TabsTrigger>
    </TabsList>

    <TabsContent value="posts">{posts}</TabsContent>
    <TabsContent value="comments">{comments}</TabsContent>
  </Tabs>
);
