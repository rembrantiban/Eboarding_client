"use client";

import { forwardRef } from "react";
import type { Rule } from "@/store/useRulesStore";

type Props = {
  rules: Rule[];
  houseName?: string;
  houseAddress?: string;
  boarderName?: string;
  roomNumber?: string;
};

const formatLongDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const HouseRulesPrintDocument = forwardRef<HTMLDivElement, Props>(
  (
    {
      rules,
      houseName = "E-Boarding House",
      houseAddress,
      boarderName,
      roomNumber,
    },
    ref
  ) => {
    const lastUpdated = rules.reduce<string | null>((latest, rule) => {
      const stamp = rule.updated_at || rule.created_at;
      return !latest || new Date(stamp) > new Date(latest) ? stamp : latest;
    }, null);

    return (
      <>
        {/* Isolate the document when printing without touching global CSS */}
        <style>{`
          #house-rules-print { display: none; }

          @media print {
            body * { visibility: hidden !important; }
            #house-rules-print,
            #house-rules-print * { visibility: visible !important; }

            #house-rules-print {
              display: block !important;
              position: absolute;
              inset: 0;
              width: 100%;
              background: #fff;
              color: #0f172a;
              font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
              font-size: 10.5pt;
              line-height: 1.55;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Keeps the measure readable instead of edge-to-edge on wide paper */
            .hr-sheet {
              width: 100%;
              max-width: 168mm;
              margin: 0 auto;
            }

            .rule-block { break-inside: avoid; page-break-inside: avoid; }
            .hr-keep { break-inside: avoid; page-break-inside: avoid; }

            @page { size: A4; margin: 16mm 18mm 14mm; }
          }
        `}</style>

        <div id="house-rules-print" ref={ref}>
          <div className="hr-sheet">
            {/* LETTERHEAD */}
            <header style={{ marginBottom: "22px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "24px",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "7.5pt",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#64748b",
                      margin: "0 0 5px",
                    }}
                  >
                    House rules and regulations
                  </p>
                  <h1
                    style={{
                      fontSize: "17pt",
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    {houseName}
                  </h1>
                  {houseAddress && (
                    <p
                      style={{
                        fontSize: "8pt",
                        color: "#64748b",
                        margin: "4px 0 0",
                      }}
                    >
                      {houseAddress}
                    </p>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "7.5pt",
                    color: "#94a3b8",
                    textAlign: "right",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {rules.length} {rules.length === 1 ? "rule" : "rules"} in effect
                </p>
              </div>

              {/* Two-weight rule reads more deliberate than a single line */}
              <div style={{ height: "2px", background: "#0f172a" }} />
              <div
                style={{
                  height: "1px",
                  background: "#cbd5e1",
                  marginTop: "2px",
                }}
              />
            </header>

            {/* META GRID */}
            <section
              className="hr-keep"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "14px",
                paddingBottom: "18px",
                marginBottom: "20px",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {[
                {
                  label: "Issued to",
                  value: boarderName
                    ? roomNumber
                      ? `${boarderName} · Room ${roomNumber}`
                      : boarderName
                    : "All boarders",
                },
                {
                  label: "Last revised",
                  value: lastUpdated ? formatLongDate(lastUpdated) : "—",
                },
                { label: "Printed", value: formatLongDate(new Date()) },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontSize: "7pt",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "#94a3b8",
                      margin: "0 0 3px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "9.5pt",
                      fontWeight: 500,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </section>

            {/* RULES */}
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {rules.map((rule, index) => (
                <li
                  key={rule.id}
                  className="rule-block"
                  style={{
                    display: "flex",
                    gap: "14px",
                    paddingBottom: "14px",
                    marginBottom: "14px",
                    borderBottom:
                      index === rules.length - 1
                        ? "none"
                        : "1px solid #f1f5f9",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      borderRadius: "5px",
                      background: "#0f172a",
                      color: "#ffffff",
                      fontSize: "8pt",
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      marginTop: "1px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        fontSize: "10.5pt",
                        fontWeight: 700,
                        letterSpacing: "-0.005em",
                        margin: 0,
                      }}
                    >
                      {rule.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "9.5pt",
                        lineHeight: 1.6,
                        color: "#334155",
                        margin: "4px 0 0",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {rule.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/* ACKNOWLEDGEMENT */}
            <section
              className="hr-keep"
              style={{
                marginTop: "26px",
                padding: "16px 18px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#f8fafc",
              }}
            >
              <p
                style={{
                  fontSize: "7pt",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#64748b",
                  margin: "0 0 6px",
                }}
              >
                Acknowledgement
              </p>

              <p
                style={{
                  fontSize: "9pt",
                  lineHeight: 1.6,
                  color: "#334155",
                  margin: 0,
                }}
              >
                I have read and understood the house rules listed above, and I
                agree to follow them for the duration of my stay.
              </p>

              <div style={{ display: "flex", gap: "32px", marginTop: "36px" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ borderTop: "1px solid #0f172a", paddingTop: "5px" }}
                  >
                    <p
                      style={{ fontSize: "7.5pt", color: "#64748b", margin: 0 }}
                    >
                      Boarder signature over printed name
                    </p>
                  </div>
                </div>

                <div style={{ width: "46mm" }}>
                  <div
                    style={{ borderTop: "1px solid #0f172a", paddingTop: "5px" }}
                  >
                    <p
                      style={{ fontSize: "7.5pt", color: "#64748b", margin: 0 }}
                    >
                      Date signed
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                marginTop: "18px",
                paddingTop: "8px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "7.5pt",
                color: "#94a3b8",
              }}
            >
              <span>{houseName}</span>
              <span>
                Reflects the rules published as of {formatLongDate(new Date())}
              </span>
            </footer>
          </div>
        </div>
      </>
    );
  }
);

HouseRulesPrintDocument.displayName = "HouseRulesPrintDocument";

export default HouseRulesPrintDocument;