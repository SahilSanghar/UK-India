import { notFound } from "next/navigation";
import Client from "./Client";

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  // Fetch the page data using the API route
  const res = await fetch(
    `${process.env.PUBLIC_URL || ""}/api/admin/pages/get_by_type?type=${type}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  if (!data?.page) {
    return notFound();
  }

  return <Client type={type} />;
}
