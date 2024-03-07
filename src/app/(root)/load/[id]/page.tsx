import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getLoadById } from "@/lib/actions/load.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditLoadProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (loadDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(loadDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].loadsColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              loadDetails?.[item.field]?.[subItem.field] ||
              loadDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else values[item.field] = loadDetails?.[item.field] || loadDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = loadDetails._id;
    return values;
  }
  return {};
};

const EditLoad = async ({ params }: EditLoadProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: loadDetails } = (await getLoadById(id)) as any;

  const defaultValues = calculateDefaultValues(loadDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit load</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].loadsColumns}
          formDetails={defaultValues}
          type="load"
        />
      </Suspense>
    </div>
  );
};

export default EditLoad;
