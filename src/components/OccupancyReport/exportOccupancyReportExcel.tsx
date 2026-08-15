import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



export interface ExcelOccupancyStats {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyRate: string;
}

export interface ExcelStatusSlice {
    name: string;
    value: number;
    color?: string;
}

export interface ExcelRoomRow {
    number: string | number;
    capacity: number;
    occupied: number;
    available: number;
    status: string;
    date: string;
}

export interface ExcelActivityRow {
    date: string;
    boarder: string;
    room: string | number;
    bed: string | number;
    action: string;
    by: string;
}

export interface ExportOccupancyReportOptions {
    roomReportStats?: ExcelOccupancyStats | null;
    roomStatusReport?: ExcelStatusSlice[];
    roomReport?: ExcelRoomRow[];
    recentActivities?: ExcelActivityRow[];
    insights?: string[];
    periodLabel?: string;
    organization?: string;
    addressLine?: string;
    preparedBy?: string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const INK = "FF0F172A";
const BODY = "FF334155";
const MUTED = "FF64748B";
const FAINT = "FF94A3B8";
const LINE = "FFE2E8F0";
const HAIRLINE = "FFF1F5F9";
const TINT = "FFF8FAFC";
const PAPER = "FFFFFFFF";

const GOOD = "FF047857";
const BAD = "FFBE123C";
const INFO = "FF1D4ED8";

const DISPLAY = "Georgia";
const TEXT = "Calibri";

const COUNT = "#,##0";
const SHARE = "0.0%";
const RATE = '0.0"%"';
const DATE_ONLY = "dd mmm yyyy";
const DATE_LONG = "dd mmmm yyyy";
const DATE_STAMP = "dd mmm yyyy  h:mm AM/PM";

const STATUS_INK: Record<string, string> = {
    Full: BAD,
    Occupied: INFO,
    Available: GOOD,
    Vacant: MUTED,
};

const ACTION_INK: Record<string, string> = {
    "Active": GOOD,
    "Checked-Out": BAD,
    "Transferred": INFO,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type WS = ExcelJS.Worksheet;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `OCC-${y}${m}-${seq}`;
}

/** Turns an API date string into a real Date so Excel can sort and filter it. */
function asDate(value: unknown): Date | string {
    if (value instanceof Date) return value;
    if (typeof value !== "string" || !value.trim()) return "";
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? value : parsed;
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
        cell.alignment = {
            vertical: "middle",
            horizontal: i === 0 ? "left" : "right",
        };
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

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export async function exportOccupancyReportExcel({
    roomReportStats,
    roomStatusReport = [],
    roomReport = [],
    recentActivities = [],
    insights = [],
    periodLabel,
    organization = "E-Boarding House Management",
    addressLine = "Guihulngan City, Negros Oriental, Philippines",
    preparedBy = "",
}: ExportOccupancyReportOptions) {
    const now = new Date();
    const period = periodLabel ?? monthYear(now);

    const COLS = 7;

    const wb = new ExcelJS.Workbook();
    wb.creator = organization;
    wb.lastModifiedBy = preparedBy || organization;
    wb.created = now;
    wb.modified = now;

    /* ============================================================== */
    /*  Sheet 1 — formatted report                                     */
    /* ============================================================== */

    const ws = wb.addWorksheet("Occupancy Report", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 8 }],
        pageSetup: {
            paperSize: 9,
            orientation: "portrait",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            horizontalCentered: true,
            margins: {
                left: 0.5,
                right: 0.5,
                top: 0.6,
                bottom: 0.6,
                header: 0.3,
                footer: 0.3,
            },
        },
        headerFooter: {
            oddFooter: `&L&8${organization} · Occupancy Report&R&8Page &P of &N`,
        },
    });

    ws.columns = [
        { width: 26 },
        { width: 14 },
        { width: 14 },
        { width: 14 },
        { width: 14 },
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
        ws.getCell(r, c).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: INK },
        };
    }
    r++;

    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 18;
    const addr = ws.getCell(r, 1);
    addr.value = addressLine;
    addr.font = { name: TEXT, size: 9, color: { argb: PAPER } };
    addr.alignment = { vertical: "middle", indent: 1 };
    for (let c = 1; c <= COLS; c++) {
        ws.getCell(r, c).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: INK },
        };
    }
    r += 2;

    /* ---- Title block --------------------------------------------- */
    ws.getRow(r).height = 30;
    const title = ws.getCell(r, 1);
    title.value = "Occupancy Report";
    title.font = { name: DISPLAY, size: 20, bold: true, color: { argb: INK } };
    title.alignment = { vertical: "middle" };

    ws.getCell(r, 6).value = "REPORTING PERIOD";
    ws.getCell(r, 6).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 6).alignment = { horizontal: "right", vertical: "middle" };
    ws.getCell(r, 7).value = period;
    ws.getCell(r, 7).font = { name: TEXT, size: 11, bold: true, color: { argb: INK } };
    ws.getCell(r, 7).alignment = { horizontal: "right", vertical: "middle" };
    r++;

    const sub = ws.getCell(r, 1);
    sub.value = "Statement of utilization · Rooms, beds and occupancy movement";
    sub.font = { name: TEXT, size: 9, color: { argb: MUTED } };

    ws.getCell(r, 6).value = "REFERENCE NO.";
    ws.getCell(r, 6).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 6).alignment = { horizontal: "right" };
    ws.getCell(r, 7).value = referenceNo(now);
    ws.getCell(r, 7).font = { name: TEXT, size: 9, color: { argb: BODY } };
    ws.getCell(r, 7).alignment = { horizontal: "right" };
    r++;

    ws.getCell(r, 6).value = "GENERATED";
    ws.getCell(r, 6).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 6).alignment = { horizontal: "right" };
    const stamp = ws.getCell(r, 7);
    stamp.value = now;
    stamp.numFmt = DATE_STAMP;
    stamp.font = { name: TEXT, size: 9, color: { argb: BODY } };
    stamp.alignment = { horizontal: "right" };
    rule(ws, r, COLS, INK, "medium");
    r += 2;

    /* ---- 01 Occupancy summary ------------------------------------ */
    sectionHeading(ws, r, "01", "Occupancy summary", COLS);
    r++;

    tableHead(ws, r, ["Metric", "Value", null, null, null, null, null]);
    r++;

    const kpis = roomReportStats
        ? [
            { label: "Total rooms", value: roomReportStats.totalRooms, fmt: COUNT },
            { label: "Occupied rooms", value: roomReportStats.occupiedRooms, fmt: COUNT },
            { label: "Available rooms", value: roomReportStats.availableRooms, fmt: COUNT },
            { label: "Occupancy rate", value: roomReportStats.occupancyRate, fmt: RATE },
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

    const totalBeds = roomReport.reduce((s, x) => s + (x.capacity || 0), 0);
    const bedsTaken = roomReport.reduce((s, x) => s + (x.occupied || 0), 0);

    ws.mergeCells(r, 1, r, COLS);
    const bedNote = ws.getCell(r, 1);
    bedNote.value = `Bed utilization: ${bedsTaken} of ${totalBeds} beds occupied${totalBeds > 0 ? ` (${((bedsTaken / totalBeds) * 100).toFixed(1)}%)` : ""
        }.`;
    bedNote.font = { name: TEXT, size: 9, italic: true, color: { argb: MUTED } };
    r += 2;

    /* ---- 02 Status distribution ---------------------------------- */
    sectionHeading(ws, r, "02", "Room status distribution", COLS);
    r++;

    tableHead(ws, r, ["Status", "Rooms", "Share", null, null, null, null]);
    r++;

    const statusFirst = r;
    const statusTotal = roomStatusReport.reduce((s, d) => s + d.value, 0) || 1;

    roomStatusReport.forEach((s) => {
        bodyRow(ws, r, 3);

        const name = ws.getCell(r, 1);
        name.value = s.name;
        name.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[s.name] ?? BODY },
        };

        const count = ws.getCell(r, 2);
        count.value = s.value;
        count.numFmt = COUNT;
        count.font = { name: TEXT, size: 10, color: { argb: INK } };
        count.alignment = { horizontal: "right" };

        const share = ws.getCell(r, 3);
        share.value = { formula: `B${r}/B${statusFirst + roomStatusReport.length}` };
        share.numFmt = SHARE;
        share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        share.alignment = { horizontal: "right" };
        r++;
    });

    ws.getRow(r).height = 20;
    ws.getCell(r, 1).value = "Total rooms";
    ws.getCell(r, 1).font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

    const statusSum = ws.getCell(r, 2);
    statusSum.value = {
        formula: `SUM(B${statusFirst}:B${r - 1})`,
        result: statusTotal,
    };
    statusSum.numFmt = COUNT;
    statusSum.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
    statusSum.alignment = { horizontal: "right" };

    ws.getCell(r, 3).value = 1;
    ws.getCell(r, 3).numFmt = SHARE;
    ws.getCell(r, 3).font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
    ws.getCell(r, 3).alignment = { horizontal: "right" };

    for (let c = 1; c <= 3; c++) {
        ws.getCell(r, c).border = {
            top: { style: "thin", color: { argb: LINE } },
            bottom: { style: "double", color: { argb: INK } },
        };
    }
    r += 2;

    /* ---- 03 Room availability ------------------------------------ */
    sectionHeading(ws, r, "03", "Room availability detail", COLS);
    r++;

    tableHead(ws, r, [
        "Room",
        "Capacity",
        "Occupied",
        "Available",
        "Utilization",
        "Status",
        "Recorded",
    ]);
    r++;

    const roomFirst = r;

    roomReport.forEach((room) => {
        bodyRow(ws, r, COLS);

        const num = ws.getCell(r, 1);
        num.value = room.number;
        num.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

        [room.capacity, room.occupied, room.available].forEach((v, idx) => {
            const cell = ws.getCell(r, idx + 2);
            cell.value = v;
            cell.numFmt = COUNT;
            cell.font = {
                name: TEXT,
                size: 10,
                color: { argb: idx === 2 ? MUTED : BODY },
            };
            cell.alignment = { horizontal: "right" };
        });

        const use = ws.getCell(r, 5);
        use.value = { formula: `IF(B${r}=0,0,C${r}/B${r})` };
        use.numFmt = SHARE;
        use.font = {
            name: TEXT,
            size: 10,
            bold: room.capacity > 0 && room.occupied >= room.capacity,
            color: {
                argb:
                    room.capacity > 0 && room.occupied >= room.capacity ? BAD : MUTED,
            },
        };
        use.alignment = { horizontal: "right" };

        const status = ws.getCell(r, 6);
        status.value = room.status;
        status.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[room.status] ?? BODY },
        };
        status.alignment = { horizontal: "right" };

        const date = ws.getCell(r, 7);
        const parsed = asDate(room.date);
        date.value = parsed;
        if (parsed instanceof Date) date.numFmt = DATE_ONLY;
        date.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        date.alignment = { horizontal: "right" };

        r++;
    });

    if (roomReport.length > 0) {
        ws.getRow(r).height = 20;
        ws.getCell(r, 1).value = "Totals";
        ws.getCell(r, 1).font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

        [2, 3, 4].forEach((c) => {
            const cell = ws.getCell(r, c);
            const col = String.fromCharCode(64 + c);
            cell.value = { formula: `SUM(${col}${roomFirst}:${col}${r - 1})` };
            cell.numFmt = COUNT;
            cell.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
            cell.alignment = { horizontal: "right" };
        });

        const totalUse = ws.getCell(r, 5);
        totalUse.value = { formula: `IF(B${r}=0,0,C${r}/B${r})` };
        totalUse.numFmt = SHARE;
        totalUse.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        totalUse.alignment = { horizontal: "right" };

        for (let c = 1; c <= COLS; c++) {
            ws.getCell(r, c).border = {
                top: { style: "thin", color: { argb: LINE } },
                bottom: { style: "double", color: { argb: INK } },
            };
        }
        r += 2;
    }

    /* ---- 04 Recent activity -------------------------------------- */
    if (recentActivities.length > 0) {
        sectionHeading(ws, r, "04", "Recent occupancy activity", COLS);
        r++;

        tableHead(ws, r, [
            "Date",
            "Boarder",
            "Room",
            "Bed",
            "Action",
            "Recorded by",
            null,
        ]);
        r++;

        recentActivities.forEach((a) => {
            bodyRow(ws, r, 6);

            const date = ws.getCell(r, 1);
            const parsed = asDate(a.date);
            date.value = parsed;
            if (parsed instanceof Date) date.numFmt = DATE_ONLY;
            date.font = { name: TEXT, size: 10, color: { argb: MUTED } };

            const boarder = ws.getCell(r, 2);
            boarder.value = a.boarder;
            boarder.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
            boarder.alignment = { horizontal: "right" };

            const room = ws.getCell(r, 3);
            room.value = a.room;
            room.font = { name: TEXT, size: 10, color: { argb: BODY } };
            room.alignment = { horizontal: "right" };

            const bed = ws.getCell(r, 4);
            bed.value = a.bed;
            bed.font = { name: TEXT, size: 10, color: { argb: BODY } };
            bed.alignment = { horizontal: "right" };

            const action = ws.getCell(r, 5);
            action.value = a.action;
            action.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: { argb: ACTION_INK[a.action] ?? BODY },
            };
            action.alignment = { horizontal: "right" };

            const by = ws.getCell(r, 6);
            by.value = a.by;
            by.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            by.alignment = { horizontal: "right" };

            r++;
        });
        r++;
    }

    /* ---- 05 Insights --------------------------------------------- */
    if (insights.length > 0) {
        sectionHeading(ws, r, "05", "Occupancy insights", COLS);
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
        "This report reflects room and bed assignments recorded in the system as of the generation date. Figures may change as check-ins, check-outs and transfers are posted.";
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

    ws.pageSetup.printArea = `A1:G${r}`;

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
        { header: "Utilization", key: "use", width: 13 },
        { header: "Status", key: "status", width: 16 },
        { header: "Recorded", key: "date", width: 18 },
    ];

    roomReport.forEach((room) =>
        roomsSheet.addRow({
            number: room.number,
            capacity: room.capacity,
            occupied: room.occupied,
            available: room.available,
            use: room.capacity > 0 ? room.occupied / room.capacity : 0,
            status: room.status,
            date: asDate(room.date),
        })
    );

    /* ============================================================== */
    /*  Sheet 3 — Activity (raw, filterable)                           */
    /* ============================================================== */

    const activitySheet = wb.addWorksheet("Activity", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    activitySheet.columns = [
        { header: "Date", key: "date", width: 18 },
        { header: "Boarder", key: "boarder", width: 28 },
        { header: "Room", key: "room", width: 12 },
        { header: "Bed", key: "bed", width: 10 },
        { header: "Action", key: "action", width: 16 },
        { header: "Recorded by", key: "by", width: 22 },
    ];

    recentActivities.forEach((a) =>
        activitySheet.addRow({
            date: asDate(a.date),
            boarder: a.boarder,
            room: a.room,
            bed: a.bed,
            action: a.action,
            by: a.by,
        })
    );

    /* ---- Shared styling for both raw sheets ---------------------- */
    [roomsSheet, activitySheet].forEach((sheet) => {
        const head = sheet.getRow(1);
        head.height = 20;
        head.eachCell((cell) => {
            cell.font = { name: TEXT, size: 9, bold: true, color: { argb: PAPER } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
            cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
        });

        sheet.eachRow((row, i) => {
            if (i === 1) return;
            row.height = 16;
            row.eachCell((cell) => {
                cell.font = { name: TEXT, size: 10, color: { argb: BODY } };
                cell.border = { bottom: { style: "thin", color: { argb: HAIRLINE } } };
            });
        });

        if (sheet.rowCount > 1) {
            sheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: sheet.rowCount, column: sheet.columnCount },
            };
        }
    });

    /* Column-specific formats on the raw sheets */
    roomsSheet.getColumn("capacity").numFmt = COUNT;
    roomsSheet.getColumn("occupied").numFmt = COUNT;
    roomsSheet.getColumn("available").numFmt = COUNT;
    roomsSheet.getColumn("use").numFmt = SHARE;
    roomsSheet.getColumn("date").numFmt = DATE_ONLY;
    activitySheet.getColumn("date").numFmt = DATE_ONLY;

    /* ============================================================== */

    const buffer = await wb.xlsx.writeBuffer();
    const fileName = `Occupancy-Report-${period.replace(/\s+/g, "-")}.xlsx`;

    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
}