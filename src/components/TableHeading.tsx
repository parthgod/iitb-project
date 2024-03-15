"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaFileImport, FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { Button } from "./ui/button";

type TableHeadingProps = {
  totalPages: number;
  totalDocuments: number;
  type: string;
  fnExportToExcel: any;
  downloadPDF: any;
  limit?: number;
};

const TableHeading = ({
  totalPages,
  totalDocuments,
  type,
  downloadPDF,
  fnExportToExcel,
  limit = 10,
}: TableHeadingProps) => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const router = useRouter();
  const totalEntries = (Number(page) - 1) * limit + limit;

  useEffect(() => {
    let newUrl = "";
    if (page > 1) {
      if (page > totalPages) {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["page"],
        });
        setPage(1);
      } else
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "page",
          value: page,
        });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["page"],
      });
    }
    router.push(newUrl, { scroll: false });
  }, [page, searchParams, router]);

  return (
    <div className="p-3 py-1.5 flex items-center justify-between border-b-[1px] border-b-gray-300">
      {totalDocuments ? (
        <>
          <p className="font-semibold whitespace-nowrap">
            Showing {(Number(page) - 1) * limit + 1} - {totalEntries > totalDocuments ? totalDocuments : totalEntries}{" "}
            of {totalDocuments} records
          </p>

          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={page <= 1}
                      tabIndex={page <= 1 ? -1 : undefined}
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={`${
                        page <= 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, ind) => {
                    if (
                      ind + 1 <= 3 ||
                      ind + 1 >= totalPages - 2 ||
                      (page >= 3 && page <= totalPages - 2 && Math.abs(page - (ind + 1)) <= 1)
                    ) {
                      return (
                        <PaginationItem
                          key={ind}
                          className={`cursor-pointer ${page === ind + 1 ? "active" : ""}`}
                          onClick={() => setPage(ind + 1)}
                        >
                          <PaginationLink
                            isActive={page === ind + 1}
                            className="p-0"
                          >
                            {ind + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (ind + 1 === 4 && page > 4) {
                      return <PaginationEllipsis key="ellipsis1" />;
                    } else if (ind + 1 === totalPages - 3 && page < totalPages - 3) {
                      return <PaginationEllipsis key="ellipsis2" />;
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={page >= totalPages}
                      tabIndex={page >= totalPages ? -1 : undefined}
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={`${
                        page >= totalPages ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            <Popover>
              <PopoverTrigger>
                <div
                  title="Download table"
                  className="p-3 bg-gray-200 ml-5 rounded-lg hover:bg-gray-300"
                >
                  <FaFileImport />
                </div>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="flex flex-col gap-2 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
              >
                <Button
                  onClick={() => fnExportToExcel(type)}
                  variant="outline"
                  className="border-[1px] border-[#008744]"
                >
                  <FaRegFileExcel className="text-[#008744] mr-2" />
                  Export as excel (.xlsx)
                </Button>
                <Button
                  onClick={() => downloadPDF(type)}
                  variant="outline"
                  className="border-[1px] border-[#d62d20]"
                >
                  <FaRegFilePdf className="text-[#d62d20] mr-2" />
                  Export as PDF (.pdf)
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : (
        <p className="font-semibold whitespace-nowrap">No records to display</p>
      )}
    </div>
  );
};

export default TableHeading;
