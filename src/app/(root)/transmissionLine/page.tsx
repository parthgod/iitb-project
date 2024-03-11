import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddColumns from "@/components/AddColumns";
import DisplayTable from "@/components/DisplayTable";
import RequestChange from "@/components/RequestChange";
import Search from "@/components/Search";
import TableSkeleton from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { getDefaultParams } from "@/lib/actions/defaultParams.actions";
import { getAllTransmissionLines } from "@/lib/actions/transmissionLines.actions";
import { getServerSession } from "next-auth";
import Link from "next/link";

const TransmissionLines = async ({ searchParams }: { searchParams: { query: string } }) => {
  const searchTerm = searchParams.query || "";
  const { data: defaultParams } = await getDefaultParams();
  const { data: transmissionLines } = await getAllTransmissionLines();

  const session = await getServerSession(authOptions);

  const filteredTransmissionLines = searchTerm
    ? transmissionLines.filter((item) => {
        return JSON.stringify(item)
          .replace("additionalFields", "")
          .replace(new RegExp(defaultParams[0].transmissionLinesColumns.map((item) => item.field).join("|"), "g"), "")
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    : transmissionLines;

  return (
    <main className="flex flex-col gap-3 w-full">
      <h1 className="text-4xl font-bold">Transmission Lines</h1>
      <div className="flex justify-between items-center gap-5 mb-2">
        <Search />
        <div className="flex gap-5">
          <Link href="/transmissionLine/create">
            <Button>Create transmission line</Button>
          </Link>
          {session?.user.isAdmin && <AddColumns userId={session.user.id} />}
          {!session?.user.isAdmin && <RequestChange />}
        </div>
      </div>
      {defaultParams.length ? (
        <DisplayTable
          columns={defaultParams[0].transmissionLinesColumns}
          data={filteredTransmissionLines}
          type="Transmission Line"
        />
      ) : (
        <TableSkeleton />
      )}
    </main>
  );
};

export default TransmissionLines;
