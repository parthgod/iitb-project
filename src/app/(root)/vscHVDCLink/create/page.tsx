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
import { Suspense } from "react";

const CreateVSCHVDCLink = async ({ searchParams }: { searchParams: { newIndex: string } }) => {
  const newIndex = Number(searchParams.newIndex) || 0;
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3">
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
            <BreadcrumbPage className="font-bold text-3xl">Create new</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].vscHVDCLinkColumns}
          type="vscHVDCLink"
          newIndex={newIndex}
        />
      </Suspense>
    </div>
  );
};

export default CreateVSCHVDCLink;
