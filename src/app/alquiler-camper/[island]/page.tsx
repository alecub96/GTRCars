import { permanentRedirect } from 'next/navigation';

export default async function AlquilerCamperIslandRedirectPage({
  params,
}: {
  params: Promise<{ island: string }>;
}) {
  const { island } = await params;
  permanentRedirect(`/alquiler-superdeportivos/${island}`);
}
