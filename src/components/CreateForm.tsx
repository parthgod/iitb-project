"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { createVendor, updateVendor } from "@/lib/actions/vendor.actions";
import { createWarehouse, updateWarehouse } from "@/lib/actions/warehouse.actions";
import { IColumn } from "@/lib/database/models/defaultParams";
import { useUploadThing } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CreateFormProps {
  formFields: IColumn[];
  formDetails?: any;
  type: "Vendor" | "Warehouse" | "Product";
}

const generateFormSchema = (fields: IColumn[]) => {
  const schema: any = {};

  fields.map((field) => {
    schema[field.field] = z.string();
  });

  return z.object(schema);
};

const CreateForm = ({ formFields, formDetails, type }: CreateFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const FormSchema = generateFormSchema(formFields);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDetails,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    let uploadedImageUrl: any = {};
    formFields.map((item) => {
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
    console.log(formFields);
    Object.keys(data).map((item) => {
      const isDefault = formFields.find((field) => field.field === item)?.isDefault;
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
      if (formDetails) {
        switch (type) {
          case "Vendor":
            response = await updateVendor(req, formDetails._id);
            break;
          case "Product":
            response = await updateProduct(req, formDetails._id);
            break;
          case "Warehouse":
            response = await updateWarehouse(req, formDetails._id);
            break;

          default:
            break;
        }
      } else {
        switch (type) {
          case "Vendor":
            response = await createVendor(req);
            break;
          case "Product":
            response = await createProduct(req);
            break;
          case "Warehouse":
            response = await createWarehouse(req);
            break;

          default:
            break;
        }
      }
      if (response?.status === 409) {
        toast.error(
          `${type} with ${type} ID: ${
            type === "Vendor" ? data?.vendorId : type === "Warehouse" ? data?.warehouseId : data.productId
          } already exists`
        );
      } else if (response?.status === 200) {
        router.push(`/${type.toLowerCase()}s`);
        router.refresh();
        toast.success(formDetails ? `${type} edited successfully` : `New ${type.toLowerCase()} created successfully`);
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
            {formFields.map((item, ind: number) => {
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
      {isLoading ? (
        <div className="z-10 absolute top-0 left-0 flex flex-col justify-center items-center w-screen h-screen bg-black bg-opacity-50">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <p className="mt-12 text-3xl font-bold text-gray-100">Submitting...</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CreateForm;
