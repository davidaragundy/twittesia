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
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </RealtimeProvider>
    </QueryClientProvider>
  );
};
