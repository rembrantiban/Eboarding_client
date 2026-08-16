import { forwardRef } from "react";


export interface CollectionStatsShape {
    totalCollections: number;
    totalCollectionsChange: number;
    totalTransactions: number;
    totalTransactionsChange: number;
    paidBoarders: number;
    paidBoardersChange: number;
    collectionRate: number;
    averageCollection: number;
}

export interface TrendPoint {
    month: string;
    amount: number;
}

export interface TransactionRow {
    date: string;
    boarder: string;
    amount: number;
    status?: string;
}

export interface BoarderStatusRow {
    name: string;
    room: string | number | null;
    due: string;
    total: number;
    paid: number;
    balance: number;
    status?: string;
    paidDate?: string;
}

export interface PaymentCollectionDocumentProps {
    collectionDashboardStats?: CollectionStatsShape | null;
    collectionTrend?: TrendPoint[];
    recentTransactions?: TransactionRow[];
    boarderBillingStatus?: BoarderStatusRow[];
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

const pct = (n: number) => `${Number(n ?? 0) >= 0 ? "+" : ""}${Number(n ?? 0)}%`;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `COL-${y}${m}-${seq}`;
}

const STATUS_INK: Record<string, string> = {
    Paid: "#047857",
    Partial: "#b45309",
    Unpaid: "#64748b",
    Overdue: "#be123c",
};


const PaymentCollectionDocument = forwardRef<
    HTMLDivElement,
    PaymentCollectionDocumentProps
>(function PaymentCollectionDocument(
    {
        collectionDashboardStats,
        collectionTrend = [],
        recentTransactions = [],
        boarderBillingStatus = [],
        periodLabel,
        preparedBy = "________________________",
        notedBy = "________________________",
        organization = "E-Boarding House Management",
        addressLine = "Guihulngan City, Negros Oriental, Philippines",
    },
    ref
) {
    const now = new Date();
    const period = periodLabel ?? monthYear(now);

    const trendMax = Math.max(1, ...collectionTrend.map((t) => t.amount));

    const billed = boarderBillingStatus.reduce(
        (sum, b) => sum + Number(b.total ?? 0),
        0
    );

    const collected = boarderBillingStatus.reduce(
        (sum, b) => sum + Number(b.paid ?? 0),
        0
    );

    const outstanding = boarderBillingStatus.reduce(
        (sum, b) => sum + Number(b.balance ?? 0),
        0
    );

    const kpis = collectionDashboardStats
        ? [
            {
                label: "Total collections",
                value: peso(collectionDashboardStats.totalCollections),
                delta: pct(collectionDashboardStats.totalCollectionsChange),
                up: collectionDashboardStats.totalCollectionsChange >= 0,
            },
            {
                label: "Transactions",
                value: String(collectionDashboardStats.totalTransactions),
                delta: pct(collectionDashboardStats.totalTransactionsChange),
                up: collectionDashboardStats.totalTransactionsChange >= 0,
            },
            {
                label: "Paid boarders",
                value: String(collectionDashboardStats.paidBoarders),
                delta: pct(collectionDashboardStats.paidBoardersChange),
                up: collectionDashboardStats.paidBoardersChange >= 0,
            },
            {
                label: "Collection rate",
                value: `${collectionDashboardStats.collectionRate}%`,
                delta: "",
                up: true,
            },
            {
                label: "Average collection",
                value: peso(collectionDashboardStats.averageCollection),
                delta: "",
                up: true,
            },
        ]
        : [];

    return (
        <div ref={ref} className="col-doc">
            <style>{`
        /* Printable width = 210mm - (14mm x 2) = 182mm */
        @page { size: A4 portrait; margin: 14mm; }

        .col-doc {
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
        .col-doc *, .col-doc *::before, .col-doc *::after { box-sizing: border-box; }
        .col-doc p, .col-doc h1, .col-doc h2 { margin: 0; }

        .col-serif { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif; }

        .col-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .col-rule { height: 1px; background: #e2e8f0; }
        .col-rule-dark { height: 2px; background: #0f172a; }

        .col-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .col-shell > tbody > tr > td,
        .col-shell > tfoot > tr > td { padding: 0; }

        .col-foot-inner {
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

        .col-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .col-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 6px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .col-table td {
          padding: 6px 6px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 8.5pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .col-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

        @media print {
          .col-doc {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .col-avoid { break-inside: avoid; page-break-inside: avoid; }
          .col-table thead { display: table-header-group; }
          .col-table tr { break-inside: avoid; page-break-inside: avoid; }
          .col-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

            <table className="col-shell">
                <tbody>
                    <tr>
                        <td>
                            {/* ---------------- Letterhead ---------------- */}
                            <header className="col-avoid">
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
                                                className="col-serif"
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
                                                className="col-serif"
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
                                        <p className="col-eyebrow">Reference no.</p>
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
                                        <p className="col-eyebrow" style={{ marginTop: 8 }}>
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

                                <div className="col-rule-dark" style={{ marginTop: 12 }} />

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
                                        <p className="col-eyebrow">Statement of collections</p>
                                        <h1
                                            className="col-serif"
                                            style={{
                                                fontSize: "21pt",
                                                fontWeight: 700,
                                                letterSpacing: "-0.015em",
                                                lineHeight: 1.1,
                                                marginTop: 3,
                                            }}
                                        >
                                            Payment Collection Report
                                        </h1>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            flex: "0 0 auto",
                                            maxWidth: "60mm",
                                        }}
                                    >
                                        <p className="col-eyebrow">Reporting period</p>
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
                                            {boarderBillingStatus.length} boarders billed
                                        </p>
                                    </div>
                                </div>

                                <div className="col-rule" />
                            </header>

                            {/* ---------------- 01 Collection summary ---------------- */}
                            <section className="col-avoid" style={{ marginTop: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="col-eyebrow">01</span>
                                    <h2
                                        className="col-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Collection summary
                                    </h2>
                                </div>

                                <table
                                    className="col-avoid"
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
                                                        width: "20%",
                                                        padding: "8px",
                                                        verticalAlign: "top",
                                                        borderRight:
                                                            i < kpis.length - 1
                                                                ? "1px solid #e2e8f0"
                                                                : "none",
                                                        background: i === 0 ? "#f8fafc" : "#fff",
                                                    }}
                                                >
                                                    <p className="col-eyebrow">{k.label}</p>
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
                                                    {k.delta && (
                                                        <p
                                                            style={{
                                                                fontSize: "7pt",
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
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <p style={{ fontSize: "8pt", color: "#64748b", marginTop: 6 }}>
                                    Billed {peso(billed)} · collected {peso(collected)} ·
                                    outstanding {peso(outstanding)}.
                                </p>
                            </section>

                            {/* ---------------- 02 Collection trend ---------------- */}
                            {collectionTrend.length > 0 && (
                                <section className="col-avoid" style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="col-eyebrow">02</span>
                                        <h2
                                            className="col-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Collection trend
                                        </h2>
                                    </div>

                                    <table className="col-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "18%" }}>Month</th>
                                                <th className="col-num" style={{ width: "30%" }}>
                                                    Collections
                                                </th>
                                                <th style={{ width: "52%" }}>Relative</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {collectionTrend.map((t) => (
                                                <tr key={t.month}>
                                                    <td style={{ fontWeight: 600 }}>{t.month}</td>
                                                    <td className="col-num">{peso(t.amount)}</td>
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

                            {/* ---------------- 03 Boarder collection status ---------------- */}
                            <section style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="col-eyebrow">03</span>
                                    <h2
                                        className="col-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Boarder collection status
                                    </h2>
                                </div>

                                <table className="col-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "22%" }}>Boarder</th>
                                            <th style={{ width: "9%" }}>Room</th>
                                            <th style={{ width: "12%" }}>Due date</th>
                                            <th className="col-num" style={{ width: "13%" }}>
                                                Total
                                            </th>
                                            <th className="col-num" style={{ width: "13%" }}>
                                                Paid
                                            </th>
                                            <th className="col-num" style={{ width: "13%" }}>
                                                Balance
                                            </th>
                                            <th style={{ width: "9%" }}>Status</th>
                                            <th className="col-num" style={{ width: "9%" }}>
                                                Paid on
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boarderBillingStatus.map((b, i) => (
                                            <tr key={`${b.name}-${i}`}>
                                                <td style={{ fontWeight: 600 }}>{b.name}</td>
                                                <td>{b.room}</td>
                                                <td style={{ color: "#64748b", fontSize: "8pt" }}>
                                                    {b.due}
                                                </td>
                                                <td className="col-num">{peso(b.total)}</td>
                                                <td className="col-num" style={{ color: "#047857" }}>
                                                    {peso(b.paid)}
                                                </td>
                                                <td
                                                    className="col-num"
                                                    style={{
                                                        fontWeight: b.balance > 0 ? 700 : 400,
                                                        color: b.balance > 0 ? "#be123c" : "#94a3b8",
                                                    }}
                                                >
                                                    {peso(b.balance)}
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: 600,
                                                        color: STATUS_INK[b.status ?? ""] ?? "#334155",
                                                    }}
                                                >
                                                    {b.status}
                                                </td>
                                                <td
                                                    className="col-num"
                                                    style={{ color: "#64748b", fontSize: "8pt" }}
                                                >
                                                    {b.paidDate || "—"}
                                                </td>
                                            </tr>
                                        ))}

                                        {boarderBillingStatus.length > 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
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
                                                    className="col-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    {peso(billed)}
                                                </td>
                                                <td
                                                    className="col-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#34d399",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    {peso(collected)}
                                                </td>
                                                <td
                                                    className="col-num"
                                                    style={{
                                                        background: "#0f172a",
                                                        color: "#fb7185",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                    }}
                                                >
                                                    {peso(outstanding)}
                                                </td>
                                                <td
                                                    colSpan={2}
                                                    style={{
                                                        background: "#0f172a",
                                                        borderBottom: "none",
                                                    }}
                                                />
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- 04 Recent transactions ---------------- */}
                            {recentTransactions.length > 0 && (
                                <section style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="col-eyebrow">04</span>
                                        <h2
                                            className="col-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Recent collection transactions
                                        </h2>
                                    </div>

                                    <table className="col-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}>Date</th>
                                                <th style={{ width: "40%" }}>Boarder</th>
                                                <th className="col-num" style={{ width: "22%" }}>
                                                    Amount
                                                </th>
                                                <th className="col-num" style={{ width: "18%" }}>
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTransactions.map((t, i) => (
                                                <tr key={`${t.boarder}-${i}`}>
                                                    <td style={{ color: "#64748b", fontSize: "8pt" }}>
                                                        {t.date}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>{t.boarder}</td>
                                                    <td className="col-num" style={{ fontWeight: 600 }}>
                                                        {peso(t.amount)}
                                                    </td>
                                                    <td
                                                        className="col-num"
                                                        style={{
                                                            fontWeight: 600,
                                                            color: STATUS_INK[t.status ?? ""] ?? "#334155",
                                                        }}
                                                    >
                                                        {t.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            )}

                            {/* ---------------- Certification ---------------- */}
                            <section className="col-avoid" style={{ marginTop: 22 }}>
                                <div className="col-rule" style={{ marginBottom: 10 }} />
                                <p
                                    style={{
                                        fontSize: "8pt",
                                        color: "#64748b",
                                        maxWidth: "120mm",
                                    }}
                                >
                                    This report was generated from payment records on file for the
                                    period stated above. Balances reflect collections posted as of
                                    the generation date and may change once pending payments are
                                    recorded.
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
                                                <p className="col-eyebrow" style={{ marginTop: 1 }}>
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
                                                <p className="col-eyebrow" style={{ marginTop: 1 }}>
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
                            <div className="col-foot-inner">
                                <span>{organization} · Payment Collection Report</span>
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

export default PaymentCollectionDocument;