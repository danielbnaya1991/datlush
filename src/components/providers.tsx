'use client';

import { DirectionProvider } from '@base-ui/react/direction-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider direction="rtl">
      {children}
    </DirectionProvider>
  );
}
