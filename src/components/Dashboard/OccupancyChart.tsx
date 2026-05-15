const OccupancyChart = () => {
  return (
    <div className="rounded-md border bg-background p-5 shadow-sm">
      <h3 className="font-semibold mb-4">Occupancy Overview</h3>

      {/* Fake Progress Bars (replace with real data later) */}
      <div className="space-y-4">
        <div>
          <p className="text-sm">Occupied</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded-full w-[90%]" />
          </div>
        </div>

        <div>
          <p className="text-sm">Available</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div className="bg-green-500 h-2 rounded-full w-[10%]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OccupancyChart