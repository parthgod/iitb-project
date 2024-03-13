import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getGeneratorById } from "@/lib/actions/generator.actions";
import { Suspense } from "react";
import { IDefaultParamSchema, IGenerator } from "@/utils/defaultTypes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EditGeneratorProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (generatorDetails: IGenerator, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(generatorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].generatorColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              generatorDetails?.[item.field]?.[subItem.field] ||
              generatorDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] = generatorDetails?.[item.field] || generatorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = generatorDetails._id;
    return values;
  }
  return {};
};

const EditGenerator = async ({ params }: EditGeneratorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: generatorDetails } = await getGeneratorById(id);

  const defaultValues = calculateDefaultValues(generatorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/generator"
              className="font-bold text-3xl"
            >
              Generator
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
          formFields={defaultParams[0].generatorColumns}
          formDetails={defaultValues}
          type="generator"
        />
      </Suspense>
    </div>
  );
};

export default EditGenerator;
