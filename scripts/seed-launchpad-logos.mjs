/**
 * One-off migration: move the hardcoded launchpad logo band into the
 * admin-managed system (S3 + DynamoDB) so the client can edit it themselves.
 *
 * What it does:
 *   1. Reads the existing logo files from /public/logos
 *   2. Uploads each to s3://ukibc-storage/pages/launchpad/<uuid>
 *      (the same key shape the admin upload uses — the existing AWS pipeline
 *       then auto-generates the .webp in ukibc-optimized for CloudFront)
 *   3. Writes the `logos` field onto the `launchpad` item in DynamoDB table
 *      `ukibc_pages` as { title, items: [{ image: <uuid>, alt }] }
 *
 * Safety: aborts if a `logos` field already exists (so it never clobbers
 * edits the client has already made). Pass --force to override.
 *
 * Run once, from the project root:
 *   node scripts/seed-launchpad-logos.mjs
 *   node scripts/seed-launchpad-logos.mjs --force   (overwrite existing band)
 */

import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const REGION = "ap-south-1";
const BUCKET = "ukibc-storage";
const TABLE = "ukibc_pages";
const PAGE_TYPE = "launchpad";
const LOGOS_DIR = path.join(process.cwd(), "public", "logos");
const HEADING = "Trusted by students from top UK universities";

// filename -> display name (alt). Order here is the display order.
const LOGO_MAP = [
  ["UEA.png", "UEA"],
  ["UCL.png", "UCL"],
  ["Swansea.jpg.jpeg", "Swansea"],
  ["Surrey.jpg.jpeg", "Surrey"],
  ["Strathclyde.jpg.jpeg", "Strathclyde"],
  ["SOAS.png", "SOAS"],
  ["QMUL.png", "QMUL"],
  ["Manchester.jpg.jpeg", "Manchester"],
  ["Imperial.jpg.jpeg", "Imperial"],
  ["Henley Business School Logo.png", "Henley Business School"],
  ["Goldsmith.jpg.jpeg", "Goldsmiths"],
  ["Essex.jpg.jpeg", "Essex"],
  ["Durham University.jpg.jpeg", "Durham University"],
  ["Cardiff.jpg.jpeg", "Cardiff"],
  ["Bristol.jpg.jpeg", "Bristol"],
  ["Brighton.png", "Brighton"],
];

// Minimal .env.local loader (no dotenv dependency in this project).
async function loadEnv() {
  try {
    const raw = await readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // fall back to whatever is already in the environment
  }
}

function contentTypeFor(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg"; // .jpg / .jpeg / .jpg.jpeg
}

async function main() {
  const force = process.argv.includes("--force");
  await loadEnv();

  if (!process.env.A_CLIENT || !process.env.A_SECRET) {
    console.error(
      "Missing AWS credentials (A_CLIENT / A_SECRET). Set them in .env.local.",
    );
    process.exit(1);
  }

  const credentials = {
    accessKeyId: process.env.A_CLIENT,
    secretAccessKey: process.env.A_SECRET,
  };
  const s3 = new S3Client({ region: REGION, credentials });
  const ddb = new DynamoDBClient({ region: REGION, credentials });

  // 1. Guard against clobbering an existing band.
  const existing = await ddb.send(
    new GetItemCommand({
      TableName: TABLE,
      Key: { type: { S: PAGE_TYPE } },
      ProjectionExpression: "logos",
    }),
  );
  if (existing.Item?.logos && !force) {
    console.error(
      "A `logos` field already exists on the launchpad page. " +
        "Refusing to overwrite. Re-run with --force if you really mean to.",
    );
    process.exit(1);
  }

  // 2. Sanity-check the files on disk match the map.
  const present = new Set(await readdir(LOGOS_DIR));
  const items = [];

  for (const [filename, alt] of LOGO_MAP) {
    if (!present.has(filename)) {
      console.warn(`!  Skipping "${filename}" — not found in public/logos`);
      continue;
    }
    const uuid = randomUUID();
    const key = `pages/${PAGE_TYPE}/${uuid}`;
    const body = await readFile(path.join(LOGOS_DIR, filename));

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentTypeFor(filename),
      }),
    );

    console.log(`✓  Uploaded ${filename}  ->  ${key}`);
    items.push({ image: uuid, alt });
  }

  if (items.length === 0) {
    console.error("No logos uploaded — aborting before touching DynamoDB.");
    process.exit(1);
  }

  // 3. Write the logos field onto the launchpad page.
  await ddb.send(
    new UpdateItemCommand({
      TableName: TABLE,
      Key: { type: { S: PAGE_TYPE } },
      UpdateExpression: "SET #l = :l",
      ExpressionAttributeNames: { "#l": "logos" },
      ExpressionAttributeValues: {
        ":l": {
          M: {
            title: { S: HEADING },
            items: {
              L: items.map((i) => ({
                M: { image: { S: i.image }, alt: { S: i.alt } },
              })),
            },
          },
        },
      },
    }),
  );

  console.log(
    `\nDone. Seeded ${items.length} logos onto the "${PAGE_TYPE}" page.`,
  );
  console.log(
    "The .webp versions will be generated by the existing S3 pipeline within a few seconds.",
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
