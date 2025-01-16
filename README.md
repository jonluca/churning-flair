# Churning Flair

Rebuild of the r/churning flair selector using a modern framework. This is currently deployed at https://www.rchurning.com/

## Getting started

1. Clone the repository
2. Run `yarn install`
3. Setup your environment variables
4. Run `yarn dev`

There are 6 required environment variables:

```mdxjs
REDDIT_CLIENT_ID="id"
REDDIT_CLIENT_SECRET="secret"
MOD_SCRIPT_SECRET="secret"
MOD_SCRIPT_ID="id"
MOD_USERNAME="username"
MOD_PASSWORD="password"
```

You will need the username and password to a non-2fa enabled mod account (this can be a bot account that only has access to the subreddit flair setting permissions).

This bot account should create two apps in the reddit developer portal. One for the bot account and one for the web app. These can be created at https://www.reddit.com/prefs/apps/

One should be a script and one should be a webapp. The webapp is what users authenticate with, and the script is what lets you control the mod account flair setting.

## Changing flair options

You can set the flair options in `src/server/api/flair-options.ts`.
