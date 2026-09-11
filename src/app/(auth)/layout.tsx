import { SiteHeader } from "@/shared/components/site-header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 sm:px-6">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
