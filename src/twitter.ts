import fs from "fs";
import { setTimeout } from "timers/promises";
import Parser from "rss-parser";
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

  const oldEntries = new Set(oldRss.items.map((item) => item.link));

  const posts = newRss.items
    .filter((item) => !oldEntries.has(item.link))
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
