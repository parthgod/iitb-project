import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginProvider from "@/components/LoginProvider";
import RegistrationForm from "@/components/RegistrationForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import React from "react";

export default async function RegisterPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="bg-zinc-900">
      <div className="flex w-full h-screen items-center justify-center">
        <Card className="w-1/2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your email below to create your account</CardDescription>
          </CardHeader>
          <LoginProvider />
          <RegistrationForm />
        </Card>
      </div>
    </div>
  );
}
