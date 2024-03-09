import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";
import { getExcitationSystemById } from "@/lib/actions/excitationSystem.actions";
import { IDefaultParamSchema, IExcitationSystem } from "@/utils/defaultTypes";

interface EditProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (excitationSystemDetails: IExcitationSystem, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(excitationSystemDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].excitationSystemColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              excitationSystemDetails?.[item.field]?.[subItem.field] ||
              excitationSystemDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          excitationSystemDetails?.[item.field] || excitationSystemDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = excitationSystemDetails._id;
    return values;
  }
  return {};
};

const EditExcitationSystem = async ({ params }: EditProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: excitationSystemDetails } = await getExcitationSystemById(id);

  const defaultValues = calculateDefaultValues(excitationSystemDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit excitation system</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].excitationSystemColumns}
          formDetails={defaultValues}
          type="excitationSystem"
        />
      </Suspense>
    </div>
  );
};

export default EditExcitationSystem;
