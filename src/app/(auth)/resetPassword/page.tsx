import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordEmailForm from "@/components/ForgotPasswordEmailForm";

const ResetPasswordPage = async ({ searchParams }: { searchParams: { status: string } }) => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  const status = searchParams.status;

  return (
    <div className="flex h-screen items-center justify-center pr-10">
      {status === "sent" ? (
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Email sent successfully</CardTitle>
            <CardDescription className="text-gray-300">
              An email has been sent to given email address containing a link to reset password. Please wait for the
              email and ensure to check your spam folder as well.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Forgot your password?</CardTitle>
            <CardDescription className="text-gray-300">
              Enter the email address associated with your account below and we will send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <ForgotPasswordEmailForm />
        </Card>
      )}
    </div>
  );
};

export default ResetPasswordPage;
