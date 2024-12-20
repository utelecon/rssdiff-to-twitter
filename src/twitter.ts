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

  const posts = [];
  for (const entry of newRss.items) {
    if (!entry.link) {
      core.warning(`Entry with title "${entry.title}" has no link.`);
      continue;
    }

    const isOldEntry = oldRss.items.some((oldEntry) => {
      const diffs = [
        oldEntry.title !== entry.title,
        oldEntry.link !== entry.link,
        oldEntry.pubDate !== entry.pubDate,
      ].filter((d) => d).length;

      // If there are more than 1 difference, we assume it's a different entry.
      return diffs <= 1;
    });
    if (isOldEntry) {
      // Since new entries are always at the top of the feed,
      // we can stop checking if we reach an old entry.
      break;
    }

    posts.push(`${entry.title} ${entry.link}`);
  }

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
