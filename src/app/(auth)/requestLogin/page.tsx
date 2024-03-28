import RequestLoginForm from "@/components/RequestLoginForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RequestLoginPage({ searchParams }: { searchParams: { status: string } }) {
  const status = searchParams.status || "";
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="bg-zinc-900">
      <div className="flex w-full h-screen items-center justify-center">
        {status === "sent" ? (
          <Card className="w-1/2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Request Sent successfully</CardTitle>
              <CardDescription>
                Your request to login has been sent successfully to the user. Please wait for admin&apos;s approval. You
                will receive the updated status of request in your mail. Thank you
              </CardDescription>
              <Link href="/login">Login</Link>
            </CardHeader>
          </Card>
        ) : (
          <Card className="w-1/2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Request Login Access</CardTitle>
              <CardDescription>Enter your name and email below to request access</CardDescription>
            </CardHeader>
            <RequestLoginForm />
          </Card>
        )}
      </div>
    </div>
  );
}
