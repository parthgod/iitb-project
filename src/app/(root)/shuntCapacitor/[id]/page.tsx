import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getShuntCapacitorById } from "@/lib/actions/shuntCapacitor.actions";
import { Suspense } from "react";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";

interface EditShuntCapacitorProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (shuntCapacitorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(shuntCapacitorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].shuntCapacitorColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              shuntCapacitorDetails?.[item.field]?.[subItem.field] ||
              shuntCapacitorDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          shuntCapacitorDetails?.[item.field] || shuntCapacitorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = shuntCapacitorDetails._id;
    return values;
  }
  return {};
};

const EditShuntCapacitor = async ({ params }: EditShuntCapacitorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: shuntCapacitorDetails } = await getShuntCapacitorById(id);

  const defaultValues = calculateDefaultValues(shuntCapacitorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit shunt capacitor</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].shuntCapacitorColumns}
          formDetails={defaultValues}
          type="shuntCapacitor"
        />
      </Suspense>
    </div>
  );
};

export default EditShuntCapacitor;
