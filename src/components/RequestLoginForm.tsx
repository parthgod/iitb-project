"use client";

import { createLoginRequest } from "@/lib/actions/loginRequest.actions";
import { uploadAvatarImages } from "@/lib/firebase/storage";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";

interface IUserRegister {
  name: string;
  email: string;
}

export default function RequestLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserRegister>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const router = useRouter();

  register("name", { required: "Name is required" });

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
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const bgColors = ["#461E52", "#DD517F", "#E68E36", "#556DC8", "#7998EE", "#DD517F", "#FF68A8"];
        const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

        ctx.fillStyle = randomColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        let initials: string;
        if (data.name.includes(" ")) {
          const words = data.name.split(" ");
          initials = words[0][0].toUpperCase() + words[1][0].toUpperCase();
        } else {
          initials = data.name.substring(0, 2).toUpperCase();
        }

        ctx.fillText(initials, canvas.width / 2, canvas.height - 33);

        const dataUrl = canvas.toDataURL();
        const image = await fetch(dataUrl);
        const arrayBuffer = await image.arrayBuffer();
        const imgUrl = await uploadAvatarImages(arrayBuffer, data.name);

        const response = await createLoginRequest({ ...data, image: imgUrl });
        if (response.status === 400 || response.status === 403) {
          toast.error(response.data);
          return;
        } else {
          toast.success(response.data);
          router.push("/requestLogin?status=sent");
        }
      }
    } catch (error: any) {
      console.log(error);
      return toast.error("Failed!", error?.message);
    } finally {
      toast.dismiss(toastLoading);
    }
  };

  return (
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
      </CardContent>
      <CardFooter className="flex flex-col gap-5">
        <Button
          className="w-full"
          type="submit"
        >
          Submit
        </Button>
        {/* <p className="text-gray-500">
            Already have an account?{" "}
            <span className="text-blue-500 underline">
              <Link href="/login">Login here</Link>
            </span>
          </p> */}
      </CardFooter>
    </form>
  );
}
