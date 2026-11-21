import { CountUp } from "@/components/motion/CountUp";

/** A mono number with a small label under it. The number counts up in view. */
export function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat">
      <CountUp value={value} />
      <span>{label}</span>
    </div>
  );
}
