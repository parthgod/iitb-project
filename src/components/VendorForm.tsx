"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface VendorFormProps {
  vendorFields: any;
  vendorDetails?: any;
}

const generateFormSchema = (fields: any) => {
  const schema: any = {};

  fields.map((field: any) => {
    schema[field.field] = z.string();
  });

  return z.object(schema);
};

const VendorForm = ({ vendorFields, vendorDetails }: VendorFormProps) => {
  const router = useRouter();

  const FormSchema = generateFormSchema(vendorFields);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: vendorDetails,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const defaultFields: any = {};
    const additionalFields: any = {};
    console.log(data);
    console.log(vendorFields);
    Object.keys(data).map((item) => {
      const isDefault = vendorFields.find((field: any) => field.field === item)?.isDefault;
      console.log(isDefault);
      if (isDefault) defaultFields[item] = data[item];
      else additionalFields[item] = data[item];
    });
    console.log(defaultFields);
    console.log(additionalFields);
    try {
      const response = await fetch(`/api/vendor${vendorDetails ? "/" + vendorDetails._id : ""}`, {
        method: vendorDetails ? "PATCH" : "POST",
        body: JSON.stringify({
          defaultFields: defaultFields,
          additionalFields: additionalFields,
        }),
      });
      console.log(response.status);
      if (response.status === 409) {
        toast.error(`Vendor with Vendor ID:${data?.vendorId} already exists`);
      }
      if (response.ok) {
        toast.success(vendorDetails ? "Vendor edited successfully" : "New vendor created successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {vendorFields.map((item: any, ind: any) => (
            <FormField
              key={ind}
              control={form.control}
              name={item?.field}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{item?.title}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={item?.title}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default VendorForm;
