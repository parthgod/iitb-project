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
