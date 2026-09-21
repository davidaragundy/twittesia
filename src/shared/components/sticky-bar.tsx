type Props = {
  children: React.ReactNode;
};

// Stays just under the header while the list below it scrolls, so its controls are always in
// reach; what passes under it is blurred rather than cut off
export function StickyBar({ children }: Props) {
  return (
    <div className="sticky top-20 z-30 -my-2 flex items-center justify-end gap-2 bg-background/80 py-2 backdrop-blur-xl">
      {children}
    </div>
  );
}
