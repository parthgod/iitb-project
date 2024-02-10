"use client";

import AddColumns from "@/components/AddColumns";
import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import { IVendor } from "@/models/vendor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [defaultParams, setDefaultParams] = useState<any>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const fetchVendors = async () => {
    const response = await fetch("/api/vendor");
    if (response.ok) {
      const data = await response.json();
      setVendors(data);
      console.log(data);
    }
  };

  const getDefaultParams = async () => {
    const response = await fetch("/api/defaultParams");
    if (response.ok) {
      const data = await response.json();
      setDefaultParams(data);
      console.log(data);
    }
  };

  const handleDelete = async (id: String) => {
    try {
      const response = await fetch(`/api/vendor/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Vendor deleted successfully");
        location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    getDefaultParams();
    fetchVendors();
  }, []);

  if (!isMounted) return null;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">List of vendors</h1>
      <div className="flex gap-5">
        <Button onClick={() => router.push("/create/vendor")}>Create vendor</Button>
        <AddColumns />
      </div>
      {defaultParams.length && (
        <Table
          columns={defaultParams[0].vendorColumns}
          data={vendors}
          handleDelete={handleDelete}
        />
      )}
    </main>
  );
}
