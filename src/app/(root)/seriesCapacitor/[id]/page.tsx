import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSeriesCapacitorById } from "@/lib/actions/seriesCapacitor.actions";
import { Suspense } from "react";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";

interface EditSeriesCapacitorProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (seriesCapacitorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(seriesCapacitorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].seriesCapacitorColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              seriesCapacitorDetails?.[item.field]?.[subItem.field] ||
              seriesCapacitorDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          seriesCapacitorDetails?.[item.field] || seriesCapacitorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = seriesCapacitorDetails._id;
    return values;
  }
  return {};
};

const EditSeriesCapacitor = async ({ params }: EditSeriesCapacitorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: seriesCapacitorDetails } = await getSeriesCapacitorById(id);

  const defaultValues = calculateDefaultValues(seriesCapacitorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit series capacitor</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].seriesCapacitorColumns}
          formDetails={defaultValues}
          type="seriesCapacitor"
        />
      </Suspense>
    </div>
  );
};

export default EditSeriesCapacitor;
