import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getShuntReactorById } from "@/lib/actions/shuntReactor.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditShuntReactorProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (shuntReactorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(shuntReactorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].shuntReactorsColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
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

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: shuntReactorDetails } = (await getShuntReactorById(id)) as any;

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
