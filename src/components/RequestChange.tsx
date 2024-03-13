"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createRequest } from "@/lib/actions/requests.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "./ui/textarea";

const FormSchema = z.object({
  message: z.string(),
});

const RequestChange = ({ userId }: { userId: string }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await createRequest({ userId: userId, message: data.message });
      if (response?.status === 200) {
        toast.success("Request sent successfully");
        form.resetField("message");
      }
    } catch (error) {
      console.log(error);
      toast.error("Action could not be completed. Please try again");
    }
  };

  return (
    <div className="flex gap-5">
      <Dialog>
        <DialogTrigger className={buttonVariants()}>Request change</DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-bold text-center">Request a change</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message"
                        {...field}
                        className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogClose>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestChange;
