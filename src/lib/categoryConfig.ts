import type { AciBreakdown } from "@/data/posts";

export const categoryStyles: Record<string, string> = {
  PPS: "bg-accent/10 text-accent",
  DIG: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  GCC: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  WFA: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  AES: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const pillars: {
  key: keyof AciBreakdown;
  label: string;
  fullName: string;
  color: string;
  textColor: string;
}[] = [
  {
    key: "pps",
    label: "PPS",
    fullName: "Problem & Performance Scale",
    color: "bg-accent",
    textColor: "text-accent",
  },
  {
    key: "dig",
    label: "DIG",
    fullName: "Digital Innovation & Growth",
    color: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "gcc",
    label: "GCC",
    fullName: "Global & Cross-Collaboration",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "wfa",
    label: "WFA",
    fullName: "Workflow & Architecture",
    color: "bg-violet-500",
    textColor: "text-violet-600 dark:text-violet-400",
  },
];
