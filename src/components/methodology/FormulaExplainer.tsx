export function FormulaExplainer() {
  return (
    <div className="space-y-5 text-sm leading-relaxed">
      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 1: כמה מס יורד לך מהתלוש</h3>
        <p>
          קודם כל מחשבים את כל המסים שלך בשנה: מס הכנסה (לפי מדרגות),
          ביטוח לאומי ומס בריאות. מזה מורידים הנחות שמגיעות לך (נקודות זיכוי).
          נקודות הזיכוי לילדים מחושבות בצורה מפושטת — בפועל הן תלויות בגיל הילדים.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          netTax = max(0, incomeTax − creditPoints) + NII + healthTax
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 2: החלק שלך מהקופה</h3>
        <p>
          כל שנה נכנסים לקופת המדינה כ-₪455 מיליארד ממסים.
          מחלקים את המסים שלך בסכום הזה כדי לדעת מה החלק שלך.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          yourShare = yourTax / 455,400,000,000
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 3: כסף שעובר למשפחות חרדיות</h3>
        <p>
          כ-260 אלף משפחות חרדיות מקבלות מהמדינה בממוצע ₪4,137 בחודש —
          קצבאות, הבטחת הכנסה, דיור ועוד. לוקחים את הסכום הכולל,
          וכופלים בחלק שלך.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          transfers = (4,137 × 260,000 × 12) × yourShare / 12
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 4: מסים שלא נגבים</h3>
        <p>
          כמעט מחצית מהגברים החרדים לא עובדים (רק 54% עובדים, לעומת 87% בשאר האוכלוסייה).
          לפי מכון הדמוקרטיה, אם כולם היו עובדים המדינה הייתה מרוויחה
          עוד ₪9.5 מיליארד בשנה. הכסף הזה חסר — וכופלים בחלק שלך.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          missingTax = 9,500,000,000 × yourShare / 12
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 5: סה״כ</h3>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          total = transfers + missingTax
        </div>
      </section>
    </div>
  );
}
