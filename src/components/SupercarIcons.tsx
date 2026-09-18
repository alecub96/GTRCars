import React from 'react';

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  alt?: string;
}

/**
 * Supercar silhouettes using the high-fidelity user line-art assets from /Icons:
 * - Coupé: /Icons/cupe.png
 * - Descapotable / Spyder: /Icons/spyder.png
 * - Sedán Deportivo: /Icons/sedan.png
 * - Super SUV: /Icons/suv.png
 */

// 1. Coupé / Berlinetta V8
export function SupercarV8Silhouette({ className = 'w-16 h-8', alt = 'Coupé', ...props }: IconProps) {
  return (
    <img
      src="/Icons/cupe.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 2. Hypercar V12 (usamos la silueta Coupé de alta gama)
export function HypercarSilhouette({ className = 'w-16 h-8', alt = 'Hypercar V12', ...props }: IconProps) {
  return (
    <img
      src="/Icons/cupe.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 3. Track GT (usamos la silueta Coupé)
export function TrackGTSilhouette({ className = 'w-16 h-8', alt = 'Track GT', ...props }: IconProps) {
  return (
    <img
      src="/Icons/cupe.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 4. Gran Turismo (usamos Coupé)
export function GranTurismoSilhouette({ className = 'w-16 h-8', alt = 'Gran Turismo', ...props }: IconProps) {
  return (
    <img
      src="/Icons/cupe.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 5. Spyder / Descapotable
export function SpyderSilhouette({ className = 'w-16 h-8', alt = 'Descapotable Spyder', ...props }: IconProps) {
  return (
    <img
      src="/Icons/spyder.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 6. Super SUV
export function SuperSUVSilhouette({ className = 'w-16 h-8', alt = 'Super SUV', ...props }: IconProps) {
  return (
    <img
      src="/Icons/suv.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

// 7. Sedán Deportivo
export function SedanDeportivoSilhouette({ className = 'w-16 h-8', alt = 'Sedán Deportivo', ...props }: IconProps) {
  return (
    <img
      src="/Icons/sedan.png"
      alt={alt}
      className={`object-contain mix-blend-multiply ${className}`}
      loading="lazy"
      {...props}
    />
  );
}
