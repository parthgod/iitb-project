import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSeriesCapacitorById } from "@/lib/actions/seriesCapacitor.actions";
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
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/seriesCapacitor"
              className="font-bold text-3xl"
            >
              Series Capacitor
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
          formFields={defaultParams[0].seriesCapacitorColumns}
          formDetails={defaultValues}
          type="seriesCapacitor"
        />
      </Suspense>
    </div>
  );
};

export default EditSeriesCapacitor;
