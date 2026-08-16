import { forwardRef } from "react";


export interface BoarderStatsShape {
    totalBoarders: number;
    maleBoarders: number;
    malePercentage: number;
    femaleBoarders: number;
    femalePercentage: number;
    activeBoarders: number;
    activePercentage: number;
}

export interface BoarderSummaryShape {
    totalBoarders: number;
    activeBoarders: number;
    deactivateBoarders: number;
    checkedOutBoarders: number;
    maleBoarders: number;
    femaleBoarders: number;
    newThisMonth: number;
    checkedOutThisMonth: number;
    percentageChange: number;
}

export interface OverTimePoint {
    month: string;
    total: number;
}

export interface BoarderListRow {
    user_id_no: string | number;
    name: string;
    gender?: string;
    account_status?: string;
    contact_number?: string;
    email?: string;
}

export interface BoarderReportDocumentProps {
    boarderStats?: BoarderStatsShape | null;
    boarderSummary?: BoarderSummaryShape | null;
    boardersOverTime?: OverTimePoint[];
    boardersList?: BoarderListRow[];
    periodLabel?: string;
    preparedBy?: string;
    notedBy?: string;
    organization?: string;
    addressLine?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `BRD-${y}${m}-${seq}`;
}

const STATUS_INK: Record<string, string> = {
    Active: "#047857",
    Deactivate: "#b45309",
    "Checked-out": "#be123c",
};

/* ------------------------------------------------------------------ */
/*  Document                                                           */
/* ------------------------------------------------------------------ */

const BoarderReportDocument = forwardRef<
    HTMLDivElement,
    BoarderReportDocumentProps
>(function BoarderReportDocument(
    {
        boarderStats,
        boarderSummary,
        boardersOverTime = [],
        boardersList = [],
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

    const trendMax = Math.max(1, ...boardersOverTime.map((t) => t.total));

    const statusSlices = boarderSummary
        ? [
            {
                name: "Active",
                value: boarderSummary.activeBoarders,
                color: "#047857",
            },
            {
                name: "Deactivate",
                value: boarderSummary.deactivateBoarders,
                color: "#eab308",
            },
            {
                name: "Checked-out",
                value: boarderSummary.checkedOutBoarders,
                color: "#e11d48",
            },
        ]
        : [];

    const statusTotal = statusSlices.reduce((s, d) => s + d.value, 0) || 1;

    const genderSlices = boarderSummary
        ? [
            { name: "Male", value: boarderSummary.maleBoarders, color: "#334155" },
            {
                name: "Female",
                value: boarderSummary.femaleBoarders,
                color: "#94a3b8",
            },
        ]
        : [];

    const genderTotal = genderSlices.reduce((s, d) => s + d.value, 0) || 1;

    const kpis = boarderStats
        ? [
            { label: "Total boarders", value: String(boarderStats.totalBoarders), sub: "" },
            {
                label: "Male",
                value: String(boarderStats.maleBoarders),
                sub: `${boarderStats.malePercentage}% of total`,
            },
            {
                label: "Female",
                value: String(boarderStats.femaleBoarders),
                sub: `${boarderStats.femalePercentage}% of total`,
            },
            {
                label: "Active",
                value: String(boarderStats.activeBoarders),
                sub: `${boarderStats.activePercentage}% active`,
            },
        ]
        : [];

    return (
        <div ref={ref} className="brd-doc">
            <style>{`
        /* Printable width = 210mm - (14mm x 2) = 182mm */
        @page { size: A4 portrait; margin: 14mm; }

        .brd-doc {
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
        .brd-doc *, .brd-doc *::before, .brd-doc *::after { box-sizing: border-box; }
        .brd-doc p, .brd-doc h1, .brd-doc h2 { margin: 0; }

        .brd-serif { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif; }

        .brd-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .brd-rule { height: 1px; background: #e2e8f0; }
        .brd-rule-dark { height: 2px; background: #0f172a; }

        .brd-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .brd-shell > tbody > tr > td,
        .brd-shell > tfoot > tr > td { padding: 0; }

        .brd-foot-inner {
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

        .brd-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .brd-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 6px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .brd-table td {
          padding: 6px 6px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 8.5pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .brd-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

        @media print {
          .brd-doc {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .brd-avoid { break-inside: avoid; page-break-inside: avoid; }
          .brd-table thead { display: table-header-group; }
          .brd-table tr { break-inside: avoid; page-break-inside: avoid; }
          .brd-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

            <table className="brd-shell">
                <tbody>
                    <tr>
                        <td>
                            {/* ---------------- Letterhead ---------------- */}
                            <header className="brd-avoid">
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
                                                className="brd-serif"
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
                                                className="brd-serif"
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
                                        <p className="brd-eyebrow">Reference no.</p>
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
                                        <p className="brd-eyebrow" style={{ marginTop: 8 }}>
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

                                <div className="brd-rule-dark" style={{ marginTop: 12 }} />

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
                                        <p className="brd-eyebrow">Register of residents</p>
                                        <h1
                                            className="brd-serif"
                                            style={{
                                                fontSize: "22pt",
                                                fontWeight: 700,
                                                letterSpacing: "-0.015em",
                                                lineHeight: 1.1,
                                                marginTop: 3,
                                            }}
                                        >
                                            Boarder Report
                                        </h1>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            flex: "0 0 auto",
                                            maxWidth: "65mm",
                                        }}
                                    >
                                        <p className="brd-eyebrow">Reporting period</p>
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
                                            {boardersList.length} boarders on register
                                        </p>
                                    </div>
                                </div>

                                <div className="brd-rule" />
                            </header>

                            {/* ---------------- 01 Boarder summary ---------------- */}
                            <section className="brd-avoid" style={{ marginTop: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="brd-eyebrow">01</span>
                                    <h2
                                        className="brd-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Boarder summary
                                    </h2>
                                </div>

                                <table
                                    className="brd-avoid"
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
                                                    <p className="brd-eyebrow">{k.label}</p>
                                                    <p
                                                        style={{
                                                            fontSize: "14pt",
                                                            fontWeight: 700,
                                                            letterSpacing: "-0.02em",
                                                            fontVariantNumeric: "tabular-nums",
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        {k.value}
                                                    </p>
                                                    {k.sub && (
                                                        <p
                                                            style={{
                                                                fontSize: "7.5pt",
                                                                color: "#94a3b8",
                                                                marginTop: 1,
                                                            }}
                                                        >
                                                            {k.sub}
                                                        </p>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                {boarderSummary && (
                                    <p
                                        style={{
                                            fontSize: "8pt",
                                            color: "#64748b",
                                            marginTop: 6,
                                        }}
                                    >
                                        {boarderSummary.newThisMonth} new this month ·{" "}
                                        {boarderSummary.checkedOutThisMonth} checked out this month ·{" "}
                                        {boarderSummary.percentageChange >= 0 ? "+" : ""}
                                        {boarderSummary.percentageChange}% versus last month.
                                    </p>
                                )}
                            </section>

                            {/* ---------------- 02 Composition ---------------- */}
                            {boarderSummary && (
                                <section className="brd-avoid" style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="brd-eyebrow">02</span>
                                        <h2
                                            className="brd-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Status and gender composition
                                        </h2>
                                    </div>

                                    {/* Status */}
                                    <p className="brd-eyebrow" style={{ marginBottom: 4 }}>
                                        By account status
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            height: 10,
                                            borderRadius: 999,
                                            overflow: "hidden",
                                            marginBottom: 8,
                                            background: "#f1f5f9",
                                        }}
                                    >
                                        {statusSlices.map((s) => (
                                            <div
                                                key={s.name}
                                                style={{
                                                    width: `${(s.value / statusTotal) * 100}%`,
                                                    background: s.color,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <table className="brd-table" style={{ marginBottom: 12 }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "50%" }}>Status</th>
                                                <th className="brd-num" style={{ width: "25%" }}>
                                                    Boarders
                                                </th>
                                                <th className="brd-num" style={{ width: "25%" }}>
                                                    Share
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {statusSlices.map((s) => (
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
                                                    <td className="brd-num" style={{ fontWeight: 600 }}>
                                                        {s.value}
                                                    </td>
                                                    <td className="brd-num" style={{ color: "#64748b" }}>
                                                        {((s.value / statusTotal) * 100).toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Gender */}
                                    <p className="brd-eyebrow" style={{ marginBottom: 4 }}>
                                        By gender
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            height: 10,
                                            borderRadius: 999,
                                            overflow: "hidden",
                                            marginBottom: 8,
                                            background: "#f1f5f9",
                                        }}
                                    >
                                        {genderSlices.map((s) => (
                                            <div
                                                key={s.name}
                                                style={{
                                                    width: `${(s.value / genderTotal) * 100}%`,
                                                    background: s.color,
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <table className="brd-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "50%" }}>Gender</th>
                                                <th className="brd-num" style={{ width: "25%" }}>
                                                    Boarders
                                                </th>
                                                <th className="brd-num" style={{ width: "25%" }}>
                                                    Share
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {genderSlices.map((s) => (
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
                                                    <td className="brd-num" style={{ fontWeight: 600 }}>
                                                        {s.value}
                                                    </td>
                                                    <td className="brd-num" style={{ color: "#64748b" }}>
                                                        {((s.value / genderTotal) * 100).toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            )}

                            {/* ---------------- 03 Boarders over time ---------------- */}
                            {boardersOverTime.length > 0 && (
                                <section className="brd-avoid" style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="brd-eyebrow">03</span>
                                        <h2
                                            className="brd-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Boarders over time
                                        </h2>
                                    </div>

                                    <table className="brd-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}>Month</th>
                                                <th className="brd-num" style={{ width: "25%" }}>
                                                    Total boarders
                                                </th>
                                                <th style={{ width: "55%" }}>Relative</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boardersOverTime.map((t) => (
                                                <tr key={t.month}>
                                                    <td style={{ fontWeight: 600 }}>{t.month}</td>
                                                    <td className="brd-num">{t.total}</td>
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
                                                                    width: `${(t.total / trendMax) * 100}%`,
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

                            {/* ---------------- 04 Directory ---------------- */}
                            <section style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="brd-eyebrow">04</span>
                                    <h2
                                        className="brd-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Boarder directory
                                    </h2>
                                </div>

                                <table className="brd-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "13%" }}>ID</th>
                                            <th style={{ width: "26%" }}>Name</th>
                                            <th style={{ width: "11%" }}>Gender</th>
                                            <th style={{ width: "14%" }}>Status</th>
                                            <th style={{ width: "16%" }}>Contact</th>
                                            <th className="brd-num" style={{ width: "20%" }}>
                                                Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boardersList.map((b) => (
                                            <tr key={String(b.user_id_no)}>
                                                <td
                                                    style={{
                                                        color: "#64748b",
                                                        fontVariantNumeric: "tabular-nums",
                                                    }}
                                                >
                                                    {b.user_id_no}
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{b.name}</td>
                                                <td style={{ color: "#64748b" }}>{b.gender}</td>
                                                <td
                                                    style={{
                                                        fontWeight: 600,
                                                        color:
                                                            STATUS_INK[b.account_status ?? ""] ?? "#334155",
                                                    }}
                                                >
                                                    {b.account_status}
                                                </td>
                                                <td
                                                    style={{
                                                        color: "#334155",
                                                        fontVariantNumeric: "tabular-nums",
                                                    }}
                                                >
                                                    {b.contact_number}
                                                </td>
                                                <td
                                                    className="brd-num"
                                                    style={{ color: "#64748b", fontSize: "7.5pt" }}
                                                >
                                                    {b.email}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- Certification ---------------- */}
                            <section className="brd-avoid" style={{ marginTop: 22 }}>
                                <div className="brd-rule" style={{ marginBottom: 10 }} />
                                <p
                                    style={{
                                        fontSize: "8pt",
                                        color: "#64748b",
                                        maxWidth: "120mm",
                                    }}
                                >
                                    This register reflects boarder records on file as of the
                                    generation date. Contact details are confidential and intended
                                    for authorized personnel only.
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
                                                <p className="brd-eyebrow" style={{ marginTop: 1 }}>
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
                                                <p className="brd-eyebrow" style={{ marginTop: 1 }}>
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
                            <div className="brd-foot-inner">
                                <span>{organization} · Boarder Report · Confidential</span>
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

export default BoarderReportDocument;