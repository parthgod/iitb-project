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
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

interface IUserRegister {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserRegister>({
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
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error === "AccessDenied") {
        setIsLoading(false);
        return toast.error("Account is disabled. Please contact admin.");
      }

      if (response?.status === 401) {
        setIsLoading(false);
        return toast.error("Incorrect email or password. Please try again");
      }

      toast.success("Successfully signed in");
      router.push("/");
    } catch (error: any) {
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
    } catch (error: any) {
      console.log(error);
      toast.error("Failed!");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="abc@xyz.com"
              className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
              {...register("email")}
            />
            {errors?.email && <span className="text-red-500 text-sm"> {errors?.email?.message} </span>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Pawwsord"
              className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
              {...register("password")}
            />
            {errors?.password && <span className="text-red-500 text-sm"> {errors?.password?.message} </span>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-5">
          <Button
            className="w-full"
            type="submit"
          >
            Login
          </Button>
          {/* <Button
            className="w-full"
            variant="destructive"
            onClick={handleAddAdmin}
          >
            Login admin
          </Button> */}
          <p className="text-gray-500">
            Don&apos;t have an account?{" "}
            <span className="text-blue-500 underline">
              {" "}
              <Link href="/requestLogin">Request access</Link>
            </span>
          </p>
        </CardFooter>
      </form>
      {isLoading ? (
        <div className="z-10 absolute top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-black bg-opacity-50">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <p className="mt-12 text-3xl font-bold text-gray-100">Please wait...</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
