import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSingleLineDiagramById } from "@/lib/actions/singleLineDiagram.actions";
import { Suspense } from "react";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EditSingleLineDiagramProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (singleLineDiagramDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(singleLineDiagramDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].singleLineDiagramsColumns.forEach((item) => {
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

  const { data: defaultParams } = await getDefaultParams();
  const { data: singleLineDiagramDetails } = await getSingleLineDiagramById(id);

  const defaultValues = calculateDefaultValues(singleLineDiagramDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/singleLineDiagram"
              className="font-bold text-3xl"
            >
              Single Line Diagram
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold text-3xl">Edit {id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
