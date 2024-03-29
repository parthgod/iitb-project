"use client";

import { useEffect, useState } from "react";
import Search from "./Search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";

const UsersFilter = () => {
  const [status, setStatus] = useState("All");
  const [isMounted, setIsMounted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let newUrl = "";
    if (status && status !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "status",
        value: status,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["status"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [status, searchParams, router]);

  if (!isMounted) return null;

  return (
    <div className="px-3 flex items-center gap-8">
      <Search placeholder="Search by username or email..." />
      <div className="flex items-center gap-1">
        <p className="whitespace-nowrap">Status:</p>
        <Select
          defaultValue={status}
          onValueChange={(value) => setStatus(value)}
        >
          <SelectTrigger className="select-field w-32 pr-2 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UsersFilter;
