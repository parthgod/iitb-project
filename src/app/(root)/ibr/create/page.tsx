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

const CreateIBR = async () => {
  const { data: defaultParams } = await getDefaultParams();

  return (
    <div className="flex flex-col gap-2 h-screen overflow-hidden">
      <Breadcrumb className="p-3 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/ibr"
              className="font-bold text-3xl"
            >
              IBR
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
          formFields={defaultParams[0].ibrColumns}
          type="ibr"
        />
      </Suspense>
    </div>
  );
};

export default CreateIBR;
