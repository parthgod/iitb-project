"use client";
import React from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IUserRegister {
  email: string;
  password: string;
}

export default function LoginForm() {
  // To redirect user use use router
  const router = useRouter();

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
    // toast loading
    const toastLoading = toast.loading("processing...");
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // console.log("response", response);
      toast.success("Successfully signed in");
      router.push("/");

      // toast success
    } catch (error: any) {
      // toast error
      toast.error("Failed!", error?.message);
    } finally {
      // toast close
      toast.dismiss(toastLoading);
    }
  };

  const redirectToRegister = () => {
    window.location.href = "http://localhost:3000/register";
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
          <Link
            href="/register"
            className="text-gray-500"
          >
            Don't have an account? <span className="text-blue-500 underline">Create new account</span>
          </Link>
        </CardFooter>
      </form>
    </>
  );
}
function useNavigate() {
  throw new Error("Function not implemented.");
}
