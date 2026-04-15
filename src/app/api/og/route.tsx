import { ImageResponse } from 'next/og';
import { computeBurden } from '@/engine/burden';
import { formatNIS } from '@/lib/format';
import type { Gender } from '@/engine/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salary = parseInt(searchParams.get('salary') || '15000', 10);
  const gender = (searchParams.get('gender') || 'male') as Gender;
  const children = parseInt(searchParams.get('children') || '0', 10);

  const clampedSalary = Math.max(5000, Math.min(80000, salary));
  const burden = computeBurden(clampedSalary, gender, children);

  const fontPath = join(process.cwd(), 'assets', 'Heebo-Bold.ttf');
  const fontData = await readFile(fontPath);

  const response = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'Arial',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <p style={{ fontSize: '28px', color: '#64748b', margin: 0 }}>
            מתוך משכורת של {formatNIS(clampedSalary)}
          </p>
          <p
            style={{
              fontSize: '96px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {formatNIS(burden.combinedMonthly)}
          </p>
          <p style={{ fontSize: '32px', color: '#475569', margin: 0 }}>
            בחודש הולכים לחרדים
          </p>
        </div>
        <p
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#94a3b8',
          }}
        >
          כמה מהמשכורת שלי הולכת לחרדים?
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Arial',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );

  response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  return response;
}
