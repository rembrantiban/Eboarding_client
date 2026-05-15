


const SummaryCard = ({
  title,
  amount,
  icon,
  color,
}: {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <div className="relative p-4 rounded-xl border bg-white shadow-sm flex items-center justify-between overflow-hidden">

      {/* TEXT */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        <p className="text-xl font-bold mt-1">
          ₱{amount.toLocaleString()}
        </p>
      </div>

      {/* ICON */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}
      >
        {icon}
      </div>

      {/* subtle glow */}
      <div className="absolute inset-0 opacity-5 bg-linear-to-br from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
};


export default SummaryCard;
