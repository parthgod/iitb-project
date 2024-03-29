"use client";

import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/utils/helperFunctions";

type IPaginationComponent = {
  limit: number;
  totalPages: number;
  totalDocuments: number;
};

const PaginationComponent = ({ limit, totalPages, totalDocuments }: IPaginationComponent) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

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
  }, [page, searchParams, router, totalPages]);

  return totalDocuments ? (
    <>
      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                onClick={() => page > 1 && setPage(page - 1)}
                className={`${page <= 1 ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
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
    </>
  ) : (
    ""
  );
};

export default PaginationComponent;
