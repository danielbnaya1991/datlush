import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'דתלוש — כמה מהתלוש שלך הולך לחרדים';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0eee9',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fbfaf6',
            border: '3px solid #0e0e0e',
            padding: '60px 80px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#0e0e0e',
              lineHeight: 1.1,
              textAlign: 'center',
              direction: 'rtl',
            }}
          >
            תלוש שכרדי
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#444',
              marginTop: 24,
              textAlign: 'center',
              direction: 'rtl',
            }}
          >
            כמה מתלוש השכר שלך הולך לחרדים מדי חודש
          </div>
          <div
            style={{
              width: 80,
              height: 5,
              background: '#E41B17',
              marginTop: 32,
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
