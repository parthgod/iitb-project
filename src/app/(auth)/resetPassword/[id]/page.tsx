import { getUserById } from "@/lib/actions/users.actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ResetPasswordForUserPage = async ({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams: {
    token: string;
  };
}) => {
  const session = await getServerSession();
  if (session) {
    redirect("/bus");
  }

  const { id } = params;
  const token = searchParams.token || "";

  const { data: user } = await getUserById(id);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center pr-10">
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Invalid User</CardTitle>
            <CardDescription className="text-gray-300">
              It seems like this user is invalid. Please try again.
            </CardDescription>
            <Link
              href="/resetPassword"
              className="text-sm underline text-gray-200 text-left"
            >
              Go back to reset password
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const expirationTime = new Date(user.resetPasswordExpiry);
  const currentTime = new Date();

  if (token !== user.resetPasswordToken) {
    return (
      <div className="flex h-screen items-center justify-center pr-10">
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Token invalid</CardTitle>
            <CardDescription className="text-gray-300">
              It seems like the token to reset your password is invalid. Please try again.
            </CardDescription>
            <Link
              href="/resetPassword"
              className="text-sm underline text-gray-200 text-left"
            >
              Go back to reset password
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (currentTime > expirationTime) {
    return (
      <div className="flex h-screen items-center justify-center pr-10">
        <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Token expired</CardTitle>
            <CardDescription className="text-gray-300">
              Sorry but unfortunately, the time limit to reset your password has expired. Please try again
            </CardDescription>
            <Link
              href="/resetPassword"
              className="text-sm underline text-gray-200 text-left"
            >
              Go back to reset password
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center pr-10">
      <Card className="bg-[#b2b2b2] w-full bg-opacity-[0.25] backdrop-blur-md border-0 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Reset password</CardTitle>
          <CardDescription className="text-gray-300">
            Please enter your new password below. Confirm the new password by enterring it once again.
          </CardDescription>
        </CardHeader>
        <ResetPasswordForm userId={id} />
      </Card>
    </div>
  );
};

export default ResetPasswordForUserPage;
