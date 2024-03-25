import qs from "query-string";

export const convertField = (input: string): string => {
  const sanitizedInput = input.replaceAll("'", "Prime"); // Remove all single quotes
  const tempSanitizedInput = sanitizedInput.replace(/[^a-zA-Z0-9\s']/g, "");
  const words = tempSanitizedInput.split(" ");
  const updatedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const firstWord = updatedWords[0].toLowerCase();
  const restOfTheWords = updatedWords.slice(1).join("");

  const result = firstWord + restOfTheWords;

  return result;
};

export const reverseUnslug = (input: string): string => {
  const words = input.replace(/[^a-zA-Z0-9\s']/g, "").split(/(?=[A-Z])/);

  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  const result = capitalizedWords.join(" ");

  return result;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

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
