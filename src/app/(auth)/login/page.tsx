import LoginForm from "@/components/LoginForm";
import LoginProvider from "@/components/LoginProvider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <div className="bg-zinc-900">
      <div className="flex w-full h-screen items-center justify-center">
        <Card className="w-1/2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login your account</CardTitle>
            <CardDescription>Enter your email below to login your account</CardDescription>
          </CardHeader>
          <LoginProvider />
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
