import Image from "next/image";

const logos = [
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

export default function LogoMarquee() {
  return (
    <div className="w-full overflow-hidden bg-white py-10">
      <p className="text-center text-sm uppercase tracking-widest text-gray-400 mb-6 font-medium">
        Trusted by students from top UK universities
      </p>
      <div className="flex w-max animate-marquee gap-16 items-center">
        {[...logos, ...logos].map((logo, i) => (
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
