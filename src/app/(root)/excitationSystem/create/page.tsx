import FormSkeleton from "@/components/FormSkeleton";
import CreateForm from "@/components/CreateForm";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CreateExcitationSystem = async () => {
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/excitationSystem"
              className="font-bold text-3xl"
            >
              Excitation System
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
          formFields={defaultParams[0].excitationSystemColumns}
          type="excitationSystem"
        />
      </Suspense>
    </div>
  );
};

export default CreateExcitationSystem;
