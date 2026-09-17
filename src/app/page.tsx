import React, { Suspense } from 'react';
import HomeClientSupercars from '@/components/HomeClientSupercars';

export const revalidate = 60;

export default async function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeClientSupercars />
    </Suspense>
  );
}
