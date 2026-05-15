const TOTAL_ROOMS = 50;
const MAINTENANCE = 0;

type RoomStatusProps = {
  occupied?: number;
  available?: number;
  maintenance?: number;
  total?: number;
};

const RoomStatus = ({
  occupied    = 45,
  available   = 5,
  maintenance = MAINTENANCE,
  total       = TOTAL_ROOMS,
}: RoomStatusProps) => {
  const occupancyPct = Math.round((occupied / total) * 100);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",  
        borderRadius: 12,
        padding: "20px 22px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <p
            style={{
              color: "#93c5fd",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: 3,
            }}
          >
            OVERVIEW
          </p>
          <h3
            style={{
              color: "#0f172a",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Room Status
          </h3>
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            {total} rooms total
          </p>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#3b82f6",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            padding: "5px 11px",
          }}
        >
          {occupancyPct}% occupied
        </span>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            height: 8,
            background: "#f1f5f9",
            borderRadius: 99,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${occupancyPct}%`,
              borderRadius: 99,
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          <span>0 rooms</span>
          <span>{total} rooms</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Occupied */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              color: "#93c5fd",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              marginBottom: 6,
            }}
          >
            OCCUPIED
          </p>
          <p
            style={{
              color: "#2563eb",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {occupied}
          </p>
          <p style={{ color: "#93c5fd", fontSize: 11, marginTop: 4 }}>
            rooms in use
          </p>
        </div>

        {/* Available */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <p
            style={{
              color: "#86efac",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.09em",
              marginBottom: 6,
            }}
          >
            AVAILABLE
          </p>
          <p
            style={{
              color: "#16a34a",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {available}
          </p>
          <p style={{ color: "#86efac", fontSize: 11, marginTop: 4 }}>
            rooms free
          </p>
        </div>
      </div>

      {/* ── Footer chips ── */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Total rooms",    value: String(total),          color: "#0f172a" },
          { label: "Occupancy rate", value: `${occupancyPct}%`,     color: "#2563eb" },
          { label: "Maintenance",    value: String(maintenance),    color: maintenance > 0 ? "#f59e0b" : "#0f172a" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "8px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
              {c.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomStatus;