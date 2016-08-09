var pigFactory = function () {
	var fs = require('fs'),
		gm = require('gm').subClass({imageMagick: true}),
		Twitter = require('twitter'),
		twitter = new Twitter({
			consumer_key: process.env.TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
			access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		}),
		logger = require('./logger'),
		self = this,
		cachedpigCount;

	const pig_DIR = __dirname + '/public_html/pigs/';
	const pigSE = __dirname + '/public_html/pigsee.jpg';
	const COUNT_FILE = __dirname + '/public_html/count.json';
	const TWEET_REGEX = /([0-9]+)(?= pigs served!)/;

	this.grabApig = function (params, callback) {
		var pig = params.pigse ? pigSE : self.getRandompig();

		gm(pig)
			.resize(params.width, params.height, '^')
			.gravity('Center')
			.crop(params.width, params.height)
			.toBuffer(function (err, buffer) {
				callback(err, buffer);
			});
	};

	this.getpigsServedCount = function (callback) {
		if (cachedpigCount) {
			callback(null, cachedpigCount);
		} else {
			twitter.get('statuses/user_timeline', {screen_name: 'placepigs'}, function (err, tweets) {
				if (err) {
					logger.error('Error getting tweets:', err);
					return;
				}

				//find last tweet mentioning "pigs served!"
				var countTweets = tweets.filter(function (tweet) {
						return TWEET_REGEX.exec(tweet.text);
					});

				cachedpigCount = TWEET_REGEX.exec(countTweets[0].text)[0];
				callback(null, cachedpigCount);
			})
		}
	};

	this.updatepigsServedCount = function () {
		self.getpigsServedCount(function (err, lastCount) {
			if (err) {
				logger.error("Couldn't get pigs served count");
				return;
			}

			//that's the count, increment it
			lastCount++;
			cachedpigCount++;

			//send out a tweet with the new count
			var tweet = {status: "I just served someone a #pig! That's " + lastCount + " pigs served!"};
			twitter.post('statuses/update', tweet, function (err, tweet, response) {
				if (err) {
					logger.error('Error posting tweet:', err);
				}
			});
		});
	};

	this.getRandompig = function () {
		var files = fs.readdirSync(pig_DIR);
		return pig_DIR + files[Math.floor(Math.random() * files.length)];
	}
};

module.exports = new pigFactory();
