import Search from "@/components/Search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllRequests } from "@/lib/actions/requests.actions";
import { convertDate } from "@/utils/helperFunctions";

const RequestsPage = async ({ searchParams }: { searchParams: { query: string } }) => {
  const query = searchParams.query || "";
  const { data: changes } = await getAllRequests({ query: query });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold p-3">User Requests</h1>
      <div className="px-3 pr-10">
        <Search placeholder="Search by username..." />
      </div>
      <div className="flex flex-col gap-4 h-[77vh] overflow-auto px-3">
        {changes.length ? (
          changes.map((change, i: number) => (
            <Card
              className="w-[98%]"
              key={i}
            >
              <CardHeader>
                <div className="flex w-full justify-between items-center">
                  <CardTitle className="text-lg">Request by {change?.user?.name}</CardTitle>
                  <CardTitle className="text-md font-semibold text-gray-500">{convertDate(change?.date)}</CardTitle>
                </div>
                <CardDescription className="text-sm">{change?.user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{change?.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="w-full text-center">No results found</p>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
