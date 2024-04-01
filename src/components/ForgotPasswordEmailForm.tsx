"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/users.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string(),
});

const ForgotPasswordEmailForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastLoading = toast.loading("Processing...");
    try {
      const response = await resetPassword(data.email);
      if (response.status === 404) {
        setIsLoading(false);
        toast.dismiss(toastLoading);
        return toast.error(response.data);
      }
      if (response.status === 200) {
        setIsLoading(false);
        toast.dismiss(toastLoading);
        toast.success(response.data);
        router.push("/resetPassword?status=sent");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="px-6 pb-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={isLoading}
                  required
                  placeholder="abc@xyz.com"
                  className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_33px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex items-center gap-5 w-full">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            Submit
          </Button>
          <Link
            href="/login"
            className={buttonVariants() + " w-full"}
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordEmailForm;
