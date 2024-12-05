import fs from 'fs';
import { setTimeout } from 'timers/promises';
import Parser from 'rss-parser';
import { TwitterApi, type TwitterApiTokens } from 'twitter-api-v2';
import type { RssPaths } from './config';

export async function tweetRssDiff(rssPaths: RssPaths, twitterTokens: TwitterApiTokens): Promise<void> {
  const parser = new Parser();

  const oldRss = await parseRss(parser, rssPaths.oldRssPath);
  const newRss = await parseRss(parser, rssPaths.newRssPath);
  const newEntries = getNewEntries(oldRss, newRss);

  if (newEntries.length > 0) {
    const client = new TwitterApi(twitterTokens);

    for (const entry of newEntries) {
      const status = `${entry.title} ${entry.link}`;
      await client.v2.tweet(status);
      console.log('Posted to Twitter:', status);

      await setTimeout(5000);
    }

    console.log(`Posted ${newEntries.length} new entries to Twitter.`);
  } else {
    console.log('No new entries found.');
  }
}

type RssData = Parser.Output<{}>;

/**
 * Read and parse an RSS file.
 */
async function parseRss(parser: Parser, filePath: string): Promise<RssData> {
  const data = fs.readFileSync(filePath, 'utf8');
  return await parser.parseString(data);
}

/**
 * Compare the old and new RSS data and get the new entries.
 */
function getNewEntries(oldRss: RssData, newRss: RssData): Parser.Item[] {
  const oldEntries = new Set(oldRss.items.map((item) => item.link));
  return newRss.items.filter((item) => !oldEntries.has(item.link));
}