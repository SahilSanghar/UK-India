import { notFound } from "next/navigation";
import Image from "next/image";
import Client from "./Client";

// Fetch posts by slug, expecting an array from the API
async function getPost(slug: string) {
  const res = await fetch(
    `https://bryanp25.sg-host.com/wp-json/wp/v2/report?slug=${slug}`
  );
  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const posts = await getPost(params.slug);

  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return notFound();
  }

  const post = posts[0];

  return <Client post={post} />;
}
