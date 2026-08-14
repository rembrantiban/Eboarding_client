import { forwardRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types — kept loose so they accept the hook's shapes directly        */
/* ------------------------------------------------------------------ */

export interface BillingStatsShape {
    totalIncome: number;
    totalIncomeChange: number;
    lateFeesCollected: number;
    lateFeesChange: number;
    amountCollectedThisMonth: number;
    amountCollectedChange: number;
    collectionRate: number;
    collectionRateChange: number;
}

export interface IncomeMixSlice {
    name: string;
    value: number;
    color: string;
}

export interface TrendPoint {
    month: string;
    income: number;
    lateFees: number;
}

export interface SummaryRow {
    category: string;
    thisMonth: number;
    lastMonth: number;
    change: number | string;
    positive: boolean;
}

export interface DetailedSummaryShape {
    rows?: SummaryRow[];
    totalIncomeThisMonth: number;
    totalIncomeLastMonth: number;
    totalIncomeChange: number;
}

export interface FinancialReportDocumentProps {
    billingStats?: BillingStatsShape | null;
    incomeMix?: IncomeMixSlice[];
    revenueTrend?: TrendPoint[];
    detailedSummary?: DetailedSummaryShape | null;
    periodLabel?: string;
    preparedBy?: string;
    notedBy?: string;
    organization?: string;
    addressLine?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const peso = (n: number) =>
    `₱${Number(n ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const pct = (n: number) => `${Number(n ?? 0) >= 0 ? "+" : ""}${Number(n ?? 0)}%`;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `FIN-${y}${m}-${seq}`;
}

/* ------------------------------------------------------------------ */
/*  Document                                                           */
/* ------------------------------------------------------------------ */

const FinancialReportDocument = forwardRef<
    HTMLDivElement,
    FinancialReportDocumentProps
>(function FinancialReportDocument(
    {
        billingStats,
        incomeMix = [],
        revenueTrend = [],
        detailedSummary,
        periodLabel,
        preparedBy = "________________________",
        notedBy = "________________________",
        organization = "E-Boarding House Management",
        addressLine = "Guihulngan City, Negros Oriental, Philippines",
    },
    ref
) {
    const now = new Date();
    const lastMonth = new Date(new Date().setMonth(now.getMonth() - 1));
    const period = periodLabel ?? monthYear(now);

    const incomeTotal = incomeMix.reduce((s, d) => s + d.value, 0) || 1;
    const trendMax =
        Math.max(1, ...revenueTrend.map((t) => Math.max(t.income, t.lateFees))) || 1;

    const rows = detailedSummary?.rows ?? [];

    const kpis = billingStats
        ? [
            {
                label: "Total income",
                value: peso(billingStats.totalIncome),
                delta: pct(billingStats.totalIncomeChange),
                up: billingStats.totalIncomeChange >= 0,
            },
            {
                label: "Late fees collected",
                value: peso(billingStats.lateFeesCollected),
                delta: pct(billingStats.lateFeesChange),
                up: billingStats.lateFeesChange >= 0,
            },
            {
                label: "Amount collected",
                value: peso(billingStats.amountCollectedThisMonth),
                delta: pct(billingStats.amountCollectedChange),
                up: billingStats.amountCollectedChange >= 0,
            },
            {
                label: "Collection rate",
                value: `${billingStats.collectionRate}%`,
                delta: pct(billingStats.collectionRateChange),
                up: billingStats.collectionRateChange >= 0,
            },
        ]
        : [];

    return (
        <div ref={ref} className="fin-doc">
            <style>{`
        /* ---- Page geometry --------------------------------------
           Printable width = 210mm - (14mm x 2) = 182mm.
           The document must never be wider than that.            */

        @page {
          size: A4 portrait;
          margin: 14mm;
        }

        .fin-doc {
          /* On screen: simulate the whole sheet including its margins */
          width: 200mm;
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

        .fin-doc *,
        .fin-doc *::before,
        .fin-doc *::after { box-sizing: border-box; }

        .fin-doc p,
        .fin-doc h1,
        .fin-doc h2 { margin: 0; }

        .fin-serif {
          font-family: "Iowan Old Style", Georgia, "Times New Roman", serif;
        }

        .fin-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .fin-rule { height: 1px; background: #e2e8f0; }
        .fin-rule-dark { height: 2px; background: #0f172a; }

        /* ---- Page shell ----------------------------------------
           tfoot repeats on every printed page and content flows
           ABOVE it, instead of underneath a fixed footer.        */
        .fin-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .fin-shell > tbody > tr > td,
        .fin-shell > tfoot > tr > td { padding: 0; }

        .fin-foot-inner {
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

        /* ---- Data tables ---------------------------------------- */
        .fin-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;   /* stops long labels pushing columns out */
        }
        .fin-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 8px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .fin-table td {
          padding: 7px 8px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 9pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .fin-num { text-align: right; font-variant-numeric: tabular-nums; }

        /* ---- Print overrides ------------------------------------ */
        @media print {
          .fin-doc {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .fin-avoid { break-inside: avoid; page-break-inside: avoid; }
          .fin-table thead { display: table-header-group; }
          .fin-table tr { break-inside: avoid; page-break-inside: avoid; }
          .fin-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

            <table className="fin-shell">
                <tbody>
                    <tr>
                        <td>
                            {/* ---------------- Letterhead ---------------- */}
                            <header className="fin-avoid">
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
                                                className="fin-serif"
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
                                                className="fin-serif"
                                                style={{
                                                    fontSize: "13pt",
                                                    fontWeight: 700,
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {organization}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "8pt",
                                                    color: "#64748b",
                                                    marginTop: 2,
                                                }}
                                            >
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
                                        <p className="fin-eyebrow">Reference no.</p>
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
                                        <p className="fin-eyebrow" style={{ marginTop: 8 }}>
                                            Generated
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "8.5pt",
                                                color: "#475569",
                                                marginTop: 1,
                                            }}
                                        >
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

                                <div className="fin-rule-dark" style={{ marginTop: 12 }} />

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
                                        <p className="fin-eyebrow">Statement of operations</p>
                                        <h1
                                            className="fin-serif"
                                            style={{
                                                fontSize: "22pt",
                                                fontWeight: 700,
                                                letterSpacing: "-0.015em",
                                                lineHeight: 1.1,
                                                marginTop: 3,
                                            }}
                                        >
                                            Financial Report
                                        </h1>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            flex: "0 0 auto",
                                            maxWidth: "70mm",
                                        }}
                                    >
                                        <p className="fin-eyebrow">Reporting period</p>
                                        <p
                                            style={{
                                                fontSize: "11pt",
                                                fontWeight: 600,
                                                marginTop: 2,
                                            }}
                                        >
                                            {period}
                                        </p>
                                        <p style={{ fontSize: "8pt", color: "#94a3b8" }}>
                                            Compared with {monthYear(lastMonth)}
                                        </p>
                                    </div>
                                </div>

                                <div className="fin-rule" />
                            </header>

                            {/* ---------------- 01 Performance summary ---------------- */}
                            <section className="fin-avoid" style={{ marginTop: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="fin-eyebrow">01</span>
                                    <h2
                                        className="fin-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Performance summary
                                    </h2>
                                </div>

                                <table
                                    className="fin-avoid"
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
                                                        width: "25%",
                                                        padding: "10px",
                                                        verticalAlign: "top",
                                                        borderRight:
                                                            i < kpis.length - 1
                                                                ? "1px solid #e2e8f0"
                                                                : "none",
                                                        background: i === 0 ? "#f8fafc" : "#fff",
                                                    }}
                                                >
                                                    <p className="fin-eyebrow">{k.label}</p>
                                                    <p
                                                        style={{
                                                            fontSize: "12pt",
                                                            fontWeight: 700,
                                                            letterSpacing: "-0.02em",
                                                            fontVariantNumeric: "tabular-nums",
                                                            marginTop: 4,
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {k.value}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: "7.5pt",
                                                            fontWeight: 600,
                                                            marginTop: 2,
                                                            color: k.up ? "#047857" : "#be123c",
                                                            fontVariantNumeric: "tabular-nums",
                                                        }}
                                                    >
                                                        {k.delta}{" "}
                                                        <span
                                                            style={{ color: "#94a3b8", fontWeight: 400 }}
                                                        >
                                                            vs last month
                                                        </span>
                                                    </p>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- 02 Income composition ---------------- */}
                            <section className="fin-avoid" style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="fin-eyebrow">02</span>
                                    <h2
                                        className="fin-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Income composition
                                    </h2>
                                </div>

                                {/* Stacked share bar — the chart, redrawn for paper */}
                                <div
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        height: 10,
                                        borderRadius: 999,
                                        overflow: "hidden",
                                        marginBottom: 10,
                                        background: "#f1f5f9",
                                    }}
                                >
                                    {incomeMix.map((s) => (
                                        <div
                                            key={s.name}
                                            style={{
                                                width: `${(s.value / incomeTotal) * 100}%`,
                                                background: s.color,
                                            }}
                                        />
                                    ))}
                                </div>

                                <table className="fin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "46%" }}>Source</th>
                                            <th className="fin-num" style={{ width: "34%" }}>
                                                Amount
                                            </th>
                                            <th className="fin-num" style={{ width: "20%" }}>
                                                Share
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeMix.map((s) => (
                                            <tr key={s.name}>
                                                <td>
                                                    <span
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: 8,
                                                                height: 8,
                                                                flex: "0 0 8px",
                                                                borderRadius: 2,
                                                                background: s.color,
                                                                display: "inline-block",
                                                            }}
                                                        />
                                                        {s.name}
                                                    </span>
                                                </td>
                                                <td className="fin-num" style={{ fontWeight: 600 }}>
                                                    {peso(s.value)}
                                                </td>
                                                <td className="fin-num" style={{ color: "#64748b" }}>
                                                    {((s.value / incomeTotal) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ fontWeight: 700, borderBottom: "none" }}>
                                                Total income
                                            </td>
                                            <td
                                                className="fin-num"
                                                style={{ fontWeight: 700, borderBottom: "none" }}
                                            >
                                                {peso(incomeTotal)}
                                            </td>
                                            <td
                                                className="fin-num"
                                                style={{ fontWeight: 700, borderBottom: "none" }}
                                            >
                                                100.0%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- 03 Six-month trend ---------------- */}
                            <section className="fin-avoid" style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="fin-eyebrow">03</span>
                                    <h2
                                        className="fin-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Income and late fee trend
                                    </h2>
                                </div>

                                <table className="fin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "10%" }}>Month</th>
                                            <th className="fin-num" style={{ width: "22%" }}>
                                                Income
                                            </th>
                                            <th style={{ width: "23%" }}>Relative</th>
                                            <th className="fin-num" style={{ width: "22%" }}>
                                                Late fees
                                            </th>
                                            <th style={{ width: "23%" }}>Relative</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenueTrend.map((t) => (
                                            <tr key={t.month}>
                                                <td style={{ fontWeight: 600 }}>{t.month}</td>
                                                <td
                                                    className="fin-num"
                                                    style={{ whiteSpace: "nowrap" }}
                                                >
                                                    {peso(t.income)}
                                                </td>
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
                                                                background: "#0f172a",
                                                                width: `${(t.income / trendMax) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{ color: "#be123c", whiteSpace: "nowrap" }}
                                                >
                                                    {peso(t.lateFees)}
                                                </td>
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
                                                                background: "#f43f5e",
                                                                width: `${(t.lateFees / trendMax) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <p
                                    style={{
                                        fontSize: "7.5pt",
                                        color: "#94a3b8",
                                        marginTop: 6,
                                    }}
                                >
                                    Bars are scaled against the highest value in the period.
                                </p>
                            </section>

                            {/* ---------------- 04 Detailed comparison ---------------- */}
                            <section style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="fin-eyebrow">04</span>
                                    <h2
                                        className="fin-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Detailed comparison
                                    </h2>
                                </div>

                                <table className="fin-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "34%" }}>Category</th>
                                            <th className="fin-num" style={{ width: "24%" }}>
                                                {monthYear(now)}
                                            </th>
                                            <th className="fin-num" style={{ width: "24%" }}>
                                                {monthYear(lastMonth)}
                                            </th>
                                            <th className="fin-num" style={{ width: "18%" }}>
                                                Change
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={row.category}>
                                                <td style={{ fontWeight: 500 }}>{row.category}</td>
                                                <td
                                                    className="fin-num"
                                                    style={{ fontWeight: 600, whiteSpace: "nowrap" }}
                                                >
                                                    {peso(row.thisMonth)}
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{ color: "#64748b", whiteSpace: "nowrap" }}
                                                >
                                                    {peso(row.lastMonth)}
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{
                                                        fontWeight: 600,
                                                        whiteSpace: "nowrap",
                                                        color: row.positive ? "#047857" : "#be123c",
                                                    }}
                                                >
                                                    {typeof row.change === "number"
                                                        ? pct(row.change)
                                                        : row.change}
                                                </td>
                                            </tr>
                                        ))}

                                        {detailedSummary && (
                                            <tr>
                                                <td
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    Total income
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {peso(detailedSummary.totalIncomeThisMonth)}
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#cbd5e1",
                                                        borderBottom: "none",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {peso(detailedSummary.totalIncomeLastMonth)}
                                                </td>
                                                <td
                                                    className="fin-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                        whiteSpace: "nowrap",
                                                        color:
                                                            detailedSummary.totalIncomeChange >= 0
                                                                ? "#34d399"
                                                                : "#fb7185",
                                                    }}
                                                >
                                                    {pct(detailedSummary.totalIncomeChange)}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- Certification ---------------- */}
                            <section className="fin-avoid" style={{ marginTop: 22 }}>
                                <div className="fin-rule" style={{ marginBottom: 10 }} />
                                <p
                                    style={{
                                        fontSize: "8pt",
                                        color: "#64748b",
                                        maxWidth: "120mm",
                                    }}
                                >
                                    This report was generated from billing records on file for the
                                    period stated above. Figures reflect payments recorded as of
                                    the generation date and may change once pending collections
                                    are posted.
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
                                                <p
                                                    style={{
                                                        fontSize: "9pt",
                                                        fontWeight: 600,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    {preparedBy}
                                                </p>
                                                <p className="fin-eyebrow" style={{ marginTop: 1 }}>
                                                    Prepared by
                                                </p>
                                            </td>
                                            <td style={{ width: "10%" }} />
                                            <td style={{ width: "45%", verticalAlign: "top" }}>
                                                <div style={{ height: 1, background: "#0f172a" }} />
                                                <p
                                                    style={{
                                                        fontSize: "9pt",
                                                        fontWeight: 600,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    {notedBy}
                                                </p>
                                                <p className="fin-eyebrow" style={{ marginTop: 1 }}>
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

                {/* Repeating footer — content flows above it, never under it */}
                <tfoot>
                    <tr>
                        <td>
                            <div className="fin-foot-inner">
                                <span>{organization} · Financial Report</span>
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
});

export default FinancialReportDocument;