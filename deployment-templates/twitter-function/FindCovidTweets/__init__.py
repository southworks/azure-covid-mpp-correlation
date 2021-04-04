from datetime import datetime, date, timedelta
import os
import csv
import time
import json
import tweepy
import logging
import tempfile
import traceback
import azure.functions as func
from azure.storage.blob import BlobServiceClient
from requests.exceptions import Timeout

def main(dailytrigger: func.TimerRequest):
    # IO
    logging.info("Configuring local file I/O...")

    def log(text, error = False):
        if error:
            logging.error(text)
        else: logging.info(text)

    # Options
    log("Formatting parameters...")

    args = { }
    MAX_RETRIES = 3 if not "max_retries" in args else args["max_retries"]
    MAX_TWEETS = -1 if not "max_tweets" in args else args["max_tweets"]
    REQUEST_WAIT_TIME = 0.55 if not "request_wait_time" in args else args["request_wait_time"]
    LOG_INTERVAL = 5000 if not "log_interval" in args else args["log_interval"]
    LAST_TWEET_ID = None if not "last_tweet_id" in args else args["last_tweet_id"]
    TIMEOUT_WAIT_TIME = 300 if not "timeout_wait_time" in args else args["timeout_wait_time"]
    DATE = ""
    if "date" in args:
        log(f"Using date from parameter: {args['date']}")
        DATE = args["date"].split('-')
    else:
        DATE = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d").split('-')
        log(f"No date parameter; Using yesterday's date: {DATE}")
    YEAR = int(DATE[0])
    MONTH = int(DATE[1])
    DAY = int(DATE[2])

    # Azure
    log("Configuring storage...")
    blob_service = BlobServiceClient.from_connection_string(os.environ["DATALAKE"])
    output_blob = blob_service.get_blob_client("twitterdataraw", f"{YEAR}-{MONTH}-{DAY}.csv")

    # API Setup
    log("Setting up API...")
    auth = tweepy.OAuthHandler(os.environ["CONSUMER_API_KEY"], os.environ["CONSUMER_API_SECRET"])
    api = tweepy.API(auth, wait_on_rate_limit=True)

    # Logic
    log(f"Started script")

    def throttle(cursor):
        nonlocal REQUEST_WAIT_TIME
        while True:
            time.sleep(REQUEST_WAIT_TIME)
            yield cursor.next()

    tweets = ""
    def loop(last_tweet_id, count = 0, retry_count = 0):
        nonlocal LOG_INTERVAL, MAX_RETRIES, TIMEOUT_WAIT_TIME, tweets

        log(f"Started new loop")
        pages = throttle(tweepy.Cursor(api.search, 
                                    q="#covid19 -filter:retweets",
                                    until=datetime(YEAR, MONTH, DAY + 1).date().strftime('%Y-%m-%d'),
                                    include_entities=False,
                                    count=100,
                                    max_id=last_tweet_id).pages())
        log("Created query item successfully")

        insights_log_count = 0
        try:
            for page in pages:
                for tweet in page:
                    if tweet.created_at.date() < datetime(YEAR, MONTH, DAY).date():
                        log(f"Found last tweet from the specified date, stopping script - {count} tweets")
                        return
                    if MAX_TWEETS > 0 and count > MAX_TWEETS:
                        log(f"Reached max amount of tweets, stopping script - {count} tweets")
                        return

                    tweets += f'{tweet.id},"",{tweet.created_at}\n'
                    count += 1
                    last_tweet_id = tweet.id

                log(f"Found page with {len(page)} items - total: {count} - last tweet id: {last_tweet_id}")
        except:
            if retry_count >= MAX_RETRIES:
                log(f"Max retry amount of {MAX_RETRIES} reached, raising error...")
                raise
            log(traceback.format_exc(), error=True)
            log(f"Error thrown - {retry_count} retries - count: {count} - id of last tweet: {last_tweet_id}", error=True)
            log(f"Waiting {TIMEOUT_WAIT_TIME} seconds and retrying...")
            time.sleep(TIMEOUT_WAIT_TIME)
            log(f"Waited {TIMEOUT_WAIT_TIME} seconds, re-starting loop")
            return loop(last_tweet_id, count, retry_count+1)

    try:
        loop(LAST_TWEET_ID)
            
        log("Done gathering tweets, uploading to storage...")
        if output_blob.exists():
            output_blob.delete_blob()
            log("An existing blob was found and deleted.")
        output_blob.upload_blob(tweets.encode())
        log("Uploaded tweets to storage.")
    except:
        log("Unhandled error, didn't move file to final storage.", error=True)
        raise
