# tweet-cleaner

Node.js module for deleting tweets

----

This fork of the [original project from kakts](https://github.com/kakts/tweet-cleaner) that converts it to parse the `tweets.js` file that comes as part of the [data archive Twitter now offers all users](https://help.twitter.com/en/managing-your-account/accessing-your-twitter-data). Why make this change? Because, if you have more than ~3200 tweets, it's the only way to delete everything. You need a list of IDs, and that file, in the data backup, is the only place that has the IDs.


There are a few other small changes. Errors are now sent to STDERR, so you can log them separately. A few other cleanups to allow the app to continue running if some "expected" errors occur. They will get logged to the error stream, so you can monitor it for issues.

A typical run of the app might look like this on a Mac:

```
node clean.js ~/temp/tweet.js 2>>errors.txt
```

