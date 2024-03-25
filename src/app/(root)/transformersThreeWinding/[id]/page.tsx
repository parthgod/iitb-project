import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTransformersThreeWindingById } from "@/lib/actions/transformersThreeWinding.actions";
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

interface EditTransformersThreeWindingProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (transformersThreeWindingDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(transformersThreeWindingDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].transformersThreeWindingColumns.forEach((item) => {
      if (!item.isRemoved)
        values[item.field] =
          transformersThreeWindingDetails?.[item.field] ||
          transformersThreeWindingDetails?.additionalFields?.[item.field] ||
          "";
    });
    values["_id"] = transformersThreeWindingDetails._id;
    return values;
  }
  return {};
};

const EditTransformersThreeWinding = async ({ params }: EditTransformersThreeWindingProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: transformersThreeWindingDetails } = await getTransformersThreeWindingById(id);

  const defaultValues = calculateDefaultValues(transformersThreeWindingDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/transformersThreeWinding"
              className="font-bold text-3xl"
            >
              Transformers Three Winding
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
          formFields={defaultParams[0].transformersThreeWindingColumns}
          formDetails={defaultValues}
          type="transformersThreeWinding"
        />
      </Suspense>
    </div>
  );
};

export default EditTransformersThreeWinding;
