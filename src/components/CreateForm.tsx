"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createExcitationSystem, updateExcitationSystem } from "@/lib/actions/excitationSystem.actions";
import { createBus, updateBus } from "@/lib/actions/bus.actions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "./ui/separator";
import { createGenerator, updateGenerator } from "@/lib/actions/generator.actions";
import { reverseUnslug } from "@/utils/helperFunctions";
import { createLoad, updateLoad } from "@/lib/actions/load.actions";
import { createSeriesCapacitor, updateSeriesCapacitor } from "@/lib/actions/seriesCapacitor.actions";
import { createShuntCapacitor, updateShuntCapacitor } from "@/lib/actions/shuntCapacitor.actions";
import { createShuntReactor, updateShuntReactor } from "@/lib/actions/shuntReactor.actions";
import { createSingleLineDiagram, updateSingleLineDiagram } from "@/lib/actions/singleLineDiagram.actions";
import {
  createTransformersThreeWinding,
  updateTransformersThreeWinding,
} from "@/lib/actions/transformersThreeWinding.actions";
import {
  createTransformersTwoWinding,
  updateTransformersTwoWinding,
} from "@/lib/actions/transformersTwoWinding.actions";
import { createTransmissionLine, updateTransmissionLine } from "@/lib/actions/transmissionLines.actions";
import { createTurbineGovernor, updateTurbineGovernor } from "@/lib/actions/turbineGovernor.actions";
interface CreateFormProps {
  formFields: IColumn[];
  formDetails?: any;
  type:
    | "excitationSystem"
    | "bus"
    | "generator"
    | "load"
    | "seriesCapacitor"
    | "shuntCapacitor"
    | "shuntReactor"
    | "singleLineDiagram"
    | "transformersThreeWinding"
    | "transformersTwoWinding"
    | "transmissionLine"
    | "turbineGovernor";
}

const generateFormSchema = (fields: IColumn[]) => {
  const schema: any = {};

  fields.map((field) => {
    if (field.type === "subColumns") {
      field.subColumns.map((subField: any) => (schema[subField.field] = z.string()));
    } else schema[field.field] = z.string();
  });
  return z.object(schema);
};

const CreateForm = ({ formFields, formDetails, type }: CreateFormProps) => {
  const [files, setFiles] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const FormSchema = generateFormSchema(formFields);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDetails,
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    setIsLoading(true);
    let uploadedImageUrl: any = {};
    formFields.map((item) => {
      if (item.type === "image") {
        uploadedImageUrl[item.field] = data[item.field];
      } else if (item.type === "subColumns") {
        item.subColumns.map((subItem: any) => {
          uploadedImageUrl[subItem.field] = data[subItem.field];
        });
      }
    });

    if (files.length > 0) {
      console.log(files);
      console.log(uploadedImageUrl);
      const uploadPromises = files.map((file: any) => startUpload(file.file));
      const images: any = await Promise.all(
        uploadPromises.map(async (promise: any, ind: number) => {
          const result = await promise;
          return { result, field: files[ind].field };
        })
      );
      console.log(images);
      images.map((image: any) => {
        data[image.field] = image.result[0].url;
      });
    }

    const defaultFields: any = {};
    const additionalFields: any = {};
    formFields.map((item) => {
      if (item.isDefault) {
        if (item.type === "subColumns") {
          const temp: any = {};
          item.subColumns.map((subItem: any) => {
            temp[subItem.field] = data[subItem.field];
          });
          defaultFields[item.field] = temp;
        } else defaultFields[item.field] = data[item.field];
      } else additionalFields[item.field] = data[item.field];
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
          case "bus":
            response = await updateBus(req, formDetails._id);
            break;
          case "excitationSystem":
            response = await updateExcitationSystem(req, formDetails._id);
            break;

          case "generator":
            response = await updateGenerator(req, formDetails._id);
            break;

          case "load":
            response = await updateLoad(req, formDetails._id);
            break;

          case "seriesCapacitor":
            response = await updateSeriesCapacitor(req, formDetails._id);
            break;

          case "shuntCapacitor":
            response = await updateShuntCapacitor(req, formDetails._id);
            break;

          case "shuntReactor":
            response = await updateShuntReactor(req, formDetails._id);
            break;

          case "singleLineDiagram":
            response = await updateSingleLineDiagram(req, formDetails._id);
            break;

          case "transformersThreeWinding":
            response = await updateTransformersThreeWinding(req, formDetails._id);
            break;

          case "transformersTwoWinding":
            response = await updateTransformersTwoWinding(req, formDetails._id);
            break;

          case "transmissionLine":
            response = await updateTransmissionLine(req, formDetails._id);
            break;

          case "turbineGovernor":
            response = await updateTurbineGovernor(req, formDetails._id);
            break;

          default:
            break;
        }
      } else {
        switch (type) {
          case "bus":
            response = await createBus(req);
            break;
          case "excitationSystem":
            response = await createExcitationSystem(req);
            break;

          case "generator":
            response = await createGenerator(req);
            break;

          case "load":
            response = await createLoad(req);
            break;

          case "seriesCapacitor":
            response = await createSeriesCapacitor(req);
            break;

          case "shuntCapacitor":
            response = await createShuntCapacitor(req);
            break;

          case "shuntReactor":
            response = await createShuntReactor(req);
            break;

          case "singleLineDiagram":
            response = await createSingleLineDiagram(req);
            break;

          case "transformersThreeWinding":
            response = await createTransformersThreeWinding(req);
            break;

          case "transformersTwoWinding":
            response = await createTransformersTwoWinding(req);
            break;

          case "transmissionLine":
            response = await createTransmissionLine(req);
            break;

          case "turbineGovernor":
            response = await createTurbineGovernor(req);
            break;

          default:
            break;
        }
      }

      if (response?.status === 200) {
        router.push(`/${type}`);
        router.refresh();
        toast.success(
          formDetails
            ? `${reverseUnslug(type)} edited successfully`
            : `New ${reverseUnslug(type).toLowerCase()} created successfully`
        );
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 justify-between pr-5"
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5 max-h-[75vh] overflow-auto py-3">
            {formFields.map((item, ind: number) => {
              if (item.type === "text" || item.type === "number")
                return (
                  <FormField
                    key={ind}
                    control={form.control}
                    name={item?.field}
                    render={({ field }) => (
                      <FormItem className="h-fit">
                        <FormLabel>{item?.title}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={item?.title}
                            {...field}
                            type={item.type}
                            className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              else if (item.type === "subColumns") {
                return (
                  <div
                    key={ind}
                    className="col-span-2 py-2"
                  >
                    {/* <Separator /> */}
                    <p className="font-bold text-lg pt-2">{item.title}</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {item.subColumns.map((subItem: any, i: number) => {
                        if (subItem.type === "text" || subItem.type === "number")
                          return (
                            <FormField
                              key={i}
                              control={form.control}
                              name={subItem?.field}
                              render={({ field }) => (
                                <FormItem className="h-fit">
                                  <FormLabel>{subItem?.title}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={subItem?.title}
                                      {...field}
                                      type={subItem.type}
                                      className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                      })}
                    </div>
                    <Separator />
                  </div>
                );
              } else if (item.type === "dropdown") {
                return (
                  <FormField
                    key={ind}
                    control={form.control}
                    name={item.field}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{item.title}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
                              <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {item.dropdownValues.map((selectValue: any, index: number) => (
                              <SelectItem
                                value={selectValue}
                                key={index}
                                className="select-item"
                              >
                                {selectValue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              } else if (item.type === "image")
                return (
                  <FormField
                    key={ind}
                    control={form.control}
                    name={item?.field}
                    render={({ field }) => (
                      <FormItem className="h-fit">
                        <FormLabel>{item?.title}</FormLabel>
                        <FormControl>
                          <FileUploader
                            onFieldChange={field.onChange}
                            imageUrl={field.value}
                            setFiles={setFiles}
                            field={item.field}
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
              className="w-1/5"
            >
              Submit
            </Button>
            <Button
              type="button"
              className="w-1/5"
              variant="destructive"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
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
    </Form>
  );
};

export default CreateForm;
