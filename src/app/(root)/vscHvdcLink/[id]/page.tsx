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
import { getVSCHVDCLinkById } from "@/lib/actions/vscHvdcLink.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditVscHvdcLinkProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (vscHvdcLinkDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(vscHvdcLinkDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].vscHvdcLinkColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              vscHvdcLinkDetails?.[item.field]?.[subItem.field] ||
              vscHvdcLinkDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          vscHvdcLinkDetails?.[item.field] || vscHvdcLinkDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = vscHvdcLinkDetails._id;
    return values;
  }
  return {};
};

const EditVscHvdcLink = async ({ params }: EditVscHvdcLinkProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: vscHvdcLinkDetails } = await getVSCHVDCLinkById(id);

  const defaultValues = calculateDefaultValues(vscHvdcLinkDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/vscHvdcLink"
              className="font-bold text-3xl"
            >
              VSC-HVDC Link
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
          formFields={defaultParams[0].vscHvdcLinkColumns}
          formDetails={defaultValues}
          type="vscHvdcLink"
        />
      </Suspense>
    </div>
  );
};

export default EditVscHvdcLink;
