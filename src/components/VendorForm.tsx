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
import { IDefaultParamSchema, IVendorColumn } from "@/lib/database/models/defaultParams";
import { createVendor, updateVendor } from "@/lib/actions/vendor.actions";
import { revalidatePath } from "next/cache";

interface VendorFormProps {
  vendorFields: IVendorColumn[];
  vendorDetails?: any;
}

const generateFormSchema = (fields: IVendorColumn[]) => {
  const schema: any = {};

  fields.map((field) => {
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
    vendorFields.map((item) => {
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
      const isDefault = vendorFields.find((field) => field.field === item)?.isDefault;
      console.log(isDefault);
      if (isDefault) defaultFields[item] = data[item];
      else additionalFields[item] = data[item];
    });
    console.log(defaultFields);
    console.log(additionalFields);
    try {
      let response;
      let req = {
        defaultFields: defaultFields,
        additionalFields: additionalFields,
      };
      if (vendorDetails) {
        response = await updateVendor(req, vendorDetails._id);
      } else {
        response = await createVendor(req);
      }
      if (response?.status === 409) {
        toast.error(`Vendor with Vendor ID:${data?.vendorId} already exists`);
      } else if (response?.status === 200) {
        toast.success(vendorDetails ? "Vendor edited successfully" : "New vendor created successfully");
        router.push("/");
        router.refresh();
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
            {vendorFields.map((item, ind: number) => {
              if (item.type === "text" || item.type === "number")
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
                            type={item.type}
                            className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              else if (item.type === "image")
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
