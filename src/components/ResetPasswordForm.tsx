"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/actions/users.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

const ResetPasswordForm = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setIsLoading(true);
    const toastLoading = toast.loading("Processing...");
    try {
      const response = await changePassword({ password: data.password, id: userId });
      if (response.status === 404 || response.status === 500) {
        setIsLoading(false);
        toast.dismiss(toastLoading);
        return toast.error(response.data);
      } else {
        toast.dismiss(toastLoading);
        setIsLoading(false);
        toast.success(response.data + " Please login with your new credentials.");
        router.push("/login");
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="whitespace-nowrap text-white">New password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter new password"
                  {...field}
                  disabled={isLoading}
                  type="password"
                  required
                  className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                />
              </FormControl>
              <FormMessage className="ml-[13%]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mt-5">
              <FormLabel className="whitespace-nowrap text-white">Confirm new password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Re-enter new password"
                  {...field}
                  disabled={isLoading}
                  type="password"
                  required
                  className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                />
              </FormControl>
              <FormMessage className="ml-[13%]" />
            </FormItem>
          )}
        />
        <div className="mt-4 flex items-center gap-5 w-full">
          <Button
            type="submit"
            className="w-full"
          >
            Change password
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

export default ResetPasswordForm;
