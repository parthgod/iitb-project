import PrintLoginRequests from "@/components/PrintLoginRequests";
import RequestsHeader from "@/components/RequestsHeader";
import { getAllLoginRequests } from "@/lib/actions/loginRequest.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const LoginRequestsPage = async ({ searchParams }: { searchParams: { query: string; status: string } }) => {
  const session = await getServerSession(authOptions);
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const { data: requests } = await getAllLoginRequests(query, status);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold p-3">Login Requests</h1>
      <div className="px-3 pr-6">
        <RequestsHeader />
      </div>
      {requests.length ? (
        <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3">
          <PrintLoginRequests data={requests} />
        </div>
      ) : (
        <p className="w-full text-center">No results found</p>
      )}
    </div>
  );
};

export default LoginRequestsPage;
