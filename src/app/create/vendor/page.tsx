"use client";

import VendorForm from "@/components/VendorForm";
import { IDefaultParamSchema } from "@/models/defaultParams";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateVendor = () => {
  const [defaultParams, setDefaultParams] = useState<IDefaultParamSchema[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getDefaultParams = async () => {
      const response = await fetch("/api/defaultParams");
      const data = await response.json();
      setDefaultParams(data);
      console.log(data);
    };
    setIsMounted(true);
    getDefaultParams();
  }, []);

  if (isMounted && defaultParams.length) {
    return <VendorForm vendorFields={defaultParams[0].vendorColumns} />;
  }
};

export default CreateVendor;
