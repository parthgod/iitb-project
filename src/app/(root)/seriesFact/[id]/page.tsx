import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getSeriesFactById } from "@/lib/actions/seriesFact.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditSeriesFactProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (seriesFactDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(seriesFactDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].seriesFactsColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              seriesFactDetails?.[item.field]?.[subItem.field] ||
              seriesFactDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] = seriesFactDetails?.[item.field] || seriesFactDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = seriesFactDetails._id;
    return values;
  }
  return {};
};

const EditSeriesFact = async ({ params }: EditSeriesFactProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: seriesFactDetails } = await getSeriesFactById(id);

  const defaultValues = calculateDefaultValues(seriesFactDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/seriesFact"
              className="font-bold text-3xl"
            >
              SeriesFact
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
          formFields={defaultParams[0].seriesFactColumns}
          formDetails={defaultValues}
          type="seriesFact"
        />
      </Suspense>
    </div>
  );
};

export default EditSeriesFact;
