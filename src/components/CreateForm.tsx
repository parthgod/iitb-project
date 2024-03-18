"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBus, updateBus } from "@/lib/actions/bus.actions";
import { createExcitationSystem, updateExcitationSystem } from "@/lib/actions/excitationSystem.actions";
import { createGenerator, updateGenerator } from "@/lib/actions/generator.actions";
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
import { createIBR, updateIBR } from "@/lib/actions/ibr.actions";
import { createLCCHVDCLink, updateLCCHVDCLink } from "@/lib/actions/lccHVDCLink.actions";
import { createSeriesFact, updateSeriesFact } from "@/lib/actions/seriesFact.actions";
import { createShuntFact, updateShuntFact } from "@/lib/actions/shuntFact.actions";
import { createVSCHVDCLink, updateVSCHVDCLink } from "@/lib/actions/vscHVDCLink.actions";
import { uploadImagesToFirebase } from "@/lib/firebase/storage";
import { IColumn } from "@/utils/defaultTypes";
import { reverseUnslug } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

type IFiles = {
  field: string;
  file: File[];
};

type CreateFormProps = {
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
    | "turbineGovernor"
    | "ibr"
    | "lccHVDCLink"
    | "vscHVDCLink"
    | "seriesFact"
    | "shuntFact";
};

const generateFormSchema = (fields: IColumn[]) => {
  const schema: any = {};

  fields.map((field) => {
    if (field.type === "subColumns") {
      field.subColumns!.map(
        (subField) => (schema[subField.field] = z.string().min(1, { message: `${subField.title} cannot be empty` }))
      );
    } else schema[field.field] = z.string().min(1, { message: `${field.title} cannot be empty` });
  });
  return z.object(schema);
};

const CreateForm = ({ formFields, formDetails, type }: CreateFormProps) => {
  const [files, setFiles] = useState<IFiles[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();

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
      } else if (item.type === "subColumns") {
        item.subColumns!.map((subItem) => {
          if (subItem.type === "image") uploadedImageUrl[subItem.field] = data[subItem.field];
        });
      }
    });

    if (files.length > 0) {
      const images = await uploadImagesToFirebase(files);
      // const uploadPromises = files.map((file) => startUpload(file.file));
      // const images: any = await Promise.all(
      //   uploadPromises.map(async (promise: any, ind: number) => {
      //     const result = await promise;
      //     return { result, field: files[ind].field };
      //   })
      // );
      images.map((image: any) => {
        data[image.field] = image.url;
      });
    }

    const defaultFields: any = {};
    const additionalFields: any = {};
    formFields.map((item) => {
      if (item.isDefault) {
        if (item.type === "subColumns") {
          const temp: any = {};
          item.subColumns!.map((subItem) => {
            temp[subItem.field] = data[subItem.field];
          });
          defaultFields[item.field] = temp;
        } else defaultFields[item.field] = data[item.field];
      } else {
        if (item.type === "subColumns") {
          const temp: any = {};
          item.subColumns!.map((subItem) => {
            temp[subItem.field] = data[subItem.field];
          });
          additionalFields[item.field] = temp;
        } else additionalFields[item.field] = data[item.field];
      }
    });

    try {
      let response;
      let req = {
        defaultFields: defaultFields,
        additionalFields: additionalFields,
      };
      if (formDetails) {
        switch (type) {
          case "bus":
            response = await updateBus(req, formDetails._id, session?.user.id!);
            break;
          case "excitationSystem":
            response = await updateExcitationSystem(req, formDetails._id, session?.user.id!);
            break;

          case "generator":
            response = await updateGenerator(req, formDetails._id, session?.user.id!);
            break;

          case "load":
            response = await updateLoad(req, formDetails._id, session?.user.id!);
            break;

          case "seriesCapacitor":
            response = await updateSeriesCapacitor(req, formDetails._id, session?.user.id!);
            break;

          case "shuntCapacitor":
            response = await updateShuntCapacitor(req, formDetails._id, session?.user.id!);
            break;

          case "shuntReactor":
            response = await updateShuntReactor(req, formDetails._id, session?.user.id!);
            break;

          case "singleLineDiagram":
            response = await updateSingleLineDiagram(req, formDetails._id, session?.user.id!);
            break;

          case "transformersThreeWinding":
            response = await updateTransformersThreeWinding(req, formDetails._id, session?.user.id!);
            break;

          case "transformersTwoWinding":
            response = await updateTransformersTwoWinding(req, formDetails._id, session?.user.id!);
            break;

          case "transmissionLine":
            response = await updateTransmissionLine(req, formDetails._id, session?.user.id!);
            break;

          case "turbineGovernor":
            response = await updateTurbineGovernor(req, formDetails._id, session?.user.id!);
            break;

          case "ibr":
            response = await updateIBR(req, formDetails._id, session?.user.id!);
            break;

          case "lccHVDCLink":
            response = await updateLCCHVDCLink(req, formDetails._id, session?.user.id!);
            break;

          case "seriesFact":
            response = await updateSeriesFact(req, formDetails._id, session?.user.id!);
            break;

          case "shuntFact":
            response = await updateShuntFact(req, formDetails._id, session?.user.id!);
            break;

          case "vscHVDCLink":
            response = await updateVSCHVDCLink(req, formDetails._id, session?.user.id!);
            break;

          default:
            break;
        }
      } else {
        switch (type) {
          case "bus":
            response = await createBus(req, session?.user.id!);
            break;
          case "excitationSystem":
            response = await createExcitationSystem(req, session?.user.id!);
            break;

          case "generator":
            response = await createGenerator(req, session?.user.id!);
            break;

          case "load":
            response = await createLoad(req, session?.user.id!);
            break;

          case "seriesCapacitor":
            response = await createSeriesCapacitor(req, session?.user.id!);
            break;

          case "shuntCapacitor":
            response = await createShuntCapacitor(req, session?.user.id!);
            break;

          case "shuntReactor":
            response = await createShuntReactor(req, session?.user.id!);
            break;

          case "singleLineDiagram":
            response = await createSingleLineDiagram(req, session?.user.id!);
            break;

          case "transformersThreeWinding":
            response = await createTransformersThreeWinding(req, session?.user.id!);
            break;

          case "transformersTwoWinding":
            response = await createTransformersTwoWinding(req, session?.user.id!);
            break;

          case "transmissionLine":
            response = await createTransmissionLine(req, session?.user.id!);
            break;

          case "turbineGovernor":
            response = await createTurbineGovernor(req, session?.user.id!);
            break;

          case "ibr":
            response = await createIBR(req, session?.user.id!);
            break;

          case "lccHVDCLink":
            response = await createLCCHVDCLink(req, session?.user.id!);
            break;

          case "seriesFact":
            response = await createSeriesFact(req, session?.user.id!);
            break;

          case "shuntFact":
            response = await createShuntFact(req, session?.user.id!);
            break;

          case "vscHVDCLink":
            response = await createVSCHVDCLink(req, session?.user.id!);
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
        className="flex flex-col gap-5 justify-between pr-5 h-full overflow-hidden p-4"
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5 max-h-[75vh] overflow-auto custom-scrollbar">
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
                    <p className="font-bold text-lg pt-2">{item.title}</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {item.subColumns!.map((subItem, i: number) => {
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
                        else if (subItem.type === "dropdown") {
                          return (
                            <FormField
                              key={ind + 100}
                              control={form.control}
                              name={subItem.field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{subItem.title}</FormLabel>
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
                                      {subItem.dropdownValues.map((selectValue: string, index: number) => (
                                        <SelectItem
                                          value={selectValue}
                                          key={index + 10}
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
                        } else if (subItem.type === "image")
                          return (
                            <FormField
                              key={ind + 5}
                              control={form.control}
                              name={subItem?.field}
                              render={({ field }) => (
                                <FormItem className="h-fit">
                                  <FormLabel>{subItem?.title}</FormLabel>
                                  <FormControl>
                                    <FileUploader
                                      onFieldChange={field.onChange}
                                      imageUrl={field.value}
                                      setFiles={setFiles}
                                      field={subItem.field}
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
                            {item.dropdownValues.map((selectValue: string, index: number) => (
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
          <div className="flex gap-5 pt-3">
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
