import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";
import { IDefaultParamSchema } from "@/lib/database/models/defaultParams";
import { IBus } from "@/lib/database/models/bus";
import { getBusById } from "@/lib/actions/bus.actions";

interface EditBusProps {
  params: {
    id: String;
  };
}

const calculateDefaultValues = (busDetails: IBus, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(busDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].busColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns.map(
          (subItem: any) =>
            (values[subItem.field] =
              busDetails?.[item.field]?.[subItem.field] ||
              busDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else values[item.field] = busDetails?.[item.field] || busDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = busDetails._id;
    return values;
  }
  return {};
};

const EditBus = async ({ params }: EditBusProps) => {
  const { id } = params;

  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: busDetails } = (await getBusById(id)) as any;

  const defaultValues = calculateDefaultValues(busDetails, defaultParams);

  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-3xl">Edit bus</p>
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
