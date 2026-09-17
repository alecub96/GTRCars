import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Supercar line-art silhouettes crafted in the minimalist, athletic automotive line-art style:
 * Dynamic strokes, sculpted wheel arches, raked cabin glass, and sharp aerodynamic lips.
 */

// 1. Supercar V8 / V10 (Mid-Engine Berlinetta: Ferrari 296 / Lamborghini Huracán / McLaren 765LT)
export function SupercarV8Silhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Línea de techo y carrocería superior */}
      <path
        d="M20 20 C26 15, 42 10, 56 10 C70 10, 78 14, 94 21"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Ventanilla / Cockpit interior oscuro */}
      <path
        d="M44 13.5 C52 11.5, 66 11.5, 72 15 C66 17.5, 52 18, 44 17 Z"
        fill="currentColor"
      />
      {/* Frontal: Capó, faro afilado y paragolpes */}
      <path
        d="M74 21.5 C84 23, 94 24, 101 27 C103 28, 101 31, 98 31 L92 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero */}
      <path
        d="M78 31 C78 24.5, 91 24.5, 91 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Talonera lateral & Toma de aire intercooler */}
      <path
        d="M43 23 C43 28, 45 31, 48 31 L71 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda trasero */}
      <path
        d="M26 31 C26 24.5, 39 24.5, 39 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Trasera / Cola Kamm & Difusor */}
      <path
        d="M20 20 L19 26 L23 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 2. Hypercar V12 / Hybrid (Extreme low wedge, cockpit canopy dome, razor nose: Ferrari SF90 / Revuelto)
export function HypercarSilhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Techo ultra bajo / Cúpula de combate */}
      <path
        d="M17 19 C24 14, 40 8, 58 8 C74 8, 82 13, 98 20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Cabina cúpula hiperdeportiva */}
      <path
        d="M40 12 C52 9.5, 68 9.5, 75 14 C68 16.5, 50 17, 40 15.5 Z"
        fill="currentColor"
      />
      {/* Morro en cuña afilado y splitter frontal */}
      <path
        d="M78 20.5 C88 22, 98 23.5, 104 26.5 L97 31 L91 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero */}
      <path
        d="M77 31 C77 23.5, 91 23.5, 91 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Faldón lateral aerodinámico & conducto NACA */}
      <path
        d="M42 22 C42 27.5, 44 31, 47 31 L70 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda trasero */}
      <path
        d="M25 31 C25 23.5, 39 23.5, 39 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Difusor trasero extremo y spoiler activo */}
      <path
        d="M17 19 L15 25 L21 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Track Focused / GT (Porsche 911 GT3 RS / AMG Black Series with high swan-neck wing)
export function TrackGTSilhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Alerón trasero GT de alta carga con soportes de cuello de cisne */}
      <path
        d="M10 9 C14 8.5, 24 8.5, 27 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M15 10 L16 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 10 L23 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

      {/* Silueta curvada clásica 911 / GT */}
      <path
        d="M20 19 C28 12, 44 9, 58 9 C72 9, 82 14, 96 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Ventanilla trasera icónica */}
      <path
        d="M42 12.5 C52 10.5, 66 11, 74 15.5 C68 18, 52 18, 42 16 Z"
        fill="currentColor"
      />
      {/* Frontal con splitter de circuito */}
      <path
        d="M76 22.5 C86 24, 96 25.5, 102 28.5 L97 31 L90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero con branquias */}
      <path
        d="M76 31 C76 24, 90 24, 90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Línea de estribera lateral */}
      <path
        d="M42 24 C42 28, 44 31, 47 31 L69 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Paso de rueda trasero ensanchado */}
      <path
        d="M25 31 C25 24, 39 24, 39 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Trasera & Paragolpes */}
      <path
        d="M20 19 L18 26 L22 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. Gran Turismo V8 / V12 (Aston Martin DBS / Bentley Continental GT / Ferrari Roma: Long muscular hood)
export function GranTurismoSilhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Techo fastback estilizado y capó alargado */}
      <path
        d="M18 21 C24 16, 42 11, 54 11 C68 11, 80 15, 102 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Cabina alargada y refinada */}
      <path
        d="M38 14.5 C48 12.5, 64 12.5, 73 16 C66 18.5, 48 19, 38 17.5 Z"
        fill="currentColor"
      />
      {/* Morro largo señorial y parrilla deportiva */}
      <path
        d="M82 22.5 C92 24, 100 25, 105 28 L99 31 L92 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero */}
      <path
        d="M78 31 C78 24.5, 92 24.5, 92 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Talonera esculpida */}
      <path
        d="M44 24 C44 28.5, 46 31, 49 31 L71 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Paso de rueda trasero con cadera ancha */}
      <path
        d="M26 31 C26 24.5, 40 24.5, 40 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Cola trasera elegante */}
      <path
        d="M18 21 L16 26 L21 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 5. Spyder / Cabriolet (Open top speedster with aerodynamic dual roll hoops)
export function SpyderSilhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Deflector de parabrisas bajo y jorobas aerodinámicas traseras */}
      <path
        d="M62 14 L73 19"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Doble joroba Speedster (Aerodynamic Roll Buttress) */}
      <path
        d="M42 16 C45 13, 50 13, 54 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Línea de cintura abierta descapotable */}
      <path
        d="M19 21 C26 18, 40 18, 58 18 C72 18, 80 20, 96 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Morro bajo */}
      <path
        d="M76 22 C86 23.5, 96 24.5, 102 27.5 L97 31 L90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero */}
      <path
        d="M76 31 C76 24.5, 90 24.5, 90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Faldón lateral */}
      <path
        d="M43 23 C43 28, 45 31, 48 31 L69 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Paso de rueda trasero */}
      <path
        d="M25 31 C25 24.5, 39 24.5, 39 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Paragolpes trasero */}
      <path
        d="M19 21 L17 26 L22 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 6. Super SUV Deportivo (Lamborghini Urus / Ferrari Purosangue / Aston Martin DBX: Muscular fastback SUV)
export function SuperSUVSilhouette({ className = 'w-14 h-7', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Línea de techo cupé sobreelevada de alto rendimiento */}
      <path
        d="M18 19 C24 12, 42 7, 56 7 C70 7, 80 12, 94 20"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Ventanilla angular deportiva */}
      <path
        d="M40 11.5 C50 9.5, 66 9.5, 73 14 C66 16.5, 48 17, 40 15 Z"
        fill="currentColor"
      />
      {/* Frontal imponente con tomas de aire hexagonales */}
      <path
        d="M78 20.5 C88 22.5, 96 23.5, 102 26.5 L97 31 L90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paso de rueda delantero sobreelevado */}
      <path
        d="M75 31 C75 23.5, 90 23.5, 90 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Talonera protegida de alto rendimiento */}
      <path
        d="M44 23 C44 28, 46 31, 49 31 L69 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Paso de rueda trasero */}
      <path
        d="M26 31 C26 23.5, 41 23.5, 41 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Portón y difusor cuádruple */}
      <path
        d="M18 19 L16 26 L22 31"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
