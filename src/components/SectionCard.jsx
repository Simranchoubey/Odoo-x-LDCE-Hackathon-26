import { GripVertical, Trash2, Calendar, ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export default function SectionCard({
  section,
  index,
  onUpdate,
  onDelete,
  dragHandleProps = {},
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { fmt, currency } = useCurrency();

  const handleField = (field, value) => {
    onUpdate?.({ ...section, [field]: value });
  };

  return (
    <article className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/40 card-shadow overflow-hidden transition-all duration-200">
      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-surface-container)]">
        {/* Drag Handle */}
        <button
          {...dragHandleProps}
          className="text-[var(--color-on-surface-variant)]/40 hover:text-[var(--color-on-surface-variant)] cursor-grab active:cursor-grabbing transition-colors p-1 rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>

        {/* Section Number Badge */}
        <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-[var(--color-primary)]">{index + 1}</span>
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => handleField('title', e.target.value)}
          placeholder={`Section ${index + 1}`}
          className="flex-1 min-w-0 bg-transparent text-sm font-bold text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-1.5 rounded-lg text-[var(--color-on-surface-variant)]/60 hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-surface)] transition-all"
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
          >
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button
            onClick={() => onDelete?.()}
            className="p-1.5 rounded-lg text-[var(--color-error)]/60 hover:bg-[var(--color-error-container)]/40 hover:text-[var(--color-error)] transition-all"
            aria-label="Delete section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={section.description || ''}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="All the necessary info about this section — travel, hotel, or any other activity"
              rows={2}
              className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none transition-all"
            />
          </div>

          {/* Date Range + Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                <Calendar size={11} className="inline mr-1" />Start Date
              </label>
              <input
                type="date"
                value={section.startDate || ''}
                onChange={(e) => handleField('startDate', e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                <Calendar size={11} className="inline mr-1" />End Date
              </label>
              <input
                type="date"
                value={section.endDate || ''}
                onChange={(e) => handleField('endDate', e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
                <Wallet size={11} className="inline mr-1" />Budget ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={section.budget || ''}
                onChange={(e) => handleField('budget', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2.5 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
              />
            </div>
          </div>

          {/* Activities list preview */}
          {section.activities && section.activities.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">
                Activities ({section.activities.length})
              </p>
              <div className="flex flex-col gap-1.5">
                {section.activities.map((act) => (
                  <div key={act.id} className="flex items-center justify-between px-3 py-2 bg-[var(--color-surface-container)] rounded-xl">
                    <span className="text-sm text-[var(--color-on-surface)]">{act.name}</span>
                    {act.expense > 0 && (
                      <span className="text-xs font-semibold text-[var(--color-primary)]">{fmt(act.expense)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
