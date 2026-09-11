"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";

import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { getQueryClient } from "@/shared/utils/get-query-client";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
