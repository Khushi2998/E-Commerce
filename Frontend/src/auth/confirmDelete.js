import { toast } from "sonner";

export const confirmDelete = async (message = "Are you sure you want to delete?") => {
  return new Promise((resolve) => {
    toast(message, {
      action: {
        label: "Delete",
        onClick: () => resolve(true),
      },
      cancel: {
        label: "Cancel",
        onClick: () => resolve(false),
      },
      duration: 6000,
    });
  });
};
