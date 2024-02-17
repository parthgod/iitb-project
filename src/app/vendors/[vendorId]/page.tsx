import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getVendorById } from "@/lib/actions/vendor.actions";
import { Suspense } from "react";

interface EditVendorProps {
  params: {
    vendorId: String;
  };
}

const calculateDefaultValues = (vendorDetails: any, defaultParams: any): any => {
  if (Object.keys(vendorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].vendorColumns.forEach((item: any) => {
      values[item.field] = vendorDetails?.[item.field] || vendorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = vendorDetails._id;
    return values;
  }
  return {};
};

const EditVendor = async ({ params }: EditVendorProps) => {
  const { vendorId } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: vendorDetails } = (await getVendorById(vendorId)) as any;

  const defaultValues = calculateDefaultValues(vendorDetails, defaultParams);

  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateForm
        formFields={defaultParams[0].vendorColumns}
        formDetails={defaultValues}
        type="Vendor"
      />
    </Suspense>
  );
};

export default EditVendor;
