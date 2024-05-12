"use client";

import { createAdmin } from "@/lib/actions/users.actions";
import { uploadAvatarImages } from "@/lib/firebase/storage";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, buttonVariants } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

interface IUserRegister {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setIsSuccess] = useState(false);

  const { register, handleSubmit } = useForm<IUserRegister>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  register("password", {
    required: "Password is required",
    // pattern: {
    //   value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[^ ]+[A-Za-z\d@$!%*?&]*$/,
    //   message: "Password must contain at least one letter, one number, and one special character and should not contain spaces",
    // },
  });

  register("email", {
    required: "Email address is required",
    // pattern: {
    //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    //   message: "Invalid email address format",
    // },
  });

  const handleSubmitForm = async (data: IUserRegister) => {
    setIsLoading(true);
    const toastLoading = toast.loading("Processing...");
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error === "AccessDenied") {
        setIsLoading(false);
        toast.dismiss(toastLoading);
        return toast.error("Account is disabled. Please contact admin.");
      }

      if (response?.status === 401) {
        setIsLoading(false);
        toast.dismiss(toastLoading);
        return toast.error("Incorrect email or password. Please try again");
      }

      toast.dismiss(toastLoading);
      toast.success("Successfully signed in");
      setIsSuccess(true);
      router.push("/bus");
    } catch (error) {
      console.log(error);
      toast.error("Failed!");
    }
  };

  const handleAddAdmin = async () => {
    setIsLoading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const randomColor = "#2C3333";

        ctx.fillStyle = randomColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        ctx.fillText("AD", canvas.width / 2, canvas.height - 33);

        const dataUrl = canvas.toDataURL();
        const image = await fetch(dataUrl);
        const arrayBuffer = await image.arrayBuffer();
        const imgUrl = await uploadAvatarImages(arrayBuffer, "Admin");
        const response = await createAdmin({
          name: "Admin",
          email: "admin@gmail.com",
          password: "123",
          image: imgUrl,
          isAdmin: true,
        });
        if (response.status === 200) toast.success("Success!!!");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      {success ? (
        <div className="flex items-center gap-2 px-6 py-2">
          <div className="flex-col gap-4 flex items-center justify-center">
            <div className="w-10 h-10 border-4 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-yellow-600 rounded-full">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
                className="animate-ping"
              ></svg>
            </div>
          </div>
          <p className="text-gray-300 whitespace-nowrap">Please wait, you will be redirected soon...</p>
        </div>
      ) : (
        <>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-white"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                disabled={isLoading}
                placeholder="abc@xyz.com"
                required
                className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-white"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                disabled={isLoading}
                required
                placeholder="Password"
                className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                {...register("password")}
              />
              <div className="flex justify-end">
                <Link
                  href="/resetPassword"
                  className={`text-sm underline text-gray-200 ${isLoading && "pointer-events-none cursor-not-allowed text-gray-400"
                    } `}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-5 px-6">
            <Button
              className="w-full active:scale-95"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? "Login" : "Processing..."}
            </Button>
            <Link
              href="/requestLogin"
              className={buttonVariants() + " w-full bg-yellow-500 hover:bg-yellow-500/80 active:scale-95"}
            >
              Request access
            </Link>

            {/* <Button
              className="w-full"
              variant="destructive"
              onClick={handleAddAdmin}
            >
              Login admin
            </Button> */}
          </CardFooter>
        </>
      )}
    </form>
  );
}
