import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllTurbineGovernors } from "@/lib/actions/turbineGovernor.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const TurbineGovernor = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: turbineGovernorDetails } = await getAllTurbineGovernors();

  const session = await getServerSession(authOptions);

  const filteredTurbineGovernors = searchTerm
    ? turbineGovernorDetails.filter((item) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : turbineGovernorDetails;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Turbine Governor</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/turbineGovernor/create">
            <Button>Create turbine governor</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].turbineGovernorColumns}
          data={filteredTurbineGovernors}
          type="Turbine Governor"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default TurbineGovernor;
