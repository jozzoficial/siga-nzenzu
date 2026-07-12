import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-[280px]">
        <Header />
        <main className="flex-1 overflow-auto p-margin-mobile md:p-margin-desktop">
          {children}
        </main>
      </div>
    </div>
  );
}
