import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso | vaneando.',
  description: 'Condiciones de uso de Vaneando y del servicio de alquiler de furgonetas camperizadas en las Islas Canarias.',
  robots: {
    index: false,
    follow: true,
  },
};

const items = [
  ['1. Qué es Vaneando (Intermediario Tecnológico)', 'Vaneando es única y exclusivamente una plataforma tecnológica e intermediaria que facilita el contacto y la comunicación entre viajeros y propietarios particulares de vehículos camperizados en Canarias. Vaneando no es propietario de los vehículos, no presta servicios de transporte ni de alquiler, ni es parte en ningún caso de los contratos de alquiler celebrados directa y exclusivamente entre los particulares.'],
  ['2. Registro y cuentas', 'Debes facilitar información veraz, mantener tus credenciales seguras y utilizar una cuenta por persona. El acceso puede suspenderse si detectamos fraude, suplantación, documentación irregular o incumplimientos de estas condiciones.'],
  ['3. Anuncios y disponibilidad', 'El propietario responde de la exactitud del anuncio, fotografías, equipamiento, precio, calendario, documentación y seguro del vehículo. Vaneando puede revisar, ocultar o retirar anuncios que no cumplan los requisitos de la plataforma.'],
  ['4. Solicitudes y reservas', 'Una solicitud no es una reserva confirmada hasta que el propietario la acepta y se cumplen las condiciones mostradas en el proceso. Las fechas, importes, fianza, extras y políticas de cancelación quedan recogidos en el resumen y contrato de cada reserva.'],
  ['5. Pagos y liquidaciones', 'Los pagos se procesan mediante proveedores autorizados. Vaneando puede aplicar comisiones de servicio comunicadas antes de confirmar. El dinero de cada reserva se transfiere al propietario en un plazo de 7 días hábiles después de que finalice el periodo de alquiler, sujeto a la verificación de su cuenta bancaria (IBAN) y a las reglas antifraude o de reembolso aplicables.'],
  ['6. Contrato, entrega y devolución', 'Las partes deben revisar y firmar el contrato, documentar el estado del vehículo en la entrega y devolución y comunicar sin demora accidentes, averías o daños. La firma electrónica registra la versión aceptada, fecha, identidad autenticada y consentimientos.'],
  ['7. Seguro, fianza y daños', 'El propietario debe mantener el seguro obligatorio y las coberturas adecuadas. La fianza responde de los conceptos descritos en el anuncio o contrato. Cualquier cargo debe estar justificado con evidencias, comunicaciones y, cuando corresponda, facturas o presupuestos.'],
  ['8. Cancelaciones y reembolsos', 'Se aplicará la política elegida para el anuncio y mostrada antes del pago, sin perjuicio de los derechos que reconozca la normativa. Los reembolsos se tramitan por el mismo medio de pago cuando sea posible y pueden tardar según la entidad financiera.'],
  ['9. Mensajes y soporte', 'Las conversaciones de reservas y soporte deben mantenerse dentro de Vaneando para proteger a las partes. No compartas credenciales, códigos de pago ni documentación sensible. Podemos moderar o conservar mensajes cuando sea necesario para seguridad, soporte o reclamaciones.'],
  ['10. Conductas prohibidas', 'No se permite utilizar la plataforma para actividades ilícitas, publicar información falsa, discriminar, eludir comisiones, contactar fuera para evitar controles, manipular valoraciones o acceder a cuentas ajenas.'],
  ['11. Limitación de responsabilidad', 'Vaneando aplica medidas razonables de seguridad y verificación, pero no garantiza la disponibilidad permanente ni responde de hechos imputables a usuarios, terceros, entidades financieras, carreteras, clima o fuerza mayor. Esta cláusula no limita derechos legalmente irrenunciables.'],
  ['12. Ley aplicable y contacto', 'Estas condiciones se interpretan conforme a la legislación española. Para consultas o reclamaciones puedes escribir a contacto@vaneando.com. La versión vigente se publica siempre en esta página. Última actualización: 11 de agosto de 2026.'],
];

export default function TermsPage() {
  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-4xl px-4 py-12"><article className="rounded-3xl border border-[#E9E1D2] bg-white p-8 shadow-sm sm:p-12"><div className="mb-8 border-b border-[#E9E1D2] pb-7"><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Reglas claras para viajar</span><h1 className="mt-2 font-serif text-4xl font-bold">Términos y condiciones</h1><p className="mt-3 text-sm leading-relaxed text-[#6B726E]">Condiciones de uso de Vaneando y del servicio de alquiler. Léelas antes de publicar, solicitar o confirmar una reserva.</p></div><div className="space-y-7 text-sm leading-7 text-[#52605B]">{items.map(([title, text]) => <section key={title}><h2 className="mb-2 font-serif text-xl font-bold text-[#13322E]">{title}</h2><p>{text}</p></section>)}</div></article></main></div>;
}
