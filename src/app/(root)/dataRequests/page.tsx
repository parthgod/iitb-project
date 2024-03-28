import { authOptions } from "@/lib/authOptions";
import PrintRequests from "@/components/PrintRequests";
import RequestsHeader from "@/components/RequestsHeader";
import { getAllDataRequests } from "@/lib/actions/dataRequest.actions";
import { getServerSession } from "next-auth";

const RequestsPage = async ({ searchParams }: { searchParams: { query: string; status: string } }) => {
  const session = await getServerSession(authOptions);
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const { data: requests } = await getAllDataRequests({
    query: session?.user.isAdmin ? query : session?.user.name!,
    status: status,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold p-3">
        {session?.user.isAdmin ? "Users'" : "Your"} Requests for changes in data
      </h1>
      <div className="px-3 pr-6">{session?.user.isAdmin && <RequestsHeader />}</div>
      {requests.length ? (
        <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3">
          <PrintRequests
            requests={requests}
            isAdmin={session?.user.isAdmin!}
          />
        </div>
      ) : (
        <p className="w-full text-center">No results found</p>
      )}
    </div>
  );
};

export default RequestsPage;
