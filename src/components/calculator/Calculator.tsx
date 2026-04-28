'use client';

import { useState, useEffect, useRef } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { SalaryInput } from './SalaryInput';
import { ProfileSelector } from './ProfileSelector';
import { ChildrenInput } from './ChildrenInput';
import { AdvancedSettings } from './AdvancedSettings';
import { ShareButton } from './ShareButton';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { SourcesTable } from '@/components/methodology/SourcesTable';
import { FormulaExplainer } from '@/components/methodology/FormulaExplainer';
import { FAQ } from '@/components/methodology/FAQ';
import { formatNIS } from '@/lib/format';
import { CAREER_YEARS } from '@/lib/constants';

function PerfEdge({ side = 'top' }: { side?: 'top' | 'bottom' }) {
  const id = `perf-c4-${side}`;
  return (
    <svg
      width="100%"
      height="8"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      style={{ display: 'block', transform: side === 'bottom' ? 'scaleY(-1)' : 'none' }}
    >
      <defs>
        <pattern id={id} x="0" y="0" width="10" height="8" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 10 0 L 10 8 A 5 5 0 0 0 0 8 Z" fill="var(--slip-paper)" />
        </pattern>
      </defs>
      <rect width="200" height="8" fill={`url(#${id})`} />
    </svg>
  );
}

function VLine({
  n,
  label,
  value,
  valueRaw,
  dim,
}: {
  n?: number;
  label: string;
  value?: number;
  valueRaw?: string;
  dim?: boolean;
}) {
  return (
    <div
      className="flex justify-between items-baseline py-[7px] text-sm font-mono"
      style={{
        color: dim ? '#666' : 'var(--foreground)',
        borderBottom: '1px dotted #ccc',
      }}
    >
      <span className="flex gap-2 items-baseline">
        {n != null && (
          <span className="text-xs min-w-[24px]" style={{ color: '#aaa' }}>
            {String(n).padStart(2, '0')}
          </span>
        )}
        <span>{label}</span>
      </span>
      <span dir="ltr" className="tabular-nums whitespace-nowrap font-medium">
        {valueRaw ?? (value != null ? formatNIS(value) : '')}
      </span>
    </div>
  );
}

export function Calculator() {
  const [calculated, setCalculated] = useState(false);
  const {
    salary,
    setSalary,
    gender,
    setGender,
    children,
    setChildren,
    burden,
    childrenByAge,
    setChildrenByAge,
    singleParent,
    setSingleParent,
    pensionEnabled,
    setPensionEnabled,
    kerenEnabled,
    setKerenEnabled,
  } = useCalculator();

  // Staged reveal animation
  const [displayValue, setDisplayValue] = useState(0);
  const [stage, setStage] = useState(0);
  const hasAnimated = useRef(false);
  const rafId = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calculated) {
      hasAnimated.current = false;
      setDisplayValue(0);
      setStage(0);
      return;
    }

    if (hasAnimated.current) {
      setDisplayValue(burden.combinedMonthly);
      return;
    }

    hasAnimated.current = true;
    resultsRef.current?.focus();

    const target = burden.combinedMonthly;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(target);
      setStage(4);
      return;
    }

    setStage(1);
    const duration = 1000;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(target * eased);
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    rafId.current = requestAnimationFrame(animate);

    const t1 = setTimeout(() => setStage(2), 700);
    const t2 = setTimeout(() => setStage(3), 1100);
    const t3 = setTimeout(() => setStage(4), 1500);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [calculated, burden.combinedMonthly]);

  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const now = new Date();
  const yyyy = now.getFullYear();
  const monthHE = months[now.getMonth()];
  const invoiceNo = (Math.floor(salary * 3.14) % 99999).toString().padStart(5, '0');

  const fade = (fromStage: number) =>
    stage >= fromStage
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-3';

  return (
    <div className="mx-auto max-w-[480px] w-full px-2 sm:px-3 py-4 sm:py-8">
      <div style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}>
        <PerfEdge side="top" />

        <div
          dir="rtl"
          className="text-sm leading-relaxed"
          style={{
            background: 'var(--slip-paper)',
            color: 'var(--foreground)',
            fontFamily: "var(--font-sans)",
            padding: '16px 16px 18px',
          }}
        >
          {/* ═══ HEADER ═══ */}
          <header className="text-center" style={{ paddingBottom: 18, borderBottom: '3px double var(--foreground)' }}>
            {/* Eyebrow: doc label + invoice number */}
            <div
              className="flex justify-between items-center font-mono"
              style={{
                fontSize: 11,
                color: '#777',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                paddingBottom: 14,
                borderBottom: '1px solid #ddd',
                marginBottom: 16,
              }}
            >
              <span>חשבונית · {yyyy}</span>
              <span dir="ltr" className="font-bold" style={{ color: 'var(--foreground)' }}>
                № 26-{invoiceNo}
              </span>
            </div>

            {/* Brand name */}
            <h1
              style={{
                fontWeight: 900,
                fontSize: 'clamp(32px, 9vw, 48px)',
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: '0.01em',
              }}
            >
              תְּלוּשׁ שָׂכֲרֵדִי
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.4,
                margin: '14px 8px 0',
                color: '#333',
                textWrap: 'balance',
              }}
            >
              כמה מתלוש השכר שלך הולך לחרדים מדי חודש
            </p>
          </header>

          {/* ═══ Period meta strip ═══ */}
          <div
            className="flex justify-between items-center font-mono"
            style={{
              marginTop: 16,
              padding: '10px 0',
              fontSize: 13,
              borderBottom: '1px solid var(--foreground)',
            }}
          >
            <div>
              <span style={{ color: '#777' }}>תקופה </span>
              <span className="font-bold">{monthHE} {yyyy}</span>
            </div>
            <div
              style={{
                color: 'var(--slip-accent)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                fontSize: 12,
              }}
            >
              חיוב פעיל
            </div>
          </div>

          {/* ═══ Section heading ═══ */}
          <div
            className="text-center font-mono font-bold"
            style={{
              fontSize: 14,
              letterSpacing: '0.18em',
              color: '#444',
              margin: '20px 0 14px',
              textTransform: 'uppercase',
            }}
          >
            הפרטים שלי
          </div>

          {/* ═══ Inputs ═══ */}
          <div className="grid gap-4">
            <div>
              <div
                className="font-mono font-medium"
                style={{ fontSize: 13, color: '#444', letterSpacing: '0.04em', marginBottom: 6 }}
              >
                שכר ברוטו / חודש
              </div>
              <SalaryInput value={salary} onChange={setSalary} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div
                  className="font-mono font-medium"
                  style={{ fontSize: 13, color: '#444', letterSpacing: '0.04em', marginBottom: 6 }}
                >
                  מגדר
                </div>
                <ProfileSelector value={gender} onChange={setGender} />
              </div>
              <div>
                <div
                  className="font-mono font-medium"
                  style={{ fontSize: 13, color: '#444', letterSpacing: '0.04em', marginBottom: 6 }}
                >
                  ילדים
                </div>
                <ChildrenInput value={children} onChange={setChildren} />
              </div>
            </div>
          </div>

          {/* ═══ Advanced settings ═══ */}
          <AdvancedSettings
            pensionEnabled={pensionEnabled}
            setPensionEnabled={setPensionEnabled}
            singleParent={singleParent}
            setSingleParent={setSingleParent}
            kerenEnabled={kerenEnabled}
            setKerenEnabled={setKerenEnabled}
            flatChildren={children}
            childrenByAge={childrenByAge}
            setChildrenByAge={setChildrenByAge}
          />

          {/* ═══ Calculate button ═══ */}
          {!calculated && (
            <button
              type="button"
              onClick={() => setCalculated(true)}
              className="w-full cursor-pointer font-mono transition-colors hover:opacity-90"
              style={{
                marginTop: 20,
                padding: '16px 12px',
                background: 'var(--foreground)',
                color: '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              הפק חשבונית ›
            </button>
          )}

          {/* ═══ Results ═══ */}
          {calculated && (
            <div ref={resultsRef} tabIndex={-1} className="outline-none">
              {/* Line items */}
              <div style={{ marginTop: 20, paddingTop: 12, borderTop: '2px solid var(--foreground)' }}>
                <div
                  className="flex justify-between font-mono font-semibold"
                  style={{
                    fontSize: 12,
                    color: '#777',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    paddingBottom: 8,
                    borderBottom: '1px solid #999',
                    marginBottom: 4,
                  }}
                >
                  <span>פריט</span>
                  <span>סכום ₪</span>
                </div>
                <VLine
                  n={1}
                  label="מס הכנסה (חודשי)"
                  value={Math.max(0, (burden.tax.incomeTax - burden.tax.creditPoints) / 12)}
                />
                <VLine n={2} label="ביטוח לאומי" value={burden.tax.nii / 12} />
                <VLine n={3} label="מס בריאות" value={burden.tax.healthTax / 12} />
                <VLine n={4} label="חלקך · פערים פיסקליים" value={burden.fiscalMonthly} dim />
                <VLine n={5} label="חלקך · עלות מילואים" value={burden.reserveDutyMonthly} dim />
              </div>

              {/* ═══ THE BIG NUMBER ═══ */}
              <div
                className={`transition-all duration-700 ease-out ${fade(1)}`}
                style={{
                  marginTop: 22,
                  padding: '20px 14px 18px',
                  border: '3px solid var(--foreground)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--slip-paper)',
                }}
              >
                <div
                  className="font-mono font-semibold"
                  style={{
                    fontSize: 13,
                    letterSpacing: '0.22em',
                    color: '#555',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}
                >
                  נטל חרדי · חודשי
                </div>
                <div
                  dir="ltr"
                  style={{
                    fontSize: 'clamp(48px, 14vw, 80px)',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    textAlign: 'center',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.05em',
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {formatNIS(displayValue)}
                </div>

                {/* Accent bar */}
                <div
                  style={{
                    width: 64,
                    height: 4,
                    background: 'var(--slip-accent)',
                    margin: '16px auto',
                  }}
                />

                {/* Annual + Career columns */}
                <div
                  className={`grid grid-cols-2 gap-3 transition-all duration-500 ease-out ${fade(2)}`}
                >
                  <div style={{ borderInlineStart: '1px solid var(--foreground)', paddingInlineStart: 10 }}>
                    <div
                      className="font-semibold"
                      style={{ fontSize: 11, color: '#666', letterSpacing: '0.06em' }}
                    >
                      סה״כ שנתי
                    </div>
                    <div dir="ltr" className="font-bold" style={{ fontSize: 16, marginTop: 3 }}>
                      {formatNIS(displayValue * 12)}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ fontSize: 11, color: '#666', letterSpacing: '0.06em' }}
                    >
                      בקריירה שלמה ({CAREER_YEARS} שנה)
                    </div>
                    <div dir="ltr" className="font-bold" style={{ fontSize: 16, marginTop: 3 }}>
                      {formatNIS(displayValue * 12 * CAREER_YEARS)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ Below results ═══ */}
              {stage >= 3 && (
                <div className="animate-fade-in">
                  {/* Dashed divider + footnote */}
                  <div style={{ borderTop: '1px dashed var(--foreground)', margin: '18px 0 12px' }} />
                  <div className="font-mono" style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                    חשבונית זו אינה מסמך מס רשמי. מבוססת על נתוני אוצר, הלמ״ס, מכון הדמוקרטיה ופורום קהלת (2025–2026).
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2" style={{ marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={() => setCalculated(false)}
                      className="flex-1 cursor-pointer font-mono font-bold transition-colors hover:bg-slip-hover"
                      style={{
                        padding: '14px 10px',
                        background: 'transparent',
                        color: 'var(--foreground)',
                        border: '2px solid var(--foreground)',
                        fontSize: 13,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}
                    >
                      ‹ עריכה
                    </button>
                    <ShareButton monthlyBurden={burden.combinedMonthly} />
                  </div>
                </div>
              )}

              {/* ═══ Accordion sections ═══ */}
              {stage >= 4 && (
                <div className="animate-fade-in" style={{ marginTop: 16 }}>
                  <Accordion>
                    {[
                      { value: 'formula', label: 'איך מחשבים?', content: <FormulaExplainer /> },
                      { value: 'sources', label: 'מקורות נתונים', content: <SourcesTable /> },
                      { value: 'faq', label: 'שאלות נפוצות', content: <FAQ /> },
                    ].map((item, i) => (
                      <AccordionItem key={item.value} value={item.value}>
                        <div
                          className="animate-fade-in"
                          style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
                        >
                          <AccordionTrigger className="text-base">{item.label}</AccordionTrigger>
                        </div>
                        <AccordionContent>
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          )}
        </div>

        <PerfEdge side="bottom" />
      </div>
    </div>
  );
}
