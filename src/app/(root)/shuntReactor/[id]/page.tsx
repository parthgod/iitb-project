import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getShuntReactorById } from "@/lib/actions/shuntReactor.actions";
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

interface EditShuntReactorProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (shuntReactorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(shuntReactorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].shuntReactorsColumns.forEach((item) => {
      values[item.field] =
        shuntReactorDetails?.[item.field] || shuntReactorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = shuntReactorDetails._id;
    return values;
  }
  return {};
};

const EditShuntReactor = async ({ params }: EditShuntReactorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: shuntReactorDetails } = await getShuntReactorById(id);

  const defaultValues = calculateDefaultValues(shuntReactorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/shuntReactor"
              className="font-bold text-3xl"
            >
              Shunt Reactor
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
          formFields={defaultParams[0].shuntReactorsColumns}
          formDetails={defaultValues}
          type="shuntReactor"
        />
      </Suspense>
    </div>
  );
};

export default EditShuntReactor;
