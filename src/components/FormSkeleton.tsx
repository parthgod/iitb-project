import { Skeleton } from "./ui/skeleton";

const FormSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 justify-between h-[90vh] pr-5">
      <div className="grid grid-cols-2 gap-5">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2"
          >
            <Skeleton className="w-40 h-8" />
            <Skeleton className="w-full h-12" />
          </div>
        ))}
      </div>
      <div className="flex gap-5 py-3 w-full">
        <Skeleton className="w-1/3 h-10" />
        <Skeleton className="w-1/3 h-10" />
      </div>
    </div>
  );
};

export default FormSkeleton;
