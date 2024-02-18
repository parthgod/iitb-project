import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateWarehouse = async () => {
  const { data: defaultParams } = (await getDefaultParams()) as any;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateForm
        formFields={defaultParams[0].warehouseColumns}
        type="Warehouse"
      />
    </Suspense>
  );
};

export default CreateWarehouse;
