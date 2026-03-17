import { cn } from "@/lib/utils";


const styles = {
  ready: "bg-moss/15 text-ink",
  partial: "bg-brass/15 text-ink",
  empty: "bg-rose/12 text-ink",
};

export function StatusPill({ tone, label }: { tone: keyof typeof styles; label: string }) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-medium", styles[tone])}>{label}</span>;
}

