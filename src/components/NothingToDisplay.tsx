import { TbTableOff } from "react-icons/tb";
import AddColumns from "./AddColumns";

const NothingToDisplay = ({ userId }: { userId: string }) => {
  return (
    <div className="flex w-full h-[80vh] justify-center items-center">
      <div className="flex flex-col items-center">
        <TbTableOff className="text-gray-400 text-[10rem] mb-3" />
        <p className="text-gray-400 text-xl mb-5">Nothing to display here since this table does not have any columns</p>
        <div className="flex items-center">
          <p className="-mr-2 text-gray-400 text-lg">To view the table, start by adding a new column</p>
          <AddColumns
            userId={userId}
            newTable={true}
            columnIndex={1}
            actionType="Add-Column-Left"
          />
        </div>
      </div>
    </div>
  );
};

export default NothingToDisplay;
