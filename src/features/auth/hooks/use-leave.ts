import { useLeaveMutation } from "@/features/auth/hooks/use-leave-mutation";

export const useLeave = () => {
  const { mutate, isPending } = useLeaveMutation();

  const leave = () => {
    if (!isPending) mutate();
  };

  return { leave, isLeaving: isPending };
};
