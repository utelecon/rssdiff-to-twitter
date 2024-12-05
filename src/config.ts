import * as core from "@actions/core";
import type { TwitterApiTokens } from "twitter-api-v2";

export interface RssPaths {
  oldRssPath: string;
  newRssPath: string;
}

export function getInputs(): { rssPaths: RssPaths, twitterTokens: TwitterApiTokens } {
  return {
    rssPaths: {
      oldRssPath: core.getInput('OLD_RSS', { required: true }),
      newRssPath: core.getInput('NEW_RSS', { required: true }),
    },
    twitterTokens: {
      appKey: core.getInput('TWITTER_APIKEY', { required: true }),
      appSecret: core.getInput('TWITTER_APIKEY_SECRET', { required: true }),
      accessToken: core.getInput('TWITTER_ACCESS_TOKEN', { required: true }),
      accessSecret: core.getInput('TWITTER_ACCESS_TOKEN_SECRET', { required: true }),
    },
  };
}
