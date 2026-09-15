import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export interface ExcelAvailabilityStats {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    totalCapacity: number;
}

export interface ExcelStatusSlice {
    name: string;
    value: number;
    pct?: string;
    color?: string;
}

export interface ExcelOccupancyTrendPoint {
    month: string;
    occupied: number;
}

export interface ExcelRoomRow {
    number: string | number;
    capacity: number;
    occupied: number;
    available: number;
    status: string;
    rate: number;
}

export interface ExportRoomAvailabilityOptions {
    availabilityStats?: ExcelAvailabilityStats | null;
    statusBreakdown?: ExcelStatusSlice[];
    occupancyTrend?: ExcelOccupancyTrendPoint[];
    rooms?: ExcelRoomRow[];
    insights?: string[];
    periodLabel?: string;
    organization?: string;
    addressLine?: string;
    preparedBy?: string;
}

const INK = "FF0F172A";
const BODY = "FF334155";
const MUTED = "FF64748B";
const FAINT = "FF94A3B8";
const LINE = "FFE2E8F0";
const HAIRLINE = "FFF1F5F9";
const TINT = "FFF8FAFC";
const PAPER = "FFFFFFFF";

const GOOD = "FF047857";
const INFO = "FF1D4ED8";
const WARN = "FFB45309";

const DISPLAY = "Georgia";
const TEXT = "Calibri";

const MONEY = '"₱"#,##0.00';
const COUNT = "#,##0";
const SHARE = "0.0%";
const DATE_STAMP = "dd mmm yyyy  h:mm AM/PM";
const DATE_LONG = "dd mmmm yyyy";

const STATUS_INK: Record<string, string> = {
    Available: GOOD,
    Occupied: INFO,
    "Under Maintenance": WARN,
};

type WS = ExcelJS.Worksheet;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `AVL-${y}${m}-${seq}`;
}

function rule(ws: WS, row: number, cols: number, color = LINE, weight: "thin" | "medium" = "thin") {
    for (let c = 1; c <= cols; c++) {
        ws.getCell(row, c).border = {
            ...ws.getCell(row, c).border,
            bottom: { style: weight, color: { argb: color } },
        };
    }
}

function sectionHeading(ws: WS, row: number, index: string, label: string, cols: number) {
    ws.getRow(row).height = 20;
    const cell = ws.getCell(row, 1);
    cell.value = `${index}    ${label.toUpperCase()}`;
    cell.font = { name: TEXT, size: 9, bold: true, color: { argb: FAINT } };
    cell.alignment = { vertical: "bottom" };
    rule(ws, row, cols, LINE);
}

function tableHead(ws: WS, row: number, labels: (string | null)[]) {
    ws.getRow(row).height = 17;
    labels.forEach((label, i) => {
        if (label === null) return;
        const cell = ws.getCell(row, i + 1);
        cell.value = label.toUpperCase();
        cell.font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
        cell.alignment = { vertical: "middle", horizontal: i === 0 ? "left" : "right" };
        cell.border = { bottom: { style: "thin", color: { argb: LINE } } };
    });
}

function bodyRow(ws: WS, row: number, cols: number, zebra = false) {
    ws.getRow(row).height = 18;
    for (let c = 1; c <= cols; c++) {
        const cell = ws.getCell(row, c);
        cell.border = { bottom: { style: "thin", color: { argb: HAIRLINE } } };
        if (zebra) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TINT } };
        }
    }
}

export async function exportRoomAvailabilityExcel({
    availabilityStats,
    statusBreakdown = [],
    occupancyTrend = [],
    rooms = [],
    insights = [],
    periodLabel,
    organization = "E-Boarding House",
    addressLine = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
    preparedBy = "",
}: ExportRoomAvailabilityOptions) {
    const now = new Date();
    const period = periodLabel ?? monthYear(now);

    const COLS = 6;

    const wb = new ExcelJS.Workbook();
    wb.creator = organization;
    wb.lastModifiedBy = preparedBy || organization;
    wb.created = now;
    wb.modified = now;

    /* ============================================================== */
    /*  Sheet 1 — formatted report                                     */
    /* ============================================================== */

    const ws = wb.addWorksheet("Room Availability", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 8 }],
        pageSetup: {
            paperSize: 9,
            orientation: "landscape",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            horizontalCentered: true,
            margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
        },
        headerFooter: {
            oddFooter: `&L&8${organization} · Room Availability Report&R&8Page &P of &N`,
        },
    });

    ws.columns = [
        { width: 26 },
        { width: 16 },
        { width: 16 },
        { width: 16 },
        { width: 16 },
        { width: 16 },
    ];

    let r = 1;

    /* ---- Letterhead ---------------------------------------------- */
    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 30;
    const brand = ws.getCell(r, 1);
    brand.value = organization;
    brand.font = { name: DISPLAY, size: 15, bold: true, color: { argb: PAPER } };
    brand.alignment = { vertical: "middle", indent: 1 };
    for (let c = 1; c <= COLS; c++) {
        ws.getCell(r, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
    }
    r++;

    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 18;
    const addr = ws.getCell(r, 1);
    addr.value = addressLine;
    addr.font = { name: TEXT, size: 9, color: { argb: PAPER } };
    addr.alignment = { vertical: "middle", indent: 1 };
    for (let c = 1; c <= COLS; c++) {
        ws.getCell(r, c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
    }
    r += 2;

    /* ---- Title block --------------------------------------------- */
    ws.getRow(r).height = 30;
    const title = ws.getCell(r, 1);
    title.value = "Room Availability Report";
    title.font = { name: DISPLAY, size: 19, bold: true, color: { argb: INK } };
    title.alignment = { vertical: "middle" };

    ws.getCell(r, COLS - 1).value = "REPORTING PERIOD";
    ws.getCell(r, COLS - 1).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right", vertical: "middle" };
    ws.getCell(r, COLS).value = period;
    ws.getCell(r, COLS).font = { name: TEXT, size: 11, bold: true, color: { argb: INK } };
    ws.getCell(r, COLS).alignment = { horizontal: "right", vertical: "middle" };
    r++;

    const sub = ws.getCell(r, 1);
    sub.value = "Statement of availability · Rooms, status and rates";
    sub.font = { name: TEXT, size: 9, color: { argb: MUTED } };

    ws.getCell(r, COLS - 1).value = "REFERENCE NO.";
    ws.getCell(r, COLS - 1).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right" };
    ws.getCell(r, COLS).value = referenceNo(now);
    ws.getCell(r, COLS).font = { name: TEXT, size: 9, color: { argb: BODY } };
    ws.getCell(r, COLS).alignment = { horizontal: "right" };
    r++;

    ws.getCell(r, COLS - 1).value = "GENERATED";
    ws.getCell(r, COLS - 1).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right" };
    const stamp = ws.getCell(r, COLS);
    stamp.value = now;
    stamp.numFmt = DATE_STAMP;
    stamp.font = { name: TEXT, size: 9, color: { argb: BODY } };
    stamp.alignment = { horizontal: "right" };
    rule(ws, r, COLS, INK, "medium");
    r += 2;

    /* ---- 01 Availability summary ----------------------------------- */
    sectionHeading(ws, r, "01", "Availability summary", COLS);
    r++;

    tableHead(ws, r, ["Metric", "Value", null, null, null, null]);
    r++;

    const kpis = availabilityStats
        ? [
            { label: "Total rooms", value: availabilityStats.totalRooms, fmt: COUNT },
            { label: "Available", value: availabilityStats.availableRooms, fmt: COUNT },
            { label: "Occupied", value: availabilityStats.occupiedRooms, fmt: COUNT },
            { label: "Under maintenance", value: availabilityStats.maintenanceRooms, fmt: COUNT },
            { label: "Total capacity", value: availabilityStats.totalCapacity, fmt: COUNT },
        ]
        : [];

    kpis.forEach((k, i) => {
        bodyRow(ws, r, 2, i % 2 === 0);

        const label = ws.getCell(r, 1);
        label.value = k.label;
        label.font = { name: TEXT, size: 10, color: { argb: BODY } };

        const value = ws.getCell(r, 2);
        value.value = k.value;
        value.numFmt = k.fmt;
        value.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        value.alignment = { horizontal: "right" };
        r++;
    });
    r++;

    /* ---- 02 Status distribution ------------------------------------ */
    if (statusBreakdown.length > 0) {
        sectionHeading(ws, r, "02", "Status distribution", COLS);
        r++;

        tableHead(ws, r, ["Status", "Rooms", "Share", null, null, null]);
        r++;

        const statusFirst = r;

        statusBreakdown.forEach((s) => {
            bodyRow(ws, r, 3);

            const name = ws.getCell(r, 1);
            name.value = s.name;
            name.font = { name: TEXT, size: 10, bold: true, color: { argb: STATUS_INK[s.name] ?? BODY } };

            const count = ws.getCell(r, 2);
            count.value = s.value;
            count.numFmt = COUNT;
            count.font = { name: TEXT, size: 10, color: { argb: INK } };
            count.alignment = { horizontal: "right" };

            const share = ws.getCell(r, 3);
            share.value = {
                formula: `IF(SUM($B$${statusFirst}:$B$${statusFirst + statusBreakdown.length - 1
                    })=0,0,B${r}/SUM($B$${statusFirst}:$B$${statusFirst + statusBreakdown.length - 1}))`,
            };
            share.numFmt = SHARE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };

            r++;
        });
        r++;
    }

    /* ---- 03 Availability trend --------------------------------------- */
    if (occupancyTrend.length > 0) {
        sectionHeading(ws, r, "03", "Availability trend", COLS);
        r++;

        tableHead(ws, r, ["Month", "New occupancy", "Share of range", null, null, null]);
        r++;

        const trendFirst = r;

        occupancyTrend.forEach((t) => {
            bodyRow(ws, r, 3);

            ws.getCell(r, 1).value = t.month;
            ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

            const amt = ws.getCell(r, 2);
            amt.value = t.occupied;
            amt.numFmt = COUNT;
            amt.font = { name: TEXT, size: 10, color: { argb: INK } };
            amt.alignment = { horizontal: "right" };

            const share = ws.getCell(r, 3);
            share.value = {
                formula: `IF(SUM($B$${trendFirst}:$B$${trendFirst + occupancyTrend.length - 1
                    })=0,0,B${r}/SUM($B$${trendFirst}:$B$${trendFirst + occupancyTrend.length - 1}))`,
            };
            share.numFmt = SHARE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };

            r++;
        });
        r++;
    }

    /* ---- 04 Room availability detail ---------------------------------- */
    sectionHeading(ws, r, "04", "Room availability detail", COLS);
    r++;

    tableHead(ws, r, ["Room", "Capacity", "Occupied", "Available", "Status", "Monthly rate"]);
    r++;

    const roomFirst = r;

    rooms.forEach((room) => {
        bodyRow(ws, r, COLS);

        const num = ws.getCell(r, 1);
        num.value = room.number;
        num.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

        [room.capacity, room.occupied, room.available].forEach((v, idx) => {
            const cell = ws.getCell(r, idx + 2);
            cell.value = v;
            cell.numFmt = COUNT;
            cell.font = { name: TEXT, size: 10, color: { argb: idx === 2 ? MUTED : BODY } };
            cell.alignment = { horizontal: "right" };
        });

        const status = ws.getCell(r, 5);
        status.value = room.status;
        status.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[room.status] ?? BODY },
        };
        status.alignment = { horizontal: "right" };

        const rate = ws.getCell(r, 6);
        rate.value = room.rate;
        rate.numFmt = MONEY;
        rate.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        rate.alignment = { horizontal: "right" };

        r++;
    });

    if (rooms.length > 0) {
        ws.getRow(r).height = 22;
        ws.getCell(r, 1).value = "Totals";

        [2, 3, 4].forEach((c) => {
            const col = String.fromCharCode(64 + c);
            const cell = ws.getCell(r, c);
            cell.value = { formula: `SUM(${col}${roomFirst}:${col}${r - 1})` };
            cell.numFmt = COUNT;
        });

        for (let c = 1; c <= COLS; c++) {
            const cell = ws.getCell(r, c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
            cell.font = { name: TEXT, size: 10, bold: true, color: { argb: PAPER } };
            cell.alignment = {
                horizontal: c === 1 ? "left" : "right",
                vertical: "middle",
                indent: c === 1 ? 1 : 0,
            };
        }
        r += 2;
    }

    /* ---- 05 Insights --------------------------------------------- */
    if (insights.length > 0) {
        sectionHeading(ws, r, "05", "Availability insights", COLS);
        r++;

        insights.forEach((item) => {
            ws.mergeCells(r, 1, r, COLS);
            ws.getRow(r).height = 20;
            const cell = ws.getCell(r, 1);
            cell.value = `—  ${item}`;
            cell.font = { name: TEXT, size: 10, color: { argb: BODY } };
            cell.alignment = { vertical: "middle", wrapText: true, indent: 1 };
            cell.border = { left: { style: "thick", color: { argb: INK } } };
            r++;
        });
        r++;
    }

    /* ---- Closing note & signatures ------------------------------- */
    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 28;
    const note = ws.getCell(r, 1);
    note.value =
        "This report reflects room availability and rates recorded in the system as of the generation date. Figures may change as bookings and maintenance updates are posted.";
    note.font = { name: TEXT, size: 8, italic: true, color: { argb: MUTED } };
    note.alignment = { wrapText: true, vertical: "top" };
    r += 2;

    ws.getCell(r, 1).value = "Prepared by";
    ws.getCell(r, 1).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 3).value = "Date";
    ws.getCell(r, 3).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    r++;

    ws.getCell(r, 1).value = preparedBy || "";
    ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: INK } };
    ws.getCell(r, 1).border = { bottom: { style: "thin", color: { argb: INK } } };
    ws.getCell(r, 2).border = { bottom: { style: "thin", color: { argb: INK } } };

    const signDate = ws.getCell(r, 3);
    signDate.value = now;
    signDate.numFmt = DATE_LONG;
    signDate.font = { name: TEXT, size: 10, color: { argb: INK } };
    signDate.border = { bottom: { style: "thin", color: { argb: INK } } };

    ws.pageSetup.printArea = `A1:F${r}`;

    /* ============================================================== */
    /*  Sheet 2 — Rooms (raw, filterable)                              */
    /* ============================================================== */

    const roomsSheet = wb.addWorksheet("Rooms", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    roomsSheet.columns = [
        { header: "Room", key: "number", width: 14 },
        { header: "Capacity", key: "capacity", width: 12 },
        { header: "Occupied", key: "occupied", width: 12 },
        { header: "Available", key: "available", width: 12 },
        { header: "Status", key: "status", width: 16 },
        { header: "Monthly rate", key: "rate", width: 16 },
    ];

    rooms.forEach((room) =>
        roomsSheet.addRow({
            number: room.number,
            capacity: room.capacity,
            occupied: room.occupied,
            available: room.available,
            status: room.status,
            rate: room.rate,
        })
    );

    const head = roomsSheet.getRow(1);
    head.height = 20;
    head.eachCell((cell) => {
        cell.font = { name: TEXT, size: 9, bold: true, color: { argb: PAPER } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    });

    roomsSheet.eachRow((row, i) => {
        if (i === 1) return;
        row.height = 16;
        row.eachCell((cell) => {
            cell.font = { name: TEXT, size: 10, color: { argb: BODY } };
            cell.border = { bottom: { style: "thin", color: { argb: HAIRLINE } } };
        });
    });

    if (roomsSheet.rowCount > 1) {
        roomsSheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: roomsSheet.rowCount, column: roomsSheet.columnCount },
        };
    }

    roomsSheet.getColumn("capacity").numFmt = COUNT;
    roomsSheet.getColumn("occupied").numFmt = COUNT;
    roomsSheet.getColumn("available").numFmt = COUNT;
    roomsSheet.getColumn("rate").numFmt = MONEY;

    /* ============================================================== */

    const buffer = await wb.xlsx.writeBuffer();
    const fileName = `Room-Availability-Report-${period.replace(/\s+/g, "-")}.xlsx`;

    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
}
