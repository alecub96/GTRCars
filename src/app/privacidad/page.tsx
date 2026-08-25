import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Política de Privacidad | vaneando.',
  description: 'Cómo protegemos tus datos cuando utilizas la plataforma Vaneando en Canarias.',
  robots: {
    index: false,
    follow: true,
  },
};

const sections = [
  ['1. Responsable del tratamiento', <>El responsable del tratamiento es <strong>Vaneando</strong>, plataforma canaria de alquiler de campers. Para cualquier consulta sobre privacidad puedes escribir a <a className="font-bold text-[#0F766E] underline" href="mailto:contacto@vaneando.com">contacto@vaneando.com</a>.</>],
  ['2. Datos que tratamos', <>Podemos tratar datos identificativos y de contacto, credenciales, perfil, documentación de verificación, datos de conducción, información de reservas, conversaciones y mensajes enviados a través de la plataforma, datos de pago gestionados por proveedores financieros y datos técnicos de navegación. Solo solicitamos los datos necesarios para cada función.</>],
  ['3. Para qué utilizamos tus datos', <>Usamos la información para crear y proteger tu cuenta, conectar viajeros y propietarios, gestionar solicitudes y contratos, procesar pagos y reembolsos, verificar documentación, atender soporte, prevenir fraude y transacciones fuera de plataforma mediante auditoría de mensajería, enviar avisos transaccionales y mejorar el servicio. En los paneles internos de supervisión, los datos de las conversaciones son sometidos a procesos de minimización y anonimización de identidades conforme al Art. 5.1.c del RGPD. No vendemos datos personales.</>],
  ['4. Base jurídica', <>El tratamiento se basa en la ejecución del contrato o de medidas precontractuales, el cumplimiento de obligaciones legales, el interés legítimo en proteger la plataforma y, cuando corresponda, tu consentimiento. Puedes retirar un consentimiento sin afectar los tratamientos realizados previamente.</>],
  ['5. Destinatarios y proveedores', <>Compartimos datos únicamente cuando es necesario con proveedores que nos ayudan a operar el servicio: alojamiento y base de datos, pagos (por ejemplo Stripe), correo electrónico, almacenamiento seguro, analítica autorizada y servicios de prevención del fraude. Estos proveedores actúan bajo contrato y solo para la finalidad indicada.</>],
  ['6. Verificaciones, documentos y comunicaciones', <>Los documentos de identidad, permisos de conducir y registros de mensajes entre usuarios se custodian con controles de acceso restringido y cifrado. La auditoría interna de conversaciones entre usuarios se realiza bajo estricto principio de anonimización para salvaguardar la intimidad de los intervinientes.</>],
  ['7. Conservación', <>Conservamos los datos mientras exista una cuenta o relación contractual y, después, durante los plazos necesarios para atender responsabilidades legales, contables o reclamaciones. Los documentos de verificación se eliminan o anonimizan cuando dejan de ser necesarios.</>],
  ['8. Tus derechos', <>Puedes solicitar acceso, rectificación, supresión, oposición, limitación, portabilidad o retirar consentimientos escribiendo a contacto@vaneando.com. También puedes reclamar ante la Agencia Española de Protección de Datos. Podremos pedir una verificación razonable de identidad antes de responder.</>],
  ['9. Seguridad', <>Aplicamos controles técnicos y organizativos razonables: sesiones autenticadas, permisos por rol, conexiones cifradas, registros de actividad y minimización de datos. Ningún sistema es infalible; si detectas un acceso sospechoso, avisa inmediatamente a soporte.</>],
  ['10. Cambios', <>Podemos actualizar esta política para reflejar cambios legales o funcionales. Publicaremos la versión vigente en esta página e indicaremos la fecha de actualización.</>],
];

export default function PrivacyPage() {
  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-4xl px-4 py-12"><article className="rounded-3xl border border-[#E9E1D2] bg-white p-8 shadow-sm sm:p-12"><div className="mb-8 border-b border-[#E9E1D2] pb-7"><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Transparencia y confianza</span><h1 className="mt-2 font-serif text-4xl font-bold">Política de privacidad</h1><p className="mt-3 text-sm leading-relaxed text-[#6B726E]">Cómo protegemos tus datos cuando utilizas Vaneando. Última actualización: 11 de agosto de 2026.</p></div><div className="space-y-7 text-sm leading-7 text-[#52605B]">{sections.map(([title, body], index) => <section key={index}><h2 className="mb-2 font-serif text-xl font-bold text-[#13322E]">{title}</h2><p>{body}</p></section>)}</div></article></main></div>;
}
