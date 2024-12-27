import { Client } from "twitter-api-sdk";
import { forEachChild } from "typescript";

import dotenv from "dotenv";

dotenv.config();







function getTimeFromHoursAgo(hoursAgo) {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export async function getXPostCount(query) {
  try {
  
    if (!process.env.X_BEARER_TOKEN) {
      throw new Error(
        "Bearer token is missing. Please set 'X_BEARER_TOKEN' in your environment variables."
      );
    }

    const client = new Client(process.env.X_BEARER_TOKEN);

  
    const formattedQuery = query;

    
    const response = await client.tweets.tweetCountsRecentSearch({
      "query": formattedQuery,
      "start_time": getTimeFromHoursAgo(1)
    });


    

    return response.meta.total_tweet_count;
  } catch (error) {
    // Handle API-specific errors
    if (error.response) {
      console.error(
        "Twitter API Error:",
        error.response.status,
        error.response.data
      );
    } else {
     
     // console.error("Error occurred:", error.header);
      //console.log(error.headers)
    }

    
    throw error;
  }
}
