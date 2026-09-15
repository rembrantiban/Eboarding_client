"use client";

/** Shared building blocks for anything styled like a printed paper receipt. */

export const RECEIPT_MONO =
    "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace";

/** Jagged torn-paper edge, drawn as a repeating triangle-wave polygon. */
export function TornEdge({ position }: { position: "top" | "bottom" }) {
    const top = "0,10 4,0 8,10 12,0 16,10 20,0 24,10 28,0 32,10 36,0 40,10 40,10 0,10";
    const bottom = "0,0 4,10 8,0 12,10 16,0 20,10 24,0 28,10 32,0 36,10 40,0 40,0 0,0";
    return (
        <svg
            className="block w-full"
            style={{ height: 9 }}
            viewBox="0 0 40 10"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polygon points={position === "top" ? top : bottom} className="fill-white" />
        </svg>
    );
}

/** A label ........ value line, like a printed receipt or restaurant check. */
export function DotRow({
    label,
    value,
    icon,
    tone = "default",
}: {
    label: React.ReactNode;
    value: React.ReactNode;
    icon?: React.ReactNode;
    tone?: "default" | "good" | "bad" | "muted";
}) {
    const valueColor =
        tone === "muted" ? "text-slate-400" : "text-slate-900";
    return (
        <div className="flex items-baseline gap-2 py-0.75 text-[13px]">
            <span className="flex shrink-0 items-center gap-1.5 text-slate-500">
                {icon}
                {label}
            </span>
            <span className="relative top-0.75 flex-1 border-b border-dotted border-slate-300" />
            <span className={`shrink-0 font-semibold tabular-nums ${valueColor}`}>{value}</span>
        </div>
    );
}

/** Deterministic barcode generated from a seed string, so it's always the "same" code for that value. */
export function Barcode({ seed }: { seed: string }) {
    const chars = seed.length ? seed.split("") : ["0"];
    const bars = chars.map((ch, i) => {
        const code = ch.charCodeAt(0);
        return {
            w: 1 + (code % 3),
            tall: (code + i) % 5 !== 0,
        };
    });
    return (
        <div className="flex h-9 items-end gap-0.5" aria-hidden="true">
            {bars.map((b, i) => (
                <div
                    key={i}
                    className="bg-slate-900"
                    style={{ width: `${b.w}px`, height: b.tall ? "100%" : "62%" }}
                />
            ))}
        </div>
    );
}
