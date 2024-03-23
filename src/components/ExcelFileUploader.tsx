"use client";

import { Button } from "@/components/ui/button";
import { useDropzone } from "@uploadthing/react/hooks";
import Image from "next/image";
import { useCallback } from "react";
import { FaRegFileExcel } from "react-icons/fa";

type ExcelFileUploaderProps = {
  file: any;
  setFile: any;
};

export function ExcelFileUploader({ file, setFile }: ExcelFileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles[0]);
    setFile(acceptedFiles[0]);
    // readExcel(acceptedFiles[0]);
    // setFiles((prev: any) => [
    //   ...prev,
    //   { field: field, file: { name: acceptedFiles[0].name, url: convertFileToUrl(acceptedFiles[0]) } },
    // ]);
    // onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50 border-2 border-dashed border-gray-400"
    >
      <input
        {...getInputProps()}
        className="cursor-pointer"
      />
      {file ? (
        <div className="text-gray-500 flex flex-col items-center justify-center gap-5">
          <FaRegFileExcel className="text-7xl" />
          <p>File selected: {file?.name}</p>
          <p>
            Please click on <span className="font-semibold">"Proceed"</span> to go ahead.
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col py-5 text-grey-500">
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag Excel file here</h3>
          <p className="p-medium-12 mb-4">.xlsx, .csv, .xls</p>
          <p className="p-medium-12 mb-4">
            Please make sure the file is in correct format and has first row as column headers
          </p>
          <Button
            type="button"
            variant="default"
            className="rounded-full bg-blue-600"
          >
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}
