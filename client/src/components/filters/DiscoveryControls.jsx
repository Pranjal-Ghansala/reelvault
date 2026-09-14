import { useState } from "react";

const genres = [
  { label: "All genres", value: "" },
  { label: "Action", value: "28" },
  { label: "Adventure", value: "12" },
  { label: "Comedy", value: "35" },
  { label: "Drama", value: "18" },
  { label: "Horror", value: "27" },
  { label: "Science Fiction", value: "878" },
  { label: "Thriller", value: "53" },
];

const years = [
  { label: "Any year", value: "" },
  ...Array.from({ length: 7 }, (_, index) => {
    const year = new Date().getFullYear() - index;

    return {
      label: String(year),
      value: String(year),
    };
  }),
];

const ratings = [
  { label: "Any rating", value: "" },
  { label: "8+", value: "8" },
  { label: "7+", value: "7" },
  { label: "6+", value: "6" },
  { label: "5+", value: "5" },
];

const defaultSortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

function DiscoveryControls({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  sortOptions = defaultSortOptions,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleFilterChange(key, value) {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  }

  function handleSortChange(value) {
    if (onSortChange) {
      onSortChange(value);
    }
  }

  function clearFilters() {
    handleFilterChange("genre", "");
    handleFilterChange("year", "");
    handleFilterChange("rating", "");
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Filters
        </button>

        <FilterSelect
          label="Sort"
          value={sort}
          options={sortOptions}
          onChange={handleSortChange}
        />
      </div>

      <div className="hidden items-center justify-between gap-6 lg:flex">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Genre"
            value={filters.genre}
            options={genres}
            onChange={(value) =>
              handleFilterChange("genre", value)
            }
          />

          <FilterSelect
            label="Year"
            value={filters.year}
            options={years}
            onChange={(value) =>
              handleFilterChange("year", value)
            }
          />

          <FilterSelect
            label="Rating"
            value={filters.rating}
            options={ratings}
            onChange={(value) =>
              handleFilterChange("rating", value)
            }
          />

          <button
            type="button"
            onClick={clearFilters}
            className="px-2 text-sm text-white/45 transition hover:text-white"
          >
            Clear all
          </button>
        </div>

        <FilterSelect
          label="Sort"
          value={sort}
          options={sortOptions}
          onChange={handleSortChange}
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-white/10 bg-[#151518] p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Refine
                </p>

                <h2
                  id="filter-title"
                  className="mt-1 text-xl font-semibold text-white"
                >
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <FilterSelect
                label="Genre"
                value={filters.genre}
                options={genres}
                onChange={(value) =>
                  handleFilterChange("genre", value)
                }
                fullWidth
              />

              <FilterSelect
                label="Release year"
                value={filters.year}
                options={years}
                onChange={(value) =>
                  handleFilterChange("year", value)
                }
                fullWidth
              />

              <FilterSelect
                label="Rating"
                value={filters.rating}
                options={ratings}
                onChange={(value) =>
                  handleFilterChange("rating", value)
                }
                fullWidth
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-[#17130b] hover:bg-amber-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  fullWidth = false,
}) {
  return (
    <label className={fullWidth ? "block" : "flex items-center gap-2"}>
      <span
        className={
          fullWidth
            ? "mb-2 block text-xs font-medium uppercase tracking-wide text-white/40"
            : "sr-only"
        }
      >
        {label}
      </span>

      <select
        aria-label={fullWidth ? undefined : label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-400 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#151518]"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default DiscoveryControls;