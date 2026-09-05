"use client";

import { forwardRef } from "react";
import type { Payment } from "@/store/usePaymentStore";

type Props = {
  payments: Payment[];
};

const getStatus = (status: string) => {
  if (status === "Paid")    return { label: "Paid",    color: "#16a34a" };
  if (status === "Pending") return { label: "Pending", color: "#d97706" };
  if (status === "Overdue") return { label: "Overdue", color: "#dc2626" };
  return { label: status, color: "#475569" };
};

const totalPaid = (payments: Payment[]) =>
  payments.filter((p) => p.status === "Paid").reduce((s, p) => s + Number(p.amount), 0);

const PaymentPrint = forwardRef<HTMLDivElement, Props>(({ payments }, ref) => {
  const today = new Date().toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        background: "#fff",
        color: "#111",
        maxWidth: "480px",
        margin: "0 auto",
        padding: "40px 32px",
      }}
    >
      {/* ── BRAND ── */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>
          E-Boarding House
        </div>
        <div style={{ fontSize: "11px", color: "#555", letterSpacing: "1px", marginTop: "2px" }}>
          A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS
        </div>
      </div>

      <Divider />

      {/* ── TITLE ── */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
          Payment Report
        </div>
        <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>
          {today}
        </div>
      </div>

      <Divider dashed />

      {/* ── TABLE ── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={thStyle("left")}>Name</th>
            <th style={thStyle("center")}>Room</th>
            <th style={thStyle("right")}>Amount</th>
            <th style={thStyle("center")}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => {
            const s = getStatus(p.status);
            return (
              <tr key={p.payment_id}>
                <td style={{ ...tdStyle("left"), borderTop: i === 0 ? "1px dashed #ccc" : "none" }}>
                  {p.first_name} {p.last_name}
                  <div style={{ fontSize: "10px", color: "#888" }}>
                    Due: {new Date(p.due_date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </td>
                <td style={{ ...tdStyle("center"), borderTop: i === 0 ? "1px dashed #ccc" : "none" }}>
                  {p.room_number}<br />
                  <span style={{ fontSize: "10px", color: "#888" }}>Bed {p.bed_number}</span>
                </td>
                <td style={{ ...tdStyle("right"), fontWeight: 700, borderTop: i === 0 ? "1px dashed #ccc" : "none" }}>
                  ₱{Number(p.amount).toLocaleString()}
                </td>
                <td style={{ ...tdStyle("center"), color: s.color, fontWeight: 700, borderTop: i === 0 ? "1px dashed #ccc" : "none" }}>
                  {s.label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Divider dashed />

      <Row label="Total Records"     value={`${payments.length}`} />
      <Row label="Total Collected"   value={`₱${totalPaid(payments).toLocaleString()}`} bold />
      <Row label="Pending / Overdue" value={`${payments.filter(p => p.status !== "Paid").length}`} />

      <Divider />

      <div style={{ textAlign: "center", fontSize: "11px", color: "#888", marginTop: "8px", lineHeight: "1.8" }}>
        <div>Thank you!</div>
        <div style={{ letterSpacing: "1px" }}>* * * E-BOARDING * * *</div>
        <div style={{ marginTop: "4px", fontSize: "10px" }}>
          {payments.length} record{payments.length !== 1 ? "s" : ""} printed on {today}
        </div>
      </div>
    </div>
  );
});

PaymentPrint.displayName = "PaymentPrint";
export default PaymentPrint;

/* ── HELPERS ── */

const Divider = ({ dashed }: { dashed?: boolean }) => (
  <div style={{ borderTop: dashed ? "1px dashed #bbb" : "1px solid #111", margin: "12px 0" }} />
);

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", fontWeight: bold ? 700 : 400 }}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const thStyle = (align: "left" | "center" | "right"): React.CSSProperties => ({
  textAlign: align,
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  paddingBottom: "6px",
  color: "#444",
});

const tdStyle = (align: "left" | "center" | "right"): React.CSSProperties => ({
  textAlign: align,
  padding: "7px 0",
  verticalAlign: "top",
  fontSize: "12px",
  borderBottom: "1px dotted #ddd",
});