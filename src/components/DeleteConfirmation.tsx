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
    | "Turbine Governor";
};

const DeleteConfirmation = ({ id, type }: DeleteConfirmationProps) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          title="Delete"
          className="text-gray-500 rounded-full hover:bg-gray-200 p-2"
        >
          <MdDelete className="text-gray-500 text-xl" />
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
                    await deleteBus(id, pathname);
                    break;
                  case "Excitation System":
                    await deleteExcitationSystem(id, pathname);
                    break;

                  case "Generator":
                    await deleteGenerator(id, pathname);
                    break;

                  case "Load":
                    await deleteLoad(id, pathname);
                    break;

                  case "Series Capacitor":
                    await deleteSeriesCapacitor(id, pathname);
                    break;

                  case "Shunt Capacitor":
                    await deleteShuntCapacitor(id, pathname);
                    break;

                  case "Shunt Reactor":
                    await deleteShuntReactor(id, pathname);
                    break;

                  case "Single Line Diagram":
                    await deleteSingleLineDiagram(id, pathname);
                    break;

                  case "Transformers Three Winding":
                    await deleteTransformersThreeWinding(id, pathname);
                    break;

                  case "Transformers Two Winding":
                    await deleteTransformersTwoWinding(id, pathname);
                    break;

                  case "Transmission Line":
                    await deleteTransmissionLine(id, pathname);
                    break;

                  case "Turbine Governor":
                    await deleteTurbineGovernor(id, pathname);
                    break;

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
