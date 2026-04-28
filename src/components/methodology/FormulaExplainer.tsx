export function FormulaExplainer() {
  return (
    <div className="space-y-6 text-sm leading-[1.7]">
      <section className="space-y-2">
        <h3 className="font-bold text-base">שלב 1: כמה מסים את/ה משלם/ת בשנה</h3>
        <p>
          המחשבון מחשב שלושה רכיבים: מס הכנסה (לפי מדרגות), ביטוח לאומי ומס בריאות.
          ממס ההכנסה מורידים נקודות זיכוי — הנחות שמגיעות לכל עובד/ת.
        </p>

        <p className="font-bold">ההכנסה החייבת במס:</p>
        <p>
          הפרשת פנסיה (ברירת מחדל 6%) ו/או קרן השתלמות (2.5% עד תקרה של ₪15,712) —
          יורדות מההכנסה החייבת במס הכנסה. ביטוח לאומי ומס בריאות מחושבים על הברוטו המלא.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          taxable = gross − pension − keren
        </div>

        <p className="font-bold">נקודות זיכוי:</p>
        <p>
          בסיס: 2.25 לגבר, 2.75 לאישה.
          לכל ילד/ה מתווספות נקודות לפי גיל:
          0-5 שנים — 3.33 (לשני ההורים),
          6-17 — 1.0 לאב / 2.0 לאם,
          18+ — 0.
          במעמד הורה יחיד: +1 להורה ו-+1 לכל ילד/ה מתחת ל-18.
          ערך נקודה: ₪242 לחודש.
        </p>

        <p className="font-bold">המס הסופי:</p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          netTax = max(0, incomeTax − credits) + NII + healthTax
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-base">שלב 2: החלק שלך מקופת המדינה</h3>
        <p>
          בשנת 2025 המדינה גבתה כ-₪509 מיליארד ממסים.
          מחלקים את המסים שלך בסכום הזה כדי לדעת איזה חלק מהקופה מקורו בכיס שלך.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          yourShare = yourTax / totalRevenue
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-base">שלב 3: סך הנטל — שני רכיבים</h3>
        <p>
          <strong>א׳ — הנטל הפיסקלי (פורום קהלת 2026):</strong>{' '}
          כ-260 אלף משפחות חרדיות מקבלות מהמדינה נטו כ-₪5,983 בחודש —
          הפער בין מה שהן מקבלות (קצבאות, סיוע בדיור, חינוך מסובסד, שירותים)
          לבין מה שהן משלמות במסים. סה״כ כ-₪18.67 מיליארד לשנה.
        </p>
        <p>
          <strong>ב׳ — עלות אי-השירות הצבאי (בנק ישראל, דצמ׳ 2025):</strong>{' '}
          גיוס 20 אלף חרדים היה חוסך כ-₪9 מיליארד בשנה
          בעומס מילואים על שאר המשרתים. עלות כלכלית ממשית
          שלא נכללת בחישוב הפיסקלי ולכן מתווספת אליו.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          totalBurden = 18.67B + 9B = 27.67B / year
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-base">שלב 4: הנטל האישי שלך</h3>
        <p>
          מכפילים את הנטל הכולל בחלק שלך מקופת המדינה,
          ומחלקים ב-12 לסכום חודשי.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          monthlyBurden = totalBurden × yourShare / 12
        </div>
      </section>
    </div>
  );
}
