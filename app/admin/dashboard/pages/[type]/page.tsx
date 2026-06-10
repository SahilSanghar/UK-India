import { notFound } from "next/navigation";
import Client from "./Client";
import { fetchPage } from "@/lib/fetchPage";

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  // Query DynamoDB directly instead of fetching our own API route. The previous
  // self-fetch needed an absolute base URL (process.env.PUBLIC_URL) and threw
  // "Failed to parse URL" whenever that env var was missing (e.g. local dev).
  // fetchPage runs the same query the public pages already use.
  let page;
  try {
    page = await fetchPage(type);
  } catch {
    return notFound();
  }

  if (!page) {
    return notFound();
  }

  return <Client type={type} />;
}
