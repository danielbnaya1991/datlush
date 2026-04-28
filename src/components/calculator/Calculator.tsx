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
  const prevValue = useRef(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Animate number from prevValue → target whenever burden changes
  useEffect(() => {
    if (!calculated) {
      hasAnimated.current = false;
      prevValue.current = 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on uncalculate
      setDisplayValue(0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStage(0);
      return;
    }

    const target = burden.combinedMonthly;
    const from = prevValue.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(target);
      prevValue.current = target;
      if (!hasAnimated.current) { hasAnimated.current = true; setStage(5); }
      return;
    }

    // First reveal: staged entrance
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      resultsRef.current?.focus();
      setStage(1);
      const t1 = setTimeout(() => setStage(2), 600);
      const t2 = setTimeout(() => setStage(3), 900);
      const t3 = setTimeout(() => setStage(4), 1200);
      const t4 = setTimeout(() => setStage(5), 1500);
      const duration = 1000;
      const start = performance.now();
      function firstAnimate(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(from + (target - from) * eased);
        if (progress < 1) {
          rafId.current = requestAnimationFrame(firstAnimate);
        } else {
          prevValue.current = target;
        }
      }
      rafId.current = requestAnimationFrame(firstAnimate);
      return () => {
        cancelAnimationFrame(rafId.current);
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      };
    }

    // Subsequent changes: just animate the number
    cancelAnimationFrame(rafId.current);
    const duration = 400;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(from + (target - from) * eased);
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = target;
      }
    }
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
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
              <span>תלוש שכר · {yyyy}</span>
              <span dir="ltr" className="font-bold" style={{ color: 'var(--foreground)' }}>
                № 26-{invoiceNo}
              </span>
            </div>

            {/* Brand logo */}
            <h1 style={{ margin: 0 }}>
              <img
                src="/logo.png"
                alt="דתלוש"
                style={{ height: 'clamp(36px, 9vw, 52px)', width: 'auto', margin: '0 auto', display: 'block' }}
              />
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
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
                color: '#777',
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
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              חישוב
            </button>
          )}

          {/* ═══ Results ═══ */}
          {calculated && (
            <div ref={resultsRef} tabIndex={-1} className="outline-none">
              {/* ═══ THE BIG NUMBER — first thing the user sees ═══ */}
              <div
                className={`transition-all duration-700 ease-out ${fade(1)}`}
                style={{
                  marginTop: 20,
                  padding: '20px 14px 18px',
                  border: '3px solid var(--foreground)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--slip-paper)',
                }}
              >
                {/* Big number */}
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

                {/* Context line */}
                <div
                  className={`font-mono text-center font-bold transition-all duration-500 ease-out ${fade(2)}`}
                  style={{ fontSize: 13, color: '#555', lineHeight: 1.5, marginTop: 12 }}
                >
                  מהתלוש שלך הולכים לחרדים מדי חודש
                </div>

                {/* Accent bar — under the text */}
                <div
                  className={`transition-all duration-500 ease-out ${fade(3)}`}
                  style={{
                    width: 64,
                    height: 4,
                    background: '#999',
                    margin: '12px auto 0',
                  }}
                />

                {/* Annual + Career — centered */}
                <div
                  className={`grid grid-cols-2 gap-3 transition-all duration-500 ease-out ${fade(3)}`}
                  style={{ marginTop: 14 }}
                >
                  <div className="text-center">
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
                  <div className="text-center">
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
              {stage >= 4 && (
                <div className="animate-fade-in">
                  {/* Dashed divider + footnote */}
                  <div style={{ borderTop: '1px dashed var(--foreground)', margin: '18px 0 12px' }} />
                  <div className="font-mono" style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                    הנתונים מבוססים על פרסומי אוצר, הלמ״ס, מכון הדמוקרטיה ופורום קהלת (2025–2026).
                    המחשבון כולל רק מסים ישירים — בפועל הסכום גבוה יותר, כי את/ה משלם/ת גם מע״מ ומסים עקיפים.
                  </div>

                  {/* Share button */}
                  <div style={{ marginTop: 16 }}>
                    <ShareButton />
                  </div>
                </div>
              )}

              {/* ═══ Accordion sections ═══ */}
              {stage >= 5 && (
                <div className="animate-fade-in" style={{ marginTop: 16 }}>
                  <Accordion>
                    {[
                      { value: 'formula', label: 'איך זה מחושב?', content: <FormulaExplainer /> },
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

      {/* ═══ Legal disclaimer ═══ */}
      <p
        dir="rtl"
        style={{
          fontSize: 10,
          lineHeight: 1.5,
          color: '#999',
          marginTop: 16,
          textAlign: 'center',
          padding: '0 8px',
        }}
      >
        המידע באתר זה מוצג למטרות אינפורמטיביות בלבד ואינו מהווה ייעוץ מקצועי, כלכלי, מיסויי או משפטי מכל סוג שהוא.
        החישובים מבוססים על הערכות, נתונים ציבוריים ומודלים סטטיסטיים, ואינם מדויקים ברמת הפרט.
        בעל האתר אינו נושא באחריות כלשהי לכל נזק, הפסד או הסתמכות על המידע המוצג.
        השימוש באתר הוא על אחריות המשתמש/ת בלבד.
      </p>
    </div>
  );
}
