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
import { deleteExcitationSystem } from "@/lib/actions/excitationSystem.actions";
import { deleteBus } from "@/lib/actions/bus.actions";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { deleteGenerator } from "@/lib/actions/generator.actions";
import { deleteLoad } from "@/lib/actions/load.actions";
import { deleteSeriesCapacitor } from "@/lib/actions/seriesCapacitor.actions";
import { deleteShuntCapacitor } from "@/lib/actions/shuntCapacitor.actions";
import { deleteShuntReactor } from "@/lib/actions/shuntReactor.actions";
import { deleteSingleLineDiagram } from "@/lib/actions/singleLineDiagram.actions";
import { deleteTransformersThreeWinding } from "@/lib/actions/transformersThreeWinding.actions";
import { deleteTransformersTwoWinding } from "@/lib/actions/transformersTwoWinding.actions";
import { deleteTransmissionLine } from "@/lib/actions/transmissionLines.actions";
import { deleteTurbineGovernor } from "@/lib/actions/turbineGovernor.actions";
import { deleteIBR } from "@/lib/actions/ibr.actions";
import { deleteLCCHVDCLink } from "@/lib/actions/lccHvdcLink.actions";
import { deleteSeriesFact } from "@/lib/actions/seriesFact.actions";
import { deleteShuntFact } from "@/lib/actions/shuntFact.actions";
import { deleteVSCHVDCLink } from "@/lib/actions/vscHvdcLink.actions";

type DeleteConfirmationProps = {
  id: string;
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
    | "LCC-HVDC Link"
    | "VSC-HVDC Link"
    | "Series Fact"
    | "Shunt Fact";
  userId: string;
};

const DeleteConfirmation = ({ id, type, userId }: DeleteConfirmationProps) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          title="Delete"
          className="text-gray-500 rounded-full hover:bg-gray-200 p-1.5"
        >
          <MdDelete className="text-gray-500 text-base" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this {type} from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-700"
            onClick={() =>
              startTransition(async () => {
                switch (type) {
                  case "Bus":
                    await deleteBus(id, pathname, userId);
                    break;
                  case "Excitation System":
                    await deleteExcitationSystem(id, pathname, userId);
                    break;

                  case "Generator":
                    await deleteGenerator(id, pathname, userId);
                    break;

                  case "Load":
                    await deleteLoad(id, pathname, userId);
                    break;

                  case "Series Capacitor":
                    await deleteSeriesCapacitor(id, pathname, userId);
                    break;

                  case "Shunt Capacitor":
                    await deleteShuntCapacitor(id, pathname, userId);
                    break;

                  case "Shunt Reactor":
                    await deleteShuntReactor(id, pathname, userId);
                    break;

                  case "Single Line Diagram":
                    await deleteSingleLineDiagram(id, pathname, userId);
                    break;

                  case "Transformers Three Winding":
                    await deleteTransformersThreeWinding(id, pathname, userId);
                    break;

                  case "Transformers Two Winding":
                    await deleteTransformersTwoWinding(id, pathname, userId);
                    break;

                  case "Transmission Line":
                    await deleteTransmissionLine(id, pathname, userId);
                    break;

                  case "Turbine Governor":
                    await deleteTurbineGovernor(id, pathname, userId);
                    break;

                  case "IBR":
                    await deleteIBR(id, pathname, userId);

                  case "LCC-HVDC Link":
                    await deleteLCCHVDCLink(id, pathname, userId);

                  case "Series Fact":
                    await deleteSeriesFact(id, pathname, userId);

                  case "Shunt Fact":
                    await deleteShuntFact(id, pathname, userId);

                  case "VSC-HVDC Link":
                    await deleteVSCHVDCLink(id, pathname, userId);

                  default:
                    break;
                }
                toast.success("Record deleted successfully");
              })
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
