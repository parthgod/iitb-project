import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTransmissionLineById } from "@/lib/actions/transmissionLines.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditTransmissionLineProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (transmissionLineDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(transmissionLineDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].transmissionLinesColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              transmissionLineDetails?.[item.field]?.[subItem.field] ||
              transmissionLineDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          transmissionLineDetails?.[item.field] || transmissionLineDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = transmissionLineDetails._id;
    return values;
  }
  return {};
};

const EditTransmissionLine = async ({ params }: EditTransmissionLineProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: transmissionLineDetails } = (await getTransmissionLineById(id)) as any;

  const defaultValues = calculateDefaultValues(transmissionLineDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit transmission line</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].transmissionLinesColumns}
          formDetails={defaultValues}
          type="transmissionLine"
        />
      </Suspense>
    </div>
  );
};

export default EditTransmissionLine;
