'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function OwnerFinancePage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/owner/analytics').then((response) => response.json()).then(setData); }, []);
  const finance = data?.finance;
  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-5xl px-4 py-10"><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Contabilidad del propietario</span><h1 className="font-serif text-4xl font-bold">Finanzas</h1><p className="mt-2 text-sm text-[#6B726E]">Importes calculados a partir de reservas pagadas y confirmadas.</p>{!finance ? <p className="mt-10">Cargando…</p> : <><div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Volumen cobrado', finance.gross], ['Comisión de plataforma', finance.platformFees], ['Neto para ti', finance.net], ['Pendiente potencial', finance.pending]].map(([label, value]) => <div key={label} className="rounded-3xl border border-[#E9E1D2] bg-white p-6"><span className="text-xs font-bold uppercase text-[#6B726E]">{label}</span><strong className="mt-2 block font-serif text-3xl">{Number(value).toFixed(2)} €</strong></div>)}</div><div className="rounded-3xl border border-[#E9E1D2] bg-white p-6 text-sm"><h2 className="font-serif text-2xl font-bold">Cómo se calcula</h2><p className="mt-3 text-[#6B726E]">El volumen cobrado es lo pagado por viajeros; la comisión corresponde al cargo aplicado al propietario; el neto es tu liquidación estimada. Los costes financieros propios del proveedor de pagos deben conciliarse con Stripe y no se inventan en este panel.</p></div></>}</main></div>;
}
