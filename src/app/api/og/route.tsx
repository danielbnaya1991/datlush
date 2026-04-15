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
          backgroundColor: '#1a1a1a',
          fontFamily: 'Heebo',
          direction: 'rtl',
          position: 'relative',
        }}
      >
        {/* Red accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: '#dc2626', display: 'flex' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '28px', color: '#999999', margin: 0 }}>
            מתוך תלוש של {formatNIS(clampedSalary)}
          </p>
          <p
            style={{
              fontSize: '108px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {formatNIS(burden.combinedMonthly)}
          </p>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            מהתלוש שלך הולכים לחרדים
          </p>
          <p style={{ fontSize: '20px', color: '#666666', margin: 0, marginTop: '8px' }}>
            שזה {formatNIS(burden.combinedMonthly * 12)} בשנה
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <p style={{ fontSize: '18px', color: '#555555' }}>
            דתלוש — כמה מהתלוש שלי הולך לחרדים?
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Heebo',
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
