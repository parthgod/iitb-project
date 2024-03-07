import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSingleLineDiagramById } from "@/lib/actions/singleLineDiagram.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditSingleLineDiagramProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (singleLineDiagramDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(singleLineDiagramDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].singleLineDiagramsColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              singleLineDiagramDetails?.[item.field]?.[subItem.field] ||
              singleLineDiagramDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          singleLineDiagramDetails?.[item.field] || singleLineDiagramDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = singleLineDiagramDetails._id;
    return values;
  }
  return {};
};

const EditSingleLineDiagram = async ({ params }: EditSingleLineDiagramProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: singleLineDiagramDetails } = (await getSingleLineDiagramById(id)) as any;

  const defaultValues = calculateDefaultValues(singleLineDiagramDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit single line diagram</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].singleLineDiagramsColumns}
          formDetails={defaultValues}
          type="singleLineDiagram"
        />
      </Suspense>
    </div>
  );
};

export default EditSingleLineDiagram;
