import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTurbineGovernorById } from "@/lib/actions/turbineGovernor.actions";
import { IBus, IDefaultParamSchema } from "@/utils/defaultTypes";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EditTurbineGovernorProps {
  params: { id: string };
}

const calculateDefaultValues = (turbineGovernorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(turbineGovernorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].turbineGovernorColumns.forEach((item) => {
      if (!item.isHidden) {
        if (item.isDefault) {
          if (item.type === "switch") values[item.field] = turbineGovernorDetails?.[item.field] === "ON" ? true : false;
          else values[item.field] = turbineGovernorDetails?.[item.field] || "";
        } else {
          if (item.type === "switch")
            values[item.field] = turbineGovernorDetails?.additionalFields?.[item.field] === "ON" ? true : false;
          else values[item.field] = turbineGovernorDetails?.additionalFields?.[item.field] || "";
        }
      }
    });
    values["_id"] = turbineGovernorDetails._id;
    return values;
  }
  return {};
};

const EditTurbineGovernor = async ({ params }: EditTurbineGovernorProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: turbineGovernorDetails } = await getTurbineGovernorById(id);

  const defaultValues = calculateDefaultValues(turbineGovernorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/turbineGovernor"
              className="font-bold text-3xl"
            >
              Turbine Governor
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
          formFields={defaultParams[0].turbineGovernorColumns}
          formDetails={defaultValues}
          type="turbineGovernor"
          id={id}
        />
      </Suspense>
    </div>
  );
};

export default EditTurbineGovernor;
