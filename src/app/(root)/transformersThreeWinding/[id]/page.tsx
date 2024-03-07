import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTransformersThreeWindingById } from "@/lib/actions/transformersThreeWinding.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditTransformersThreeWindingProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (transformersThreeWindingDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(transformersThreeWindingDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].transformersThreeWindingColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              transformersThreeWindingDetails?.[item.field]?.[subItem.field] ||
              transformersThreeWindingDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          transformersThreeWindingDetails?.[item.field] ||
          transformersThreeWindingDetails?.additionalFields?.[item.field] ||
          "";
    });
    values["_id"] = transformersThreeWindingDetails._id;
    return values;
  }
  return {};
};

const EditTransformersThreeWinding = async ({ params }: EditTransformersThreeWindingProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: transformersThreeWindingDetails } = (await getTransformersThreeWindingById(id)) as any;

  const defaultValues = calculateDefaultValues(transformersThreeWindingDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit transformers three winding</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].transformersThreeWindingColumns}
          formDetails={defaultValues}
          type="transformersThreeWinding"
        />
      </Suspense>
    </div>
  );
};

export default EditTransformersThreeWinding;
