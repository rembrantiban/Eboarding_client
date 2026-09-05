import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ExcelBillingStats {
    totalIncome: number;
    totalIncomeChange: number;
    lateFeesCollected: number;
    lateFeesChange: number;
    amountCollectedThisMonth: number;
    amountCollectedChange: number;
    collectionRate: number;
    collectionRateChange: number;
}

export interface ExcelIncomeSlice {
    name: string;
    value: number;
    color?: string;
}

export interface ExcelTrendPoint {
    month: string;
    income: number;
    lateFees: number;
}

export interface ExcelSummaryRow {
    category: string;
    thisMonth: number;
    lastMonth: number;
    change: number | string;
    positive: boolean;
}

export interface ExcelDetailedSummary {
    rows?: ExcelSummaryRow[];
    totalIncomeThisMonth: number;
    totalIncomeLastMonth: number;
    totalIncomeChange: number;
}

export interface ExportFinancialReportOptions {
    billingStats?: ExcelBillingStats | null;
    incomeMix?: ExcelIncomeSlice[];
    revenueTrend?: ExcelTrendPoint[];
    detailedSummary?: ExcelDetailedSummary | null;
    periodLabel?: string;
    organization?: string;
    addressLine?: string;
    preparedBy?: string;
}

/* ------------------------------------------------------------------ */
/*  Design tokens — mirrors the slate palette used in the app          */
/* ------------------------------------------------------------------ */

const INK = "FF0F172A"; // slate-900
const BODY = "FF334155"; // slate-700
const MUTED = "FF64748B"; // slate-500
const FAINT = "FF94A3B8"; // slate-400
const LINE = "FFE2E8F0"; // slate-200
const HAIRLINE = "FFF1F5F9"; // slate-100
const TINT = "FFF8FAFC"; // slate-50
const GOOD = "FF047857"; // emerald-700
const BAD = "FFBE123C"; // rose-700
const PAPER = "FFFFFFFF";

const DISPLAY = "Georgia";
const TEXT = "Calibri";

const MONEY = '"₱"#,##0.00';
const MONEY_TOTAL = '"₱"#,##0.00';
const DELTA = '+0.00"%";-0.00"%";0.00"%"';
const RATE = '0.0"%"';
const SHARE = "0.0%";
const DATE_LONG = 'dd mmmm yyyy';
const DATE_STAMP = 'dd mmm yyyy  h:mm AM/PM';

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

type WS = ExcelJS.Worksheet;

const monthYear = (d: Date) =>
    d.toLocaleString("en-PH", { month: "long", year: "numeric" });

function referenceNo(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const seq = String(d.getDate()).padStart(3, "0");
    return `FIN-${y}${m}-${seq}`;
}

/** Rule across the full A:E band. */
function rule(ws: WS, row: number, color = LINE, weight: "thin" | "medium" = "thin") {
    for (let c = 1; c <= 5; c++) {
        ws.getCell(row, c).border = {
            ...ws.getCell(row, c).border,
            bottom: { style: weight, color: { argb: color } },
        };
    }
}

/** Numbered section heading, e.g. "02   INCOME COMPOSITION". */
function sectionHeading(ws: WS, row: number, index: string, label: string) {
    ws.getRow(row).height = 20;
    const cell = ws.getCell(row, 1);
    cell.value = `${index}    ${label.toUpperCase()}`;
    cell.font = { name: TEXT, size: 9, bold: true, color: { argb: FAINT } };
    cell.alignment = { vertical: "bottom" };
    rule(ws, row, LINE);
}

/** Column headings for a data table. */
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

/* ------------------------------------------------------------------ */
/*  Export                                                             */
/* ------------------------------------------------------------------ */

export async function exportFinancialReportExcel({
    billingStats,
    incomeMix = [],
    revenueTrend = [],
    detailedSummary,
    periodLabel,
    organization = "E-Boarding House",
    addressLine = "A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS",
    preparedBy = "",
}: ExportFinancialReportOptions) {
    const now = new Date();
    const prev = new Date(new Date().setMonth(now.getMonth() - 1));
    const period = periodLabel ?? monthYear(now);

    const wb = new ExcelJS.Workbook();
    wb.creator = organization;
    wb.lastModifiedBy = preparedBy || organization;
    wb.created = now;
    wb.modified = now;

    /* ============================================================== */
    /*  Sheet 1 — the formatted report                                */
    /* ============================================================== */

    const ws = wb.addWorksheet("Financial Report", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 8 }],
        pageSetup: {
            paperSize: 9, // A4
            orientation: "portrait",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            horizontalCentered: true,
            margins: {
                left: 0.55,
                right: 0.55,
                top: 0.6,
                bottom: 0.6,
                header: 0.3,
                footer: 0.3,
            },
        },
        headerFooter: {
            oddFooter: `&L&8${organization} · Financial Report&R&8Page &P of &N`,
        },
    });

    ws.columns = [
        { width: 36 },
        { width: 19 },
        { width: 19 },
        { width: 15 },
        { width: 15 },
    ];

    let r = 1;

    /* ---- Letterhead band ---------------------------------------- */
    ws.mergeCells(r, 1, r, 5);
    ws.getRow(r).height = 30;
    const brand = ws.getCell(r, 1);
    brand.value = organization;
    brand.font = { name: DISPLAY, size: 15, bold: true, color: { argb: PAPER } };
    brand.alignment = { vertical: "middle", indent: 1 };
    for (let c = 1; c <= 5; c++) {
        ws.getCell(r, c).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: INK },
        };
    }
    r++;

    ws.mergeCells(r, 1, r, 5);
    ws.getRow(r).height = 18;
    const addr = ws.getCell(r, 1);
    addr.value = addressLine;
    addr.font = { name: TEXT, size: 9, color: { argb: PAPER } };
    addr.alignment = { vertical: "middle", indent: 1 };
    for (let c = 1; c <= 5; c++) {
        ws.getCell(r, c).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: INK },
        };
    }
    r += 2;

    /* ---- Title block -------------------------------------------- */
    ws.getRow(r).height = 30;
    const title = ws.getCell(r, 1);
    title.value = "Financial Report";
    title.font = { name: DISPLAY, size: 20, bold: true, color: { argb: INK } };
    title.alignment = { vertical: "middle" };

    const periodLbl = ws.getCell(r, 4);
    periodLbl.value = "REPORTING PERIOD";
    periodLbl.font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    periodLbl.alignment = { horizontal: "right", vertical: "middle" };

    const periodVal = ws.getCell(r, 5);
    periodVal.value = period;
    periodVal.font = { name: TEXT, size: 11, bold: true, color: { argb: INK } };
    periodVal.alignment = { horizontal: "right", vertical: "middle" };
    r++;

    const sub = ws.getCell(r, 1);
    sub.value = "Statement of operations · Income, late fees and collections";
    sub.font = { name: TEXT, size: 9, color: { argb: MUTED } };

    ws.getCell(r, 4).value = "REFERENCE NO.";
    ws.getCell(r, 4).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 4).alignment = { horizontal: "right" };
    ws.getCell(r, 5).value = referenceNo(now);
    ws.getCell(r, 5).font = { name: TEXT, size: 9, color: { argb: BODY } };
    ws.getCell(r, 5).alignment = { horizontal: "right" };
    r++;

    ws.getCell(r, 4).value = "GENERATED";
    ws.getCell(r, 4).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 4).alignment = { horizontal: "right" };
    /* Real Date value + display format, so Excel treats it as a date */
    const stamp = ws.getCell(r, 5);
    stamp.value = now;
    stamp.numFmt = DATE_STAMP;
    stamp.font = { name: TEXT, size: 9, color: { argb: BODY } };
    stamp.alignment = { horizontal: "right" };
    rule(ws, r, INK, "medium");
    r += 2;

    /* ---- 01 Performance summary --------------------------------- */
    sectionHeading(ws, r, "01", "Performance summary");
    r += 1;

    tableHead(ws, r, ["Metric", "Value", "Change", null, null]);
    r++;

    const kpis = billingStats
        ? [
            {
                label: "Total income",
                value: billingStats.totalIncome,
                fmt: MONEY,
                delta: billingStats.totalIncomeChange,
            },
            {
                label: "Late fees collected",
                value: billingStats.lateFeesCollected,
                fmt: MONEY,
                delta: billingStats.lateFeesChange,
            },
            {
                label: "Amount collected this month",
                value: billingStats.amountCollectedThisMonth,
                fmt: MONEY,
                delta: billingStats.amountCollectedChange,
            },
            {
                label: "Collection rate",
                value: billingStats.collectionRate,
                fmt: RATE,
                delta: billingStats.collectionRateChange,
            },
        ]
        : [];

    kpis.forEach((k, i) => {
        ws.getRow(r).height = 18;

        const label = ws.getCell(r, 1);
        label.value = k.label;
        label.font = { name: TEXT, size: 10, color: { argb: BODY } };

        const value = ws.getCell(r, 2);
        value.value = k.value;
        value.numFmt = k.fmt;
        value.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        value.alignment = { horizontal: "right" };

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

        if (i % 2 === 0) {
            for (let c = 1; c <= 3; c++) {
                ws.getCell(r, c).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: TINT },
                };
            }
        }
        for (let c = 1; c <= 3; c++) {
            ws.getCell(r, c).border = {
                bottom: { style: "thin", color: { argb: HAIRLINE } },
            };
        }
        r++;
    });
    r++;

    /* ---- 02 Income composition ---------------------------------- */
    sectionHeading(ws, r, "02", "Income composition");
    r += 1;

    tableHead(ws, r, ["Source", "Amount", "Share", null, null]);
    r++;

    const incomeTotal = incomeMix.reduce((s, d) => s + d.value, 0) || 1;
    const mixFirstRow = r;

    incomeMix.forEach((slice) => {
        ws.getRow(r).height = 18;

        ws.getCell(r, 1).value = slice.name;
        ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

        const amt = ws.getCell(r, 2);
        amt.value = slice.value;
        amt.numFmt = MONEY;
        amt.font = { name: TEXT, size: 10, color: { argb: INK } };
        amt.alignment = { horizontal: "right" };

        const share = ws.getCell(r, 3);
        share.value = { formula: `B${r}/B${mixFirstRow + incomeMix.length}` };
        share.numFmt = SHARE;
        share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        share.alignment = { horizontal: "right" };

        for (let c = 1; c <= 3; c++) {
            ws.getCell(r, c).border = {
                bottom: { style: "thin", color: { argb: HAIRLINE } },
            };
        }
        r++;
    });

    /* Total row — live SUM so the sheet stays auditable */
    ws.getRow(r).height = 20;
    ws.getCell(r, 1).value = "Total income";
    ws.getCell(r, 1).font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };

    const mixTotal = ws.getCell(r, 2);
    mixTotal.value = {
        formula: `SUM(B${mixFirstRow}:B${r - 1})`,
        result: incomeTotal,
    };
    mixTotal.numFmt = MONEY_TOTAL;
    mixTotal.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
    mixTotal.alignment = { horizontal: "right" };

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

    /* ---- 03 Trend ------------------------------------------------ */
    sectionHeading(ws, r, "03", "Income and late fee trend");
    r += 1;

    tableHead(ws, r, ["Month", "Income", "Late fees", "Late fee share", null]);
    r++;

    revenueTrend.forEach((t) => {
        ws.getRow(r).height = 18;

        ws.getCell(r, 1).value = t.month;
        ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

        const inc = ws.getCell(r, 2);
        inc.value = t.income;
        inc.numFmt = MONEY;
        inc.font = { name: TEXT, size: 10, color: { argb: INK } };
        inc.alignment = { horizontal: "right" };

        const late = ws.getCell(r, 3);
        late.value = t.lateFees;
        late.numFmt = MONEY;
        late.font = { name: TEXT, size: 10, color: { argb: BAD } };
        late.alignment = { horizontal: "right" };

        const share = ws.getCell(r, 4);
        share.value = { formula: `IF(B${r}=0,0,C${r}/B${r})` };
        share.numFmt = SHARE;
        share.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        share.alignment = { horizontal: "right" };

        for (let c = 1; c <= 4; c++) {
            ws.getCell(r, c).border = {
                bottom: { style: "thin", color: { argb: HAIRLINE } },
            };
        }
        r++;
    });
    r++;

    /* ---- 04 Detailed comparison --------------------------------- */
    sectionHeading(ws, r, "04", "Detailed comparison");
    r += 1;

    tableHead(ws, r, [
        "Category",
        monthYear(now),
        monthYear(prev),
        "Change",
        null,
    ]);
    r++;

    (detailedSummary?.rows ?? []).forEach((row) => {
        ws.getRow(r).height = 18;

        ws.getCell(r, 1).value = row.category;
        ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: BODY } };

        const cur = ws.getCell(r, 2);
        cur.value = row.thisMonth;
        cur.numFmt = MONEY;
        cur.font = { name: TEXT, size: 10, bold: true, color: { argb: INK } };
        cur.alignment = { horizontal: "right" };

        const old = ws.getCell(r, 3);
        old.value = row.lastMonth;
        old.numFmt = MONEY;
        old.font = { name: TEXT, size: 10, color: { argb: MUTED } };
        old.alignment = { horizontal: "right" };

        const chg = ws.getCell(r, 4);
        chg.value = typeof row.change === "number" ? row.change : Number(row.change) || 0;
        chg.numFmt = DELTA;
        chg.font = {
            name: TEXT,
            size: 10,
            bold: true,
            color: { argb: row.positive ? GOOD : BAD },
        };
        chg.alignment = { horizontal: "right" };

        for (let c = 1; c <= 4; c++) {
            ws.getCell(r, c).border = {
                bottom: { style: "thin", color: { argb: HAIRLINE } },
            };
        }
        r++;
    });

    if (detailedSummary) {
        ws.getRow(r).height = 22;

        ws.getCell(r, 1).value = "Total income";
        ws.getCell(r, 2).value = detailedSummary.totalIncomeThisMonth;
        ws.getCell(r, 2).numFmt = MONEY_TOTAL;
        ws.getCell(r, 3).value = detailedSummary.totalIncomeLastMonth;
        ws.getCell(r, 3).numFmt = MONEY_TOTAL;
        ws.getCell(r, 4).value = detailedSummary.totalIncomeChange;
        ws.getCell(r, 4).numFmt = DELTA;

        for (let c = 1; c <= 4; c++) {
            const cell = ws.getCell(r, c);
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
            cell.font = {
                name: TEXT,
                size: 10,
                bold: true,
                color: {
                    argb:
                        c === 4
                            ? detailedSummary.totalIncomeChange >= 0
                                ? "FF34D399"
                                : "FFFB7185"
                            : c === 3
                                ? "FFCBD5E1"
                                : PAPER,
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

    /* ---- Closing note ------------------------------------------- */
    rule(ws, r - 1, LINE);
    ws.mergeCells(r, 1, r, 5);
    ws.getRow(r).height = 28;
    const note = ws.getCell(r, 1);
    note.value =
        "Generated from billing records on file for the period stated above. Figures reflect payments recorded as of the generation date and may change once pending collections are posted.";
    note.font = { name: TEXT, size: 8, italic: true, color: { argb: MUTED } };
    note.alignment = { wrapText: true, vertical: "top" };
    r += 2;

    ws.getCell(r, 1).value = "Prepared by";
    ws.getCell(r, 1).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    ws.getCell(r, 2).value = "Date";
    ws.getCell(r, 2).font = { name: TEXT, size: 8, bold: true, color: { argb: FAINT } };
    r++;

    ws.getCell(r, 1).value = preparedBy || "";
    ws.getCell(r, 1).font = { name: TEXT, size: 10, color: { argb: INK } };
    ws.getCell(r, 1).border = { bottom: { style: "thin", color: { argb: INK } } };

    const signDate = ws.getCell(r, 2);
    signDate.value = now;
    signDate.numFmt = DATE_LONG;
    signDate.font = { name: TEXT, size: 10, color: { argb: INK } };
    signDate.border = { bottom: { style: "thin", color: { argb: INK } } };

    ws.pageSetup.printArea = `A1:E${r}`;

    /* ============================================================== */
    /*  Sheet 2 — clean raw data for pivots and formulas              */
    /* ============================================================== */

    const data = wb.addWorksheet("Data", {
        views: [{ showGridLines: false, state: "frozen", ySplit: 1 }],
    });

    data.columns = [
        { header: "Section", key: "section", width: 22 },
        { header: "Label", key: "label", width: 30 },
        { header: "Amount", key: "amount", width: 16 },
        { header: "Comparison", key: "compare", width: 16 },
        { header: "Change %", key: "change", width: 12 },
        { header: "Period", key: "period", width: 18 },
        { header: "Generated", key: "generated", width: 22 },
    ];

    incomeMix.forEach((s) =>
        data.addRow({
            section: "Income composition",
            label: s.name,
            amount: s.value,
            period: period,
            generated: now,
        })
    );

    revenueTrend.forEach((t) => {
        data.addRow({
            section: "Trend · income",
            label: t.month,
            amount: t.income,
            period: period,
            generated: now,
        });
        data.addRow({
            section: "Trend · late fees",
            label: t.month,
            amount: t.lateFees,
            period: period,
            generated: now,
        });
    });

    (detailedSummary?.rows ?? []).forEach((row) =>
        data.addRow({
            section: "Detailed comparison",
            label: row.category,
            amount: row.thisMonth,
            compare: row.lastMonth,
            change: typeof row.change === "number" ? row.change : Number(row.change) || 0,
            period: period,
            generated: now,
        })
    );

    const head = data.getRow(1);
    head.height = 20;
    head.eachCell((cell) => {
        cell.font = { name: TEXT, size: 9, bold: true, color: { argb: PAPER } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: INK } };
        cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    });

    data.eachRow((row, i) => {
        if (i === 1) return;
        row.height = 16;
        row.getCell(3).numFmt = MONEY;
        row.getCell(4).numFmt = MONEY;
        row.getCell(5).numFmt = DELTA;
        row.getCell(7).numFmt = DATE_STAMP;
        row.eachCell((cell) => {
            cell.font = { name: TEXT, size: 10, color: { argb: BODY } };
            cell.border = { bottom: { style: "thin", color: { argb: HAIRLINE } } };
        });
    });

    data.autoFilter = { from: "A1", to: `G${data.rowCount}` };

    /* ============================================================== */

    const buffer = await wb.xlsx.writeBuffer();
    const fileName = `Financial-Report-${period.replace(/\s+/g, "-")}.xlsx`;

    saveAs(
        new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
    );
}