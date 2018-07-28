# tweet-cleaner

Node.js module for deleting tweets

----

This fork of the [original project from kakts](https://github.com/kakts/tweet-cleaner) that converts it to parse the `tweets.js` file that comes as part of the [data archive Twitter now offers all users](https://help.twitter.com/en/managing-your-account/accessing-your-twitter-data). Why make this change? Because, if you have more than ~3200 tweets, it's the only way to delete everything. You need a list of IDs, and that file, in the data backup, is the only place that has the IDs.


There are a few other small changes. Errors are now sent to STDERR, so you can log them separately. A few other cleanups to allow the app to continue running if some "expected" errors occur. They will get logged to the error stream, so you can monitor it for issues.

## Usage

1. Create a `credential.js` file in the conf subdirectory. You can copy the `default-credential.js` file as a template. It documents the format.
	- You will need to create a twitter APP to get the values necessary. You can find some instructions for the current process [here](https://iag.me/socialmedia/how-to-create-a-twitter-app-in-8-easy-steps/). This process will change soon, unfortunately. I'll try to update the docs once I find a good tutorial.
	- The application will require read & write access.
	- Make sure you create the app AND the access tokens.
2. Download your Twitter archive: https://help.twitter.com/en/managing-your-account/accessing-your-twitter-data
3. Expand the archive somewhere handy.
3. Run the following command, substituting the path to the tweets.js file:

```
node clean.js path/to/the/tweets.js 2>>errors.txt
```

That should parse the list of your tweets from the backup and clear **EVERYTHING**. **THERE IS NO UNDO ON THIS OPERATION!!** Use caution before running this utility.