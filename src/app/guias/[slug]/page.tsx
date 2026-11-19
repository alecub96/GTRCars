import { permanentRedirect } from 'next/navigation';

export default function GuiaSlugRedirectPage() {
  permanentRedirect('/blog');
}
