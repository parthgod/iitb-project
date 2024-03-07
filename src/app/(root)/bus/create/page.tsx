import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateBus = async () => {
  const { data: defaultParams } = (await getDefaultParams()) as any;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Create new bus</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].busColumns}
          type="bus"
        />
      </Suspense>
    </div>
  );
};

export default CreateBus;
