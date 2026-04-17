export function MarqueeBand() {
  const items = [
    "Local Moving",
    "Long Distance",
    "Packing Services",
    "White Glove",
    "Storage Solutions",
    "Commercial Moving",
    "Apartment Moving",
    "Office Relocation",
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div className="py-3 sm:py-5 border-y border-border overflow-hidden">
      <div className="flex animate-marquee-left whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 mx-4 sm:gap-6 sm:mx-6">
            <span className="text-xs sm:text-sm md:text-base font-semibold text-text-muted uppercase tracking-widest">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
