import { fetchEventById } from "@/lib/fetchEventById";
import EventDetail from "./Client";

export default async function Page({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = await params;
  const event = await fetchEventById(slugs);
  if (!event)
    return (
      <div className="p-20 text-center text-xl">Event not found.</div>
    );
  return <EventDetail event={event} />;
}

export const revalidate = 60;