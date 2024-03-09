import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllExcitationSystems } from "@/lib/actions/excitationSystem.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const ExcitationSystem = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: excitationSystems } = await getAllExcitationSystems();

  const session = await getServerSession(authOptions);

  const filteredExcitationSystems = searchTerm
    ? excitationSystems.filter((item) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : excitationSystems;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Excitation Systems</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/excitationSystem/create">
            <Button>Create Excitation System</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].excitationSystemColumns}
          data={filteredExcitationSystems}
          type="Excitation System"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default ExcitationSystem;
