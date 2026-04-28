const SOURCES = [
  {
    parameter: 'מדרגות מס הכנסה 2026',
    value: '10%–47%',
    source: 'רשות המיסים (עדכון תקציב 2026)',
    url: 'https://en.globes.co.il/en/article-revised-income-tax-brackets-boost-march-salary-1001539434',
  },
  {
    parameter: 'ערך נקודת זיכוי',
    value: '₪242 לחודש',
    source: 'רשות המיסים',
    url: 'https://www.gov.il/he/departments/general/income-tax-rates',
  },
  {
    parameter: 'נקודות זיכוי לילדים (לפי גיל)',
    value: '0-5: 3.33 · 6-17: 1.0/2.0 · 18+: 0',
    source: 'רשות המיסים (§40 פקודת מס הכנסה)',
    url: 'https://www.gov.il/he/pages/income-tax-credit-points',
  },
  {
    parameter: 'נקודות זיכוי להורה יחיד',
    value: '+1 להורה, +1 לכל ילד/ה מתחת ל-18',
    source: 'רשות המיסים (§40(ב)(2))',
    url: 'https://www.gov.il/he/pages/income-tax-credit-points',
  },
  {
    parameter: 'ביטוח לאומי + מס בריאות',
    value: '1.04%–7% / 3.23%–5.17%',
    source: 'ביטוח לאומי (תיקון 252)',
    url: 'https://www.btl.gov.il/Insurance/Rates/Pages/לעובדים%20שכירים.aspx',
  },
  {
    parameter: 'הפרשת עובד/ת לפנסיה חובה',
    value: '6% מהשכר (ברירת מחדל)',
    source: 'צו הרחבה לפנסיה חובה 2017',
    url: 'https://www.gov.il/he/pages/pension_rights',
  },
  {
    parameter: 'הפרשת עובד/ת לקרן השתלמות',
    value: '2.5% עד תקרה של ₪15,712',
    source: 'פקודת מס הכנסה §3(ה)',
    url: 'https://www.kolzchut.org.il/he/קרן_השתלמות',
  },
  {
    parameter: 'שכר ממוצע במשק',
    value: '₪13,514',
    source: 'הלמ״ס 2024',
    url: 'https://www.cbs.gov.il/he/mediarelease/DocLib/2025/070/26_25_070b.pdf',
  },
  {
    parameter: 'סך הכנסות המדינה ממסים',
    value: '~₪509 מיליארד לשנה',
    source: 'רשות המיסים 2025',
    url: 'https://en.globes.co.il/en/article-tax-collection-in-israel-up-12-in-2025-1001531232',
  },
  {
    parameter: 'אחוז החרדים מהאוכלוסייה',
    value: '~14%',
    source: 'מכון הדמוקרטיה 2025',
    url: 'https://en.idi.org.il/haredi/2025/?chapter=63076',
  },
  {
    parameter: 'אחוז החרדים מהכנסות המסים',
    value: '~4%',
    source: 'מכון הדמוקרטיה 2024',
    url: 'https://en.idi.org.il/articles/59401',
  },
  {
    parameter: 'כמה משפחה חרדית מקבלת מהמדינה (נטו)',
    value: '~₪5,983 לחודש',
    source: 'פורום קהלת, עדכון 2026',
    url: 'https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994',
  },
  {
    parameter: 'עלות אי-גיוס חרדים (מילואים)',
    value: '~₪9 מיליארד לשנה',
    source: 'בנק ישראל, דצמ׳ 2025',
    url: 'https://www.boi.org.il/en/communication-and-publications/press-releases/10-12-25-en/',
  },
  {
    parameter: 'כמה משפחה לא-חרדית משלמת למדינה (נטו)',
    value: '~₪8,842 לחודש',
    source: 'פורום קהלת, עדכון 2026',
    url: 'https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994',
  },
  {
    parameter: 'אחוז גברים חרדים שעובדים',
    value: '54%',
    source: 'מכון הדמוקרטיה הישראלי 2026',
    url: 'https://en.idi.org.il/articles/63385',
  },
  {
    parameter: 'אחוז גברים יהודים לא-חרדים שעובדים',
    value: '87%',
    source: 'מכון הדמוקרטיה הישראלי 2026',
    url: 'https://en.idi.org.il/articles/63385',
  },
  {
    parameter: 'אחוז נשים חרדיות שעובדות',
    value: '~80%',
    source: 'מכון הדמוקרטיה הישראלי 2026',
    url: 'https://en.idi.org.il/articles/63385',
  },
  {
    parameter: 'מספר משפחות חרדיות (אומדן)',
    value: '~260,000',
    source: 'מכון הדמוקרטיה / הלמ״ס (נגזר)',
    url: 'https://en.idi.org.il/haredi/2025/?chapter=63076',
  },
];

export function SourcesTable() {
  return (
    <div className="space-y-0 divide-y divide-slip-border">
      {SOURCES.map((s) => (
        <div key={s.parameter} className="py-2.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-bold text-sm">{s.parameter}</span>
            <span className="tabular-nums text-sm">{s.value}</span>
          </div>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground/70 mt-0.5 inline-block break-all"
          >
            {s.source}
          </a>
        </div>
      ))}
    </div>
  );
}
