import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import Sidebar from "@/components/organisms/Sidebar";
import Topbar from "@/components/organisms/Topbar";
import ProfileSyncState from "@/components/organisms/ProfileSyncState";
import { MascotUserSync } from "@/features/mascot/presentation/MascotUserSync";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <ProfileSyncState />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <MascotUserSync userId={user.id} />
      <Sidebar profile={profile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
