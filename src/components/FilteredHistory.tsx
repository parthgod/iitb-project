"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Search from "./Search";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";

const FilteredHistory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [databaseName, setDatabaseName] = useState(searchParams.get("databaseName") || "All");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let newUrl = "";
    if (type && type !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [type, searchParams, router]);

  useEffect(() => {
    let newUrl = "";
    if (databaseName && databaseName !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "databaseName",
        value: databaseName,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["databaseName"],
      });
    }

    router.push(newUrl, { scroll: false });
  }, [databaseName, searchParams, router]);

  if (!isMounted) return null;

  return (
    <div className="px-4 flex items-center gap-8">
      <Search placeholder="Search by username..." />
      <div className="flex items-center gap-1">
        <p className="whitespace-nowrap">Operation type:</p>
        <Select
          defaultValue={type}
          onValueChange={(value) => setType(value)}
        >
          <SelectTrigger className="select-field w-28 pr-2 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Create">Create</SelectItem>
            <SelectItem value="Update">Update</SelectItem>
            <SelectItem value="Delete">Delete</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <p className="whitespace-nowrap">Select database:</p>
        <Select
          defaultValue={databaseName}
          onValueChange={(value) => setDatabaseName(value)}
        >
          <SelectTrigger className="select-field w-56 px-2 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:shadow-blue-500 focus:shadow-[0px_2px_20px_-10px_rgba(0,0,0,0.75)] focus:border-blue-500 focus:outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Bus">Bus</SelectItem>
            <SelectItem value="Excitation System">Excitation System</SelectItem>
            <SelectItem value="Generator">Generator</SelectItem>
            <SelectItem value="Load">Load</SelectItem>
            <SelectItem value="Series Capacitor">Series Capacitor</SelectItem>
            <SelectItem value="Shunt Capacitor">Shunt Capacitor</SelectItem>
            <SelectItem value="Shunt Reactor">Shunt Reactor</SelectItem>
            <SelectItem value="Single Line Diagram">Single Line Diagram</SelectItem>
            <SelectItem value="Transformers Three Winding">Transformers Three Winding</SelectItem>
            <SelectItem value="Transformers Two Winding">Transformers Two Winding</SelectItem>
            <SelectItem value="Transmission Line">Transmission Line</SelectItem>
            <SelectItem value="Turbine Governor">Turbine Governor</SelectItem>
            <SelectItem value="IBR">IBR</SelectItem>
            <SelectItem value="LCC-HVDC Link">LCC-HVDC Link</SelectItem>
            <SelectItem value="VSC-HVDC Link">VSC-HVDC Link</SelectItem>
            <SelectItem value="Series Fact">Series Fact</SelectItem>
            <SelectItem value="Shunt Fact">Shunt Fact</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilteredHistory;
