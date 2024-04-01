"use client";

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
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createDefaultParams,
  editSpecificDefaultParam,
  getDefaultParams,
  toggleDefaultParam,
  updateDefaultParams,
} from "@/lib/actions/defaultParams.actions";
import { IColumn } from "@/utils/defaultTypes";
import { reverseUnslug } from "@/utils/helperFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiHide } from "react-icons/bi";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "./ui/input";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  dropdownValues: z
    .array(
      z.object({
        name: z.string(),
      })
    )
    .optional(),
  type: z.string({
    required_error: "Please select appropriate type of field",
  }),
  dropdownFromExistingTable: z.enum(["true", "false"]).optional(),
  dropdownTableRef: z.string().min(1, { message: "Required" }).optional(),
  dropdownColumnRef: z.string().min(1, { message: "Required" }).optional(),
});

const AddColumns = ({
  columnDetails,
  userId,
  newTable,
  columnIndex,
  actionType,
}: {
  columnDetails?: IColumn;
  userId: string;
  newTable?: boolean;
  columnIndex: number;
  actionType: "Edit-Column" | "Add-Column-Left" | "Add-Column-Right" | "Hide-Column";
}) => {
  const pathname = usePathname();

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropdownColumnData, setDropdownColumnData] = useState<IColumn[]>([]);

  let defaultValues = {};
  if (columnDetails?.type === "dropdown") {
    if (columnDetails.tableRef) {
      defaultValues = {
        name: columnDetails?.title,
        type: columnDetails?.type,
        dropdownFromExistingTable: "true",
        dropdownTableRef: columnDetails.tableRef,
        dropdownColumnRef: columnDetails.columnRef,
      };
    } else {
      defaultValues = {
        name: columnDetails?.title,
        type: columnDetails?.type,
        dropdownFromExistingTable: "false",
      };
    }
  } else {
    defaultValues = {
      name: columnDetails?.title,
      type: columnDetails?.type,
    };
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const { watch, setValue, getValues, setError } = form;
  const dropdown = watch("type");
  const dropdownValues = watch("dropdownValues") || [];
  const dropdownFromExistingTable = watch("dropdownFromExistingTable");
  const dropdownTableRef = watch("dropdownTableRef");

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

  useEffect(() => {
    if (dropdown === "dropdown" && dropdownFromExistingTable === "false") {
      setValue(
        "dropdownValues",
        columnDetails?.dropdownValues?.map((item: string) => ({ name: item })) || [{ name: "" }]
      );
    }
  }, [dropdown, setValue, dropdownFromExistingTable, columnDetails]);

  useEffect(() => {
    const fetchColumnData = async () => {
      if (dropdownTableRef === "Bus") {
        const { data } = await getDefaultParams();
        setDropdownColumnData(data[0].busColumns);
      } else if (dropdownTableRef === "Generator") {
        const { data } = await getDefaultParams();
        setDropdownColumnData(data[0].generatorColumns);
      }
    };
    fetchColumnData();
  }, [dropdownTableRef]);

  useEffect(() => {
    if (!open) {
      const popoverTrigger = document.getElementById(`popover-btn-${columnIndex}`);
      if (popoverTrigger) popoverTrigger.click();
    }
  }, [open, columnIndex]);

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
    if (Object.keys(form.formState.errors).length !== 0) return;
    if (!data.type) {
      setError("type", { message: "Required" }, { shouldFocus: true });
      return;
    }

    if (data.type === "dropdown") {
      if (!data.dropdownFromExistingTable) {
        setError("dropdownFromExistingTable", { message: "Required" }, { shouldFocus: true });
        return;
      }
      if (data.dropdownFromExistingTable === "true") {
        if (!data.dropdownTableRef) {
          setError("dropdownTableRef", { message: "Required" }, { shouldFocus: true });
          return;
        }
        if (!data.dropdownColumnRef) {
          setError("dropdownColumnRef", { message: "Required" }, { shouldFocus: true });
          return;
        }
      } else {
        for (let ind = 0; ind < data.dropdownValues!.length; ind++) {
          const item = data.dropdownValues![ind];
          if (item.name === "") {
            setError(`dropdownValues.${ind}.name`, { message: "Required" }, { shouldFocus: true });
            return;
          }
        }
      }
    }

    try {
      let response;
      switch (actionType) {
        case "Add-Column-Left":
          response = await updateDefaultParams(data, pathname, userId, columnIndex - 1 < 0 ? 0 : columnIndex - 1);
          break;

        case "Add-Column-Right":
          response = await updateDefaultParams(data, pathname, userId, columnIndex + 1);
          break;

        case "Edit-Column":
          response = await editSpecificDefaultParam(data, pathname, userId, columnIndex);
          break;

        default:
          break;
      }
      if (response?.status === 409) {
        toast.error(response.data);
      } else if (response?.status === 200) {
        router.refresh();
        setOpen(false);
        form.reset(columnDetails && data);
        toast.success(
          columnDetails ? `Column ${data.name} edited successfully` : `New column ${data.name} added successfully`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeColumn = async () => {
    try {
      const response = await toggleDefaultParam(pathname, userId, columnIndex, "Hide-One");
      if (response.status === 200) {
        toast.success(`Column '${columnDetails?.title}' hidden successfully`);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* {!columnDetails && (
        <Button
          variant={"destructive"}
          onClick={dummy}
        >
          Add new column
        </Button>
      )} */}
      {actionType === "Hide-Column" && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              className="w-full flex items-center gap-3"
            >
              <BiHide className="text-lg" />
              <p>Hide column</p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will hide <span className="font-semibold">{columnDetails?.title}</span> from{" "}
                <span className="font-semibold">{reverseUnslug(pathname)}</span> table. To change it, you need to go to
                column details section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-700"
                onClick={removeColumn}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger className="w-full">
          {newTable ? (
            <p className={buttonVariants({ variant: "link" }) + " text-lg"}>Add columns &rarr;</p>
          ) : (
            <>
              {actionType === "Add-Column-Left" && (
                <div className={buttonVariants({ variant: "outline" }) + " w-full flex items-center gap-3"}>
                  <IoMdAdd />
                  <p>Add column to left</p>
                </div>
              )}
              {actionType === "Add-Column-Right" && (
                <div className={buttonVariants({ variant: "outline" }) + " w-full flex items-center gap-3"}>
                  <IoMdAdd />
                  <p>Add column to right</p>
                </div>
              )}
              {actionType === "Edit-Column" && (
                <div className={buttonVariants({ variant: "outline" }) + " w-full flex items-center gap-3"}>
                  <MdEdit />
                  <p>Edit column details</p>
                </div>
              )}
            </>
          )}
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[80vh] overflow-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="font-bold text-center">
              {actionType === "Edit-Column" ? "Edit column" : "Add a new column"}
            </DialogTitle>
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
                        className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
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
                      disabled={!!columnDetails}
                    >
                      <FormControl>
                        <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
                          <SelectValue
                            placeholder="Select appropriate type of field"
                            className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="switch">Switch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {dropdown === "dropdown" && (
                <FormField
                  control={form.control}
                  name="dropdownFromExistingTable"
                  render={({ field }) => (
                    <FormItem className="flex gap-5 items-center">
                      <FormLabel>Do you want to fetch dropdown values from existing tables?</FormLabel>
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
              )}

              {dropdownFromExistingTable === "true" && (
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="dropdownTableRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table name:</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
                              <SelectValue
                                placeholder="Select table from which you want to fetch dropdown values"
                                className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Generator">Generator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {dropdownTableRef && dropdownColumnData.length ? (
                    <FormField
                      control={form.control}
                      name="dropdownColumnRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Column name:</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
                                <SelectValue
                                  placeholder="Select particular column of table"
                                  className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dropdownColumnData.map((selectValue, ind) => (
                                <SelectItem
                                  value={selectValue.field}
                                  key={ind}
                                >
                                  {selectValue.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )}

              {dropdownFromExistingTable === "false" &&
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
                              className="focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none"
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

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddColumns;
