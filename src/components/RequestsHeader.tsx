"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Search from "./Search";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";
import { Skeleton } from "./ui/skeleton";

const RequestsHeader = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  if (!isMounted)
    return (
      <div className="flex gap-2">
        <Skeleton className="w-4/5 h-12" />
        <Skeleton className="w-1/5 h-12" />
      </div>
    );

  return (
    <div className="flex gap-8">
      <Search placeholder={`Search by username ${pathname === "/loginRequests" ? "or email" : ""}... `} />
      <div className="flex items-center gap-1">
        <p className="whitespace-nowrap">Status:</p>
        <Select
          defaultValue={status}
          onValueChange={(value) => setStatus(value)}
        >
          <SelectTrigger className="select-field w-28 pr-2 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            {pathname !== "/loginRequests" && <SelectItem value="Completed">Completed</SelectItem>}
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RequestsHeader;
