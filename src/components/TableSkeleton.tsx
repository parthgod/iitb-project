import { Skeleton } from "./ui/skeleton";

const TableSkeleton = () => {
  return (
    <div>
      <div className="w-[98%] rounded-2xl overflow-hidden shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] p-3">
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Skeleton className="w-full h-12 mr-2" />
          <Skeleton className="w-full h-12 mr-2" />
          <Skeleton className="w-full h-12 mr-2" />
          <Skeleton className="w-full h-12 mr-2" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[...Array(20)].map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full h-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
