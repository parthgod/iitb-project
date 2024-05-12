import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTransmissionLineById } from "@/lib/actions/transmissionLines.actions";
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

interface EditTransmissionLineProps {
  params: { id: string };
  searchParams: { newIndex: string };
}

const calculateDefaultValues = (transmissionLineDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(transmissionLineDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].transmissionLinesColumns.forEach((item) => {
      if (!item.isHidden) {
        if (item.isDefault) {
          if (item.type === "switch")
            values[item.field] = transmissionLineDetails?.[item.field] === "ON" ? true : false;
          else values[item.field] = transmissionLineDetails?.[item.field] || "";
        } else {
          if (item.type === "switch")
            values[item.field] = transmissionLineDetails?.additionalFields?.[item.field] === "ON" ? true : false;
          else values[item.field] = transmissionLineDetails?.additionalFields?.[item.field] || "";
        }
      }
    });
    values["_id"] = transmissionLineDetails._id;
    return values;
  }
  return {};
};

const EditTransmissionLine = async ({ params, searchParams }: EditTransmissionLineProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: transmissionLineDetails } = await getTransmissionLineById(id);

  const defaultValues = calculateDefaultValues(transmissionLineDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/transmissionLine"
              className="font-bold text-3xl"
            >
              Transmission Line
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
          formFields={defaultParams[0].transmissionLinesColumns}
          formDetails={defaultValues}
          type="transmissionLine"
          id={id}
        />
      </Suspense>
    </div>
  );
};

export default EditTransmissionLine;
