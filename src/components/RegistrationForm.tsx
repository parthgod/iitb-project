"use client";

import { createNewUser } from "@/lib/actions/users.actions";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserRegister>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  register("name", { required: "Name is required" });
  register("password", {
    required: "Password is required",
    // pattern: {
    //   // value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[^ ]+[A-Za-z\d@$!%*?&]*$/,
    //   message:
    //     "Password must contain at least one letter, one number, and one special character and should not contain spaces",
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
    const toastLoading = toast.loading("Processing...");
    try {
      const response = await createNewUser(data);
      if (response.status === 400 || response.status === 403) {
        toast.error(response.data);
        return;
      } else {
        toast.success("User registration completed successfully. Please login with your credentials");
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      return toast.error("Failed!", error?.message);
    } finally {
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              id="text"
              type="name"
              placeholder="Name"
              className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
              {...register("name")}
            />
            {errors?.name && <span className="text-red-500 text-sm"> {errors?.name?.message} </span>}
          </div>

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
              placeholder="Password"
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
            Create account
          </Button>
          <Link
            href="/login"
            className="text-gray-500"
          >
            Already have an account? <span className="text-blue-500 underline">Login here</span>
          </Link>
        </CardFooter>
      </form>
    </>
  );
}
