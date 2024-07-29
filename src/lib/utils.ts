import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyText(str: string) {
  navigator.clipboard.writeText(str);
  toast.success("Copied to clipboard");
}
