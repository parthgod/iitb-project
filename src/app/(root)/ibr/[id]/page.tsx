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
import { getIBRById } from "@/lib/actions/ibr.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditIBRProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (ibrDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(ibrDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].ibrColumns.forEach((item) => {
      if (!item.isHidden)
        values[item.field] = ibrDetails?.[item.field] || ibrDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = ibrDetails._id;
    return values;
  }
  return {};
};

const EditIBR = async ({ params }: EditIBRProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: ibrDetails } = await getIBRById(id);

  const defaultValues = calculateDefaultValues(ibrDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/ibr"
              className="font-bold text-3xl"
            >
              IBR
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
          formFields={defaultParams[0].ibrColumns}
          formDetails={defaultValues}
          type="ibr"
        />
      </Suspense>
    </div>
  );
};

export default EditIBR;
