import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



export interface ExcelBoarderStats {
    totalBoarders: number;
    maleBoarders: number;
    malePercentage: number;
    femaleBoarders: number;
    femalePercentage: number;
    activeBoarders: number;
    activePercentage: number;
}

export interface ExcelBoarderSummary {
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

export interface ExcelOverTimePoint {
    month: string;
    total: number;
}

export interface ExcelBoarderRow {
    user_id_no: string | number;
    name: string;
    gender?: string;
    account_status?: string;
    contact_number?: string;
    email?: string;
}

export interface ExportBoarderReportOptions {
    boarderStats?: ExcelBoarderStats | null;
    boarderSummary?: ExcelBoarderSummary | null;
    boardersOverTime?: ExcelOverTimePoint[];
    boardersList?: ExcelBoarderRow[];
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
const WARN = "FFB45309";

const DISPLAY = "Georgia";
const TEXT = "Calibri";

const COUNT = "#,##0";
const SHARE = "0.0%";
const RATE = '0.0"%"';
const DELTA = '+0.00"%";-0.00"%";0.00"%"';
const DATE_LONG = "dd mmmm yyyy";
const DATE_STAMP = "dd mmm yyyy  h:mm AM/PM";

const STATUS_INK: Record<string, string> = {
    Active: GOOD,
    Deactivate: WARN,
    "Checked-out": BAD,
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
    return `BRD-${y}${m}-${seq}`;
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

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export async function exportBoarderReportExcel({
    boarderStats,
    boarderSummary,
    boardersOverTime = [],
    boardersList = [],
    periodLabel,
    organization = "E-Boarding House",
    addressLine = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
    preparedBy = "",
}: ExportBoarderReportOptions) {
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

    const ws = wb.addWorksheet("Boarder Report", {
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
            oddFooter: `&L&8${organization} · Boarder Report · Confidential&R&8Page &P of &N`,
        },
    });

    ws.columns = [
        { width: 28 },
        { width: 16 },
        { width: 16 },
        { width: 18 },
        { width: 20 },
        { width: 28 },
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
    title.value = "Boarder Report";
    title.font = { name: DISPLAY, size: 20, bold: true, color: { argb: INK } };
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
    sub.value = "Register of residents · Status, gender and contact directory";
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

    /* ---- 01 Boarder summary -------------------------------------- */
    sectionHeading(ws, r, "01", "Boarder summary", COLS);
    r++;

    tableHead(ws, r, ["Metric", "Value", "Share", null, null, null]);
    r++;

    const kpis = boarderStats
        ? [
            {
                label: "Total boarders",
                value: boarderStats.totalBoarders,
                fmt: COUNT,
                share: null as number | null,
            },
            {
                label: "Male boarders",
                value: boarderStats.maleBoarders,
                fmt: COUNT,
                share: boarderStats.malePercentage,
            },
            {
                label: "Female boarders",
                value: boarderStats.femaleBoarders,
                fmt: COUNT,
                share: boarderStats.femalePercentage,
            },
            {
                label: "Active boarders",
                value: boarderStats.activeBoarders,
                fmt: COUNT,
                share: boarderStats.activePercentage,
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

        if (k.share !== null) {
            const share = ws.getCell(r, 3);
            share.value = k.share;
            share.numFmt = RATE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };
        }
        r++;
    });

    if (boarderSummary) {
        r++;
        tableHead(ws, r, ["Movement this month", "Value", null, null, null, null]);
        r++;

        const movement = [
            { label: "New this month", value: boarderSummary.newThisMonth, fmt: COUNT },
            {
                label: "Checked out this month",
                value: boarderSummary.checkedOutThisMonth,
                fmt: COUNT,
            },
            {
                label: "Change vs last month",
                value: boarderSummary.percentageChange,
                fmt: DELTA,
            },
        ];

        movement.forEach((m, i) => {
            bodyRow(ws, r, 2, i % 2 === 0);

            ws.getCell(r, 1).value = m.label;
            ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

            const value = ws.getCell(r, 2);
            value.value = m.value;
            value.numFmt = m.fmt;
            value.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: {
                    argb:
                        m.fmt === DELTA ? (m.value >= 0 ? GOOD : BAD) : INK,
                },
            };
            value.alignment = { horizontal: "right" };
            r++;
        });
    }
    r++;

    /* ---- 02 Composition ------------------------------------------ */
    if (boarderSummary) {
        sectionHeading(ws, r, "02", "Status and gender composition", COLS);
        r++;

        tableHead(ws, r, ["Account status", "Boarders", "Share", null, null, null]);
        r++;

        const statusFirst = r;
        const statusRows = [
            { name: "Active", value: boarderSummary.activeBoarders },
            { name: "Deactivate", value: boarderSummary.deactivateBoarders },
            { name: "Checked-out", value: boarderSummary.checkedOutBoarders },
        ];
        const statusTotal = statusRows.reduce((s, d) => s + d.value, 0) || 1;

        statusRows.forEach((s) => {
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
            share.value = { formula: `B${r}/B${statusFirst + statusRows.length}` };
            share.numFmt = SHARE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };
            r++;
        });

        ws.getRow(r).height = 20;
        ws.getCell(r, 1).value = "Total";
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

        tableHead(ws, r, ["Gender", "Boarders", "Share", null, null, null]);
        r++;

        const genderFirst = r;
        const genderRows = [
            { name: "Male", value: boarderSummary.maleBoarders },
            { name: "Female", value: boarderSummary.femaleBoarders },
        ];
        const genderTotal = genderRows.reduce((s, d) => s + d.value, 0) || 1;

        genderRows.forEach((g) => {
            bodyRow(ws, r, 3);

            ws.getCell(r, 1).value = g.name;
            ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

            const count = ws.getCell(r, 2);
            count.value = g.value;
            count.numFmt = COUNT;
            count.font = { name: TEXT, size: 10, color: { argb: INK } };
            count.alignment = { horizontal: "right" };

            const share = ws.getCell(r, 3);
            share.value = { formula: `B${r}/B${genderFirst + genderRows.length}` };
            share.numFmt = SHARE;
            share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
            share.alignment = { horizontal: "right" };
            r++;
        });

        ws.getRow(r).height = 20;
        ws.getCell(r, 1).value = "Total";
        ws.getCell(r, 1).font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        const genderSum = ws.getCell(r, 2);
        genderSum.value = {
            formula: `SUM(B${genderFirst}:B${r - 1})`,
            result: genderTotal,
        };
        genderSum.numFmt = COUNT;
        genderSum.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        genderSum.alignment = { horizontal: "right" };
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
    }

    /* ---- 03 Boarders over time ----------------------------------- */
    if (boardersOverTime.length > 0) {
        sectionHeading(ws, r, "03", "Boarders over time", COLS);
        r++;

        tableHead(ws, r, ["Month", "Total boarders", "Change", null, null, null]);
        r++;

        boardersOverTime.forEach((t, i) => {
            bodyRow(ws, r, 3);

            ws.getCell(r, 1).value = t.month;
            ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

            const total = ws.getCell(r, 2);
            total.value = t.total;
            total.numFmt = COUNT;
            total.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
            total.alignment = { horizontal: "right" };

            if (i > 0) {
                const change = ws.getCell(r, 3);
                change.value = { formula: `B${r}-B${r - 1}` };
                change.numFmt = '+#,##0;-#,##0;0';
                change.font = { name: TEXT, size: 10, color: { argb: MUTED } };
                change.alignment = { horizontal: "right" };
            }
            r++;
        });
        r++;
    }

    /* ---- 04 Directory -------------------------------------------- */
    sectionHeading(ws, r, "04", "Boarder directory", COLS);
    r++;

    tableHead(ws, r, ["ID", "Name", "Gender", "Status", "Contact", "Email"]);
    r++;

    boardersList.forEach((b) => {
        bodyRow(ws, r, COLS);

        const id = ws.getCell(r, 1);
        id.value = b.user_id_no;
        id.font = { name: TEXT, size: 10, color: { argb: MUTED } };

        const name = ws.getCell(r, 2);
        name.value = b.name;
        name.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        name.alignment = { horizontal: "right" };

        const gender = ws.getCell(r, 3);
        gender.value = b.gender ?? "";
        gender.font = { name: TEXT, size: 10, color: { argb: BODY } };
        gender.alignment = { horizontal: "right" };

        const status = ws.getCell(r, 4);
        status.value = b.account_status ?? "";
        status.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[b.account_status ?? ""] ?? BODY },
        };
        status.alignment = { horizontal: "right" };

        const contact = ws.getCell(r, 5);
        contact.value = b.contact_number ?? "";
        contact.font = { name: TEXT, size: 10, color: { argb: BODY } };
        contact.alignment = { horizontal: "right" };

        const email = ws.getCell(r, 6);
        email.value = b.email ?? "";
        email.font = { name: TEXT, size: 9.5, color: { argb: MUTED } };
        email.alignment = { horizontal: "right" };

        r++;
    });
    r += 2;

    /* ---- Closing note & signatures ------------------------------- */
    ws.mergeCells(r, 1, r, COLS);
    ws.getRow(r).height = 28;
    const note = ws.getCell(r, 1);
    note.value =
        "This register reflects boarder records on file as of the generation date. Contact details are confidential and intended for authorized personnel only.";
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
    /*  Sheet 2 — Boarders (raw, filterable)                           */
    /* ============================================================== */

    const listSheet = wb.addWorksheet("Boarders", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    listSheet.columns = [
        { header: "ID", key: "id", width: 16 },
        { header: "Name", key: "name", width: 30 },
        { header: "Gender", key: "gender", width: 12 },
        { header: "Status", key: "status", width: 16 },
        { header: "Contact", key: "contact", width: 20 },
        { header: "Email", key: "email", width: 32 },
    ];

    boardersList.forEach((b) =>
        listSheet.addRow({
            id: b.user_id_no,
            name: b.name,
            gender: b.gender ?? "",
            status: b.account_status ?? "",
            contact: b.contact_number ?? "",
            email: b.email ?? "",
        })
    );

    const head = listSheet.getRow(1);
    head.height = 20;
    head.eachCell((cell) => {
        cell.font = { name: TEXT, size: 9, bold: true, color: { argb: PAPER } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    });

    listSheet.eachRow((row, i) => {
        if (i === 1) return;
        row.height = 16;
        row.eachCell((cell) => {
            cell.font = { name: TEXT, size: 10, color: { argb: BODY } };
            cell.border = { bottom: { style: "thin", color: { argb: HAIRLINE } } };
        });
        const statusCell = row.getCell(4);
        statusCell.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: STATUS_INK[String(statusCell.value ?? "")] ?? BODY },
        };
    });

    if (listSheet.rowCount > 1) {
        listSheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: listSheet.rowCount, column: listSheet.columnCount },
        };
    }

    /* ============================================================== */

    const buffer = await wb.xlsx.writeBuffer();
    const fileName = `Boarder-Report-${period.replace(/\s+/g, "-")}.xlsx`;

    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
}