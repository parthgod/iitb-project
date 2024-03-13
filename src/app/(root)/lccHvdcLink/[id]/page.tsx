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
import { getLCCHVDCLinkById } from "@/lib/actions/lccHvdcLink.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditLccHvdcLinkProps {
  params: {
    id: string;
  };
}

const calculateDefaultValues = (lccHvdcLinkDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(lccHvdcLinkDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].lccHvdcLinkColumns.forEach((item) => {
      if (item.type === "subColumns") {
        item.subColumns!.map(
          (subItem) =>
            (values[subItem.field] =
              lccHvdcLinkDetails?.[item.field]?.[subItem.field] ||
              lccHvdcLinkDetails?.additionalFields?.[item.field]?.[subItem.field] ||
              "")
        );
      } else
        values[item.field] =
          lccHvdcLinkDetails?.[item.field] || lccHvdcLinkDetails?.additionalFields?.[item.field] || "";
    });
    values["_id"] = lccHvdcLinkDetails._id;
    return values;
  }
  return {};
};

const EditLccHvdcLink = async ({ params }: EditLccHvdcLinkProps) => {
  const { id } = params;

  const { data: defaultParams } = await getDefaultParams();
  const { data: lccHvdcLinkDetails } = await getLCCHVDCLinkById(id);

  const defaultValues = calculateDefaultValues(lccHvdcLinkDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lccHvdcLink"
              className="font-bold text-3xl"
            >
              LCC-HVDC Link
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
          formFields={defaultParams[0].lccHvdcLinkColumns}
          formDetails={defaultValues}
          type="lccHvdcLink"
        />
      </Suspense>
    </div>
  );
};

export default EditLccHvdcLink;
