"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { FC, PropsWithChildren } from "react";

import { ThemeProvider } from "@/shared/components/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { getQueryClient } from "@/shared/lib/react-query/get-query-client";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(() =>
        import("@tanstack/react-query-devtools").then(
          ({ ReactQueryDevtools: Devtools }) => Devtools,
        ),
      )
    : null;

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          {children}

          {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
        </QueryClientProvider>

        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
};
