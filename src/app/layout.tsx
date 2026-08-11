import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://vaneando.com'),
  title: "vaneando. | Canarias sobre ruedas",
  description: "Tu isla. Tu ruta. Tu camper.",
  icons: { icon: '/vaneando-icon.svg', apple: '/vaneando-icon.svg' },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
