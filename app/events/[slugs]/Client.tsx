"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface EventProps {
  id: string;
  title: string;
  image: string;
  content: string;
  date: string;
  tempdate: string;
  start_date: string;
  end_date: string;
  time: string;
  location: string;
  venue: string;
  who_can_attend: string;
  slug: string;
}

export default function EventDetail({ event }: { event: EventProps }) {
  const router = useRouter();

  const formatDate = (d: string) =>
    d && d.length === 8
      ? new Date(
          `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : d;

  return (
    <div className="w-full min-h-screen py-20 px-4 md:px-10 max-w-4xl mx-auto flex flex-col gap-8">
      <button
        onClick={() => router.back()}
        className="text-navy font-semibold flex items-center gap-2 hover:opacity-70 transition w-fit"
      >
        ← Back to Events
      </button>

      <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden relative">
        <Image
          src={event.image || "/event.jpg"}
          alt={event.title}
          fill
          className="object-cover object-center"
        />
      </div>

      <h1
        className="text-2xl md:text-4xl font-bold text-navy"
        dangerouslySetInnerHTML={{ __html: event.title }}
      />

      <div className="flex flex-col gap-3 text-gray-700">
        {event.tempdate && (
          <p className="text-base font-medium">{event.tempdate}</p>
        )}
        {!event.tempdate && event.start_date && (
          <p className="text-base font-medium">
            📅 {formatDate(event.start_date)}
            {event.end_date && ` — ${formatDate(event.end_date)}`}
          </p>
        )}
        {event.time && <p className="text-base font-medium">🕐 {event.time}</p>}
        {event.location && (
          <p className="text-base font-medium">📍 {event.location}</p>
        )}
        {event.venue && (
          <p className="text-base font-medium">🏛 {event.venue}</p>
        )}
        {event.who_can_attend && (
          <p className="text-base font-medium">
            👤{" "}
            {event.who_can_attend.startsWith("Invite")
              ? "Invite Only"
              : event.who_can_attend}
          </p>
        )}
      </div>

      {event.content && (
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: event.content }}
        />
      )}
    </div>
  );
}