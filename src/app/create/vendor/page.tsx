import FormSkeleton from "@/components/FormSkeleton";
import VendorForm from "@/components/VendorForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateVendor = async () => {
  const { data: defaultParams } = (await getDefaultParams()) as any;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <VendorForm vendorFields={defaultParams[0].vendorColumns} />;
    </Suspense>
  );
};

export default CreateVendor;
