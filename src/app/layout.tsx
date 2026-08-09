import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import Script from 'next/script';
import { ThemedToaster } from "@/components/themed-toaster";
import { SimulationProvider } from "@/components/security/simulation-provider";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_STORAGE_KEY,
  MODES,
  STORAGE_KEY,
  THEME_IDS,
} from "@/lib/themes";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aiwcrm.com'),
  title: {
    default: "AiWCRM | Enterprise WhatsApp CRM Platform & API",
    template: "%s — AiWCRM",
  },
  description: "Meta-Approved WhatsApp CRM software by Nighwan Technology Pvt. Ltd. Shared multi-agent inbox, AI chatbots, bulk broadcast campaigns, and automated sales pipelines.",
  keywords: [
    "AIWCRM",
    "WhatsApp CRM India",
    "WhatsApp Business API Provider",
    "WhatsApp Shared Inbox Software",
    "WhatsApp Automation Platform",
    "AI WhatsApp Chatbot",
    "AI Meta Ads Creation",
    "Meta Approved WhatsApp API Partner",
    "Enterprise RBAC WhatsApp",
    "WhatsApp Security & Governance",
    "Geo-Targeted WhatsApp Marketing",
    "LLM Search Optimization (AIO)",
    "AI-Powered WhatsApp Ads"
  ],
  authors: [{ name: "Nighwan Technology Pvt. Ltd.", url: "https://www.aiwcrm.com" }],
  creator: "Nighwan Technology Pvt. Ltd.",
  publisher: "Nighwan Technology Pvt. Ltd.",
  alternates: {
    canonical: "https://www.aiwcrm.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/logo.svg" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AiWCRM | Enterprise WhatsApp CRM & Automation Platform",
    description: "Connect, Automate, and Grow your business with Meta-Approved WhatsApp Shared Inbox, AI Chatbots, and Sales Pipelines.",
    url: "https://www.aiwcrm.com",
    siteName: "AiWCRM",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.aiwcrm.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AiWCRM Platform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiWCRM | WhatsApp CRM Platform",
    description: "Meta-Approved WhatsApp CRM, Shared Inbox & AI Automation.",
    images: ["https://www.aiwcrm.com/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark light",
};

// Inline boot script — runs before React hydrates so the user's
// chosen accent (data-theme) AND mode (data-mode) are on the <html>
// element before first paint. Without this every page load flashes
// the server-rendered defaults for a frame before the React tree
// mounts and applies the picked values.
//
// Kept dependency-free (no imports, no JSX) — must be a string the
// browser can run as a single <script>. Knowledge of valid ids is
// sourced from the THEME_IDS / MODES constants so adding one doesn't
// silently break the boot path.
const THEME_BOOT_SCRIPT = `
(function(){
  var d = document.documentElement;
  try {
    var THEME_KEY = ${JSON.stringify(STORAGE_KEY)};
    var THEME_DEFAULT = ${JSON.stringify(DEFAULT_THEME)};
    var THEMES = ${JSON.stringify(THEME_IDS)};
    var savedTheme = localStorage.getItem(THEME_KEY);
    d.dataset.theme = THEMES.indexOf(savedTheme) !== -1 ? savedTheme : THEME_DEFAULT;

    var pathname = window.location.pathname;
    var appPrefixes = ["/admin", "/inbox", "/dashboard", "/analytics", "/broadcasts", "/contacts", "/flows", "/orders", "/pipelines", "/sequences", "/settings", "/team-performance", "/ai-assistant"];
    var isApp = false;
    for (var i = 0; i < appPrefixes.length; i++) {
      if (pathname === appPrefixes[i] || pathname.indexOf(appPrefixes[i] + "/") === 0) {
        isApp = true;
        break;
      }
    }

    if (isApp) {
      var MODE_KEY = ${JSON.stringify(MODE_STORAGE_KEY)};
      var MODE_DEFAULT = ${JSON.stringify(DEFAULT_MODE)};
      var MODES = ${JSON.stringify(MODES)};
      var savedMode = localStorage.getItem(MODE_KEY);
      d.dataset.mode = MODES.indexOf(savedMode) !== -1 ? savedMode : MODE_DEFAULT;
    } else {
      d.dataset.mode = "light";
    }
  } catch (_e) {
    d.dataset.theme = ${JSON.stringify(DEFAULT_THEME)};
    d.dataset.mode = "light";
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      data-mode={DEFAULT_MODE}
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
      // The `theme-boot` script below rewrites `data-theme` and
      // `data-mode` on <html> from localStorage before React hydrates,
      // so for any non-default choice the client DOM intentionally
      // differs from the server-rendered defaults. suppressHydration-
      // Warning silences the expected mismatch — it only applies to
      // this element's own attributes, so genuine mismatches in
      // children still surface.
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LRP2ZMD5CY"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LRP2ZMD5CY');
            `,
          }}
        />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "LocalBusiness"],
              "name": "Nighwan Technology Pvt. Ltd.",
              "alternateName": "AiWCRM",
              "url": "https://www.aiwcrm.com",
              "logo": "https://www.aiwcrm.com/logo.png",
              "description": "Meta-Approved WhatsApp Business API & CRM platform providing shared multi-agent inbox, broadcast campaigns, AI chatbots, and lead management.",
              "email": "mahendra@nighwantech.com",
              "telephone": "+91 8985025794",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "addressCountry": "IN"
              },
              "areaServed": ["IN", "US", "AE", "GB", "SG"],
              "priceRange": "₹₹"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AIWCRM",
              "operatingSystem": "Web, Android, iOS",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "320"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is AIWCRM?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AIWCRM is an official Meta-approved WhatsApp Business API platform offering a shared multi-agent inbox, AI auto-replies, broadcast marketing campaigns, lead scoring, and automated pipelines."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does WhatsApp CRM help businesses in India?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It enables teams to respond to customer inquiries instantly 24/7 with AI, send bulk WhatsApp promotional broadcasts, assign customer chats to agents, and track leads in sales pipelines."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is AIWCRM approved by Meta?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, AIWCRM uses official Meta WhatsApp Business API integration with green-tick badge support, compliant template broadcasts, and direct webhook events."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <SimulationProvider>
              {children}
              <ThemedToaster />
            </SimulationProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
