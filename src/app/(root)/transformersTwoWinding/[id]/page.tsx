import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTransformersTwoWindingById } from "@/lib/actions/transformersTwoWinding.actions";
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

interface EditTransformersTwoWindingProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (transformersTwoWindingDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(transformersTwoWindingDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].transformersTwoWindingColumns.forEach((item) => {
      if (!item.isHidden)
        values[item.field] =
          transformersTwoWindingDetails?.[item.field] ||
          transformersTwoWindingDetails?.additionalFields?.[item.field] ||
          "";
    });
    values["_id"] = transformersTwoWindingDetails._id;
    return values;
  }
  return {};
};

const EditTransformersTwoWinding = async ({ params }: EditTransformersTwoWindingProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: transformersTwoWindingDetails } = await getTransformersTwoWindingById(id);

  const defaultValues = calculateDefaultValues(transformersTwoWindingDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/transformersTwoWinding"
              className="font-bold text-3xl"
            >
              Transformers Two Winding
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
          formFields={defaultParams[0].transformersTwoWindingColumns}
          formDetails={defaultValues}
          type="transformersTwoWinding"
        />
      </Suspense>
    </div>
  );
};

export default EditTransformersTwoWinding;
