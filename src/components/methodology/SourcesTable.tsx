const SOURCES = [
  {
    parameter: 'מדרגות מס הכנסה 2025',
    value: '10%–47%',
    source: 'רשות המיסים',
    url: 'https://www.gov.il/he/departments/general/income-tax-rates',
  },
  {
    parameter: 'ערך נקודת זיכוי',
    value: '₪242 לחודש',
    source: 'רשות המיסים',
    url: 'https://www.gov.il/he/departments/general/income-tax-rates',
  },
  {
    parameter: 'ביטוח לאומי + מס בריאות',
    value: '1.04%–7% / 3.23%–5.17%',
    source: 'ביטוח לאומי (תיקון 252)',
    url: 'https://www.btl.gov.il/Insurance/Rates/Pages/לעובדים%20שכירים.aspx',
  },
  {
    parameter: 'שכר ממוצע במשק',
    value: '₪13,514',
    source: 'הלמ״ס 2024',
    url: 'https://www.cbs.gov.il/he/mediarelease/DocLib/2025/070/26_25_070b.pdf',
  },
  {
    parameter: 'סך הכנסות המדינה ממסים',
    value: '~₪455 מיליארד לשנה',
    source: 'משרד האוצר 2024',
    url: 'https://fs.knesset.gov.il/globaldocs/MMM/6745f598-afce-ef11-a856-005056aa1f91/2_6745f598-afce-ef11-a856-005056aa1f91_11_20780.pdf',
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
    value: '~₪4,137 לחודש',
    source: 'פורום קהלת',
    url: 'https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994',
  },
  {
    parameter: 'כמה משפחה לא-חרדית משלמת למדינה (נטו)',
    value: '~₪6,114 לחודש',
    source: 'פורום קהלת',
    url: 'https://www.jpost.com/israel-news/politics-and-diplomacy/article-886994',
  },
  {
    parameter: 'כמה כסף המדינה הייתה מרוויחה אם חרדים היו עובדים',
    value: '₪9.5 מיליארד לשנה',
    source: 'מכון הדמוקרטיה 2024',
    url: 'https://en.idi.org.il/articles/59401',
  },
  {
    parameter: 'עלות אי-העבודה של חרדים לכל עובד/ת',
    value: '₪3,540 לשנה',
    source: 'מכון הדמוקרטיה 2024',
    url: 'https://en.idi.org.il/articles/59401',
  },
  {
    parameter: 'אחוז גברים חרדים שעובדים',
    value: '54%',
    source: 'הלמ״ס 2024',
    url: 'https://www.calcalist.co.il/local_news/article/hk8qvnefke',
  },
  {
    parameter: 'אחוז גברים לא-חרדים שעובדים',
    value: '87%',
    source: 'הלמ״ס / מרכז טאוב 2024',
    url: 'https://www.taubcenter.org.il/en/research/labor-market-in-the-shadow-of-war/',
  },
  {
    parameter: 'מספר משפחות חרדיות',
    value: '~260,000',
    source: 'מכון הדמוקרטיה / הלמ״ס',
    url: 'https://en.idi.org.il/haredi/2025/?chapter=63076',
  },
];

export function SourcesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="slip-cell font-bold text-start !text-xs !py-1.5 !px-2">נתון</th>
            <th className="slip-cell font-bold text-start !text-xs !py-1.5 !px-2">ערך</th>
            <th className="slip-cell font-bold text-start !text-xs !py-1.5 !px-2">מקור</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => (
            <tr key={s.parameter}>
              <td className="slip-cell !text-xs !py-1.5 !px-2">{s.parameter}</td>
              <td className="slip-cell !text-xs !py-1.5 !px-2 tabular-nums whitespace-nowrap">{s.value}</td>
              <td className="slip-cell !text-xs !py-1.5 !px-2">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground/70"
                >
                  {s.source}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
