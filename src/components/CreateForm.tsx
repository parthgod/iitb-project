"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createBus, getAllBuses, updateBus } from "@/lib/actions/bus.actions";
import { createExcitationSystem, updateExcitationSystem } from "@/lib/actions/excitationSystem.actions";
import { createGenerator, getAllGenerators, updateGenerator } from "@/lib/actions/generator.actions";
import { createIBR, updateIBR } from "@/lib/actions/ibr.actions";
import { createLCCHVDCLink, updateLCCHVDCLink } from "@/lib/actions/lccHVDCLink.actions";
import { createLoad, updateLoad } from "@/lib/actions/load.actions";
import { createSeriesCapacitor, updateSeriesCapacitor } from "@/lib/actions/seriesCapacitor.actions";
import { createSeriesFact, updateSeriesFact } from "@/lib/actions/seriesFact.actions";
import { createShuntCapacitor, updateShuntCapacitor } from "@/lib/actions/shuntCapacitor.actions";
import { createShuntFact, updateShuntFact } from "@/lib/actions/shuntFact.actions";
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
import { createVSCHVDCLink, updateVSCHVDCLink } from "@/lib/actions/vscHVDCLink.actions";
import { uploadImagesToFirebase } from "@/lib/firebase/storage";
import { cn } from "@/lib/utils";
import { IBus, IColumn, IGenerator } from "@/utils/defaultTypes";
import { reverseUnslug } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSearch } from "react-icons/io5";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "./FileUploader";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import Link from "next/link";

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
  newIndex?: number;
};

const generateFormSchema = (fields: IColumn[]) => {
  const schema: any = {};

  fields.forEach((field) => {
    if (!field.isHidden && field.field !== "deviceName") {
      if (field.type === "switch") {
        schema[field.field] = z.boolean().default(false);
      } else schema[field.field] = z.string().min(1, { message: `${field.title} cannot be empty` });
    }
  });
  return z.object(schema);
};

const CreateForm = ({ formFields, formDetails, type, newIndex }: CreateFormProps) => {
  const [files, setFiles] = useState<IFiles[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [locationData, setLocationData] = useState<string[]>([]);
  const [filteredLocationData, setFilteredLocationData] = useState<string[]>([]);

  const [busDropdownData, setBusDropdownData] = useState<IBus[]>([]);
  const [filteredBusDropdownData, setFilteredBusDropdownData] = useState<IBus[]>([]);

  const [generatorDropdownData, setGeneratorDropdownData] = useState<IGenerator[]>([]);
  const [filteredGeneratorDropdownData, setFilteredGeneratorDropdownData] = useState<IGenerator[]>([]);

  const [searchDevice, setSearchDevice] = useState("");

  const { data: session } = useSession();

  const router = useRouter();

  const FormSchema = generateFormSchema(formFields);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDetails,
  });

  const filterLocations = (value: string, data: string[], setData: any) => {
    const updatedLocation = data.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
    setData(updatedLocation);
    setSearchDevice(value);
  };

  const filterDevices = (columnName: string, event: any, data: IBus[] | IGenerator[], setData: any) => {
    const { value } = event.target;
    setSearchDevice(value);
    const filteredData = data.filter((item) => item[columnName]?.toLowerCase().includes(value.toLowerCase()));
    setData(filteredData);
  };

  const handleChange = (item: IColumn, ind: number, value: string) => {
    form.setValue(item.field, value);
    const trigger = document.getElementById(`${item.tableRef}-${ind}`);
    if (trigger) trigger.click();
    setSearchDevice("");
    setFilteredBusDropdownData(busDropdownData);
    setFilteredGeneratorDropdownData(generatorDropdownData);
    setFilteredLocationData(locationData);
  };

  const handleDeviceName = (data: z.infer<typeof FormSchema>) => {
    if (formDetails) {
      let duplicate = false;
      Object.keys(data).forEach((field) => {
        if (data[field] !== formDetails[field]) duplicate = true;
      });
      if (!duplicate) {
        router.push(`/${type}`);
        router.refresh();
        return toast.success(`${reverseUnslug(type)} edited successfully`);
      }
    }

    switch (type) {
      case "excitationSystem":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_ExcitationSystem_${newIndex}`;
        break;

      case "generator":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_Generator_${data.mw}_${data.kv}_${newIndex}`;

        if (form.getValues("busTo") === "Other") {
          data.busTo = `${data.location.replace(/\s/g, "_")}_Generator_${data.kv}_${newIndex}`;
        }
        break;

      case "load":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_Load_${data.pMW}_${data.qMvar}_${newIndex}`;

        // if (form.getValues("busFrom") === "Other") {
        //   data.busFrom = `${data.location.replace(/\s/g, "_")}_Load_${data.qMvar}_${newIndex}`;
        // }
        break;

      case "seriesCapacitor":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_SeriesCapacitor_${data.mvar}_${newIndex}`;
        break;

      case "shuntCapacitor":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_ShuntCapacitor_${data.mva}_${newIndex}`;

        if (form.getValues("busFrom") === "Other") {
          data.busFrom = `${data.location.replace(/\s/g, "_")}_ShuntCapacitor_${data.kv}_${newIndex}`;
        }
        break;

      case "shuntReactor":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_ShuntReactor_${data.mva}_${newIndex}`;

        if (form.getValues("busFrom") === "Other") {
          data.busFrom = `${data.location.replace(/\s/g, "_")}_ShuntReactor_${data.kv}_${newIndex}`;
        }
        break;

      case "transformersThreeWinding":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_Transformer_${data.mva}_${data.kvprimaryVoltage}/${
          data.kvsecondaryVoltage
        }/${data.kvtertiaryVoltage}_${newIndex}`;

        if (form.getValues("busprimaryFrom") === "Other") {
          data.busprimaryFrom = `${data.location.replace(/\s/g, "_")}_Transformer_${data.kvprimaryVoltage}_${newIndex}`;
        }

        if (form.getValues("bussecondaryTo") === "Other") {
          data.bussecondaryTo = `${data.location.replace(/\s/g, "_")}_Transformer_${
            data.kvsecondaryVoltage
          }_${newIndex}`;
        }

        if (form.getValues("bustertiaryTo") === "Other") {
          data.bustertiaryTo = `${data.location.replace(/\s/g, "_")}_Transformer_${data.kvtertiaryVoltage}_${newIndex}`;
        }
        break;

      case "transformersTwoWinding":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_Transformer_${data.mva}_${data.kvprimary}/${
          data.kvsecondary
        }_${newIndex}`;

        if (form.getValues("busFrom") === "Other") {
          data.busFrom = `${data.location.replace(/\s/g, "_")}_Transformer_${data.kvprimary}_${newIndex}`;
        }

        if (form.getValues("busTo") === "Other") {
          data.busTo = `${data.location.replace(/\s/g, "_")}_Transformer_${data.kvsecondary}_${newIndex}`;
        }
        break;

      case "transmissionLine":
        data.deviceName = `${data.location1.replace(/\s/g, "_")}_${data.location2.replace(
          /\s/g,
          "_"
        )}_TransmissionLine_${newIndex}`;

        if (form.getValues("busFrom") === "Other") {
          data.busFrom = `${data.location1.replace(/\s/g, "_")}_TransmissionLine_${data.kv}_${newIndex}`;
        }
        break;

      case "turbineGovernor":
        data.deviceName = `${data.location.replace(/\s/g, "_")}_TurbineGovernor_${newIndex}`;
        break;

      default:
        break;
    }

    formFields.forEach((item) => form.setValue(item.field, data?.[item.field]));
    setOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    // console.log(data);

    let uploadedImageUrl: any = {};
    formFields.map((item) => {
      if (item.type === "image" && !item.isHidden) {
        uploadedImageUrl[item.field] = data[item.field];
      }
    });

    if (files.length > 0) {
      const images = await uploadImagesToFirebase(files, type, session?.user.name!);
      images.map((image: any) => {
        data[image.field] = image.url;
      });
    }

    const defaultFields: any = {};
    const additionalFields: any = {};
    formFields.map((item) => {
      if (!item.isHidden) {
        if (item.isDefault) {
          if (item.type === "switch") defaultFields[item.field] = data[item.field] ? "ON" : "OFF";
          else defaultFields[item.field] = data[item.field];
        } else {
          if (item.type === "switch") additionalFields[item.field] = data[item.field] ? "ON" : "OFF";
          else additionalFields[item.field] = data[item.field];
        }
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

  useEffect(() => {
    formFields.forEach(async (item) => {
      if (!item.isHidden && item.type === "dropdown" && item?.tableRef) {
        if (item.tableRef === "Bus") {
          const response = await getAllBuses(0, 0, "", formFields);
          setBusDropdownData(response.completeData);
          setFilteredBusDropdownData(response.completeData);
          if (item.field === "location" || item.field === "location1" || item.field === "location2") {
            const uniqueLocations = Array.from(new Set(response.completeData.map((item) => item.location)));
            setLocationData(uniqueLocations);
            setFilteredLocationData(uniqueLocations);
          }
        } else if (item.tableRef === "Generator") {
          const response = await getAllGenerators(0, 0, "", formFields);
          setGeneratorDropdownData(response.completeData);
          setFilteredGeneratorDropdownData(response.completeData);
        }
      }
    });
  }, [formFields]);

  useEffect(() => {
    if (!open && form && busDropdownData.length) {
      let isOtherBus;
      switch (type) {
        case "generator":
          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busTo"));
          if (!isOtherBus) form.setValue("busTo", "Other");
          break;

        case "shuntCapacitor":
          isOtherBus = busDropdownData.find(
            (item) => item.busName?.toString() === form.getValues("busFrom").toString()
          );
          if (!isOtherBus) form.setValue("busFrom", "Other");
          break;

        case "shuntReactor":
          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busFrom"));
          if (!isOtherBus) form.setValue("busFrom", "Other");
          break;

        case "transformersThreeWinding":
          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busprimaryFrom"));
          if (!isOtherBus) form.setValue("busprimaryFrom", "Other");

          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("bussecondaryTo"));
          if (!isOtherBus) form.setValue("bussecondaryTo", "Other");

          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("bustertiaryTo"));
          if (!isOtherBus) form.setValue("bustertiaryTo", "Other");
          break;

        case "transformersTwoWinding":
          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busFrom"));
          if (!isOtherBus) form.setValue("busFrom", "Other");

          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busTo"));
          if (!isOtherBus) form.setValue("busTo", "Other");
          break;

        case "transmissionLine":
          isOtherBus = busDropdownData.find((item) => item.busName === form.getValues("busFrom"));
          if (!isOtherBus) form.setValue("busFrom", "Other");
          break;

        default:
          break;
      }
    }
  }, [open, form, busDropdownData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(type === "singleLineDiagram" || type === "bus" ? onSubmit : handleDeviceName)}
        className="flex flex-col gap-5 justify-between pr-5 h-full overflow-hidden p-4"
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5 max-h-[75vh] overflow-auto custom-scrollbar">
            {formFields.map((item, ind: number) => {
              if (!item.isHidden && item.field !== "deviceName") {
                if (
                  (item.field === "location" || item.field === "location1" || item.field === "location2") &&
                  type !== "bus"
                ) {
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={item.field}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-0.5">
                          <FormLabel>{item.title}</FormLabel>
                          <Popover>
                            <PopoverTrigger
                              asChild
                              id={`${item.tableRef}-${ind}`}
                              className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                            >
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="text-left justify-between font-normal"
                                >
                                  {field.value || "Select locations..."}
                                  <ChevronsUpDown />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[40vw] p-1 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                              <div className="flex gap-1 items-center px-1">
                                <IoSearch className="ml-2" />
                                <Input
                                  type="text"
                                  value={searchDevice}
                                  onChange={(e) =>
                                    filterLocations(e.target.value, locationData, setFilteredLocationData)
                                  }
                                  placeholder="Search locations..."
                                  className="border-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:outline-none"
                                />
                              </div>
                              <Separator />
                              <div className="max-h-[40vh] overflow-auto custom-scrollbar">
                                {filteredLocationData.map((selectValue, index) => (
                                  <Button
                                    variant="ghost"
                                    key={index}
                                    className={`w-full justify-start font-normal ${
                                      selectValue === field.value && "bg-gray-100"
                                    }`}
                                    onClick={() => handleChange(item, ind, selectValue)}
                                  >
                                    {selectValue}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        selectValue === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </Button>
                                ))}
                                {!filteredLocationData.length && <p className="px-4 py-1">No such device found</p>}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                } else if (item.type === "text" || item.type === "number")
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={item?.field}
                      render={({ field }) => (
                        <FormItem className="h-fit space-y-0">
                          <FormLabel className="mb-3">{item?.title}</FormLabel>
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
                else if (item.type === "dropdown") {
                  if (item.tableRef) {
                    return (
                      <FormField
                        key={ind}
                        control={form.control}
                        name={item.field}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-0.5">
                            <FormLabel>{item.title}</FormLabel>
                            <Popover>
                              <PopoverTrigger
                                asChild
                                id={`${item.tableRef}-${ind}`}
                                className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                              >
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="text-left justify-between font-normal"
                                  >
                                    {field.value || "Select device..."}
                                    <ChevronsUpDown />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[40vw] p-1 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                                <div className="flex gap-1 items-center px-1">
                                  <IoSearch className="ml-2" />
                                  <Input
                                    type="text"
                                    value={searchDevice}
                                    onChange={(e) =>
                                      filterDevices(
                                        item.columnRef!,
                                        e,
                                        item.tableRef === "Bus" ? busDropdownData : generatorDropdownData,
                                        item.tableRef === "Bus"
                                          ? setFilteredBusDropdownData
                                          : setFilteredGeneratorDropdownData
                                      )
                                    }
                                    placeholder="Search device..."
                                    className="border-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:outline-none"
                                  />
                                </div>
                                <Separator />
                                <div className="max-h-[40vh] overflow-auto custom-scrollbar">
                                  {(type === "transmissionLine" && item.field === "busTo") ||
                                  item.tableRef === "Generator" ||
                                  (type === "load" && item.field === "busFrom") ? (
                                    ""
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      key={ind}
                                      className={`w-full justify-start italic text-gray-500 font-normal ${
                                        "Other" === field.value && "bg-gray-100"
                                      }`}
                                      onClick={() => handleChange(item, ind, "Other")}
                                    >
                                      Other
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          "Other" === field.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                    </Button>
                                  )}
                                  {item.tableRef === "Bus" &&
                                    filteredBusDropdownData.map((selectValue, index) => (
                                      <Button
                                        variant="ghost"
                                        key={index}
                                        className={`w-full justify-start font-normal ${
                                          selectValue[item.columnRef!] === field.value && "bg-gray-100"
                                        }`}
                                        onClick={() => handleChange(item, ind, selectValue[item.columnRef!])}
                                      >
                                        {selectValue[item.columnRef!]}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            selectValue[item.columnRef!] === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </Button>
                                    ))}
                                  {item.tableRef === "Bus" && !filteredBusDropdownData.length && (
                                    <p className="px-4 py-1">No such device found</p>
                                  )}
                                  {item.tableRef === "Generator" &&
                                    filteredGeneratorDropdownData.map((selectValue, index) => (
                                      <Button
                                        variant="ghost"
                                        key={index}
                                        className={`w-full justify-start font-normal ${
                                          selectValue[item.columnRef!] === field.value && "bg-gray-100"
                                        }`}
                                        onClick={() => handleChange(item, ind, selectValue[item.columnRef!])}
                                      >
                                        {selectValue[item.columnRef!]}
                                        <Check
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            selectValue[item.columnRef!] === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </Button>
                                    ))}
                                  {item.tableRef === "Generator" && !filteredGeneratorDropdownData.length && (
                                    <p className="px-4 py-1">No such device found</p>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={item.field}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
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
                } else if (item.type === "switch") {
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={item?.field}
                      render={({ field }) => (
                        <FormItem className="h-fit space-y-0 flex flex-col">
                          <FormLabel>{item?.title}</FormLabel>
                          <FormControl>
                            <label className="rocker rocker-small">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                              <span className="switch-left">ON</span>
                              <span className="switch-right">OFF</span>
                            </label>
                          </FormControl>
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
              }
            })}
          </div>
          <div className="flex gap-5 pt-3">
            <Button
              type="submit"
              className="w-1/5"
            >
              Submit
            </Button>
            <AlertDialog
              open={open}
              onOpenChange={setOpen}
            >
              <AlertDialogTrigger asChild></AlertDialogTrigger>
              <AlertDialogContent className="bg-white max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div>
                      <p className="mb-2">
                        This will {formDetails ? "edit the" : "create a new"} {reverseUnslug(type)} with following{" "}
                        {formDetails ? "new " : ""}
                        details:
                      </p>
                      <p className="font-semibold">
                        {reverseUnslug(type)} device name: {form.getValues("deviceName")}
                      </p>
                      {type === "generator" ? (
                        <p className="font-semibold">Bus to name: {form.getValues("busTo")}</p>
                      ) : type === "transformersThreeWinding" ? (
                        <p className="font-semibold">Primary bus from name: {form.getValues("busprimaryFrom")}</p>
                      ) : type === "transformersTwoWinding" ||
                        type === "transmissionLine" ||
                        type === "load" ||
                        type === "shuntCapacitor" ||
                        type === "shuntReactor" ? (
                        <p className="font-semibold">Bus from name: {form.getValues("busFrom")}</p>
                      ) : (
                        ""
                      )}
                      {type === "transformersThreeWinding" ? (
                        <p className="font-semibold">Secondary bus to name: {form.getValues("bussecondaryTo")}</p>
                      ) : type === "transformersTwoWinding" ? (
                        <p className="font-semibold">Bus to name: {form.getValues("busTo")}</p>
                      ) : (
                        ""
                      )}
                      {type === "transformersThreeWinding" ? (
                        <p className="font-semibold">Tertiary bus to name: {form.getValues("bustertiaryTo")}</p>
                      ) : (
                        ""
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onSubmit(form.watch())}>Submit</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link
              href={`/${type}`}
              className={buttonVariants({ variant: "destructive" }) + " w-1/5"}
            >
              Cancel
            </Link>
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
