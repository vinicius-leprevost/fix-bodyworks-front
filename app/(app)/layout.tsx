import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex relative flex-col md:flex-row min-h-screen bg-gray">
        <Sidebar />
        <Header />
        <div className="overflow-y-auto overflow-x-hidden w-full">{children}</div>
      </div>
    </>
  );
}
