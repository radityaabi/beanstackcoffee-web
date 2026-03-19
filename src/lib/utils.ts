import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(number: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export const getPreviewUrl = (url: string, size: string) => {
  if (!url) return url;
  const base = url.endsWith("/") ? url : `${url}/`;
  return `${base}-/preview/${size}/`;
};
