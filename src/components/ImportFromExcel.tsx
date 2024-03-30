"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadBusFromExcel } from "@/lib/actions/bus.actions";
import { uploadExcitationSystemFromExcel } from "@/lib/actions/excitationSystem.actions";
import { uploadGeneratorFromExcel } from "@/lib/actions/generator.actions";
import { uploadIBRFromExcel } from "@/lib/actions/ibr.actions";
import { uploadLCCHVDCLinkFromExcel } from "@/lib/actions/lccHVDCLink.actions";
import { uploadLoadFromExcel } from "@/lib/actions/load.actions";
import { uploadSeriesCapacitorFromExcel } from "@/lib/actions/seriesCapacitor.actions";
import { uploadSeriesFactFromExcel } from "@/lib/actions/seriesFact.actions";
import { uploadShuntCapacitorFromExcel } from "@/lib/actions/shuntCapacitor.actions";
import { uploadShuntFactFromExcel } from "@/lib/actions/shuntFact.actions";
import { uploadShuntReactorFromExcel } from "@/lib/actions/shuntReactor.actions";
import { uploadSingleLineDiagramFromExcel } from "@/lib/actions/singleLineDiagram.actions";
import { uploadTransformersThreeWindingFromExcel } from "@/lib/actions/transformersThreeWinding.actions";
import { uploadTransformersTwoWindingFromExcel } from "@/lib/actions/transformersTwoWinding.actions";
import { uploadTransmissionLineFromExcel } from "@/lib/actions/transmissionLines.actions";
import { uploadTurbineGovernorFromExcel } from "@/lib/actions/turbineGovernor.actions";
import { uploadVSCHVDCLinkFromExcel } from "@/lib/actions/vscHVDCLink.actions";
import { IColumn } from "@/utils/defaultTypes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFileUpload, FaRegFileExcel, FaTable } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { toast } from "sonner";
import * as XLSX from "xlsx/xlsx.mjs";
import { ExcelFileUploader } from "./ExcelFileUploader";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type HeadersArrayProps = {
  fieldValue: string;
  correspondingFieldValue: string;
};

const ImportFromExcel = ({ columns, userId }: { columns: IColumn[]; userId: string }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(1);
  const [headersArray, setHeadersArray] = useState<HeadersArrayProps[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleSelectChange = (index: number, value: string) => {
    const updatedArray = headersArray.map((item, ind) => {
      if (index === ind) {
        return {
          ...item,
          correspondingFieldValue: value,
        };
      }
      return item;
    });
    setHeadersArray(updatedArray);

    for (let i = 0; i < updatedArray.length; i++) {
      const item = updatedArray[i];
      if (item.correspondingFieldValue === "") {
        setError(true);
        break;
      } else if (
        updatedArray.find(
          (duplicate, ind) =>
            duplicate.correspondingFieldValue !== "null" &&
            duplicate.correspondingFieldValue === item.correspondingFieldValue &&
            ind !== i
        )
      ) {
        setError(true);
        break;
      } else setError(false);
    }
  };

  const handleAddToTable = () => {
    setIsLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file!);
    console.log(headersArray);
    // return;

    fileReader.onload = async (e: any) => {
      const bufferArray = e?.target.result;
      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
        if (headersArray.find((item) => item.fieldValue === ws[address].v && item.correspondingFieldValue !== "null")) {
          ws[address].t = "s";
          const newHeader = headersArray.find((item) => item.fieldValue === ws[address].v)?.correspondingFieldValue;
          ws[address].v = newHeader;
          ws[address].h = newHeader;
          ws[address].w = newHeader;
        } else {
          for (let R = range.s.r; R <= range.e.r; ++R) {
            const deleteAddress = XLSX.utils.encode_cell({ r: R, c: C });
            delete ws[deleteAddress];
          }
        }
      }
      const data = XLSX.utils.sheet_to_json(ws);

      const dataToImport = data.map((item: any) => {
        const defaultFields: any = {};
        const additionalFields: any = {};
        columns.forEach((column) => {
          if (!column.isHidden) {
            if (column.isDefault) defaultFields[column.field] = item[column.field];
            else additionalFields[column.field] = item[column.field];
          }
        });
        if (Object.keys(additionalFields).length) return { ...defaultFields, additionalFields };
        else return { ...defaultFields };
      });
      console.log(dataToImport);

      if (!dataToImport.length) {
        setIsLoading(false);
        return toast.error("No data to upload");
      }

      try {
        let res;
        switch (pathname) {
          case "/bus":
            res = await uploadBusFromExcel(dataToImport, userId);
            break;

          case "/excitationSystem":
            res = await uploadExcitationSystemFromExcel(dataToImport, userId);
            break;

          case "/generator":
            res = await uploadGeneratorFromExcel(dataToImport, userId);
            break;

          case "/load":
            res = await uploadLoadFromExcel(dataToImport, userId);
            break;

          case "/seriesCapacitor":
            res = await uploadSeriesCapacitorFromExcel(dataToImport, userId);
            break;

          case "/shuntCapacitor":
            res = await uploadShuntCapacitorFromExcel(dataToImport, userId);
            break;

          case "/shuntReactor":
            res = await uploadShuntReactorFromExcel(dataToImport, userId);
            break;

          case "/singleLineDiagram":
            res = await uploadSingleLineDiagramFromExcel(dataToImport, userId);
            break;

          case "/transformersThreeWinding":
            res = await uploadTransformersThreeWindingFromExcel(dataToImport, userId);
            break;

          case "/transformersTwoWinding":
            res = await uploadTransformersTwoWindingFromExcel(dataToImport, userId);
            break;

          case "/transmissionLine":
            res = await uploadTransmissionLineFromExcel(dataToImport, userId);
            break;

          case "/turbineGovernor":
            res = await uploadTurbineGovernorFromExcel(dataToImport, userId);
            break;

          case "/ibr":
            res = await uploadIBRFromExcel(dataToImport, userId);
            break;

          case "/lccHVDCLink":
            res = await uploadLCCHVDCLinkFromExcel(dataToImport, userId);
            break;

          case "/seriesFact":
            res = await uploadSeriesFactFromExcel(dataToImport, userId);
            break;

          case "/shuntFact":
            res = await uploadShuntFactFromExcel(dataToImport, userId);
            break;

          case "/vscHVDCLink":
            res = await uploadVSCHVDCLinkFromExcel(dataToImport, userId);
            break;

          default:
            break;
        }
        if (res?.status === 200) {
          toast.success(res.data);
          setOpen((prev) => !prev);
          router.refresh();
          setProgress(1);
          setHeadersArray([]);
          setFile(null);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
  };

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e: any) => {
        const bufferArray = e?.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const range = XLSX.utils.decode_range(ws["!ref"]);
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
          const cell = ws[address];
          if (cell.v.toLowerCase() !== "id") {
            const correspondingFieldValue = columns.find(
              (item) => (item.field === cell.v || item.title === cell.v) && !item.isHidden
            )?.field;
            headers.push({ fieldValue: cell.v, correspondingFieldValue: correspondingFieldValue || "" });
            if (!correspondingFieldValue) setError(true);
          }
        }
        setHeadersArray(headers);
      };
    }
  }, [file]);

  return (
    <div className="flex justify-center items-center">
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div className="p-3 py-2 flex items-center gap-1 bg-gray-200 rounded-lg hover:bg-gray-300">
                  <FaFileUpload />
                  <p>Upload</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Import data from excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="bg-white max-h-[80vh] overflow-auto custom-scrollbar">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-center">Upload data to this table from an excel file</DialogTitle>
            <Separator />
          </DialogHeader>
          <div className={`${progress === 1 ? "visible" : "hidden"}`}>
            <p className="mb-2">Drag and drop your excel file here or select from computer</p>
            <ExcelFileUploader
              file={file}
              setFile={setFile}
            />
          </div>

          <div className={`${progress === 2 ? "visible" : "hidden"}`}>
            <p>Configure how the file&apos;s columns map to their corresponding table&apos;s columns.</p>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 w-full">
                  <FaRegFileExcel />
                  <p>File&apos;s column</p>
                </div>
                <div className="flex items-center gap-1 w-full pl-10">
                  <FaTable />
                  <p>Table&apos;s column</p>
                </div>
              </div>
              <Separator className="mt-2" />
              {headersArray.length &&
                headersArray.map((header, ind) => (
                  <div
                    key={ind}
                    className="flex justify-between items-center my-3"
                  >
                    <div className="pr-5 w-full">
                      <p className="w-full rounded-md h-10 px-3 py-1 border border-input flex items-center text-sm">
                        {header.fieldValue}
                      </p>
                    </div>

                    <FaArrowRightLong className="text-3xl text-gray-400" />
                    <div className="w-full pl-5">
                      <Select
                        defaultValue={header.correspondingFieldValue}
                        onValueChange={(e) => handleSelectChange(ind, e)}
                      >
                        <SelectTrigger
                          className={`select-field focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none ${
                            header.correspondingFieldValue === "" ||
                            (headersArray.find(
                              (duplicate, i) =>
                                duplicate.correspondingFieldValue !== "null" &&
                                duplicate.correspondingFieldValue === header.correspondingFieldValue &&
                                i !== ind
                            ) &&
                              "border border-red-500 focus:border-red-500")
                          }`}
                        >
                          <SelectValue placeholder="Select corresponding column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((item, i) =>
                            item.isHidden ? (
                              ""
                            ) : (
                              <SelectItem
                                value={item.field}
                                key={i}
                              >
                                {item.title}
                              </SelectItem>
                            )
                          )}
                          <SelectItem value="null">Don't map to any column</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={`${progress === 3 ? "visible" : "hidden"}`}>
            <p>Confirm if columns are mapped correctly. You can go back and change it.</p>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 w-full">
                  <FaRegFileExcel />
                  <p>File&apos;s column</p>
                </div>
                <div className="flex items-center gap-1 w-full pl-10">
                  <FaTable />
                  <p>Table&apos;s column</p>
                </div>
              </div>
              <Separator className="mt-2" />
              {headersArray.length &&
                headersArray.map((header, ind) => (
                  <div
                    key={ind}
                    className="flex justify-between items-center my-3"
                  >
                    <div className="pr-5 w-full">
                      <p className="w-full rounded-md h-10 px-3 py-1 border border-input flex items-center text-sm">
                        {header.fieldValue}
                      </p>
                    </div>

                    <FaArrowRightLong className="text-3xl text-gray-400" />
                    <div className="pl-5 w-full">
                      <p className="w-full rounded-md h-10 px-3 py-1 border border-input flex items-center text-sm">
                        {columns.find((item) => item.field === header.correspondingFieldValue)?.title || (
                          <span className="text-gray-400 italic">null</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <Button
              className={`${progress === 1 ? "invisible" : "visible"}`}
              onClick={() => setProgress((prev) => prev - 1)}
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </Button>
            <Button
              className={`${progress === 3 ? "hidden" : "visible"}`}
              onClick={() => setProgress((prev) => prev + 1)}
              disabled={(progress === 1 && !file) || (progress === 2 && error)}
            >
              Proceed
              <FaArrowRight className="ml-2" />
            </Button>
            <Button
              className={`${progress === 3 ? "visible" : "hidden"} bg-green-600 hover:bg-green-700`}
              onClick={handleAddToTable}
            >
              Finish
              <GiConfirmed className="ml-2" />
            </Button>
          </div>
          {isLoading ? (
            <div className="z-[60] absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-50">
              <div className="loader scale-50">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              <p className="mt-12 text-xl font-bold text-gray-100">Please wait...</p>
            </div>
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportFromExcel;
