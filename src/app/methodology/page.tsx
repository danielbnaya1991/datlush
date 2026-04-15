import type { Metadata } from 'next';
import { SourcesTable } from '@/components/methodology/SourcesTable';
import { FormulaExplainer } from '@/components/methodology/FormulaExplainer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'מקורות ושיטת חישוב — כמה מהתלוש שלי הולך לחרדים',
  description: 'הסבר מפורט על איך המספרים חושבו, מאיפה הנתונים, ומה הטווח',
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-2xl w-full space-y-8 px-4 py-8">
      <div className="space-y-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← חזרה למחשבון
        </Link>
        <h1 className="text-2xl font-bold">מקורות ושיטת חישוב</h1>
        <p className="text-muted-foreground">
          כל הנתונים במחשבון מבוססים על מקורות רשמיים — משרד האוצר, הלמ״ס,
          מכון הדמוקרטיה ופורום קהלת.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">מקורות נתונים</h2>
        <SourcesTable />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">איך מחשבים?</h2>
        <FormulaExplainer />
      </section>

      <section className="space-y-3 border border-slip-border bg-muted/30 p-6 text-sm">
        <h2 className="text-lg font-semibold">חשוב לדעת</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>המחשבון מיועד להמחשה בלבד ואינו ייעוץ כלכלי או מיסויי.</li>
          <li>הנתונים מבוססים על הפרסומים האחרונים (2024–2025).</li>
          <li>חישוב המס הוא אומדן — ייתכנו הטבות, ניכויים וזיכויים נוספים שלא נלקחו בחשבון.</li>
          <li>הטווח מבוסס על פערים בין מקורות שונים, לא על חישוב סטטיסטי.</li>
        </ul>
      </section>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          חזרה למחשבון
        </Link>
      </div>
    </div>
  );
}
