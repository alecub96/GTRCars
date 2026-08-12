import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 text-[#13322E]"><section className="max-w-xl text-center"><Compass className="mx-auto h-14 w-14 text-[#16B8AA]" /><p className="mt-5 text-[10px] font-black uppercase tracking-[.25em] text-[#D97706]">Ruta no encontrada</p><h1 className="mt-2 font-serif text-5xl font-bold">Esta carretera no lleva a ninguna camper.</h1><p className="mt-4 text-sm text-[#6B726E]">La página puede haber cambiado de dirección o ya no estar disponible.</p><div className="mt-7 flex justify-center gap-2"><Link href="/" className="rounded-full bg-[#13322E] px-6 py-3 text-xs font-bold text-white">Volver al inicio</Link><Link href="/buscar" className="rounded-full border border-[#E9E1D2] bg-white px-6 py-3 text-xs font-bold">Buscar campers</Link></div></section></main>;
}
