const Twitter = require('twitter');
const _ = require('lodash');
const async = require('neo-async');
const config = require('./conf/credential');
const fs = require('fs');
const JSONStream = require('JSONStream');
const util = require('util');

// Create twitter client instance.
const client = new Twitter(config);

const MAX_API_REQUEST_COUNT = 320000;

let list = [];
let deleteCount = 0;
let lastSuccessfulTweetDeleted = 0;

// There are a few reasons that we may get errors. Seems like
// native retweets require permissions to the original tweet
// even though we're just trying to nuke our retweet. So these 
// errors pop up. We should just continue.
const continuableErrors = [
  179, // "not authorized to see"
  144, // "No status found with that ID"
  34,  // "Sorry that page does not exist" - not sure why this is different than 144...
  63,  // "User has been suspended"
  200  // "Forbidden"
];

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/tweets/file");
    process.exit(-1);
}

const inputFile = process.argv[2];

console.log('------Start deleting.-----');

const jsonStream = JSONStream.parse([true, 'id_str']);
jsonStream.on('data', (data)=> {
  // console.log(data);
  list.push(data);
})

jsonStream.on('close',(error)=>{

    async.eachSeries(list, (tweetId, next) => {
      // If the deleteCount exceeds MAX_API_REQUEST_COUNT, it will be skipped.
      if (deleteCount > MAX_API_REQUEST_COUNT) {
        return next();
      }
      // Delete specified tweets.
      client.post('statuses/destroy/' + tweetId, (err, result, response) => {
        if (err) {
          console.error("Error deleting " + tweetId + ": " + util.inspect(err));
          if (err.length > 0 && !continuableErrors.includes(err[0].code)) {
            return next(err);
          }
        } else {
          deleteCount++;
          console.log('success: tweetId: ', tweetId, deleteCount);
          lastSuccessfulTweetDeleted = tweetId;
        }
        next();
      });
    }, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('finish. The last delete tweetId: ' + lastSuccessfulTweetDeleted + '\n');
    });  
});

fs.createReadStream(inputFile)
  .on('error', (error)=> {
    console.error(error);
  })
  .pipe(jsonStream);
