import { ImageResponse } from 'next/og';

export const alt = 'vaneando. — Alquiler de Campers y Autocaravanas en las Islas Canarias';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #13322E 0%, #0D221F 60%, #16B8AA 140%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Efecto decorativo de luz esmeralda */}
        <div
          style={{
            position: 'absolute',
            right: '-80px',
            top: '-80px',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,184,170,0.35) 0%, rgba(19,50,46,0) 70%)',
          }}
        />

        {/* Cabecera superior con Logo y Marca */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: '#16B8AA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: '900',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(22, 184, 170, 0.4)',
              }}
            >
              V
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', color: '#ffffff', lineHeight: 1 }}>
                vaneando<span style={{ color: '#16B8AA' }}>.</span>
              </span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#F2CC8F', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>
                Canarias sobre ruedas
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '10px 22px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '15px',
              fontWeight: '800',
              color: '#ffffff',
            }}
          >
            <span>🌴</span>
            <span>Islas Canarias</span>
          </div>
        </div>

        {/* Bloque Central con Titular Potente */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 10, maxWidth: '980px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '15px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              color: '#16B8AA',
            }}
          >
            Alquiler de Campers & Autocaravanas entre Particulares
          </div>
          <div
            style={{
              fontSize: '54px',
              fontWeight: '900',
              lineHeight: 1.12,
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            Tu viaje sobre ruedas por las Islas Canarias.
          </div>
          <div style={{ fontSize: '21px', color: '#E9E1D2', fontWeight: '400', lineHeight: 1.4 }}>
            Furgonetas camperizadas, gran volumen y 4x4 de particulares verificados. Contrato digital, seguro y sin comisiones abusivas.
          </div>
        </div>

        {/* Barra inferior con las 7 Islas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10, flexWrap: 'wrap' }}>
          {['Tenerife', 'Gran Canaria', 'Fuerteventura', 'Lanzarote', 'La Palma', 'La Gomera', 'El Hierro'].map((island) => (
            <div
              key={island}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                padding: '8px 18px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff',
              }}
            >
              {island}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
