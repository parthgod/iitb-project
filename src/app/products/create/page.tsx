import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateProduct = async () => {
  const { data: defaultParams } = (await getDefaultParams()) as any;

  return (
    <Suspense fallback={<FormSkeleton />}>
      <CreateForm
        formFields={defaultParams[0].productColumns}
        type="Product"
      />
    </Suspense>
  );
};

export default CreateProduct;
