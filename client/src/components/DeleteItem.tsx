import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
export default function DeleteItem() {
  return (
    <Dialog>
      <DialogTrigger asChild className="flex gap-2">
        <Button variant="ghost" className="w-full">
          <Trash2 /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this</DialogTitle>
          <DialogDescription>
            This Action is ireversible continue with caution
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
