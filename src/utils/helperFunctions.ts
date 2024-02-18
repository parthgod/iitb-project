import qs from "query-string";
import fs from "fs";

export const convertField = (input: string): string => {
  const words = input.split(" ");
  const firstWord = words[0].toLowerCase();
  const restOfTheWords = words
    .slice(1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  const result = firstWord + restOfTheWords;
  return result;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const handleError = (error: unknown) => {
  console.error(error);
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export function formUrlQuery({ params, key, value }: any) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({ params, keysToRemove }: any) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key: any) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}
