import { SiteHeader } from "@/shared/components/site-header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-10 lg:px-16">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
