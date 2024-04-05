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
import { getLCCHVDCLinkById } from "@/lib/actions/lccHVDCLink.actions";
import { IDefaultParamSchema, INonDefaultDatabases } from "@/utils/defaultTypes";
import { Suspense } from "react";

interface EditLccHvdcLinkProps {
  params: { id: string };
  searchParams: { newIndex: string };
}

const calculateDefaultValues = (lccHVDCLinkDetails: INonDefaultDatabases, defaultParams: IDefaultParamSchema[]) => {
  if (Object.keys(lccHVDCLinkDetails).length && defaultParams.length) {
    const values: any = {};
    defaultParams?.[0].lccHVDCLinkColumns.forEach((item) => {
      if (!item.isHidden) {
        if (item.isDefault) {
          if (item.type === "switch") values[item.field] = lccHVDCLinkDetails?.[item.field] === "ON" ? true : false;
          else values[item.field] = lccHVDCLinkDetails?.[item.field] || "";
        } else {
          if (item.type === "switch")
            values[item.field] = lccHVDCLinkDetails?.additionalFields?.[item.field] === "ON" ? true : false;
          else values[item.field] = lccHVDCLinkDetails?.additionalFields?.[item.field] || "";
        }
      }
    });
    values["_id"] = lccHVDCLinkDetails._id;
    return values;
  }
  return {};
};

const EditLccHvdcLink = async ({ params, searchParams }: EditLccHvdcLinkProps) => {
  const { id } = params;
  const newIndex = Number(searchParams.newIndex) || 0;

  const { data: defaultParams } = await getDefaultParams();
  const { data: lccHVDCLinkDetails } = await getLCCHVDCLinkById(id);

  const defaultValues = calculateDefaultValues(lccHVDCLinkDetails, defaultParams);

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/lccHVDCLink"
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
          formFields={defaultParams[0].lccHVDCLinkColumns}
          formDetails={defaultValues}
          type="lccHVDCLink"
          newIndex={newIndex}
        />
      </Suspense>
    </div>
  );
};

export default EditLccHvdcLink;
