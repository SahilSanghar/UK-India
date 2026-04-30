import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Provider } from "@/lib/provider";
import Script from "next/script";

const dmsans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UK India Business Council",
  description:
    "The UK India Business Council passionately believes that the UK-India partnership creates jobs and growth in both countries, and that UK and Indian businesses have ideas, technology, services, and products that can succeed in India and the UK, respectively. Through our last-mile insights, networks, future-focused policy advocacy, and market-entry services, we support businesses in achieving this success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${montserrat.variable} ${dmsans.variable} antialiased overflow-x-hidden`}
      >
        <Script
          id="verloop-livechat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d, s, u) {
                w.Verloop = function(c) { w.Verloop._.push(c) }; w.Verloop._ = []; w.Verloop.url = u;
                var h = d.getElementsByTagName(s)[0], j = d.createElement(s); j.async = true;
                j.src = 'https://ukibc.verloop.io/livechat/script.min.js';
                h.parentNode.insertBefore(j, h);
              })(window, document, 'script', 'https://ukibc.verloop.io/livechat');
            `,
          }}
        />
        <Script
          id="linkedin-insight-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "10058841";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `,
          }}
        />
        <Script
          id="linkedin-insight-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})(window.lintrk);
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=10058841&fmt=gif"
          />
        </noscript>
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
