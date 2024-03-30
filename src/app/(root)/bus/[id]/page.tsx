import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";
import { getBusById } from "@/lib/actions/bus.actions";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EditBusProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (busDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(busDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].busColumns.forEach((item) => {
      if (!item.isHidden)
        if (!item.isHidden)
          values[item.field] = busDetails?.[item.field] || busDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = busDetails._id;
    return values;
  }
  return {};
};

const EditBus = async ({ params }: EditBusProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: busDetails } = await getBusById(id);

  const defaultValues = calculateDefaultValues(busDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/bus"
              className="font-bold text-3xl"
            >
              Bus
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
          formFields={defaultParams[0].busColumns}
          formDetails={defaultValues}
          type="bus"
        />
      </Suspense>
    </div>
  );
};

export default EditBus;
