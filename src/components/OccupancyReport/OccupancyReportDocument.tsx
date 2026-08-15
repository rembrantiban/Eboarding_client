import { forwardRef } from "react";


export interface OccupancyStatsShape {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyRate: string;
}

export interface RoomStatusSlice {
    name: string;
    value: number;
    color: string;
}

export interface RoomReportRow {
    number: string | number;
    capacity: number;
    occupied: number;
    available: number;
    status: string;
    date: string;
}

export interface ActivityRow {
    date: string;   
    boarder: string;
    room: string | number;
    bed: string | number;
    action: string;
    by: string;
}

export interface OccupancyReportDocumentProps {
    roomReportStats?: OccupancyStatsShape | null;
    roomStatusReport?: RoomStatusSlice[];
    roomReport?: RoomReportRow[];
    recentActivities?: ActivityRow[];
    insights?: string[];
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
    return `OCC-${y}${m}-${seq}`;
}

const STATUS_INK: Record<string, string> = {
    Full: "#be123c",
    Occupied: "#1d4ed8",
    Available: "#047857",
    Vacant: "#64748b",
};

/* ------------------------------------------------------------------ */
/*  Document                                                           */
/* ------------------------------------------------------------------ */

const OccupancyReportDocument = forwardRef<
    HTMLDivElement,
    OccupancyReportDocumentProps
>(function OccupancyReportDocument(
    {
        roomReportStats,
        roomStatusReport = [],
        roomReport = [],
        recentActivities = [],
        insights = [],
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

    const statusTotal = roomStatusReport.reduce((s, d) => s + d.value, 0) || 1;

    const totalBeds = roomReport.reduce((s, r) => s + (r.capacity || 0), 0);
    const bedsTaken = roomReport.reduce((s, r) => s + (r.occupied || 0), 0);

    const kpis = roomReportStats
        ? [
            { label: "Total rooms", value: String(roomReportStats.totalRooms) },
            { label: "Occupied rooms", value: String(roomReportStats.occupiedRooms) },
            { label: "Available rooms", value: String(roomReportStats.availableRooms) },
            { label: "Occupancy rate", value: `${roomReportStats.occupancyRate}%` },
        ]
        : [];

    return (
        <div ref={ref} className="occ-doc">
            <style>{`
        /* Printable width = 210mm - (14mm x 2) = 182mm */
        @page { size: A4 portrait; margin: 14mm; }

        .occ-doc {
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
        .occ-doc *, .occ-doc *::before, .occ-doc *::after { box-sizing: border-box; }
        .occ-doc p, .occ-doc h1, .occ-doc h2 { margin: 0; }

        .occ-serif { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif; }

        .occ-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .occ-rule { height: 1px; background: #e2e8f0; }
        .occ-rule-dark { height: 2px; background: #0f172a; }

        .occ-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .occ-shell > tbody > tr > td,
        .occ-shell > tfoot > tr > td { padding: 0; }

        .occ-foot-inner {
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

        .occ-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .occ-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 8px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .occ-table td {
          padding: 6px 8px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 9pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .occ-num { text-align: right; font-variant-numeric: tabular-nums; }

        @media print {
          .occ-doc {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .occ-avoid { break-inside: avoid; page-break-inside: avoid; }
          .occ-table thead { display: table-header-group; }
          .occ-table tr { break-inside: avoid; page-break-inside: avoid; }
          .occ-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

            <table className="occ-shell">
                <tbody>
                    <tr>
                        <td>
                            {/* ---------------- Letterhead ---------------- */}
                            <header className="occ-avoid">
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
                                                className="occ-serif"
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
                                                className="occ-serif"
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
                                        <p className="occ-eyebrow">Reference no.</p>
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
                                        <p className="occ-eyebrow" style={{ marginTop: 8 }}>
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

                                <div className="occ-rule-dark" style={{ marginTop: 12 }} />

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
                                        <p className="occ-eyebrow">Statement of utilization</p>
                                        <h1
                                            className="occ-serif"
                                            style={{
                                                fontSize: "22pt",
                                                fontWeight: 700,
                                                letterSpacing: "-0.015em",
                                                lineHeight: 1.1,
                                                marginTop: 3,
                                            }}
                                        >
                                            Occupancy Report
                                        </h1>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            flex: "0 0 auto",
                                            maxWidth: "70mm",
                                        }}
                                    >
                                        <p className="occ-eyebrow">Reporting period</p>
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
                                            {roomReport.length} rooms · {totalBeds} beds
                                        </p>
                                    </div>
                                </div>

                                <div className="occ-rule" />
                            </header>

                            {/* ---------------- 01 Occupancy summary ---------------- */}
                            <section className="occ-avoid" style={{ marginTop: 16 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="occ-eyebrow">01</span>
                                    <h2
                                        className="occ-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Occupancy summary
                                    </h2>
                                </div>

                                <table
                                    className="occ-avoid"
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
                                                    <p className="occ-eyebrow">{k.label}</p>
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
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>

                                <p
                                    style={{
                                        fontSize: "8pt",
                                        color: "#64748b",
                                        marginTop: 6,
                                    }}
                                >
                                    Bed utilization: {bedsTaken} of {totalBeds} beds occupied
                                    {totalBeds > 0
                                        ? ` (${((bedsTaken / totalBeds) * 100).toFixed(1)}%)`
                                        : ""}
                                    .
                                </p>
                            </section>

                            {/* ---------------- 02 Room status distribution ---------------- */}
                            <section className="occ-avoid" style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="occ-eyebrow">02</span>
                                    <h2
                                        className="occ-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Room status distribution
                                    </h2>
                                </div>

                                {/* The donut, redrawn for paper */}
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
                                    {roomStatusReport.map((s) => (
                                        <div
                                            key={s.name}
                                            style={{
                                                width: `${(s.value / statusTotal) * 100}%`,
                                                background: s.color,
                                            }}
                                        />
                                    ))}
                                </div>

                                <table className="occ-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "50%" }}>Status</th>
                                            <th className="occ-num" style={{ width: "25%" }}>
                                                Rooms
                                            </th>
                                            <th className="occ-num" style={{ width: "25%" }}>
                                                Share
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomStatusReport.map((s) => (
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
                                                <td className="occ-num" style={{ fontWeight: 600 }}>
                                                    {s.value}
                                                </td>
                                                <td className="occ-num" style={{ color: "#64748b" }}>
                                                    {((s.value / statusTotal) * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ fontWeight: 700, borderBottom: "none" }}>
                                                Total rooms
                                            </td>
                                            <td
                                                className="occ-num"
                                                style={{ fontWeight: 700, borderBottom: "none" }}
                                            >
                                                {statusTotal}
                                            </td>
                                            <td
                                                className="occ-num"
                                                style={{ fontWeight: 700, borderBottom: "none" }}
                                            >
                                                100.0%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- 03 Room availability ---------------- */}
                            <section style={{ marginTop: 18 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span className="occ-eyebrow">03</span>
                                    <h2
                                        className="occ-serif"
                                        style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                    >
                                        Room availability detail
                                    </h2>
                                </div>

                                <table className="occ-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "14%" }}>Room</th>
                                            <th className="occ-num" style={{ width: "12%" }}>
                                                Capacity
                                            </th>
                                            <th className="occ-num" style={{ width: "12%" }}>
                                                Occupied
                                            </th>
                                            <th className="occ-num" style={{ width: "12%" }}>
                                                Available
                                            </th>
                                            <th style={{ width: "22%" }}>Utilization</th>
                                            <th style={{ width: "14%" }}>Status</th>
                                            <th className="occ-num" style={{ width: "14%" }}>
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomReport.map((r) => {
                                            const use =
                                                r.capacity > 0 ? (r.occupied / r.capacity) * 100 : 0;
                                            return (
                                                <tr key={String(r.number)}>
                                                    <td style={{ fontWeight: 600 }}>{r.number}</td>
                                                    <td className="occ-num">{r.capacity}</td>
                                                    <td className="occ-num">{r.occupied}</td>
                                                    <td className="occ-num">{r.available}</td>
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
                                                                    background:
                                                                        use >= 100 ? "#be123c" : "#0f172a",
                                                                    width: `${Math.min(100, use)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 600,
                                                            color: STATUS_INK[r.status] ?? "#334155",
                                                        }}
                                                    >
                                                        {r.status}
                                                    </td>
                                                    <td
                                                        className="occ-num"
                                                        style={{ color: "#64748b", fontSize: "8pt" }}
                                                    >
                                                        {r.date}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </section>

                            {/* ---------------- 04 Recent activity ---------------- */}
                            {recentActivities.length > 0 && (
                                <section style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="occ-eyebrow">04</span>
                                        <h2
                                            className="occ-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Recent occupancy activity
                                        </h2>
                                    </div>

                                    <table className="occ-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "16%" }}>Date</th>
                                                <th style={{ width: "26%" }}>Boarder</th>
                                                <th style={{ width: "12%" }}>Room</th>
                                                <th style={{ width: "10%" }}>Bed</th>
                                                <th style={{ width: "16%" }}>Action</th>
                                                <th className="occ-num" style={{ width: "20%" }}>
                                                    Recorded by
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivities.map((a, i) => (
                                                <tr key={`${a.boarder}-${i}`}>
                                                    <td style={{ color: "#64748b", fontSize: "8pt" }}>
                                                        {a.date}
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>{a.boarder}</td>
                                                    <td>{a.room}</td>
                                                    <td>{a.bed}</td>
                                                    <td
                                                        style={{
                                                            fontWeight: 600,
                                                            color:
                                                                a.action === "Checked-Out"
                                                                    ? "#be123c"
                                                                    : a.action === "Transferred"
                                                                        ? "#1d4ed8"
                                                                        : "#047857",
                                                        }}
                                                    >
                                                        {a.action}
                                                    </td>
                                                    <td className="occ-num" style={{ color: "#64748b" }}>
                                                        {a.by}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            )}

                            {/* ---------------- 05 Insights ---------------- */}
                            {insights.length > 0 && (
                                <section className="occ-avoid" style={{ marginTop: 18 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span className="occ-eyebrow">05</span>
                                        <h2
                                            className="occ-serif"
                                            style={{ fontSize: "11.5pt", fontWeight: 700 }}
                                        >
                                            Occupancy insights
                                        </h2>
                                    </div>

                                    <div
                                        style={{
                                            border: "1px solid #e2e8f0",
                                            borderLeft: "3px solid #0f172a",
                                            padding: "10px 12px",
                                        }}
                                    >
                                        {insights.map((item, i) => (
                                            <p
                                                key={i}
                                                style={{
                                                    fontSize: "9pt",
                                                    color: "#334155",
                                                    marginBottom:
                                                        i === insights.length - 1 ? 0 : 5,
                                                }}
                                            >
                                                — {item}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* ---------------- Certification ---------------- */}
                            <section className="occ-avoid" style={{ marginTop: 22 }}>
                                <div className="occ-rule" style={{ marginBottom: 10 }} />
                                <p
                                    style={{
                                        fontSize: "8pt",
                                        color: "#64748b",
                                        maxWidth: "120mm",
                                    }}
                                >
                                    This report reflects room and bed assignments recorded in the
                                    system as of the generation date. Figures may change as
                                    check-ins, check-outs and transfers are posted.
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
                                                <p className="occ-eyebrow" style={{ marginTop: 1 }}>
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
                                                <p className="occ-eyebrow" style={{ marginTop: 1 }}>
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
                            <div className="occ-foot-inner">
                                <span>{organization} · Occupancy Report</span>
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

export default OccupancyReportDocument;