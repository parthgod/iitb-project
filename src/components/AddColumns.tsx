"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertField } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { createDefaultParams, updateDefaultParams } from "@/lib/actions/defaultParams.actions";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Name of field must be atleast 2 characters" }),
  type: z.string({
    required_error: "Please select appropriate type of field",
  }),
});

const AddColumns = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const dummy = async () => {
    try {
      const response = await createDefaultParams();
      if (response?.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await updateDefaultParams({
        columnName: data.name,
        columnType: data.type,
        columnField: convertField(data.name),
      });
      if (response?.status === 200) {
        location.reload();
        toast.success(`New column ${data.name} added successfully`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-5">
      {/* <Button
        variant={"destructive"}
        onClick={dummy}
      >
        Add new column
      </Button> */}
      <Dialog>
        <DialogTrigger className={buttonVariants()}>Add column</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-center">Add a new column</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select appropriate type of field"
                            className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddColumns;
