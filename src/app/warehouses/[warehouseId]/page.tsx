import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getWarehouseById } from "@/lib/actions/warehouse.actions";
import { Suspense } from "react";

interface EditWarehouseProps {
  params: {
    warehouseId: String;
  };
}

const calculateDefaultValues = (warehouseDetails: any, defaultParams: any): any => {
  if (Object.keys(warehouseDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].warehouseColumns.forEach((item: any) => {
      values[item.field] = warehouseDetails?.[item.field] || warehouseDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = warehouseDetails._id;
    return values;
  }
  return {};
};

const EditWarehouse = async ({ params }: EditWarehouseProps) => {
  const { warehouseId } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: warehouseDetails } = (await getWarehouseById(warehouseId)) as any;

  const defaultValues = calculateDefaultValues(warehouseDetails, defaultParams);

  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateForm
        formFields={defaultParams[0].warehouseColumns}
        formDetails={defaultValues}
        type="Warehouse"
      />
    </Suspense>
  );
};

export default EditWarehouse;
