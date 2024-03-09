import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateShuntReactor = async () => {
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Create new shunt reactor</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].shuntReactorsColumns}
          type="shuntReactor"
        />
      </Suspense>
    </div>
  );
};

export default CreateShuntReactor;
