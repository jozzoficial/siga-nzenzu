import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userProfile = null;
  if (user) {
    const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single();
    userProfile = data;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#f8fafc]">
      {/* Optional mesh/noise overlay could go here */}
      <Sidebar userProfile={userProfile} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-[280px]">
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-auto p-4 md:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
