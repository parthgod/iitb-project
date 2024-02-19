"use client";
import React from "react";
import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const providers = [
  { providerName: "github", Icon: <FaGithub /> },
  { providerName: "google", Icon: <FaGoogle /> },
];

export default function LoginProvider() {
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider);
  };

  return (
    <div>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          {providers.map((provider, index) =>
            provider.providerName === "github" ? (
              <Button
                key={index}
                className="capitalize bg-[#111111] hover:bg-[#252525] active:scale-95 transition-all duration-300 ease-in-out flex justify-center items-center gap-2"
                onClick={() => handleOAuthSignIn(provider?.providerName)}
              >
                {/* <Icons.google className="mr-2 h-4 w-4" /> */}
                {provider?.providerName}
                <span className="scale-110">{provider.Icon}</span>
              </Button>
            ) : (
              <Button
                key={index}
                className="capitalize bg-[#d62d20] hover:bg-[#ae483f] active:scale-95 transition-all duration-300 ease-in-out flex justify-center items-center gap-2"
                onClick={() => handleOAuthSignIn(provider?.providerName)}
              >
                {/* <Icons.google className="mr-2 h-4 w-4" /> */}
                {provider?.providerName}
                {provider.Icon}
              </Button>
            )
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
