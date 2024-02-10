"use client";

import VendorForm from "@/components/VendorForm";
import { IDefaultParamSchema } from "@/models/defaultParams";
import { IVendor } from "@/models/vendor";
import { useEffect, useState } from "react";

interface EditVendorProps {
  params: {
    vendorId: String;
  };
}

const EditVendor = ({ params }: EditVendorProps) => {
  const { vendorId } = params;
  const [vendorDetails, setVendorDetails] = useState<any>({});
  const [defaultParams, setDefaultParams] = useState<IDefaultParamSchema[]>([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  const fetchVendorDetails = async () => {
    console.log(`/api/vendor/${vendorId}`);
    const response = await fetch(`/api/vendor/${vendorId}`);
    if (response.status === 200) {
      const data = await response.json();
      setVendorDetails(data);
      // console.log(data);
    }
  };

  const getDefaultParams = async () => {
    const response = await fetch("/api/defaultParams");
    const data = await response.json();
    setDefaultParams(data);
    // console.log(data);
  };

  useEffect(() => {
    setIsMounted(true);
    getDefaultParams();
    fetchVendorDetails();
  }, []);

  useEffect(() => {
    if (Object.keys(vendorDetails).length && defaultParams.length) {
      const values: any = {};
      defaultParams?.[0].vendorColumns.map((item: any) => {
        values[item.field] = vendorDetails?.[item.field] || vendorDetails?.additionalFields?.[item.field] || "";
      });
      values["_id"] = vendorDetails._id;
      console.log(values);
      setDefaultValues(values);
    }
  }, [vendorDetails, defaultParams]);

  if (isMounted && Object.keys(defaultValues).length) {
    return (
      <VendorForm
        vendorFields={defaultParams[0].vendorColumns}
        vendorDetails={defaultValues}
      />
    );
  }
};

export default EditVendor;
