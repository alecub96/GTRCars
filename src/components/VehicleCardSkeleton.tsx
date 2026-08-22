'use client';

import React from 'react';

export default function VehicleCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-[#E9E1D2] bg-white p-4 space-y-4 shadow-sm"
        >
          {/* Foto Skeleton */}
          <div className="h-48 w-full rounded-2xl skeleton-shimmer" />

          {/* Textos Skeleton */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-28 rounded-full skeleton-shimmer" />
              <div className="h-3 w-10 rounded-full skeleton-shimmer" />
            </div>
            <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />
            <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
          </div>

          {/* Footer Skeleton */}
          <div className="pt-3 border-t border-[#E9E1D2] flex justify-between items-center">
            <div className="h-6 w-20 rounded-md skeleton-shimmer" />
            <div className="h-8 w-24 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
