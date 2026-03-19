import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RunMyBiz - AI Business Operator",
  description:
    "Your AI team works around the clock — planning, executing, and optimizing your business. Wake up to real progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vyd1h1of0t");
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#1d1d1f] antialiased">
        {children}
      </body>
    </html>
  );
}
