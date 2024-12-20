import * as core from '@actions/core';

import { getInputs } from "./config";
import { tweetRssDiff } from "./twitter";

const { rssPaths, twitterTokens, safetyLimits } = getInputs();
tweetRssDiff(rssPaths, twitterTokens, safetyLimits).catch((error) => {
  core.setFailed(error.message);
});
