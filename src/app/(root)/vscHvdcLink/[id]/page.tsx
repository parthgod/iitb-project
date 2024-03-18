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
import { getVSCHVDCLinkById } from "@/lib/actions/vscHVDCLink.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditVscHvdcLinkProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (vscHVDCLinkDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(vscHVDCLinkDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].vscHVDCLinkColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              vscHVDCLinkDetails?.[item.field]?.[subItem.field] ||
              vscHVDCLinkDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          vscHVDCLinkDetails?.[item.field] || vscHVDCLinkDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = vscHVDCLinkDetails._id;
    return values;
  }
  return {};
};

const EditVscHvdcLink = async ({ params }: EditVscHvdcLinkProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: vscHVDCLinkDetails } = await getVSCHVDCLinkById(id);

  const defaultValues = calculateDefaultValues(vscHVDCLinkDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/vscHVDCLink"
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
          formFields={defaultParams[0].vscHVDCLinkColumns}
          formDetails={defaultValues}
          type="vscHVDCLink"
        />
      </Suspense>
    </div>
  );
};

export default EditVscHvdcLink;
