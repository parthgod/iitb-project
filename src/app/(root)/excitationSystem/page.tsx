import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllExcitationSystems } from "@/lib/actions/excitationSystem.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const ExcitationSystem = async ({
  searchParams,
}: {
  searchParams: { query: string; page?: number; limit?: number };
}) => {
  const searchTerm = searchParams?.query || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 20;
  const { data: defaultParams } = await getDefaultParams();
  const {
    data: excitationSystems,
    totalPages,
    totalDocuments,
    completeData,
  } = await getAllExcitationSystems(limit, page, searchTerm, defaultParams[0]?.excitationSystemColumns);

  const session = await getServerSession(authOptions);

  const filteredExcitationSystems = searchTerm
    ? excitationSystems.filter((item) => {
      return JSON.stringify(item)
        .replace("additionalFields", "")
        .replace(new RegExp(defaultParams[0].excitationSystemColumns.map((item) => item.field).join("|"), "g"), "")
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    : excitationSystems;

  return (
    <main className="flex flex-col w-full">
      <h1 className="text-4xl font-bold p-3">Excitation Systems</h1>
      <div className="flex justify-between items-center gap-5 px-4 py-2 mt-2">
        <Search />
        <div className="flex gap-5">
          <Link href={`/excitationSystem/create`}>
            <Button>
              Create Excitation System <FaPlus className="text-lg ml-2" />
            </Button>
          </Link>
          {!session?.user.isAdmin && <RequestChange userId={session?.user.id!} />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].excitationSystemColumns}
          data={filteredExcitationSystems}
          type="Excitation System"
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          completeData={completeData}
          session={session!}
          page={page}
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default ExcitationSystem;
