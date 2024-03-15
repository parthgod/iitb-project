import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/context/AuthContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex">
      <SessionProvider session={session}>
        <Sidebar />
        <div className="w-full h-screen overflow-auto pl-3">{children}</div>
      </SessionProvider>
    </main>
  );
}
