import { LEAVE_SEARCH_PARAM } from "@/features/auth/constants/leave-search-param";

// Shallow URL update through the native History API: Next.js syncs it with useSearchParams
// without a server round trip, so the dialog reacts instantly. The same trick the settings
// dialog uses, and the reason both the mobile button and the account menu can open one dialog.
export const writeLeaveOpen = (isOpen: boolean) => {
  const url = new URL(window.location.href);

  if (isOpen) url.searchParams.set(LEAVE_SEARCH_PARAM, "1");
  else url.searchParams.delete(LEAVE_SEARCH_PARAM);

  window.history.replaceState(null, "", url);
};
