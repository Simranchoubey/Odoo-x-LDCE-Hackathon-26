import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function SearchFilterBar({
  searchValue = '',
  onSearchChange,
  groupOptions = [],
  groupValue = '',
  onGroupChange,
  filterOptions = [],
  filterValue = '',
  onFilterChange,
  sortOptions = [],
  sortValue = '',
  onSortChange,
  placeholder = 'Search...',
  className = '',
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 pointer-events-none"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]/50 transition-all"
          />
        </div>

        {/* Group By */}
        {groupOptions.length > 0 && (
          <SelectDropdown
            icon={<SlidersHorizontal size={14} />}
            value={groupValue}
            onChange={onGroupChange}
            options={groupOptions}
            placeholder="Group by"
          />
        )}

        {/* Filter */}
        {filterOptions.length > 0 && (
          <SelectDropdown
            icon={<SlidersHorizontal size={14} />}
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
            placeholder="Filter"
          />
        )}

        {/* Sort By */}
        {sortOptions.length > 0 && (
          <SelectDropdown
            icon={<ArrowUpDown size={14} />}
            value={sortValue}
            onChange={onSortChange}
            options={sortOptions}
            placeholder="Sort by"
          />
        )}
      </div>
    </div>
  );
}

function SelectDropdown({ icon, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/50 rounded-xl py-2.5 pl-8 pr-8 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 cursor-pointer transition-all hover:border-[var(--color-outline)]/50 min-w-[120px]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 pointer-events-none"
      />
    </div>
  );
}
