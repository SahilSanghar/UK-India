/**
 * One-off: register the placeholder photos the Strategic Partnership page
 * currently shows (from /public) as real admin-managed images, so they appear
 * in Admin -> Pages -> Strategic Partnership and the client can see, remove and
 * replace exactly what is live.
 *
 * What it does:
 *   1. Reads the `strategic-partnership` record and finds image slots that are
 *      still empty (slots the client has already filled are left alone).
 *   2. Uploads the matching /public photos to
 *      s3://ukibc-storage/pages/strategic-partnership/<uuid> — the same key
 *      shape the admin upload uses, so the existing pipeline generates the
 *      .webp that CloudFront serves.
 *   3. Waits until each .webp is reachable on CloudFront, so the live page
 *      never points at an image that isn't ready yet.
 *   4. Writes the image ids onto the record.
 *
 * Run once, from the project root:
 *   node --env-file=.env.local scripts/seed-strategic-partnership-images.mjs
 */

import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = "ap-south-1";
const BUCKET = "ukibc-storage";
const TABLE = "ukibc_pages";
const TYPE = "strategic-partnership";
const CDN = "https://d2paj8ptqa22jg.cloudfront.net";
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Same photos the page falls back to in app/strategic-partnership/Client.tsx.
const SLOTS = [
  { name: "hero", path: ["lander", "image"], files: ["inf1.webp", "inf2.webp", "govtmeet.jpg"] },
  { name: "coordinated approach", path: ["box", 0, "image"], files: ["noble2.jpg", "noble3.jpg"] },
  { name: "mission to impact", path: ["box", 1, "image"], files: ["banerjee.jpeg", "govtmeet.jpg", "churchHouse.jpg"] },
];

const contentTypeFor = (f) => {
  const l = f.toLowerCase();
  if (l.endsWith(".png")) return "image/png";
  if (l.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
};

const dig = (obj, keys) => keys.reduce((o, k) => (o == null ? o : o[k]), obj);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForCdn(uuid) {
  const url = `${CDN}/pages/${TYPE}/${uuid}.webp`;
  for (let i = 0; i < 30; i++) {
    const res = await fetch(url, { method: "HEAD" }).catch(() => null);
    if (res?.ok) return true;
    await sleep(2000);
  }
  return false;
}

async function main() {
  if (!process.env.A_CLIENT || !process.env.A_SECRET) {
    console.error("Missing A_CLIENT / A_SECRET. Run with --env-file=.env.local");
    process.exit(1);
  }
  const credentials = {
    accessKeyId: process.env.A_CLIENT,
    secretAccessKey: process.env.A_SECRET,
  };
  const s3 = new S3Client({ region: REGION, credentials });
  const ddb = new DynamoDBClient({ region: REGION, credentials });

  const got = await ddb.send(
    new GetItemCommand({ TableName: TABLE, Key: { type: { S: TYPE } } }),
  );
  if (!got.Item) {
    console.error(`No "${TYPE}" record found. Run seed-strategic-partnership.mjs first.`);
    process.exit(1);
  }
  const page = unmarshall(got.Item);

  const toSet = [];
  for (const slot of SLOTS) {
    const current = dig(page, slot.path);
    if (Array.isArray(current) && current.length > 0) {
      console.log(`-  ${slot.name}: already has images, leaving as is`);
      continue;
    }
    if (current === undefined) {
      console.warn(`!  ${slot.name}: field missing on the record, skipping`);
      continue;
    }
    toSet.push(slot);
  }
  const contactEmpty = page.contact && !page.contact.image;

  if (toSet.length === 0 && !contactEmpty) {
    console.log("Nothing to do.");
    return;
  }

  const uploaded = []; // every uuid we uploaded, to verify on the CDN
  const values = {};
  const names = {};
  const sets = [];

  async function upload(file) {
    const uuid = randomUUID();
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `pages/${TYPE}/${uuid}`,
        Body: await readFile(path.join(PUBLIC_DIR, file)),
        ContentType: contentTypeFor(file),
      }),
    );
    console.log(`✓  Uploaded ${file}  ->  pages/${TYPE}/${uuid}`);
    uploaded.push(uuid);
    return uuid;
  }

  let n = 0;
  const nm = (k) => {
    const key = `#n${k}`;
    names[key] = k;
    return key;
  };
  const expr = (p) => p.map((k, i) => (typeof k === "number" ? `[${k}]` : (i ? "." : "") + nm(k))).join("");

  for (const slot of toSet) {
    const ids = [];
    for (const f of slot.files) ids.push(await upload(f));
    const v = `:v${n++}`;
    values[v] = { L: ids.map((s) => ({ S: s })) };
    sets.push(`${expr(slot.path)} = ${v}`);
  }
  if (contactEmpty) {
    const id = await upload("connect.webp");
    const v = `:v${n++}`;
    values[v] = { S: id };
    sets.push(`${expr(["contact", "image"])} = ${v}`);
  }

  console.log("\nWaiting for the .webp versions to be ready on CloudFront...");
  for (const id of uploaded) {
    if (!(await waitForCdn(id))) {
      console.error(
        `Image ${id} never became available on CloudFront. Aborting before ` +
          "touching the record (uploaded files are harmless leftovers).",
      );
      process.exit(1);
    }
  }

  await ddb.send(
    new UpdateItemCommand({
      TableName: TABLE,
      Key: { type: { S: TYPE } },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
  console.log(`\nDone. Registered ${uploaded.length} images on "${TYPE}".`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
