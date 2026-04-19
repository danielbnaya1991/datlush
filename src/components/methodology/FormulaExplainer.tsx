export function FormulaExplainer() {
  return (
    <div className="space-y-5 text-base leading-relaxed">
      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 1: כמה מסים את/ה משלם/ת בשנה</h3>
        <p>
          המחשבון מחשב שלושה רכיבים: מס הכנסה (לפי מדרגות), ביטוח לאומי ומס בריאות.
          ממס ההכנסה מורידים נקודות זיכוי (הנחות שמגיעות לכל עובד/ת).
        </p>

        <p className="font-bold pt-2">ההכנסה החייבת במס (לא הברוטו):</p>
        <p>
          אם סימנת &quot;הפרשת פנסיה&quot; (ברירת מחדל 6% לפי צו ההרחבה לפנסיה חובה)
          ו/או &quot;קרן השתלמות&quot; (2.5% מהשכר עד תקרה של ₪15,712) —
          חלק השכר הזה יורד מההכנסה החייבת במס הכנסה, אבל לא משפיע על
          בסיס ביטוח לאומי ומס בריאות (הם מחושבים על הברוטו המלא).
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
          taxable = gross − pension(0-7%) − keren(2.5%)
        </div>

        <p className="font-bold pt-2">נקודות זיכוי:</p>
        <p>
          בסיס: 2.25 לגבר, 2.75 לאישה. לכל ילד מתווספות נקודות לפי גיל הילד/ה:
          0-5 שנים — 2.0 (גבר) / 2.5 (אישה); 6-17 — 1.0; 18+ — 0.
          במעמד הורה יחיד מתווספת נקודה נוספת להורה וכן נקודה לכל ילד/ה מתחת לגיל 18.
          ערך נקודה: ₪242 לחודש.
        </p>

        <p className="font-bold pt-2">המס הסופי:</p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
          netTax = max(0, incomeTax(taxable) − creditPoints) + NII(gross) + healthTax(gross)
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 2: מהו החלק היחסי שלך בקופת המדינה</h3>
        <p>
          בשנת 2025 המדינה גבתה כ-₪509 מיליארד ממסים (שיא היסטורי).
          מחלקים את המסים שאת/ה משלם/ת בסכום הזה כדי לדעת איזה אחוז מהקופה מקורו בכיס שלך.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
          yourShare = yourTax / 509,300,000,000
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 3: סך הנטל — שני רכיבים</h3>
        <p>
          <strong>רכיב א׳ — הנטל הפיסקלי (פורום קהלת, עדכון 2026):</strong>
          {' '}כ-260 אלף משפחות חרדיות מקבלות מהמדינה נטו כ-₪5,983 בחודש בממוצע —
          הפער בין כל מה שהן מקבלות (קצבאות, סיוע בדיור, חינוך מסובסד, שירותים ציבוריים)
          לבין כל מה שהן משלמות (מסים ישירים ועקיפים). זה מצטבר לכ-₪18.7 מיליארד לשנה.
        </p>
        <p>
          <strong>רכיב ב׳ — עלות אי-השירות הצבאי (בנק ישראל, דצמ׳ 2025):</strong>
          {' '}בנק ישראל פרסם שגיוס 20 אלף חרדים היה חוסך כ-₪9 מיליארד בשנה
          בעלות מילואים שנופלת על שאר המשרתים. זה עומס כלכלי ממשי (אובדן שכר
          ופרודוקטיביות) שלא נכלל בחישוב הפיסקלי של קהלת ולכן מתווסף אליו.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
          totalBurden = 18.67B (Kohelet) + 9B (BoI) = 27.67B / year
        </div>
      </section>

      <section className="space-y-1.5">
        <h3 className="font-bold">שלב 4: הנטל האישי שלך</h3>
        <p>
          מכפילים את הנטל הכולל בחלק היחסי שלך מקופת המדינה,
          ומחלקים ב-12 כדי לקבל את הסכום החודשי —
          זהו הסכום שמחושב מהתלוש שלך ומופנה בפועל, ישירות ובעקיפין,
          לסבסוד הציבור החרדי ולכיסוי עלות אי-השירות שלו.
        </p>
        <div className="bg-slip-hover/50 border border-slip-border p-2.5 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
          monthlyBurden = totalBurden × yourShare / 12
        </div>
      </section>
    </div>
  );
}
