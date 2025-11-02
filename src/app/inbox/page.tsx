import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div>
      Welcome {session.user.name || 'User'} 
      {session.user.role && `(${session.user.role})`}
    </div>
  );
}
