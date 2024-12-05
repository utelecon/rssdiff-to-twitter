# RSSDiff to Twitter

[![CI Status](https://github.com/phenylshima/rssdiff-to-twitter/workflows/CI/badge.svg)](https://github.com/phenylshima/rssdiff-to-twitter/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/phenylshima/rssdiff-to-twitter/blob/master/LICENSE)

GitHub Actions post twitter from RSS Feed.

## Post Steps

1. Load RSS feeds from `NEW_RSS` and `OLD_RSS` files.
1. Compare the feeds, and find the newly added entries.
1. Post the newly added entries to Twitter.

## Usage

To use this GitHub Action, create a workflow YAML file in your repository's `.github/workflows` directory. Below is an example configuration:

```yaml
name: RSS Diff to Twitter

on:
  push:
    branches: [main]
  pull_request:

jobs:
  post_to_twitter:
    runs-on: ubuntu-latest

    steps:
    - name: Run RSS diff to Twitter action
      uses: utelecon/rssdiff-to-twitter@main
      with:
        OLD_RSS: path/to/old/rss/file.xml
        NEW_RSS: path/to/new/rss/file.xml
        TWITTER_APIKEY: ${{ secrets.TWITTER_APIKEY }}
        TWITTER_APIKEY_SECRET: ${{ secrets.TWITTER_APIKEY_SECRET }}
        TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
        TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
```

Make sure to replace the `path/to/old/rss/file.xml` and `path/to/new/rss/file.xml` with the actual paths to your RSS files. Also, store your Twitter API credentials as secrets in your GitHub repository.

This will set up the action to run on every push to the `main` branch and on every pull request.

## License

MIT
