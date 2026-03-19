export function MarketSnapshot() {
  const items = [
    { label: 'NASDAQ', value: '-1.53%', note: 'Tech sensitivity' },
    { label: 'S&P 500', value: '-0.79%', note: 'Support near 6,800' },
    { label: 'WTI', value: '+7.0%', note: 'Hormuz risk premium' },
    { label: 'US 10Y', value: '3.962%', note: 'Higher yields hurt growth' },
  ];

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-zinc-900 p-5">
      <h3 className="text-lg font-semibold">Market Snapshot</h3>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.label}</span>
            <span>{item.value}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
