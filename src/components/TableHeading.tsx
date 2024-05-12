"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteManyBus } from "@/lib/actions/bus.actions";
import { deleteManyExcitationSystem } from "@/lib/actions/excitationSystem.actions";
import { deleteManyGenerator } from "@/lib/actions/generator.actions";
import { deleteManyIBR } from "@/lib/actions/ibr.actions";
import { deleteManyLCCHVDCLink } from "@/lib/actions/lccHVDCLink.actions";
import { deleteManyLoad } from "@/lib/actions/load.actions";
import { deleteManySeriesCapacitor } from "@/lib/actions/seriesCapacitor.actions";
import { deleteManySeriesFact } from "@/lib/actions/seriesFact.actions";
import { deleteManyShuntCapacitor } from "@/lib/actions/shuntCapacitor.actions";
import { deleteManyShuntFact } from "@/lib/actions/shuntFact.actions";
import { deleteManyShuntReactor } from "@/lib/actions/shuntReactor.actions";
import { deleteManySingleLineDiagram } from "@/lib/actions/singleLineDiagram.actions";
import { deleteManyTransformersThreeWinding } from "@/lib/actions/transformersThreeWinding.actions";
import { deleteManyTransformersTwoWinding } from "@/lib/actions/transformersTwoWinding.actions";
import { deleteManyTransmissionLine } from "@/lib/actions/transmissionLines.actions";
import { deleteManyTurbineGovernor } from "@/lib/actions/turbineGovernor.actions";
import { deleteManyVSCHVDCLink } from "@/lib/actions/vscHVDCLink.actions";
import {
  IBus,
  IColumn,
  IExcitationSystem,
  IGenerator,
  ILoad,
  INonDefaultDatabases,
  ISeriesCapacitor,
  IShuntCapacitor,
  IShuntReactor,
  ISingleLineDiagram,
  ITransformersThreeWinding,
  ITransformersTwoWinding,
  ITransmissionLine,
  ITurbineGovernor,
} from "@/utils/defaultTypes";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { FaFileDownload, FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import ImportFromExcel from "./ImportFromExcel";
import PaginationComponent from "./PaginationComponent";
import ToggleColumns from "./ToggleColumns";
import { Button } from "./ui/button";

type TableHeadingProps = {
  totalPages: number;
  totalDocuments: number;
  type:
  | "Excitation System"
  | "Bus"
  | "Generator"
  | "Load"
  | "Series Capacitor"
  | "Shunt Capacitor"
  | "Shunt Reactor"
  | "Single Line Diagram"
  | "Transformers Three Winding"
  | "Transformers Two Winding"
  | "Transmission Line"
  | "Turbine Governor"
  | "IBR"
  | "LCC - HVDC Link"
  | "VSC - HVDC Link"
  | "Series Fact"
  | "Shunt Fact";
  fnExportToExcel: any;
  downloadPDF: any;
  limit?: number;
  columns: IColumn[];
  session: Session;
  page: number;
  recordsToDelete: string[];
  setRecordsToDelete: any;
  completeData:
  | IBus[]
  | IExcitationSystem[]
  | IGenerator[]
  | ILoad[]
  | ISeriesCapacitor[]
  | IShuntCapacitor[]
  | IShuntReactor[]
  | ISingleLineDiagram[]
  | ITransformersThreeWinding[]
  | ITransformersTwoWinding[]
  | ITransmissionLine[]
  | ITurbineGovernor[]
  | INonDefaultDatabases[];
  data:
  | IBus[]
  | IExcitationSystem[]
  | IGenerator[]
  | ILoad[]
  | ISeriesCapacitor[]
  | IShuntCapacitor[]
  | IShuntReactor[]
  | ISingleLineDiagram[]
  | ITransformersThreeWinding[]
  | ITransformersTwoWinding[]
  | ITransmissionLine[]
  | ITurbineGovernor[];
};

const TableHeading = ({
  totalPages,
  totalDocuments,
  type,
  downloadPDF,
  fnExportToExcel,
  limit = 20,
  columns,
  session,
  page,
  recordsToDelete,
  setRecordsToDelete,
  completeData,
  data,
}: TableHeadingProps) => {
  const totalEntries = (Number(page) - 1) * limit + limit;

  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  return (
    <div className="p-3 py-1.5 flex items-center justify-between border-b-[1px] border-b-gray-300">
      {totalDocuments ? (
        <p className="font-semibold whitespace-nowrap flex">
          {session.user.isAdmin && <input
            type="checkbox"
            className="scale-125 cursor-pointer mr-2"
            checked={recordsToDelete.length >= limit || recordsToDelete.length === data.length}
            onChange={(e) => {
              if (e.target.checked)
                data.map(
                  (item) =>
                    !recordsToDelete.includes(item._id) &&
                    setRecordsToDelete((prevSelectedIds: string[]) => [...prevSelectedIds, item._id])
                );
              else setRecordsToDelete([]);
            }}
          />}
          {recordsToDelete.length ? (
            <span className="flex items-center">
              {recordsToDelete.length} record{recordsToDelete.length > 1 ? <>s</> : ""} selected{" "}
              {recordsToDelete.length !== totalDocuments ? (
                <span className="ml-1">
                  {" "}
                  on this page.{" "}
                  <span
                    className="cursor-pointer text-blue-600 font-bold hover:underline"
                    onClick={() =>
                      completeData.map(
                        (item) =>
                          !recordsToDelete.includes(item._id) &&
                          setRecordsToDelete((prevSelectedIds: string[]) => [...prevSelectedIds, item._id])
                      )
                    }
                  >
                    Select all {totalDocuments} records?
                  </span>
                </span>
              ) : (
                ""
              )}
              <AlertDialog>
                <AlertDialogTrigger>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <div className="flex justify-center items-center ml-1 cursor-pointer p-2 hover:bg-gray-200 rounded-full">
                          <MdDelete className="text-lg" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {recordsToDelete.length} records from{" "}
                      {type}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-700"
                      onClick={() =>
                        startTransition(async () => {
                          let res;
                          switch (type) {
                            case "Bus":
                              res = await deleteManyBus(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Excitation System":
                              res = await deleteManyExcitationSystem(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Generator":
                              res = await deleteManyGenerator(recordsToDelete, session.user.id, pathname);
                              break;

                            case "IBR":
                              res = await deleteManyIBR(recordsToDelete, session.user.id, pathname);
                              break;

                            case "LCC - HVDC Link":
                              res = await deleteManyLCCHVDCLink(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Load":
                              res = await deleteManyLoad(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Series Capacitor":
                              res = await deleteManySeriesCapacitor(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Series Fact":
                              res = await deleteManySeriesFact(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Shunt Capacitor":
                              res = await deleteManyShuntCapacitor(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Shunt Fact":
                              res = await deleteManyShuntFact(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Shunt Reactor":
                              res = await deleteManyShuntReactor(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Single Line Diagram":
                              res = await deleteManySingleLineDiagram(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Transformers Three Winding":
                              res = await deleteManyTransformersThreeWinding(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Transformers Two Winding":
                              res = await deleteManyTransformersTwoWinding(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Transmission Line":
                              res = await deleteManyTransmissionLine(recordsToDelete, session.user.id, pathname);
                              break;

                            case "Turbine Governor":
                              res = await deleteManyTurbineGovernor(recordsToDelete, session.user.id, pathname);
                              break;

                            case "VSC - HVDC Link":
                              res = await deleteManyVSCHVDCLink(recordsToDelete, session.user.id, pathname);
                              break;

                            default:
                              break
                          }

                          toast.success(res?.data);
                          setRecordsToDelete([]);
                        })
                      }
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </span>
          ) : (
            <span>
              Showing {(Number(page) - 1) * limit + 1} - {totalEntries > totalDocuments ? totalDocuments : totalEntries}{" "}
              of {totalDocuments} records
            </span>
          )}
        </p>
      ) : (
        <p className="font-semibold whitespace-nowrap">No records to display</p>
      )}
      <div className="flex items-center gap-3">
        <PaginationComponent
          limit={limit}
          totalDocuments={totalDocuments}
          totalPages={totalPages}
          setRecordsToDelete={setRecordsToDelete}
          recordsToDelete={recordsToDelete}
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
