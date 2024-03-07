import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/context/AuthContext";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
        <div className="p-3 pt-10 pl-10 w-screen h-screen overflow-x-auto overflow-y-hidden">{children}</div>
        <Navbar />
      </SessionProvider>
    </main>
  );
}
