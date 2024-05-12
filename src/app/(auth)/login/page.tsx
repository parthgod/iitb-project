import LoginForm from "@/components/LoginForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/bus");
  }

  return (
    <div className="flex h-screen items-center justify-center pr-10">
      <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Login to your account</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email and password below to login your account
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}
