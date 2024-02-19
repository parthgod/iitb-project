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
import { deleteProduct } from "@/lib/actions/product.actions";
import { deleteVendor } from "@/lib/actions/vendor.actions";
import { deleteWarehouse } from "@/lib/actions/warehouse.actions";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const DeleteConfirmation = ({ id, type }: { id: string; type: "Vendor" | "Warehouse" | "Product" }) => {
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
            onClick={() =>
              startTransition(async () => {
                switch (type) {
                  case "Vendor":
                    await deleteVendor(id, pathname);
                    break;
                  case "Product":
                    await deleteProduct(id, pathname);
                    break;
                  case "Warehouse":
                    await deleteWarehouse(id, pathname);
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
