import CreateForm from "@/components/CreateForm";
import FormSkeleton from "@/components/FormSkeleton";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getTurbineGovernorById } from "@/lib/actions/turbineGovernor.actions";
import { IBus } from "@/lib/database/models/bus";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { Suspense } from "react";

interface EditTurbineGovernorProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (turbineGovernorDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(turbineGovernorDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].turbineGovernorColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              turbineGovernorDetails?.[item.field]?.[subItem.field] ||
              turbineGovernorDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          turbineGovernorDetails?.[item.field] || turbineGovernorDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = turbineGovernorDetails._id;
    return values;
  }
  return {};
};

const EditTurbineGovernor = async ({ params }: EditTurbineGovernorProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: turbineGovernorDetails } = (await getTurbineGovernorById(id)) as any;

  const defaultValues = calculateDefaultValues(turbineGovernorDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit turbine governor</p>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].turbineGovernorColumns}
          formDetails={defaultValues}
          type="turbineGovernor"
        />
      </Suspense>
    </div>
  );
};

export default EditTurbineGovernor;
