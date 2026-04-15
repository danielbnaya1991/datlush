'use client';

import { useState, useEffect, useRef } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { SalaryInput } from './SalaryInput';
import { ProfileSelector } from './ProfileSelector';
import { ChildrenInput } from './ChildrenInput';
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
    setStage(1);

    // Focus results for screen readers
    resultsRef.current?.focus();

    const target = burden.combinedMonthly;
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
          <img src="/logo.png" alt="דתלוש" className="h-10 sm:h-12 mx-auto mb-4" />
          <h1 className="text-lg sm:text-xl font-bold leading-tight">
            כמה מהתלוש שלי הולך לחרדים?
          </h1>
        </div>

        <div className="mx-3 border-t border-slip-border" />

        {/* ── Salary ── */}
        <div className="p-2.5">
          <span className="block mb-2 text-[11px] font-bold text-muted-foreground">שכר ברוטו חודשי</span>
          <SalaryInput value={salary} onChange={setSalary} />
        </div>

        <div className="mx-3 border-t border-slip-border" />

        {/* ── Gender + Children ── */}
        <div className="grid grid-cols-2">
          <div className="p-2.5">
            <span className="block mb-2 text-[11px] font-bold text-muted-foreground">מגדר</span>
            <ProfileSelector value={gender} onChange={setGender} />
          </div>
          <div className="p-2.5">
            <span className="block mb-2 text-[11px] font-bold text-muted-foreground">ילדים</span>
            <ChildrenInput value={children} onChange={setChildren} />
          </div>
        </div>

        {/* ── Calculate button ── */}
        {!calculated && (
          <>
            <div className="mx-3 border-t border-slip-border" />
            <button
              type="button"
              onClick={() => setCalculated(true)}
              className="w-full bg-foreground text-white font-bold py-3 text-sm cursor-pointer hover:bg-foreground/90 transition-colors"
            >
              חישוב
            </button>
            <div className="px-3 py-2 text-center">
              <p className="text-[10px] text-muted-foreground">
                מבוסס על נתוני משרד האוצר, הלמ״ס ומכון הדמוקרטיה · המחשה בלבד
              </p>
            </div>
          </>
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
                className={`text-sm sm:text-base mt-3 transition-all duration-500 ease-out ${stage >= 3 ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                שזה {formatNIS(annual)} בשנה<br />ו-{formatNIS(career)} לאורך {CAREER_YEARS} שנות קריירה
              </p>
              <p
                className={`text-xs mt-4 transition-all duration-500 ease-out ${stage >= 3 ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                (חח אבל שטויות מי סופר?)
              </p>
            </div>
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
                          <AccordionTrigger className="text-sm">{item.label}</AccordionTrigger>
                        </div>
                        <AccordionContent>
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
                  <ShareButton />
                </div>

                <div className="px-3 py-3 text-center animate-fade-in" style={{ animationDelay: '320ms', animationFillMode: 'both' }}>
                  <p className="text-[9px] leading-relaxed text-muted-foreground">
                    הנתונים מבוססים על פרסומים של משרד האוצר, הלמ״ס, מכון הדמוקרטיה הישראלי ופורום קהלת.
                    החישוב הוא הערכה כללית בלבד, אינו מדויק ועשוי לסטות מהמציאות.
                    האתר אינו מהווה ייעוץ מיסויי, כלכלי או משפטי מכל סוג שהוא.
                    השימוש באתר הוא על אחריות המשתמש/ת בלבד.
                    <br />
                    {new Date().toLocaleDateString('he-IL')}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
