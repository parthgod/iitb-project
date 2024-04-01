"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IColumn } from "@/utils/defaultTypes";
import { Session } from "next-auth";
import { FaFileDownload, FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import ImportFromExcel from "./ImportFromExcel";
import PaginationComponent from "./PaginationComponent";
import ToggleColumns from "./ToggleColumns";
import { Button } from "./ui/button";

type TableHeadingProps = {
  totalPages: number;
  totalDocuments: number;
  type: string;
  fnExportToExcel: any;
  downloadPDF: any;
  limit?: number;
  columns: IColumn[];
  session: Session;
  page: number;
};

const TableHeading = ({
  totalPages,
  totalDocuments,
  type,
  downloadPDF,
  fnExportToExcel,
  limit = 10,
  columns,
  session,
  page,
}: TableHeadingProps) => {
  const totalEntries = (Number(page) - 1) * limit + limit;

  return (
    <div className="p-3 py-1.5 flex items-center justify-between border-b-[1px] border-b-gray-300">
      {totalDocuments ? (
        <p className="font-semibold whitespace-nowrap">
          Showing {(Number(page) - 1) * limit + 1} - {totalEntries > totalDocuments ? totalDocuments : totalEntries} of{" "}
          {totalDocuments} records
        </p>
      ) : (
        <p className="font-semibold whitespace-nowrap">No records to display</p>
      )}
      <div className="flex items-center gap-3">
        <PaginationComponent
          limit={limit}
          totalDocuments={totalDocuments}
          totalPages={totalPages}
        />
        <Popover>
          <PopoverTrigger>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <div className="p-3 py-2 flex items-center gap-1 bg-gray-200 rounded-lg hover:bg-gray-300">
                    <FaFileDownload />
                    <p>Download</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Download table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <ImportFromExcel
          columns={columns}
          userId={session.user.id}
        />
        {session.user.isAdmin && (
          <ToggleColumns
            columns={columns}
            userId={session.user.id}
          />
        )}
      </div>
    </div>
  );
};

export default TableHeading;
