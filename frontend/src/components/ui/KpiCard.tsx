import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendData } from '../../lib/types';

interface KpiCardProps {
  id?: string;
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: TrendData;
  accentColor?: string;
  iconBg?: string;
  badgeBorder?: string;
  className?: string;
  onClick?: () => void;
}

export function KpiCard({
  id,
  icon,
  title,
  value,
  subtitle,
  trend,
  accentColor = '#6366f1',
  iconBg,
  badgeBorder,
  className,
  onClick,
}: KpiCardProps) {
  const bgBadge = iconBg || `${accentColor}15`;
  const borderBadge = badgeBorder || `${accentColor}25`;

  return (
    <div
      id={id}
      onClick={onClick}
      className={className}
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '22px 24px',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.22s ease',
        boxShadow: '0 6px 20px rgba(15,28,64,0.05), 0 2px 4px rgba(15,28,64,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 12px 30px rgba(15,28,64,0.1)';
        el.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 6px 20px rgba(15,28,64,0.05), 0 2px 4px rgba(15,28,64,0.03)';
        el.style.transform = 'translateY(0)';
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3.5px',
        background: accentColor,
        borderRadius: '12px 12px 0 0',
      }} />

      {/* Title + Icon Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
        <p style={{
          fontSize: '0.76rem',
          fontWeight: 750,
          color: '#64748b',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 1.3,
          fontFamily: "'Inter', sans-serif",
        }}>
          {title}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: bgBadge,
          color: accentColor,
          flexShrink: 0,
          border: `1.5px solid ${borderBadge}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}>
          {icon}
        </div>
      </div>

      {/* Big Bold Inter Number */}
      <p style={{
        fontSize: '2.5rem',
        fontWeight: 900,
        color: '#0f172a',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        marginBottom: '6px',
        fontFamily: "'Inter', sans-serif",
      }}>
        {value}
      </p>

      {/* Small Gray Caption Underneath */}
      {subtitle && (
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: trend ? '14px' : '0', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
          {subtitle}
        </p>
      )}

      {/* Colored Trend Badge */}
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: subtitle ? '0' : '14px' }}>
          {trend.direction === 'up' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 750, color: '#15803d', background: '#ecfdf5', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #a7f3d0', fontFamily: "'Inter', sans-serif" }}>
              <TrendingUp size={12} />
              +{Math.abs(trend.changePercent)}%
            </span>
          )}
          {trend.direction === 'down' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 750, color: '#dc2626', background: '#fff1f2', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #fecaca', fontFamily: "'Inter', sans-serif" }}>
              <TrendingDown size={12} />
              −{Math.abs(trend.changePercent)}%
            </span>
          )}
          {trend.direction === 'neutral' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 750, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', fontFamily: "'Inter', sans-serif" }}>
              <Minus size={12} />
              0%
            </span>
          )}
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 450, fontFamily: "'Inter', sans-serif" }}>vs last period</span>
        </div>
      )}
    </div>
  );
}
