import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getShuntReactorById } from "@/lib/actions/shuntReactor.actions";
import { Suspense } from "react";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";

interface EditShuntReactorProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (shuntReactorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(shuntReactorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].shuntReactorsColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              shuntReactorDetails?.[item.field]?.[subItem.field] ||
              shuntReactorDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          shuntReactorDetails?.[item.field] || shuntReactorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = shuntReactorDetails._id;
    return values;
  }
  return {};
};

const EditShuntReactor = async ({ params }: EditShuntReactorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: shuntReactorDetails } = await getShuntReactorById(id);

  const defaultValues = calculateDefaultValues(shuntReactorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit shunt reactor</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].shuntReactorsColumns}
          formDetails={defaultValues}
          type="shuntReactor"
        />
      </Suspense>
    </div>
  );
};

export default EditShuntReactor;
