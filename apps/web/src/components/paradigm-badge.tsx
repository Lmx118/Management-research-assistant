import { cn } from "@/lib/utils";


const badgeClasses: Record<"OM" | "OR" | "IS", string> = {
  OM: "bg-ink text-cloud",
  OR: "bg-brass/15 text-ink",
  IS: "bg-moss/15 text-ink",
};

export function ParadigmBadge({ paradigm }: { paradigm: "OM" | "OR" | "IS" }) {
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em]", badgeClasses[paradigm])}>
      {paradigm}
    </span>
  );
}

