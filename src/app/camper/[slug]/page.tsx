import { permanentRedirect } from 'next/navigation';

export default async function CamperSlugRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/coche/${slug}`);
}
