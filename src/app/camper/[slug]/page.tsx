import { redirect } from 'next/navigation';

export default async function CamperRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/coche/${slug}`);
}
