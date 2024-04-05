import PaginationComponent from "@/components/PaginationComponent";
import UsersFilter from "@/components/UsersFilter";
import UsersTable from "@/components/UsersTable";
import { getAllUsers } from "@/lib/actions/users.actions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: { query: string; status?: string; page?: number; limit?: number };
}) => {
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const page = searchParams?.page || 1;
  const limit = searchParams?.limit || 10;
  const totalEntries = (Number(page) - 1) * limit + limit;
  const session = await getServerSession(authOptions);
  const {
    data: users,
    totalPages,
    totalDocuments,
  } = await getAllUsers({ query, status, limit, page, userId: session?.user.id! });

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-4xl font-bold p-3">Users registered</h1>
      <UsersFilter />
      <div className="flex px-3 justify-between items-center mt-3">
        {totalDocuments ? (
          <p className="font-semibold whitespace-nowrap">
            Showing {(Number(page) - 1) * limit + 1} - {totalEntries > totalDocuments ? totalDocuments : totalEntries}{" "}
            of {totalDocuments} records
          </p>
        ) : (
          <p className="font-semibold whitespace-nowrap">No records to display</p>
        )}
        <PaginationComponent
          limit={limit}
          totalDocuments={totalDocuments}
          totalPages={totalPages}
        />
      </div>
      {users.length ? (
        <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3 pr-4">
          <UsersTable users={users} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UsersPage;
