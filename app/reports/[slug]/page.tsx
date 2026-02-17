import { notFound } from "next/navigation";
import Image from "next/image";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Client from "./Client";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

interface PostProps {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  image: string;
}

const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Fetch posts by slug, expecting an array from the API
// async function getPost(slug: string) {
//   const res = await fetch(
//     `https://bryanp25.sg-host.com/wp-json/wp/v2/report?slug=${slug}`,
//   );
//   if (!res.ok) {
//     return null;
//   }

//   return res.json();
// }

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  // const posts = await getPost(params.slug);

  try {
    const command = new QueryCommand({
      TableName: "ukibc_reports",
      IndexName: "reports-index",
      KeyConditionExpression: "#slug = :slug",
      ExpressionAttributeNames: {
        "#slug": "slug",
      },
      ExpressionAttributeValues: {
        ":slug": params.slug,
      },
      Limit: 1,
    });

    const result = await docClient.send(command);
    // console.log(result);
    const posts = result.Items?.[0] ?? null;
    console.log(posts);

    if (!posts) {
      return notFound();
    }

    return <Client post={posts as PostProps} />;
  } catch (error) {
    console.error("Failed to get report", error);
    return notFound();
  }
}
