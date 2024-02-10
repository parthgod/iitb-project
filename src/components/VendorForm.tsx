"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { FileUploader } from "./FileUploader";
import { IDefaultParamSchema } from "@/models/defaultParams";

interface VendorFormProps {
  vendorFields: any;
  vendorDetails?: any;
}

const generateFormSchema = (fields: IDefaultParamSchema[]) => {
  const schema: any = {};

  fields.map((field: any) => {
    schema[field.field] = z.string();
  });

  return z.object(schema);
};

const VendorForm = ({ vendorFields, vendorDetails }: VendorFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const FormSchema = generateFormSchema(vendorFields);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: vendorDetails,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    let uploadedImageUrl: any = {};
    vendorFields.map((item: any) => {
      if (item.type === "image") {
        uploadedImageUrl[item.field] = data[item.field];
      }
    });
    console.log(uploadedImageUrl);

    if (files.length > 0) {
      console.log(files);
      files.forEach((file) => {
        console.log(file);
      });
      const uploadPromises = files.map((file: any) => startUpload(file));
      const images: any = await Promise.all(uploadPromises);
      console.log(images);
      Object.keys(uploadedImageUrl).map((item: any, ind: any) => {
        data[item] = images[ind][0].url;
      });
      console.log(data);
    }

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
    setIsLoading(false);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 justify-between h-[90vh] pr-5"
        >
          <div className="grid grid-cols-2 gap-5">
            {vendorFields.map((item: any, ind: any) => {
              if (item.type === "text")
                return (
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
                );
              if (item.type === "image")
                return (
                  <FormField
                    key={ind}
                    control={form.control}
                    name={item?.field}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{item?.title}</FormLabel>
                        <FormControl>
                          <FileUploader
                            onFieldChange={field.onChange}
                            imageUrl={field.value}
                            setFiles={setFiles}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
            })}
          </div>
          <div className="flex gap-5 py-3">
            <Button
              type="submit"
              className="w-1/3"
            >
              Submit
            </Button>
            <Button
              type="button"
              className="w-1/3"
              variant="destructive"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      {isLoading && (
        <div className="z-10 absolute top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-black bg-opacity-50">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <p className="mt-12 text-3xl font-bold text-gray-100">Submitting...</p>
        </div>
      )}
    </div>
  );
};

export default VendorForm;
