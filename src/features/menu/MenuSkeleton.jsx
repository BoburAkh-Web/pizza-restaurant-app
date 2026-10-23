// Mirrors the layout of Menu + MenuItem, so nothing jumps when the real menu arrives.
function MenuSkeleton() {
  return (
    <div role="status" className="motion-safe:animate-pulse">
      <span className="sr-only">Loading menu...</span>

      <div className="space-y-3 px-4 py-3">
        <div className="flex gap-2">
          <div className="h-10 grow rounded-full bg-stone-200 md:h-12" />
          <div className="h-10 w-36 rounded-full bg-stone-200 md:h-12" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 rounded-full bg-stone-200" />
          <div className="h-8 w-32 rounded-full bg-stone-200" />
          <div className="h-8 w-20 rounded-full bg-stone-200" />
        </div>
      </div>

      <ul className="grid gap-4 px-4 pt-3 pb-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200 sm:flex-col sm:gap-3"
          >
            <div className="h-24 w-24 shrink-0 rounded-xl bg-stone-200 sm:aspect-square sm:h-auto sm:w-full" />
            <div className="flex grow flex-col gap-2">
              <div className="h-5 w-2/3 rounded bg-stone-200" />
              <div className="flex gap-1">
                <div className="h-5 w-14 rounded-full bg-stone-100" />
                <div className="h-5 w-20 rounded-full bg-stone-100" />
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="h-5 w-16 rounded bg-stone-200" />
                <div className="h-8 w-28 rounded-full bg-stone-200" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MenuSkeleton;
