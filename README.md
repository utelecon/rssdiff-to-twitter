# RSSDiff to Twitter

GitHub Actions to post newly added entries from a RSS feed to twitter.

This actions was developed for [utelecon](https://github.com/utelecon) project, inspired by [azu/rss-to-twitter](https://github.com/azu/rss-to-twitter).

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

jobs:
  post_to_twitter:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/download-artifact@v4
        with:
          name: rss-old
          path: rss-old
      - uses: actions/download-artifact@v4
        with:
          name: rss-new
          path: rss-new

      - name: Run RSS diff to Twitter action
        uses: utelecon/rssdiff-to-twitter@main
        with:
          OLD_RSS: "rss-old/rss.xml"
          NEW_RSS: "rss-new/rss.xml"
          TWITTER_APIKEY: ${{ secrets.TWITTER_APIKEY }}
          TWITTER_APIKEY_SECRET: ${{ secrets.TWITTER_APIKEY_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
```

Please make sure to store your Twitter API credentials as secrets in your GitHub repository.

## License

MIT
