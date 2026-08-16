import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ExcelCollectionStats {
    totalCollections: number;
    totalCollectionsChange: number;
    totalTransactions: number;
    totalTransactionsChange: number;
    paidBoarders: number;
    paidBoardersChange: number;
    collectionRate: number;
    averageCollection: number;
}

export interface ExcelTrendPoint {
    month: string;
    amount: number;
}

export interface ExcelTransactionRow {
    date: string;
    boarder: string;
    amount: number;
    status?: string;
}

export interface ExcelBoarderRow {
    name: string;
    room: string | number | null;
    due: string;
    total: number;
    paid: number;
    balance: number;
    status?: string;
    paidDate?: string;
}

export interface ExportPaymentCollectionOptions {
    collectionDashboardStats?: ExcelCollectionStats | null;
    collectionTrend?: ExcelTrendPoint[];
    recentTransactions?: ExcelTransactionRow[];
    boarderBillingStatus?: ExcelBoarderRow[];
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
const BAD = "FFBE123C";
const WARN = "FFB45309";

const DISPLAY = "Georgia";
const TEXT = "Calibri";

const MONEY = '"₱"#,##0.00';
const COUNT = "#,##0";
const SHARE = "0.0%";
const RATE = '0.0"%"';
const DELTA = '+0.00"%";-0.00"%";0.00"%"';
const DATE_ONLY = "dd mmm yyyy";
const DATE_LONG = "dd mmmm yyyy";
const DATE_STAMP = "dd mmm yyyy  h:mm AM/PM";

const STATUS_INK: Record<string, string> = {
    Paid: GOOD,
    Partial: WARN,
    Unpaid: MUTED,
    Overdue: BAD,
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
    return `COL-${y}${m}-${seq}`;
}

/** Turns an API date string into a real Date so Excel can sort and filter it. */
function asDate(value: unknown): Date | string {
    if (value instanceof Date) return value;
    if (typeof value !== "string" || !value.trim()) return "";
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? value : parsed;
}

function rule(
    ws: WS,
    row: number,
    cols: number,
    color = LINE,
    weight: "thin" | "medium" = "thin"
) {
    for (let c = 1; c <= cols; c++) {
        ws.getCell(row, c).border = {
            ...ws.getCell(row, c).border,
            bottom: { style: weight, color: { argb: color } },
        };
    }
}

function sectionHeading(
    ws: WS,
    row: number,
    index: string,
    label: string,
    cols: number
) {
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



export async function exportPaymentCollectionExcel({
    collectionDashboardStats,
    collectionTrend = [],
    recentTransactions = [],
    boarderBillingStatus = [],
    periodLabel,
    organization = "E-Boarding House Management",
    addressLine = "Guihulngan City, Negros Oriental, Philippines",
    preparedBy = "",
}: ExportPaymentCollectionOptions) {
    const now = new Date();
    const period = periodLabel ?? monthYear(now);

    const COLS = 8;

    const wb = new ExcelJS.Workbook();
    wb.creator = organization;
    wb.lastModifiedBy = preparedBy || organization;
    wb.created = now;
    wb.modified = now;

    /* ============================================================== */
    /*  Sheet 1 — formatted report                                     */
    /* ============================================================== */

    const ws = wb.addWorksheet("Collection Report", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 8 }],
        pageSetup: {
            paperSize: 9,
            orientation: "landscape",
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
            oddFooter: `&L&8${organization} · Payment Collection Report&R&8Page &P of &N`,
        },
    });

    ws.columns = [
        { width: 26 },
        { width: 12 },
        { width: 16 },
        { width: 16 },
        { width: 16 },
        { width: 16 },
        { width: 13 },
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
    title.value = "Payment Collection Report";
    title.font = { name: DISPLAY, size: 19, bold: true, color: { argb: INK } };
    title.alignment = { vertical: "middle" };

    ws.getCell(r, COLS - 1).value = "REPORTING PERIOD";
    ws.getCell(r, COLS - 1).font = {
        name: TEXT,
        size: 8,
        bold: true,
        color: { argb: FAINT },
    };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right", vertical: "middle" };
    ws.getCell(r, COLS).value = period;
    ws.getCell(r, COLS).font = {
        name: TEXT,
        size: 11,
        bold: true,
        color: { argb: INK },
    };
    ws.getCell(r, COLS).alignment = { horizontal: "right", vertical: "middle" };
    r++;

    const sub = ws.getCell(r, 1);
    sub.value = "Statement of collections · Transactions and boarder balances";
    sub.font = { name: TEXT, size: 9, color: { argb: MUTED } };

    ws.getCell(r, COLS - 1).value = "REFERENCE NO.";
    ws.getCell(r, COLS - 1).font = {
        name: TEXT,
        size: 8,
        bold: true,
        color: { argb: FAINT },
    };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right" };
    ws.getCell(r, COLS).value = referenceNo(now);
    ws.getCell(r, COLS).font = { name: TEXT, size: 9, color: { argb: BODY } };
    ws.getCell(r, COLS).alignment = { horizontal: "right" };
    r++;

    ws.getCell(r, COLS - 1).value = "GENERATED";
    ws.getCell(r, COLS - 1).font = {
        name: TEXT,
        size: 8,
        bold: true,
        color: { argb: FAINT },
    };
    ws.getCell(r, COLS - 1).alignment = { horizontal: "right" };
    const stamp = ws.getCell(r, COLS);
    stamp.value = now;
    stamp.numFmt = DATE_STAMP;
    stamp.font = { name: TEXT, size: 9, color: { argb: BODY } };
    stamp.alignment = { horizontal: "right" };
    rule(ws, r, COLS, INK, "medium");
    r += 2;

    /* ---- 01 Collection summary ----------------------------------- */
    sectionHeading(ws, r, "01", "Collection summary", COLS);
    r++;

    tableHead(ws, r, ["Metric", "Value", "Change", null, null, null, null, null]);
    r++;

    const kpis = collectionDashboardStats
        ? [
            {
                label: "Total collections",
                value: collectionDashboardStats.totalCollections,
                fmt: MONEY,
                delta: collectionDashboardStats.totalCollectionsChange,
            },
            {
                label: "Total transactions",
                value: collectionDashboardStats.totalTransactions,
                fmt: COUNT,
                delta: collectionDashboardStats.totalTransactionsChange,
            },
            {
                label: "Paid boarders",
                value: collectionDashboardStats.paidBoarders,
                fmt: COUNT,
                delta: collectionDashboardStats.paidBoardersChange,
            },
            {
                label: "Collection rate",
                value: collectionDashboardStats.collectionRate,
                fmt: RATE,
                delta: null,
            },
            {
                label: "Average collection",
                value: collectionDashboardStats.averageCollection,
                fmt: MONEY,
                delta: null,
            },
        ]
        : [];

    kpis.forEach((k, i) => {
        bodyRow(ws, r, 3, i % 2 === 0);

        const label = ws.getCell(r, 1);
        label.value = k.label;
        label.font = { name: TEXT, size: 10, color: { argb: BODY } };

        const value = ws.getCell(r, 2);
        value.value = k.value;
        value.numFmt = k.fmt;
        value.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        value.alignment = { horizontal: "right" };

        if (k.delta !== null && k.delta !== undefined) {
            const delta = ws.getCell(r, 3);
            delta.value = k.delta;
            delta.numFmt = DELTA;
            delta.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: { argb: k.delta >= 0 ? GOOD : BAD },
            };
            delta.alignment = { horizontal: "right" };
        }
        r++;
    });
    r++;

    /* ---- 02 Collection trend ------------------------------------- */
    if (collectionTrend.length > 0) {
        sectionHeading(ws, r, "02", "Collection trend", COLS);
        r++;

        tableHead(ws, r, [
            "Month",
            "Collections",
            "Share of period",
            null,
            null,
            null,
            null,
            null,
        ]);
        r++;

        const trendFirst = r;

        collectionTrend.forEach((t) => {
            bodyRow(ws, r, 3);

            ws.getCell(r, 1).value = t.month;
            ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

            const amt = ws.getCell(r, 2);
            amt.value = t.amount;
            amt.numFmt = MONEY;
            amt.font = { name: TEXT, size: 10, color: { argb: INK } };
            amt.alignment = { horizontal: "right" };

            const share = ws.getCell(r, 3);
            share.value = {
                formula: `IF(SUM($B$${trendFirst}:$B$${trendFirst + collectionTrend.length - 1
                    })=0,0,B${r}/SUM($B$${trendFirst}:$B$${trendFirst + collectionTrend.length - 1
                    }))`,
            };
            share.numFmt = SHARE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };

            r++;
        });
        r++;
    }

    /* ---- 03 Boarder collection status ---------------------------- */
    sectionHeading(ws, r, "03", "Boarder collection status", COLS);
    r++;

    tableHead(ws, r, [
        "Boarder",
        "Room",
        "Due date",
        "Total",
        "Paid",
        "Balance",
        "Status",
        "Paid on",
    ]);
    r++;

    const boarderFirst = r;

    boarderBillingStatus.forEach((b) => {
        bodyRow(ws, r, COLS);

        const name = ws.getCell(r, 1);
        name.value = b.name;
        name.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

        const room = ws.getCell(r, 2);
        room.value = b.room;
        room.font = { name: TEXT, size: 10, color: { argb: BODY } };
        room.alignment = { horizontal: "right" };

        const due = ws.getCell(r, 3);
        const dueParsed = asDate(b.due);
        due.value = dueParsed;
        if (dueParsed instanceof Date) due.numFmt = DATE_ONLY;
        due.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        due.alignment = { horizontal: "right" };

        const total = ws.getCell(r, 4);
        total.value = b.total;
        total.numFmt = MONEY;
        total.font = { name: TEXT, size: 10, color: { argb: INK } };
        total.alignment = { horizontal: "right" };

        const paid = ws.getCell(r, 5);
        paid.value = b.paid;
        paid.numFmt = MONEY;
        paid.font = { name: TEXT, size: 10, color: { argb: GOOD } };
        paid.alignment = { horizontal: "right" };

        const balance = ws.getCell(r, 6);
        balance.value = { formula: `D${r}-E${r}`, result: b.balance };
        balance.numFmt = MONEY;
        balance.font = {
            name: TEXT,
            size: 10,
            bold: b.balance > 0,
            color: { argb: b.balance > 0 ? BAD : FAINT },
        };
        balance.alignment = { horizontal: "right" };

        const status = ws.getCell(r, 7);
        status.value = b.status ?? "";
        status.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[b.status ?? ""] ?? BODY },
        };
        status.alignment = { horizontal: "right" };

        const paidOn = ws.getCell(r, 8);
        const paidParsed = asDate(b.paidDate);
        paidOn.value = paidParsed || "—";
        if (paidParsed instanceof Date) paidOn.numFmt = DATE_ONLY;
        paidOn.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        paidOn.alignment = { horizontal: "right" };

        r++;
    });

    if (boarderBillingStatus.length > 0) {
        ws.getRow(r).height = 22;

        ws.getCell(r, 1).value = "Totals";

        [4, 5, 6].forEach((c) => {
            const col = String.fromCharCode(64 + c);
            const cell = ws.getCell(r, c);
            cell.value = { formula: `SUM(${col}${boarderFirst}:${col}${r - 1})` };
            cell.numFmt = MONEY;
        });

        for (let c = 1; c <= COLS; c++) {
            const cell = ws.getCell(r, c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
            cell.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: {
                    argb: c === 5 ? "FF34D399" : c === 6 ? "FFFB7185" : PAPER,
                },
            };
            cell.alignment = {
                horizontal: c === 1 ? "left" : "right",
                vertical: "middle",
                indent: c === 1 ? 1 : 0,
            };
        }
        r += 2;
    }

    /* ---- 04 Recent transactions ---------------------------------- */
    if (recentTransactions.length > 0) {
        sectionHeading(ws, r, "04", "Recent collection transactions", COLS);
        r++;

        tableHead(ws, r, [
            "Date",
            "Boarder",
            "Amount",
            "Status",
            null,
            null,
            null,
            null,
        ]);
        r++;

        recentTransactions.forEach((t) => {
            bodyRow(ws, r, 4);

            const date = ws.getCell(r, 1);
            const parsed = asDate(t.date);
            date.value = parsed;
            if (parsed instanceof Date) date.numFmt = DATE_ONLY;
            date.font = { name: TEXT, size: 10, color: { argb: MUTED } };

            const boarder = ws.getCell(r, 2);
            boarder.value = t.boarder;
            boarder.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
            boarder.alignment = { horizontal: "right" };

            const amount = ws.getCell(r, 3);
            amount.value = t.amount;
            amount.numFmt = MONEY;
            amount.font = { name: TEXT, size: 10, color: { argb: INK } };
            amount.alignment = { horizontal: "right" };

            const status = ws.getCell(r, 4);
            status.value = t.status ?? "";
            status.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: { argb: STATUS_INK[t.status ?? ""] ?? BODY },
            };
            status.alignment = { horizontal: "right" };

            r++;
        });
        r++;
    }

    /* ---- Closing note & signatures ------------------------------- */
    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 28;
    const note = ws.getCell(r, 1);
    note.value =
        "Generated from payment records on file for the period stated above. Balances reflect collections posted as of the generation date and may change once pending payments are recorded.";
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

    ws.pageSetup.printArea = `A1:H${r}`;

    /* ============================================================== */
    /*  Sheet 2 — Boarders (raw, filterable)                           */
    /* ============================================================== */

    const boardersSheet = wb.addWorksheet("Boarders", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    boardersSheet.columns = [
        { header: "Boarder", key: "name", width: 26 },
        { header: "Room", key: "room", width: 12 },
        { header: "Due date", key: "due", width: 16 },
        { header: "Total", key: "total", width: 15 },
        { header: "Paid", key: "paid", width: 15 },
        { header: "Balance", key: "balance", width: 15 },
        { header: "Collected %", key: "rate", width: 13 },
        { header: "Status", key: "status", width: 13 },
        { header: "Paid on", key: "paidDate", width: 16 },
    ];

    boarderBillingStatus.forEach((b) =>
        boardersSheet.addRow({
            name: b.name,
            room: b.room,
            due: asDate(b.due),
            total: b.total,
            paid: b.paid,
            balance: b.balance,
            rate: b.total > 0 ? b.paid / b.total : 0,
            status: b.status ?? "",
            paidDate: asDate(b.paidDate),
        })
    );

    /* ============================================================== */
    /*  Sheet 3 — Transactions (raw, filterable)                       */
    /* ============================================================== */

    const txSheet = wb.addWorksheet("Transactions", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    txSheet.columns = [
        { header: "Date", key: "date", width: 16 },
        { header: "Boarder", key: "boarder", width: 28 },
        { header: "Amount", key: "amount", width: 16 },
        { header: "Status", key: "status", width: 14 },
    ];

    recentTransactions.forEach((t) =>
        txSheet.addRow({
            date: asDate(t.date),
            boarder: t.boarder,
            amount: t.amount,
            status: t.status ?? "",
        })
    );

    /* ---- Shared styling for both raw sheets ---------------------- */
    [boardersSheet, txSheet].forEach((sheet) => {
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

    boardersSheet.getColumn("due").numFmt = DATE_ONLY;
    boardersSheet.getColumn("paidDate").numFmt = DATE_ONLY;
    boardersSheet.getColumn("total").numFmt = MONEY;
    boardersSheet.getColumn("paid").numFmt = MONEY;
    boardersSheet.getColumn("balance").numFmt = MONEY;
    boardersSheet.getColumn("rate").numFmt = SHARE;

    txSheet.getColumn("date").numFmt = DATE_ONLY;
    txSheet.getColumn("amount").numFmt = MONEY;

    /* ============================================================== */

    const buffer = await wb.xlsx.writeBuffer();
    const fileName = `Payment-Collection-Report-${period.replace(/\s+/g, "-")}.xlsx`;

    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
}