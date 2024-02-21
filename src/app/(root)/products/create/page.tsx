import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateProduct = async () => {
  const { data: defaultParams } = (await getDefaultParams()) as any;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Create new product</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].productColumns}
          type="Product"
        />
      </Suspense>
    </div>
  );
};

export default CreateProduct;
