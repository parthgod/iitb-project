import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getLoadById } from "@/lib/actions/load.actions";
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

interface EditLoadProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (loadDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(loadDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].loadsColumns.forEach((item) => {
      values[item.field] = loadDetails?.[item.field] || loadDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = loadDetails._id;
    return values;
  }
  return {};
};

const EditLoad = async ({ params }: EditLoadProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: loadDetails } = await getLoadById(id);

  const defaultValues = calculateDefaultValues(loadDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/load"
              className="font-bold text-3xl"
            >
              Load
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
          formFields={defaultParams[0].loadsColumns}
          formDetails={defaultValues}
          type="load"
        />
      </Suspense>
    </div>
  );
};

export default EditLoad;
