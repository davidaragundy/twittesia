"use client";

import { Suspense } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";

import { PostComposer } from "@/features/posts/components/post-composer";
import { PostComposerSkeleton } from "@/features/posts/components/post-composer-skeleton";
import { usePostComposeDialog } from "@/features/posts/hooks/use-post-compose-dialog";

interface Props {
  // What opens it, such as the sidebar's button or the one beside the tab bar
  trigger: React.ReactElement;
}

const TITLE = "New post";
const DESCRIPTION = "It lives for 24 hours, then it's gone.";

// Writing a post from anywhere, without losing your place: a dialog, or a drawer on a phone
export const PostComposeDialog = ({ trigger }: Props) => {
  const { isMobile, isOpen, setOpen, onPublished } = usePostComposeDialog();

  const composer = (
    <Suspense fallback={<PostComposerSkeleton />}>
      <PostComposer onPublished={onPublished} autoFocus />
    </Suspense>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setOpen}>
        <DrawerTrigger render={trigger} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pt-2 pb-8">{composer}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        {composer}
      </DialogContent>
    </Dialog>
  );
};
