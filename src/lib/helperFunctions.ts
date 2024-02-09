export const convertField = (input: string): string => {
  const withoutSpaces = input.toLowerCase().replace(/\s/g, "");
  const firstChar = withoutSpaces.charAt(0).toLowerCase();
  const result = firstChar + withoutSpaces.slice(1);
  return result;
};
