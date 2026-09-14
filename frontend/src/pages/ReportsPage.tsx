import { useState } from 'react';
import { FileBarChart, Download, Printer, CheckCircle2, BarChart3, TrendingUp } from 'lucide-react';
import { FilterRail } from '../components/ui/FilterRail';
import { KpiReportEmbed } from '../components/powerbi/KpiReportEmbed';
import { useKpiStore, useDeptStore } from '../lib/store';
import { calcSummaryMetrics, formatDate } from '../lib/utils';
import { sectionSchemas } from '../lib/sectionSchema';

export function ReportsPage() {
  const currentPeriodId = useKpiStore((s) => s.currentPeriodId);
  const getSubmission   = useKpiStore((s) => s.getSubmission);
  const periods         = useKpiStore((s) => s.periods);
  const [showPreview, setShowPreview] = useState(false);
  const [showToast,   setShowToast]   = useState(false);
  const dept = useDeptStore((s) => s.getSelectedDept());

  const submission    = getSubmission(currentPeriodId);
  const metrics       = calcSummaryMetrics(submission.data);
  const currentPeriod = periods.find((p) => p.id === currentPeriodId);

  const handleDownloadPdf = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const summaryMetrics = [
    { label: 'Total Faculty',    value: metrics.totalFaculty,                  color: '#6366f1' },
    { label: 'LMS Compliance',   value: `${metrics.lmsCompliancePercent}%`,    color: '#16a34a' },
    { label: 'On-time %',        value: `${metrics.onTimePunchInPercent}%`,    color: '#0891b2' },
    { label: 'Active MoUs',      value: metrics.activeMous,                    color: '#d97706' },
    { label: 'Patents Filed',    value: metrics.patentsFiledYtd,               color: '#9333ea' },
    { label: 'Placement Rate',   value: `${metrics.placementOfferRatePercent}%`, color: '#059669' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Reports
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Interactive Power BI analytics and KPI summary exports
          </p>
        </div>
        <FilterRail />
      </div>

      {/* ── Power BI Dashboard ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(79,70,229,0.3)',
          }}>
            <BarChart3 size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Power BI Interactive Dashboard
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '1px' }}>
              Live KPI visualizations · {dept.name}
            </p>
          </div>
        </div>
        <KpiReportEmbed periodId={currentPeriodId} minHeight={600} />
      </div>

      {/* ── Action Bar ── */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: '16px',
        border: '1px solid var(--border-color)', padding: '20px 24px',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        boxShadow: 'var(--shadow-card-val)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileBarChart size={20} style={{ color: '#4f46e5' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              KPI Summary Report — {currentPeriod?.label}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '2px' }}>
              Last updated: {formatDate(submission.lastUpdated)}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', fontSize: '0.85rem', fontWeight: 650,
              color: '#4f46e5', background: '#eef2ff',
              border: '1px solid #c7d2fe', borderRadius: '12px',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e0e7ff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#eef2ff'; }}
          >
            <Printer size={14} />
            {showPreview ? 'Hide Preview' : 'Generate Report'}
          </button>
          <button
            onClick={handleDownloadPdf}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', fontSize: '0.85rem', fontWeight: 650,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
              border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
              transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      {/* ── Report Preview ── */}
      {showPreview && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)', animation: 'scaleIn 0.2s ease-out forwards' }}>
          {/* Report header */}
          <div style={{
            padding: '28px 32px',
            background: 'linear-gradient(135deg, #0d1b3e 0%, #1a2d6b 100%)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <TrendingUp size={18} style={{ color: '#818cf8' }} />
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Department KPI Report
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {dept.name}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Period: {currentPeriod?.label} · Generated {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Summary metrics */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-faint)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Key Metrics Summary
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {summaryMetrics.map((m) => (
                <div key={m.label} style={{
                  background: 'var(--bg-surface)', borderRadius: '12px',
                  padding: '16px', textAlign: 'center',
                  border: '1px solid var(--border-color)',
                  borderTop: `3px solid ${m.color}`,
                }}>
                  <p style={{ fontSize: '1.65rem', fontWeight: 800, color: m.color, letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section details */}
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Section Details
            </p>
            {sectionSchemas.map((schema) => {
              const sectionData = submission.data[schema.key as keyof typeof submission.data] as unknown as Record<string, unknown>;
              return (
                <div key={schema.key} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 18px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-faint)' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{schema.title}</h4>
                  </div>
                  <div style={{ padding: '12px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '6px 20px' }}>
                    {schema.fields.map((field) => {
                      const val = sectionData[field.key];
                      const displayVal = Array.isArray(val)
                        ? (val as string[]).join(', ') || '—'
                        : val !== undefined && val !== null && val !== ''
                        ? String(val)
                        : '—';
                      return (
                        <div key={field.key} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-faint)' }}>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginRight: '8px', flex: 1 }}>{field.label}</span>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>{displayVal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {showToast && (
        <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 50, animation: 'slideInRight 0.3s ease-out forwards' }}>
          <div style={{
            background: '#0d1b3e', color: 'white',
            padding: '14px 20px', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            fontSize: '0.875rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
            Export will be enabled once Power BI is connected.
          </div>
        </div>
      )}
    </div>
  );
}
