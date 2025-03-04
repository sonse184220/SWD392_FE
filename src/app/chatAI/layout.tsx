import "./global.css";
import type { Metadata } from "next";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Subframe Next.js Starter",
  description: "Your starter kit for integrating Subframe into Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="google-fonts"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap';
                link.rel = 'stylesheet';
                document.head.appendChild(link);
              })()
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}