import { permanentRedirect } from 'next/navigation';

export default function GuiasRedirectPage() {
  permanentRedirect('/blog');
}
