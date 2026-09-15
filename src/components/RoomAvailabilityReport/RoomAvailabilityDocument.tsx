import { forwardRef } from "react";

export interface AvailabilityStatsShape {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    totalCapacity: number;
}

export interface StatusSlice {
    name: string;
    value: number;
    pct: string;
    color: string;
}

export interface OccupancyTrendPoint {
    month: string;
    occupied: number;
}

export interface RoomAvailabilityRow {
    number: string | number;
    capacity: number;
    occupied: number;
    available: number;
    status: string;
    rate: number;
}

export interface RoomAvailabilityDocumentProps {
    availabilityStats?: AvailabilityStatsShape | null;
    statusBreakdown?: StatusSlice[];
    occupancyTrend?: OccupancyTrendPoint[];
    rooms?: RoomAvailabilityRow[];
    insights?: string[];
    periodLabel?: string;
    preparedBy?: string;
    notedBy?: string;
    organization?: string;
    addressLine?: string;
}

const peso = (n: number) => `₱${Number(n ?? 0).toLocaleString("en-PH")}.00`;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `AVL-${y}${m}-${seq}`;
}

const STATUS_INK: Record<string, string> = {
    Available: "#047857",
    Occupied: "#1d4ed8",
    "Under Maintenance": "#b45309",
};

const RoomAvailabilityDocument = forwardRef<HTMLDivElement, RoomAvailabilityDocumentProps>(
    function RoomAvailabilityDocument(
        {
            availabilityStats,
            statusBreakdown = [],
            occupancyTrend = [],
            rooms = [],
            insights = [],
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

        const statusTotal = statusBreakdown.reduce((s, d) => s + d.value, 0) || 1;
        const trendMax = Math.max(1, ...occupancyTrend.map((t) => t.occupied));

        const totalCapacity = rooms.reduce((s, r) => s + (r.capacity || 0), 0);
        const totalOccupied = rooms.reduce((s, r) => s + (r.occupied || 0), 0);

        const kpis = availabilityStats
            ? [
                { label: "Total rooms", value: String(availabilityStats.totalRooms) },
                { label: "Available", value: String(availabilityStats.availableRooms) },
                { label: "Occupied", value: String(availabilityStats.occupiedRooms) },
                { label: "Under maintenance", value: String(availabilityStats.maintenanceRooms) },
                { label: "Total capacity", value: String(availabilityStats.totalCapacity) },
            ]
            : [];

        return (
            <div ref={ref} className="ra-doc">
                <style>{`
        @page { size: A4 portrait; margin: 14mm; }

        .ra-doc {
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
        .ra-doc *, .ra-doc *::before, .ra-doc *::after { box-sizing: border-box; }
        .ra-doc p, .ra-doc h1, .ra-doc h2 { margin: 0; }

        .ra-serif { font-family: "Iowan Old Style", Georgia, "Times New Roman", serif; }

        .ra-eyebrow {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .ra-rule { height: 1px; background: #e2e8f0; }
        .ra-rule-dark { height: 2px; background: #0f172a; }

        .ra-shell {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .ra-shell > tbody > tr > td,
        .ra-shell > tfoot > tr > td { padding: 0; }

        .ra-foot-inner {
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

        .ra-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .ra-table th {
          font-size: 6.8pt;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 6px 6px;
          border-bottom: 1px solid #cbd5e1;
          text-align: left;
        }
        .ra-table td {
          padding: 6px 6px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 8.5pt;
          vertical-align: middle;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .ra-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

        @media print {
          .ra-doc {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .ra-avoid { break-inside: avoid; page-break-inside: avoid; }
          .ra-table thead { display: table-header-group; }
          .ra-table tr { break-inside: avoid; page-break-inside: avoid; }
          .ra-shell > tfoot { display: table-footer-group; }
        }
      `}</style>

                <table className="ra-shell">
                    <tbody>
                        <tr>
                            <td>
                                {/* ---------------- Letterhead ---------------- */}
                                <header className="ra-avoid">
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
                                                    className="ra-serif"
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
                                                    className="ra-serif"
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
                                            <p className="ra-eyebrow">Reference no.</p>
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
                                            <p className="ra-eyebrow" style={{ marginTop: 8 }}>
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

                                    <div className="ra-rule-dark" style={{ marginTop: 12 }} />

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
                                            <p className="ra-eyebrow">Statement of availability</p>
                                            <h1
                                                className="ra-serif"
                                                style={{
                                                    fontSize: "21pt",
                                                    fontWeight: 700,
                                                    letterSpacing: "-0.015em",
                                                    lineHeight: 1.1,
                                                    marginTop: 3,
                                                }}
                                            >
                                                Room Availability Report
                                            </h1>
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "right",
                                                flex: "0 0 auto",
                                                maxWidth: "60mm",
                                            }}
                                        >
                                            <p className="ra-eyebrow">Reporting period</p>
                                            <p style={{ fontSize: "11pt", fontWeight: 600, marginTop: 2 }}>
                                                {period}
                                            </p>
                                            <p style={{ fontSize: "8pt", color: "#94a3b8" }}>
                                                {rooms.length} rooms on record
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ra-rule" />
                                </header>

                                {/* ---------------- 01 Availability summary ---------------- */}
                                <section className="ra-avoid" style={{ marginTop: 16 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                        <span className="ra-eyebrow">01</span>
                                        <h2 className="ra-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                            Availability summary
                                        </h2>
                                    </div>

                                    <table
                                        className="ra-avoid"
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
                                                        <p className="ra-eyebrow">{k.label}</p>
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
                                        Bed utilization: {totalOccupied} of {totalCapacity} beds occupied
                                        {totalCapacity > 0
                                            ? ` (${((totalOccupied / totalCapacity) * 100).toFixed(1)}%)`
                                            : ""}
                                        .
                                    </p>
                                </section>

                                {/* ---------------- 02 Status distribution ---------------- */}
                                {statusBreakdown.length > 0 && (
                                    <section className="ra-avoid" style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="ra-eyebrow">02</span>
                                            <h2 className="ra-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Status distribution
                                            </h2>
                                        </div>

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
                                            {statusBreakdown.map((s) => (
                                                <div
                                                    key={s.name}
                                                    style={{
                                                        width: `${(s.value / statusTotal) * 100}%`,
                                                        background: s.color,
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <table className="ra-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "50%" }}>Status</th>
                                                    <th className="ra-num" style={{ width: "25%" }}>
                                                        Rooms
                                                    </th>
                                                    <th className="ra-num" style={{ width: "25%" }}>
                                                        Share
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {statusBreakdown.map((s) => (
                                                    <tr key={s.name}>
                                                        <td>
                                                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                                                        <td className="ra-num" style={{ fontWeight: 600 }}>
                                                            {s.value}
                                                        </td>
                                                        <td className="ra-num" style={{ color: "#64748b" }}>
                                                            {s.pct}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </section>
                                )}

                                {/* ---------------- 03 Availability trend ---------------- */}
                                {occupancyTrend.length > 0 && (
                                    <section className="ra-avoid" style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="ra-eyebrow">03</span>
                                            <h2 className="ra-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Availability trend
                                            </h2>
                                        </div>

                                        <table className="ra-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "18%" }}>Month</th>
                                                    <th className="ra-num" style={{ width: "30%" }}>
                                                        New occupancy
                                                    </th>
                                                    <th style={{ width: "52%" }}>Relative</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {occupancyTrend.map((t) => (
                                                    <tr key={t.month}>
                                                        <td style={{ fontWeight: 600 }}>{t.month}</td>
                                                        <td className="ra-num">{t.occupied}</td>
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
                                                                        background: "#2563eb",
                                                                        width: `${(t.occupied / trendMax) * 100}%`,
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

                                {/* ---------------- 04 Room availability detail ---------------- */}
                                <section style={{ marginTop: 18 }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                        <span className="ra-eyebrow">04</span>
                                        <h2 className="ra-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                            Room availability detail
                                        </h2>
                                    </div>

                                    <table className="ra-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "16%" }}>Room</th>
                                                <th className="ra-num" style={{ width: "14%" }}>
                                                    Capacity
                                                </th>
                                                <th className="ra-num" style={{ width: "14%" }}>
                                                    Occupied
                                                </th>
                                                <th className="ra-num" style={{ width: "14%" }}>
                                                    Available
                                                </th>
                                                <th style={{ width: "20%" }}>Status</th>
                                                <th className="ra-num" style={{ width: "22%" }}>
                                                    Monthly rate
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rooms.map((r, i) => (
                                                <tr key={`${r.number}-${i}`}>
                                                    <td style={{ fontWeight: 600 }}>{r.number}</td>
                                                    <td className="ra-num">{r.capacity}</td>
                                                    <td className="ra-num">{r.occupied}</td>
                                                    <td className="ra-num" style={{ color: "#64748b" }}>
                                                        {r.available}
                                                    </td>
                                                    <td
                                                        style={{
                                                            fontWeight: 600,
                                                            color: STATUS_INK[r.status] ?? "#334155",
                                                        }}
                                                    >
                                                        {r.status}
                                                    </td>
                                                    <td className="ra-num" style={{ fontWeight: 600 }}>
                                                        {peso(r.rate)}
                                                    </td>
                                                </tr>
                                            ))}

                                            {rooms.length > 0 && (
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
                                                        className="ra-num"
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        {totalCapacity}
                                                    </td>
                                                    <td
                                                        className="ra-num"
                                                        style={{
                                                            background: "#0f172a",
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            borderBottom: "none",
                                                        }}
                                                    >
                                                        {totalOccupied}
                                                    </td>
                                                    <td
                                                        colSpan={3}
                                                        style={{ background: "#0f172a", borderBottom: "none" }}
                                                    />
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </section>

                                {/* ---------------- 05 Insights ---------------- */}
                                {insights.length > 0 && (
                                    <section className="ra-avoid" style={{ marginTop: 18 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                                            <span className="ra-eyebrow">05</span>
                                            <h2 className="ra-serif" style={{ fontSize: "11.5pt", fontWeight: 700 }}>
                                                Availability insights
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
                                                        marginBottom: i === insights.length - 1 ? 0 : 5,
                                                    }}
                                                >
                                                    — {item}
                                                </p>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* ---------------- Certification ---------------- */}
                                <section className="ra-avoid" style={{ marginTop: 22 }}>
                                    <div className="ra-rule" style={{ marginBottom: 10 }} />
                                    <p style={{ fontSize: "8pt", color: "#64748b", maxWidth: "120mm" }}>
                                        This report reflects room availability and rates recorded in the system as
                                        of the generation date. Figures may change as bookings and maintenance
                                        updates are posted.
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
                                                    <p className="ra-eyebrow" style={{ marginTop: 1 }}>
                                                        Prepared by
                                                    </p>
                                                </td>
                                                <td style={{ width: "10%" }} />
                                                <td style={{ width: "45%", verticalAlign: "top" }}>
                                                    <div style={{ height: 1, background: "#0f172a" }} />
                                                    <p style={{ fontSize: "9pt", fontWeight: 600, marginTop: 4 }}>
                                                        {notedBy}
                                                    </p>
                                                    <p className="ra-eyebrow" style={{ marginTop: 1 }}>
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
                                <div className="ra-foot-inner">
                                    <span>{organization} · Room Availability Report</span>
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

export default RoomAvailabilityDocument;
