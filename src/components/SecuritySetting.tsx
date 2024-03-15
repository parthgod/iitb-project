"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Session } from "next-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePassword } from "@/lib/actions/users.actions";
import { toast } from "sonner";

const formSchema = z.object({
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
});

const SecuritySetting = ({ session }: { session: Session }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    try {
      const response = await changePassword({ password: data.password, id: session.user.id });
      if (response.status === 404 || response.status === 500) {
        toast.error(response.data);
      } else {
        toast.success(response.data);
        form.reset({ password: "", confirmPassword: "" });
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold my-3">Security Setting</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-2 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <div className="w-full flex items-center">
                  <FormLabel className="whitespace-nowrap w-[15%]">New password:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new password"
                      {...field}
                      type="password"
                      className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                    />
                  </FormControl>
                </div>
                <FormMessage className="ml-[13%]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <div className="w-full flex items-center">
                  <FormLabel className="whitespace-nowrap w-[15%]">Confirm new password:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter new password"
                      {...field}
                      type="password"
                      className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                    />
                  </FormControl>
                </div>
                <FormMessage className="ml-[13%]" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-fit"
          >
            Change password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SecuritySetting;
