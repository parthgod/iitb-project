import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSeriesCapacitorById } from "@/lib/actions/seriesCapacitor.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditSeriesCapacitorProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (seriesCapacitorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(seriesCapacitorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].seriesCapacitorColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
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

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: seriesCapacitorDetails } = (await getSeriesCapacitorById(id)) as any;

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
