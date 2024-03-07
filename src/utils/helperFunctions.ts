import qs from "query-string";

export const convertField = (input: string): string => {
  const sanitizedInput = input.replace(/[^a-zA-Z0-9\s']/g, ""); // Remove special characters
  const words = sanitizedInput.split(" ");
  const updatedWords = words.map((word) => {
    const baseWord = word.replace(/'$/, ""); // Remove trailing single quote if present
    return baseWord.charAt(0).toUpperCase() + baseWord.slice(1);
  });

  const firstWord = updatedWords[0].toLowerCase();
  const restOfTheWords = updatedWords.slice(1).join("");

  const result = firstWord + restOfTheWords + (sanitizedInput.endsWith("'") ? "Prime" : "");

  return result;
};

export const reverseUnslug = (input: string): string => {
  const words = input.match(/[A-Za-z0-9]+/g) || []; // Extract alphanumeric words
  const result = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

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

export const convertDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-GB", options);
};
