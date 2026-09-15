import { forwardRef } from "react";

export interface PenaltyStatsShape {
    totalPenalties: number;
    penalizedBoarders: number;
    outstandingPenalties: number;
    averagePenalty: number;
}

export interface PenaltyTrendPoint {
    month: string;
    amount: number;
}

export interface PenaltyTypeRow {
    name: string;
    value: number;
    pct: string;
}

export interface PenaltyRecordRow {
    date: string;
    boarder: string;
    type: string;
    reason: string;
    amount: number;
    status: string;
}

export interface PenaltyBoarderRow {
    name: string;
    total: number;
    paid: number;
    unpaid: number;
    count: number;
    status: string;
}

export interface PenaltySummaryShape {
    collected: number;
    unpaid: number;
    collectionRate: number;
}

export interface PenaltyDocumentProps {
    penaltyStats?: PenaltyStatsShape | null;
    penaltyTrend?: PenaltyTrendPoint[];
    typeBreakdown?: PenaltyTypeRow[];
    recentRecords?: PenaltyRecordRow[];
    boarderBreakdown?: PenaltyBoarderRow[];
    monthSummary?: PenaltySummaryShape | null;
    periodLabel?: string;
    preparedBy?: string;
    notedBy?: string;
    organization?: string;
    addressLine?: string;
}

const peso = (n: number) =>
    `₱${Number(n ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `PEN-${y}${m}-${seq}`;
}

const STATUS_INK: Record<string, string> = {
    Pending: "#b45309",
    "Partially Paid": "#1d4ed8",
    Paid: "#047857",
    Waived: "#64748b",
    Partial: "#b45309",
    Unpaid: "#be123c",
};

const PenaltyDocument = forwardRef<HTMLDivElement, PenaltyDocumentProps>(
    function PenaltyDocument(
        {
            penaltyStats,
            penaltyTrend = [],
            typeBreakdown = [],
            recentRecords = [],
            boarderBreakdown = [],
            monthSummary,
            periodLabel,
            preparedBy = "________________________",
            notedBy = "________________________",
            organization = "E-Boarding House",
            addressLine = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
        },
        ref
    ) {
        const now = new Date();
        const period = periodLabel ?? monthYear(now);

        const trendMax = Math.max(1, ...penaltyTrend.map((t) => t.amount));

        const totalAssessed = boarderBreakdown.reduce((sum, b) => sum + Number(b.total ?? 0), 0);
        const totalPaid = boarderBreakdown.reduce((sum, b) => sum + Number(b.paid ?? 0), 0);
        const totalUnpaid = boarderBreakdown.reduce((sum, b) => sum + Number(b.unpaid ?? 0), 0);

        const kpis = penaltyStats
            ? [
                { label: "Total penalties", value: peso(penaltyStats.totalPenalties) },
                { label: "Penalized boarders", value: String(penaltyStats.penalizedBoarders) },
                { label: "Outstanding penalties", value: String(penaltyStats.outstandingPenalties) },
                { label: "Average penalty", value: peso(penaltyStats.averagePenalty) },
            ]
            : [];

        return (
            <div ref={ref} className="pen-doc">
                <style>{`
        @page { size: A4 portrait; margin: 14mm; }

        .pen-doc {
          width: 210mm;
          max-width: 100%;
          padding: 14mm;
          margin: 0 auto;
          background: #ffffff;
          color: #0f172a;
          font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 9.5pt;
          line-height: 1.45;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .pen-doc *, .pen-doc *::before, .pen-doc *::after { box-sizing: border-box; }
        .pen-doc p, .pen-doc h1, .pen-doc h2 { margin: 0; }

        .pen-serif { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif; }

        .pen-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .pen-rule { height: 1px; background: #e2e8f0; }
        .pen-rule-dark { height: 2px; background: #0f172a; }

        .pen-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .pen-shell > tbody > tr > td,
        .pen-shell > tfoot > tr > td { padding: 0; }

        .pen-foot-inner {
          display: flex;
          justify-content: space-between;
          gap: 8mm;
          padding-top: 4px;
          margin-top: 10px;
          border-top: 1px solid #e2e8f0;
          font-size: 6.8pt;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .pen-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .pen-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 6px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .pen-table td {
          padding: 6px 6px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 8.5pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .pen-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

        @media print {
          .pen-doc {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .pen-avoid { break-inside: avoid; page-break-inside: avoid; }
          .pen-table thead { display: table-header-group; }
          .pen-table tr { break-inside: avoid; page-break-inside: avoid; }
          .pen-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

                <table className="pen-shell">
                    <tbody>
                        <tr>
                            <td>
                                {/* ---------------- Letterhead ---------------- */}
                                <header className="pen-avoid">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            gap: "10mm",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    flex: "0 0 40px",
                                                    borderRadius: 8,
                                                    background: "#0f172a",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <span
                                                    className="pen-serif"
                                                    style={{
                                                        color: "#fff",
                                                        fontSize: "15pt",
                                                        fontWeight: 700,
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    E
                                                </span>
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    className="pen-serif"
                                                    style={{ fontSize: "13pt", fontWeight: 700, lineHeight: 1.2 }}
                                                >
                                                    {organization}
                                                </p>
                                                <p style={{ fontSize: "8pt", color: "#64748b", marginTop: 2 }}>
                                                    {addressLine}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                textAlign: "right",
                                                flex: "0 0 46mm",
                                                maxWidth: "46mm",
                                            }}
                                        >
                                            <p className="pen-eyebrow">Reference no.</p>
                                            <p
                                                style={{
                                                    fontSize: "9.5pt",
                                                    fontWeight: 700,
                                                    fontVariantNumeric: "tabular-nums",
                                                    marginTop: 1,
                                                }}
                                            >
                                                {referenceNo(now)}
                                            </p>
                                            <p className="pen-eyebrow" style={{ marginTop: 8 }}>
                                                Generated
                                            </p>
                                            <p style={{ fontSize: "8.5pt", color: "#475569", marginTop: 1 }}>
                                                {now.toLocaleString("en-PH", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pen-rule-dark" style={{ marginTop: 12 }} />

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "space-between",
                                            gap: "10mm",
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <p className="pen-eyebrow">Statement of penalties</p>
                                            <h1
                                                className="pen-serif"
                                                style={{
                                                    fontSize: "21pt",
                                                    fontWeight: 700,
                                                    letterSpacing: "-0.015em",
                                                    lineHeight: 1.1,
                                                    marginTop: 3,
                                                }}
                                            >
                                                Penalty Report
                                            </h1>
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "right",
                                                flex: "0 0 auto",
                                                maxWidth: "60mm",
                                            }}
                                        >
                                            <p className="pen-eyebrow">Reporting period</p>
                                            <p style={{ fontSize: "11pt", fontWeight: 600, marginTop: 2 }}>
                                                {period}
                                            </p>
                                            <p style={{ fontSize: "8pt", color: "#94a3b8" }}>
                                                {boarderBreakdown.length} boarders penalized
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pen-rule" />
                                </header>

                                {/* ---------------- 01 Penalty summary ---------------- */}
                                <section className="pen-avoid" style={{ marginTop: 16 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                        <span className="pen-eyebrow">01</span>
                                        <h2 className="pen-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                            Penalty summary
                                        </h2>
                                    </div>

                                    <table
                                        className="pen-avoid"
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                {kpis.map((k, i) => (
                                                    <td
                                                        key={k.label}
                                                        style={{
                                                            width: `${100 / Math.max(1, kpis.length)}%`,
                                                            padding: "8px",
                                                            verticalAlign: "top",
                                                            borderRight: i < kpis.length - 1 ? "1px solid #e2e8f0" : "none",
                                                            background: i === 0 ? "#f8fafc" : "#fff",
                                                        }}
                                                    >
                                                        <p className="pen-eyebrow">{k.label}</p>
                                                        <p
                                                            style={{
                                                                fontSize: "10.5pt",
                                                                fontWeight: 700,
                                                                letterSpacing: "-0.02em",
                                                                fontVariantNumeric: "tabular-nums",
                                                                marginTop: 4,
                                                            }}
                                                        >
                                                            {k.value}
                                                        </p>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>

                                    <p style={{ fontSize: "8pt", color: "#64748b", marginTop: 6 }}>
                                        Assessed {peso(totalAssessed)} · collected {peso(totalPaid)} · outstanding{" "}
                                        {peso(totalUnpaid)}.
                                        {monthSummary
                                            ? ` This month: ${peso(monthSummary.collected)} collected, ${peso(
                                                monthSummary.unpaid
                                            )} unpaid (${monthSummary.collectionRate.toFixed(1)}% collection rate).`
                                            : ""}
                                    </p>
                                </section>

                                {/* ---------------- 02 Penalties by type ---------------- */}
                                {typeBreakdown.length > 0 && (
                                    <section className="pen-avoid" style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="pen-eyebrow">02</span>
                                            <h2 className="pen-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Penalties by type
                                            </h2>
                                        </div>

                                        <table className="pen-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "40%" }}>Type</th>
                                                    <th className="pen-num" style={{ width: "30%" }}>
                                                        Amount
                                                    </th>
                                                    <th className="pen-num" style={{ width: "30%" }}>
                                                        Share
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {typeBreakdown.map((t) => (
                                                    <tr key={t.name}>
                                                        <td style={{ fontWeight: 600 }}>{t.name}</td>
                                                        <td className="pen-num">{peso(t.value)}</td>
                                                        <td className="pen-num" style={{ color: "#64748b" }}>
                                                            {t.pct}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {/* ---------------- 03 Penalty amount trend ---------------- */}
                                {penaltyTrend.length > 0 && (
                                    <section className="pen-avoid" style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="pen-eyebrow">03</span>
                                            <h2 className="pen-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Penalty amount trend
                                            </h2>
                                        </div>

                                        <table className="pen-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "18%" }}>Month</th>
                                                    <th className="pen-num" style={{ width: "30%" }}>
                                                        Amount assessed
                                                    </th>
                                                    <th style={{ width: "52%" }}>Relative</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {penaltyTrend.map((t) => (
                                                    <tr key={t.month}>
                                                        <td style={{ fontWeight: 600 }}>{t.month}</td>
                                                        <td className="pen-num">{peso(t.amount)}</td>
                                                        <td>
                                                            <div
                                                                style={{
                                                                    height: 5,
                                                                    width: "100%",
                                                                    borderRadius: 999,
                                                                    background: "#f1f5f9",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        height: 5,
                                                                        borderRadius: 999,
                                                                        background: "#ea580c",
                                                                        width: `${(t.amount / trendMax) * 100}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {/* ---------------- 04 Penalty breakdown by boarder ---------------- */}
                                <section style={{ marginTop: 18 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                        <span className="pen-eyebrow">04</span>
                                        <h2 className="pen-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                            Penalty breakdown by boarder
                                        </h2>
                                    </div>

                                    <table className="pen-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "28%" }}>Boarder</th>
                                                <th className="pen-num" style={{ width: "17%" }}>
                                                    Total
                                                </th>
                                                <th className="pen-num" style={{ width: "17%" }}>
                                                    Paid
                                                </th>
                                                <th className="pen-num" style={{ width: "17%" }}>
                                                    Unpaid
                                                </th>
                                                <th className="pen-num" style={{ width: "9%" }}>
                                                    Count
                                                </th>
                                                <th style={{ width: "12%" }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boarderBreakdown.map((b, i) => (
                                                <tr key={`${b.name}-${i}`}>
                                                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                                                    <td className="pen-num">{peso(b.total)}</td>
                                                    <td className="pen-num" style={{ color: "#047857" }}>
                                                        {peso(b.paid)}
                                                    </td>
                                                    <td
                                                        className="pen-num"
                                                        style={{
                                                            fontWeight: b.unpaid > 0 ? 700 : 400,
                                                            color: b.unpaid > 0 ? "#be123c" : "#94a3b8",
                                                        }}
                                                    >
                                                        {peso(b.unpaid)}
                                                    </td>
                                                    <td className="pen-num">{b.count}</td>
                                                    <td
                                                        style={{
                                                            fontWeight: 600,
                                                            color: STATUS_INK[b.status] ?? "#334155",
                                                        }}
                                                    >
                                                        {b.status}
                                                    </td>
                                                </tr>
                                            ))}

                                            {boarderBreakdown.length > 0 && (
                                                <tr>
                                                    <td
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        Totals
                                                    </td>
                                                    <td
                                                        className="pen-num"
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        {peso(totalAssessed)}
                                                    </td>
                                                    <td
                                                        className="pen-num"
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#34d399",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        {peso(totalPaid)}
                                                    </td>
                                                    <td
                                                        className="pen-num"
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#fb7185",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        {peso(totalUnpaid)}
                                                    </td>
                                                    <td
                                                        colSpan={2}
                                                        style={{ background: "#0f172a", borderBottom: "none" }}
                                                    />
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </section>

                                {/* ---------------- 05 Recent penalty records ---------------- */}
                                {recentRecords.length > 0 && (
                                    <section style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="pen-eyebrow">05</span>
                                            <h2 className="pen-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Recent penalty records
                                            </h2>
                                        </div>

                                        <table className="pen-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "14%" }}>Date</th>
                                                    <th style={{ width: "22%" }}>Boarder</th>
                                                    <th style={{ width: "16%" }}>Type</th>
                                                    <th style={{ width: "22%" }}>Reason</th>
                                                    <th className="pen-num" style={{ width: "14%" }}>
                                                        Amount
                                                    </th>
                                                    <th className="pen-num" style={{ width: "12%" }}>
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentRecords.map((r, i) => (
                                                    <tr key={`${r.boarder}-${i}`}>
                                                        <td style={{ color: "#64748b", fontSize: "8pt" }}>{r.date}</td>
                                                        <td style={{ fontWeight: 600 }}>{r.boarder}</td>
                                                        <td>{r.type}</td>
                                                        <td style={{ color: "#64748b" }}>{r.reason}</td>
                                                        <td className="pen-num" style={{ fontWeight: 600 }}>
                                                            {peso(r.amount)}
                                                        </td>
                                                        <td
                                                            className="pen-num"
                                                            style={{
                                                                fontWeight: 600,
                                                                color: STATUS_INK[r.status] ?? "#334155",
                                                            }}
                                                        >
                                                            {r.status}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {/* ---------------- Certification ---------------- */}
                                <section className="pen-avoid" style={{ marginTop: 22 }}>
                                    <div className="pen-rule" style={{ marginBottom: 10 }} />
                                    <p style={{ fontSize: "8pt", color: "#64748b", maxWidth: "120mm" }}>
                                        This report was generated from penalty records on file for the period stated
                                        above. Balances reflect settlements posted as of the generation date and may
                                        change once pending payments are recorded.
                                    </p>

                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            tableLayout: "fixed",
                                            marginTop: 18,
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "45%", verticalAlign: "top" }}>
                                                    <div style={{ height: 1, background: "#0f172a" }} />
                                                    <p style={{ fontSize: "9pt", fontWeight: 600, marginTop: 4 }}>
                                                        {preparedBy}
                                                    </p>
                                                    <p className="pen-eyebrow" style={{ marginTop: 1 }}>
                                                        Prepared by
                                                    </p>
                                                </td>
                                                <td style={{ width: "10%" }} />
                                                <td style={{ width: "45%", verticalAlign: "top" }}>
                                                    <div style={{ height: 1, background: "#0f172a" }} />
                                                    <p style={{ fontSize: "9pt", fontWeight: 600, marginTop: 4 }}>
                                                        {notedBy}
                                                    </p>
                                                    <p className="pen-eyebrow" style={{ marginTop: 1 }}>
                                                        Noted by
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                            </td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td>
                                <div className="pen-foot-inner">
                                    <span>{organization} · Penalty Report</span>
                                    <span style={{ whiteSpace: "nowrap" }}>
                                        {period} · {referenceNo(now)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
);

export default PenaltyDocument;
