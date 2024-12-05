import * as core from '@actions/core';

import { getInputs } from "./config";
import { tweetRssDiff } from "./twitter";

const { rssPaths, twitterTokens } = getInputs();
tweetRssDiff(rssPaths, twitterTokens).catch((error) => {
  core.setFailed(error.message);
});
