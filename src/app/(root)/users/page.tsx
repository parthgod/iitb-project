import UsersFilter from "@/components/UsersFilter";
import UsersTable from "@/components/UsersTable";
import { getAllUsers } from "@/lib/actions/users.actions";

const UsersPage = async ({ searchParams }: { searchParams: { query: string; status?: string } }) => {
  const query = searchParams.query || "";
  const status = searchParams.status || "";
  const { data: users } = await getAllUsers({ query, status });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold p-3">Users registered</h1>
      <UsersFilter />
      <div className="flex flex-col gap-4 h-[77vh] overflow-auto custom-scrollbar px-3 pr-4">
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UsersPage;
