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
import { usePathname } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { Separator } from "./ui/separator";

// const SubcolumnSchema = z.object({
//   title: z.string().optional(),
//   type: z.string().optional(),
// }).refine((data)=>{
//   if(data.)
// })

const FormSchema = z.object({
  name: z.string(),
  dropdownValues: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
  type: z
    .string({
      required_error: "Please select appropriate type of field",
    })
    .optional(),
  hasSubcolumns: z.enum(["true", "false"], {
    required_error: "You need to select yes or no.",
  }),
  subcolumns: z
    .array(
      z.object({
        title: z.string(),
        type: z.string(),
        dropdownValues: z.array(
          z.object({
            name: z.string(),
          })
        ),
      })
    )
    .optional(),
});

const AddColumns = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { watch, setValue, getValues, setError } = form;
  const hasSubcolumnsValue = watch("hasSubcolumns");
  const subcolumns = watch("subcolumns", []);
  const dropdown = watch("type");
  const dropdownValues = watch("dropdownValues") || [];

  const addSubcolumn = () => {
    const currentSubcolumns = getValues("subcolumns") || [];
    const newSubcolumns = [...currentSubcolumns, { title: "", type: "", dropdownValues: [{ name: "" }] }];
    setValue("subcolumns", newSubcolumns);
  };

  const removeSubcolumn = (index: number) => {
    const currentSubcolumns = getValues("subcolumns") || [];
    const newSubcolumns = currentSubcolumns.filter((_, i) => i !== index);
    setValue("subcolumns", newSubcolumns);
  };

  const addDropDownValues = () => {
    const currentDropdownValues = getValues("dropdownValues") || [];
    const newDropdownValues = [...currentDropdownValues, { name: "" }];
    setValue("dropdownValues", newDropdownValues);
  };

  const removeDropDownValues = (index: number) => {
    const currentDropdownValues = getValues("dropdownValues") || [];
    const newDropdownValues = currentDropdownValues.filter((_, i) => i !== index);
    setValue("dropdownValues", newDropdownValues);
  };

  const addSubcolumnDropDownValues = (index: number) => {
    const currentDropdownValues = getValues("subcolumns") || [];
    currentDropdownValues.map((item, ind) => {
      if (ind === index) item.dropdownValues = [...item.dropdownValues, { name: "" }];
    });
    setValue("subcolumns", currentDropdownValues);
  };

  const removeSubcolumnDropDownValues = (index: number, subIndex: number) => {
    const currentDropdownValues = getValues("subcolumns") || [];
    currentDropdownValues.map((item, ind) => {
      if (ind === index) {
        const newDropdownValues = item.dropdownValues.filter((_, i) => i !== subIndex);
        item.dropdownValues = newDropdownValues;
      }
    });
    setValue("subcolumns", currentDropdownValues);
  };

  useEffect(() => {
    if (subcolumns?.length === 0 && hasSubcolumnsValue === "true") {
      setValue("subcolumns", [{ title: "", type: "", dropdownValues: [{ name: "" }] }]);
    }
  }, [subcolumns, setValue, hasSubcolumnsValue]);

  useEffect(() => {
    if (dropdown === "dropdown") {
      setValue("dropdownValues", [{ name: "" }]);
    }
  }, [dropdown, setValue]);

  useEffect(() => {
    form.reset();
  }, [open, form]);

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
    if (data.hasSubcolumns === "false") {
      if (!data.type) {
        setError("type", { message: "Required" }, { shouldFocus: true });
        return;
      }
    } else {
      data.type = "subColumns";
      for (let ind = 0; ind < data.subcolumns!.length; ind++) {
        const item = data.subcolumns![ind];
        if (item.title === "") {
          setError(`subcolumns.${ind}.title`, { message: "Required" }, { shouldFocus: true });
          return;
        }
        if (item.type === "") {
          setError(`subcolumns.${ind}.type`, { message: "Required" }, { shouldFocus: true });
          return;
        }
        if (item.type === "dropdown") {
          for (let index = 0; index < item.dropdownValues!.length; index++) {
            const dropdownItem = item.dropdownValues[index];
            if (dropdownItem.name === "") {
              setError(
                `subcolumns.${ind}.dropdownValues.${index}.name`,
                { message: "Required" },
                { shouldFocus: true }
              );
              return;
            }
          }
        }
      }
    }

    if (data.type === "dropdown") {
      for (let ind = 0; ind < data.dropdownValues!.length; ind++) {
        const item = data.dropdownValues![ind];
        if (item.name === "") {
          setError(`dropdownValues.${ind}.name`, { message: "Required" }, { shouldFocus: true });
          return;
        }
      }
    }
    console.log(data);
    try {
      const response = await updateDefaultParams(data, pathname);
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
      <Button
        variant={"destructive"}
        onClick={dummy}
      >
        Add new column
      </Button>
      <Dialog>
        <DialogTrigger
          className={buttonVariants()}
          onClick={() => setOpen(true)}
        >
          Add column
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-center">Add a new column</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
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
                name="hasSubcolumns"
                render={({ field }) => (
                  <FormItem className="flex gap-5 items-center">
                    <FormLabel>Does this column have any sub-columns?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-10"
                      >
                        <FormItem className="flex items-center space-y-0 gap-2">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-y-0 gap-2">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hasSubcolumnsValue === "false" && (
                <>
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
                            <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
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
                            <SelectItem value="dropdown">Dropdown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {dropdown === "dropdown" &&
                    dropdownValues.map((dropdownValue, index) => (
                      <div
                        key={index}
                        className="flex w-full gap-2 items-center"
                      >
                        <FormField
                          control={form.control}
                          name={`dropdownValues.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex gap-2 items-center justify-start w-3/4">
                              <FormLabel className="whitespace-nowrap">Dropdown value {index + 1}:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dropdown value"
                                  {...field}
                                  className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="w-10 flex gap-2 px-2">
                          <button
                            title={`Remove dropdown value ${index + 1}`}
                            onClick={() => removeDropDownValues(index)}
                            type="button"
                            disabled={dropdownValues.length <= 1}
                            className={`bg-transparent rounded-full text-3xl ${
                              dropdownValues.length <= 1
                                ? "cursor-not-allowed text-gray-300"
                                : "cursor-pointer hover:bg-transparent hover:text-black text-gray-500"
                            }`}
                          >
                            <CiCircleMinus />
                          </button>
                          <button
                            onClick={addDropDownValues}
                            type="button"
                            className={`bg-transparent rounded-full text-3xl cursor-pointer hover:bg-transparent hover:text-black text-gray-500 ${
                              index === dropdownValues.length - 1 ? "visible" : "hidden"
                            }`}
                          >
                            <CiCirclePlus />
                          </button>
                        </div>
                      </div>
                    ))}
                </>
              )}
              {hasSubcolumnsValue === "true" && (
                <>
                  {subcolumns?.length! >= 1 && <Separator />}
                  {subcolumns?.map((subcolumn, index) => (
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between items-center">
                        <p className="font-bold mb-2 whitespace-nowrap">Sub-column {index + 1}</p>
                        <div className="flex gap-1">
                          <button
                            title={`Remove subcolumn ${index + 1}`}
                            onClick={() => removeSubcolumn(index)}
                            type="button"
                            disabled={subcolumns.length <= 1}
                            className={`bg-transparent rounded-full text-3xl ${
                              subcolumns.length <= 1
                                ? "cursor-not-allowed text-gray-300"
                                : "cursor-pointer hover:bg-transparent hover:text-black text-gray-500"
                            }`}
                          >
                            <CiCircleMinus />
                          </button>
                          <button
                            title="Add new subcolumn"
                            onClick={addSubcolumn}
                            type="button"
                            className={`bg-transparent rounded-full text-3xl cursor-pointer hover:bg-transparent hover:text-black text-gray-500 ${
                              index === subcolumns.length - 1 ? "visible" : "hidden"
                            }`}
                          >
                            <CiCirclePlus />
                          </button>
                        </div>
                      </div>
                      <div
                        key={index}
                        className="grid grid-cols-3 w-full gap-2 items-center"
                      >
                        <FormField
                          control={form.control}
                          name={`subcolumns.${index}.title`}
                          render={({ field }) => (
                            <FormItem className="flex gap-2 items-center justify-start w-full">
                              <FormLabel>Name:</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Subcolumn Name"
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
                          name={`subcolumns.${index}.type`}
                          render={({ field }) => (
                            <FormItem className="flex ml-3 gap-2 items-center justify-start w-full">
                              <FormLabel>Type:</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
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
                                  <SelectItem value="dropdown">Dropdown</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {subcolumn.type === "dropdown" &&
                          subcolumn.dropdownValues.map((dropdownValue, i) => (
                            <div
                              key={i}
                              className="flex w-full gap-2 items-center col-start-1 col-span-2"
                            >
                              <FormField
                                control={form.control}
                                name={`subcolumns.${index}.dropdownValues.${i}.name`}
                                render={({ field }) => (
                                  <FormItem className="flex gap-2 items-center justify-start w-full">
                                    <FormLabel className="whitespace-nowrap">Dropdown value {i + 1}:</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Dropdown value"
                                        {...field}
                                        className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="w-10 flex gap-2 px-2">
                                <button
                                  title={`Remove dropdown value ${i + 1} for subcolumn ${index + 1}`}
                                  onClick={() => removeSubcolumnDropDownValues(index, i)}
                                  type="button"
                                  disabled={subcolumn.dropdownValues.length <= 1}
                                  className={`bg-transparent rounded-full text-3xl ${
                                    subcolumn.dropdownValues.length <= 1
                                      ? "cursor-not-allowed text-gray-300"
                                      : "cursor-pointer hover:bg-transparent hover:text-black text-gray-500"
                                  }`}
                                >
                                  <CiCircleMinus />
                                </button>
                                <button
                                  title={`Add new dropdown value for subcolumn ${index + 1}`}
                                  onClick={() => addSubcolumnDropDownValues(index)}
                                  type="button"
                                  className={`bg-transparent rounded-full text-3xl cursor-pointer hover:bg-transparent hover:text-black text-gray-500 ${
                                    i === subcolumn.dropdownValues.length - 1 ? "visible" : "hidden"
                                  }`}
                                >
                                  <CiCirclePlus />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <Separator className="mt-5" />
                    </div>
                  ))}
                </>
              )}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddColumns;
