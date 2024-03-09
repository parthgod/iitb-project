import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";

const CreateSingleLineDiagram = async () => {
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Create new single line diagram</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].singleLineDiagramsColumns}
          type="singleLineDiagram"
        />
      </Suspense>
    </div>
  );
};

export default CreateSingleLineDiagram;
