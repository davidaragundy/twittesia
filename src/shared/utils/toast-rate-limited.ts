import { toast } from "sonner";

export const toastRateLimited = () =>
  toast.error("Rate limit exceeded 🚫", {
    duration: 10_000,
    description: "Try again later, take a break!",
  });
