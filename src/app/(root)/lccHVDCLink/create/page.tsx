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

const CreateLCCHVDCLink = async ({ searchParams }: { searchParams: { newIndex: string } }) => {
  const newIndex = Number(searchParams.newIndex) || 0;
  const { data: defaultParams } = await getDefaultParams();

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
            <BreadcrumbPage className="font-bold text-3xl">Create new</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<FormSkeleton />}>
        <CreateForm
          formFields={defaultParams[0].lccHVDCLinkColumns}
          type="lccHVDCLink"
          newIndex={newIndex}
        />
      </Suspense>
    </div>
  );
};

export default CreateLCCHVDCLink;
