"use client";

import { useDropzone } from "@uploadthing/react/hooks";
import { useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "@/components/ui/button";
import { convertFileToUrl } from "@/utils/helperFunctions";
import Image from "next/image";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFiles: any;
  field: string;
};

export function FileUploader({ imageUrl, onFieldChange, setFiles, field }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles((prev: any) => [
      ...prev,
      { field: field, file: { name: acceptedFiles[0].name, url: convertFileToUrl(acceptedFiles[0]) } },
    ]);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
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

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col py-5 text-grey-500">
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Upoad picture here from your device</h3>
          <p className="p-medium-12 mb-4">.jpg or .jpeg or .png</p>
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
