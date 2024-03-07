import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllGenerators } from "@/lib/actions/generator.actions";
import { IExcitationSystem } from "@/lib/database/models/excitationSystem";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Generators = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = (await getDefaultParams()) as any;
  const { data: generators } = (await getAllGenerators()) as any;

  const session = await getServerSession(authOptions);

  const filteredGenerators = searchTerm
    ? generators.filter((item: IExcitationSystem) => {
        return JSON.stringify(item).replace("additionalFields", "")?.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : generators;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Generator</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/generator/create">
            <Button>Create generator</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].generatorColumns}
          data={filteredGenerators}
          type="Generator"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default Generators;
