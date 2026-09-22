"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "@upstash/realtime/client";
import { FC, PropsWithChildren } from "react";

import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { REALTIME_URL } from "@/shared/constants/realtime-url";
import { getQueryClient } from "@/shared/utils/get-query-client";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {/* withCredentials: the stream is only for someone with an identity, so it carries the
          session cookie */}
      <RealtimeProvider api={{ url: REALTIME_URL, withCredentials: true }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            {/* At the top, where the eye already is and clear of the tab bar, drawn like the app's
                cards: soft, round and borderless, floating over the page */}
            <Toaster
              position="top-center"
              offset={{ top: 24 }}
              mobileOffset={{ top: 16 }}
              toastOptions={{
                classNames: {
                  toast:
                    "cn-toast gap-3! rounded-3xl! border-0! bg-popover/95! px-5! py-4! shadow-xl! backdrop-blur-xl!",
                  title: "text-sm! font-semibold!",
                  description: "text-sm! leading-relaxed! text-muted-foreground!",
                },
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </RealtimeProvider>
    </QueryClientProvider>
  );
};
