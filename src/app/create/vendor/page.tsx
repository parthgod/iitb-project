"use client";

import VendorForm from "@/components/VendorForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateVendor = () => {
  const [defaultParams, setDefaultParams] = useState<any>([]);
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

  const createNewVendor = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/vendor/new", {
        method: "POST",
        body: JSON.stringify({
          name: "testname-2",
          address: "testadd-2",
          shopName: "testShopName-2",
        }),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isMounted && defaultParams.length) {
    return <VendorForm vendorFields={defaultParams[0].vendorColumns} />;
  }
};

export default CreateVendor;
