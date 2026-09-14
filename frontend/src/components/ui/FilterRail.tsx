import { Calendar, ChevronDown } from 'lucide-react';
import { useKpiStore } from '../../lib/store';

interface FilterRailProps {
  className?: string;
}

export function FilterRail({ className }: FilterRailProps) {
  const currentPeriodId = useKpiStore((s) => s.currentPeriodId);
  const periods         = useKpiStore((s) => s.periods);
  const setCurrentPeriod = useKpiStore((s) => s.setCurrentPeriod);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }} className={className}>
      {/* Month / Period Picker Pill */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '999px',
          background: '#4f46e5',
          color: '#ffffff', flexShrink: 0,
          position: 'absolute', left: '8px', pointerEvents: 'none', zIndex: 1,
          boxShadow: '0 2px 6px rgba(79,70,229,0.3)',
        }}>
          <Calendar size={13} />
        </div>
        <select
          id="period-filter"
          value={currentPeriodId}
          onChange={(e) => setCurrentPeriod(e.target.value)}
          style={{
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#334155',
            background: '#eef2ff',
            border: '1.5px solid #c7d2fe',
            borderRadius: '999px',
            padding: '9px 38px 9px 44px',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease',
            appearance: 'none',
            WebkitAppearance: 'none',
            boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.18)'; }}
          onBlur={(e)  => { e.target.style.borderColor = '#c7d2fe'; e.target.style.boxShadow = '0 2px 8px rgba(79,70,229,0.08)'; }}
          aria-label="Select period"
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '14px', color: '#4f46e5', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}
