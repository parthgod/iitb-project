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
import { getShuntFactById } from "@/lib/actions/shuntFact.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditShuntFactProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (shuntFactDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(shuntFactDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].shuntFactsColumns.forEach((item) => {
      if (!item.isRemoved)
        values[item.field] = shuntFactDetails?.[item.field] || shuntFactDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = shuntFactDetails._id;
    return values;
  }
  return {};
};

const EditShuntFact = async ({ params }: EditShuntFactProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: shuntFactDetails } = await getShuntFactById(id);

  const defaultValues = calculateDefaultValues(shuntFactDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/shuntFact"
              className="font-bold text-3xl"
            >
              ShuntFact
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
          formFields={defaultParams[0].shuntFactColumns}
          formDetails={defaultValues}
          type="shuntFact"
        />
      </Suspense>
    </div>
  );
};

export default EditShuntFact;
