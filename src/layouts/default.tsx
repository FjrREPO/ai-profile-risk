import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen bg-cover bg-no-repeat bg-hero">
      <div className="backdrop-blur-sm w-full flex-1 flex flex-col relative">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
          {children}
        </main>
        <footer className="w-full flex items-center justify-center py-3">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="#"
            title="profile risk homepage"
          >
            <span className="text-default-600">Powered by</span>
            <p className="text-primary">AI</p>
          </Link>
        </footer>
      </div>
    </div>
  );
}
