import Image from "next/image";

// Fallback used only before the logo band has been configured in the admin
// panel (i.e. the page record has no `logos` field yet). Once an admin saves
// the logo band, the dynamic list below takes over entirely.
const fallbackLogos = [
  { src: "/logos/UEA.png", alt: "UEA" },
  { src: "/logos/UCL.png", alt: "UCL" },
  { src: "/logos/Swansea.jpg.jpeg", alt: "Swansea" },
  { src: "/logos/Surrey.jpg.jpeg", alt: "Surrey" },
  { src: "/logos/Strathclyde.jpg.jpeg", alt: "Strathclyde" },
  { src: "/logos/SOAS.png", alt: "SOAS" },
  { src: "/logos/QMUL.png", alt: "QMUL" },
  { src: "/logos/Manchester.jpg.jpeg", alt: "Manchester" },
  { src: "/logos/Imperial.jpg.jpeg", alt: "Imperial" },
  { src: "/logos/Henley Business School Logo.png", alt: "Henley Business School" },
  { src: "/logos/Goldsmith.jpg.jpeg", alt: "Goldsmiths" },
  { src: "/logos/Essex.jpg.jpeg", alt: "Essex" },
  { src: "/logos/Durham University.jpg.jpeg", alt: "Durham University" },
  { src: "/logos/Cardiff.jpg.jpeg", alt: "Cardiff" },
  { src: "/logos/Bristol.jpg.jpeg", alt: "Bristol" },
  { src: "/logos/Brighton.png", alt: "Brighton" },
];

interface LogosData {
  title?: string;
  items?: { image: string; alt: string }[];
}

export default function LogoMarquee({
  logos,
  type = "launchpad",
}: {
  logos?: LogosData;
  type?: string;
}) {
  // If the admin has configured the logo band, use those logos (served from
  // S3/CloudFront like every other managed image). Otherwise fall back to the
  // built-in list so the band keeps working until the migration is run.
  const configured = logos && Array.isArray(logos.items);

  const resolvedLogos = configured
    ? (logos!.items || [])
        .filter((l) => l.image)
        .map((l) => ({
          src: `https://d2paj8ptqa22jg.cloudfront.net/pages/${type}/${l.image}.webp`,
          alt: l.alt || "",
        }))
    : fallbackLogos;

  const title =
    logos?.title || "Trusted by students from top UK universities";

  // Respect an intentionally emptied band: if configured but no logos remain,
  // render nothing rather than resurrecting the fallback list.
  if (resolvedLogos.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-white py-10">
      <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-6 font-medium">
        {title}
      </p>
      <div className="flex w-max animate-marquee gap-16 items-center">
        {[...resolvedLogos, ...resolvedLogos].map((logo, i) => (
          <div
            key={i}
            className="relative h-12 w-28 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
