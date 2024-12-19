import fs from "fs";
import { setTimeout } from "timers/promises";
import Parser, { type Item } from "rss-parser";
import { TwitterApi, type TwitterApiTokens } from "twitter-api-v2";
import * as core from "@actions/core";

import type { RssPaths } from "./config";

export async function tweetRssDiff(
  rssPaths: RssPaths,
  twitterTokens: TwitterApiTokens,
): Promise<void> {
  const parser = new Parser();

  const oldRss = await parseRss(parser, rssPaths.oldRssPath);
  const newRss = await parseRss(parser, rssPaths.newRssPath);

  const oldIdent = oldRss.items.map(generateIdents).reduce(
    (acc, idents) => {
      idents.forEach((ident) => acc.add(ident));
      return acc;
    },
    new Set<string>(),
  );

  const posts = newRss.items
    .filter((item) => {
      const idents = generateIdents(item);
      if (idents.length === 0) {
        // Skip entries with no identifiers. They can't be compared.
        core.warning(`Skipping entry with no identifiers: ${item.title} ${item.link}`);
        return false;
      }

      // Check if the item is new by comparing identifiers.
      return !idents.some((ident) => oldIdent.has(ident));
    })
    .map((entry) => `${entry.title} ${entry.link}`);
  if (posts.length === 0) {
    core.info("No new entry found.");
    return;
  }

  core.info(`${posts.length} new entrie(s) found:`);
  for (const post of posts) {
    core.info(`- ${post}`);
  }

  const client = new TwitterApi(twitterTokens);
  for (const status of posts) {
    await client.v2.tweet(status);
    core.info(`Posted to Twitter: ${status}`);

    await setTimeout(5000);
  }

  core.info(`Posted ${posts.length} new entries to Twitter.`);
}

type RssData = Parser.Output<{}>;

/**
 * Read and parse an RSS file.
 */
async function parseRss(parser: Parser, filePath: string): Promise<RssData> {
  const data = fs.readFileSync(filePath, "utf8");
  return await parser.parseString(data);
}

/**
 * Generates an identifier object for a given RSS feed item.
 *
 * @param item - The RSS feed item for which to generate identifiers.
 * @returns An object containing identifiers based on the item's publication date, link, and title.
 */
function generateIdents(item: Item): string[] {
  const result = [];

  const dateString = item.pubDate && new Date(item.pubDate).toDateString();
  if (dateString && typeof item.link === "string") {
    result.push(`DateLink;;;${dateString};;;${item.link}`);
  }
  if (dateString && typeof item.title === "string") {
    result.push(`DateTitle;;;${dateString};;;${item.title}`);
  }
  if (typeof item.link === "string" && typeof item.title === "string") {
    result.push(`LinkTitle;;;${item.link};;;${item.title}`);
  }

  return result;
}
