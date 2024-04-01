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
    <div className="flex h-screen items-center justify-center pr-10">
      {status === "sent" ? (
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Request Sent successfully</CardTitle>
            <CardDescription className="text-gray-300">
              Your request to login has been sent successfully to the user. Please wait for admin&apos;s approval. You
              will receive the updated status of request in your mail. Thank you
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Request Login Access</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your name and email below to request access
            </CardDescription>
          </CardHeader>
          <RequestLoginForm />
        </Card>
      )}
    </div>
  );
}
