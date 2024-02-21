"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";
import { IoCloseOutline } from "react-icons/io5";

const Search = ({ placeholder = "Search ..." }: { placeholder?: string }) => {
  const [query, setQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="flex justify-center items-center h-15 w-full overflow-hidden rounded-full bg-gray-100 px-4 py-1">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />
      <Input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="border-0 bg-gray-100 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
      />
      {query && (
        <div
          className="cursor-pointer hover:bg-gray-300 p-1 text-xl rounded-full"
          onClick={() => setQuery("")}
        >
          <IoCloseOutline />
        </div>
      )}
    </div>
  );
};

export default Search;
