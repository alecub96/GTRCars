import { permanentRedirect } from 'next/navigation';

export default function HistoriasRedirectPage() {
  permanentRedirect('/blog');
}
