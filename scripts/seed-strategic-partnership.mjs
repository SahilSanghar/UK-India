/**
 * One-off: create the `strategic-partnership` page record in the DynamoDB
 * table `ukibc_pages`, so it shows up in Admin -> Pages and can be edited
 * like the other pages. Content comes from app/strategic-partnership/content.json.
 *
 * Safety: only creates the record if none exists (conditional put) — it never
 * overwrites edits already made in the admin panel.
 *
 * Run once, from the project root:
 *   node --env-file=.env.local scripts/seed-strategic-partnership.mjs
 */

import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const TYPE = "strategic-partnership";

const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT,
    secretAccessKey: process.env.A_SECRET,
  },
});

const content = JSON.parse(
  await readFile(
    new URL("../app/strategic-partnership/content.json", import.meta.url),
    "utf8",
  ),
);

const item = { id: randomUUID(), type: TYPE, ...content };

try {
  await client.send(
    new PutItemCommand({
      TableName: "ukibc_pages",
      Item: marshall(item, { removeUndefinedValues: true }),
      ConditionExpression: "attribute_not_exists(#t)",
      ExpressionAttributeNames: { "#t": "type" },
    }),
  );
  console.log(`Created "${TYPE}" page record.`);
} catch (err) {
  if (err.name === "ConditionalCheckFailedException") {
    console.log(`"${TYPE}" already exists — left untouched.`);
  } else {
    throw err;
  }
}
