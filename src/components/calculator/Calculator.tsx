'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

    // Focus results for screen readers
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

  const annual = displayValue * 12;
  const career = displayValue * 12 * CAREER_YEARS;

  const fade = (fromStage: number) =>
    stage >= fromStage
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-3';

  return (
    <div className="mx-auto max-w-xl w-full px-2 py-4 sm:py-6">
      <div className="border border-slip-border bg-white">

        {/* ── Logo + Title ── */}
        <div className="px-3 py-5 sm:py-7 text-center">
          <Image
            src="/logo.png"
            alt="דתלוש"
            width={200}
            height={48}
            priority
            className="h-10 sm:h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-lg sm:text-xl font-bold leading-tight">
            כמה מהתלוש שלי הולך לחרדים?
          </h1>
        </div>

        <div className="mx-3 border-t border-slip-border" />

        {/* ── Salary ── */}
        <div className="p-2.5">
          <span className="block mb-2 text-sm font-bold text-muted-foreground">שכר ברוטו חודשי</span>
          <SalaryInput value={salary} onChange={setSalary} />
        </div>

        <div className="mx-3 border-t border-slip-border" />

        {/* ── Gender + Children ── */}
        <div className="grid grid-cols-2">
          <div className="p-2.5">
            <span className="block mb-2 text-sm font-bold text-muted-foreground">מגדר</span>
            <ProfileSelector value={gender} onChange={setGender} />
          </div>
          <div className="p-2.5">
            <span className="block mb-2 text-sm font-bold text-muted-foreground">ילדים</span>
            <ChildrenInput value={children} onChange={setChildren} />
          </div>
        </div>

        <div className="mx-3 border-t border-slip-border" />

        {/* ── Deductions + credits ── */}
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

        {/* ── Calculate button ── */}
        {!calculated && (
          <button
            type="button"
            onClick={() => setCalculated(true)}
            className="w-full bg-foreground text-white font-bold py-3 text-base cursor-pointer hover:bg-foreground/90 transition-colors"
          >
            חישוב
          </button>
        )}

        {/* ── Results ── */}
        {calculated && (
          <div ref={resultsRef} tabIndex={-1} className="outline-none">
            {/* ── Accent line ── */}
            <div className="h-[3px] bg-red-600" />

            {/* ── Punchline ── */}
            <div className="bg-foreground text-white px-3 py-6 sm:py-8 text-center overflow-hidden">
              <p
                className={`text-6xl sm:text-7xl font-bold leading-none tabular-nums transition-all duration-700 ease-out ${fade(1)}`}
                dir="ltr"
              >
                {formatNIS(displayValue)}
              </p>
              <p
                className={`text-3xl sm:text-4xl font-bold leading-snug mt-3 transition-all duration-500 ease-out ${fade(2)}`}
              >
                מהתלוש שלך<br />הולכים לחרדים<br />מדי חודש
              </p>
              <p
                className={`text-base sm:text-lg mt-3 transition-all duration-500 ease-out ${stage >= 3 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                שזה {formatNIS(annual)} בשנה<br />ו-{formatNIS(career)} לאורך {CAREER_YEARS} שנות קריירה
              </p>
            </div>
            {/* ── Tax breakdown mini-table ── */}
            {stage >= 4 && (
              <div className="animate-fade-in px-3 py-3">
                <table className="w-full border-collapse text-sm" dir="rtl">
                  <tbody>
                    {[
                      { label: 'שכר ברוטו (חודשי)', value: burden.tax.grossAnnual / 12 },
                      ...(burden.tax.taxableAnnual !== burden.tax.grossAnnual
                        ? [{ label: 'הכנסה חייבת במס', value: burden.tax.taxableAnnual / 12 }]
                        : []),
                      { label: 'מס הכנסה', value: Math.max(0, burden.tax.incomeTax - burden.tax.creditPoints) / 12 },
                      { label: 'ביטוח לאומי', value: burden.tax.nii / 12 },
                      { label: 'מס בריאות', value: burden.tax.healthTax / 12 },
                      { label: 'סה״כ מסים', value: burden.tax.netTax / 12, bold: true },
                      { label: 'חלקך מקופת המדינה', value: `${(burden.userTaxShare * 100).toFixed(6)}%`, raw: true },
                      { label: 'נטל חרדי (חודשי)', value: burden.combinedMonthly, bold: true, highlight: true },
                    ].map((row) => (
                      <tr key={row.label}>
                        <td className={`slip-cell !text-sm !py-1 !px-2 ${row.bold ? 'font-bold' : ''} ${row.highlight ? 'bg-red-600 text-white' : ''}`}>
                          {row.label}
                        </td>
                        <td className={`slip-cell !text-sm !py-1 !px-2 tabular-nums whitespace-nowrap text-start ${row.bold ? 'font-bold' : ''} ${row.highlight ? 'bg-red-600 text-white' : ''}`} dir="ltr">
                          {'raw' in row && row.raw ? row.value : formatNIS(row.value as number)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Below punchline (only renders after punchline is done) ── */}
            {stage >= 4 && (
              <>
                <div className="px-2">
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

                <div className="animate-fade-in" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
                  <ShareButton monthlyBurden={burden.combinedMonthly} />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Unified footer (shown in both states) ── */}
        <div className="px-3 py-3 text-center">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            המחשבון מבוסס על נתונים ופרסומים רשמיים של משרד האוצר, הלמ״ס, מכון הדמוקרטיה הישראלי ופורום קהלת (נתוני 2025-2026),
            ומציג הערכה אינדיקטיבית לצורכי מידע והמחשה בלבד.
            אין לראות בתוצאות תחליף לייעוץ מיסויי, כלכלי או משפטי מקצועי,
            והשימוש במידע המוצג הוא באחריות המשתמש/ת בלבד.
          </p>
        </div>
      </div>
    </div>
  );
}
