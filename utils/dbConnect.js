import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const options = {
  minPoolSize: 2,
  maxPoolSize: 10,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false,
};

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cachedPromise = null;

async function dbConnect(maxRetries = 5, retryDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // console.log(`Mongoose connection attempt ${attempt}`);
      cachedPromise = mongoose.connect(MONGO_URI, options);
      await cachedPromise;
      // console.log("Mongoose connected successfully");
      cachedPromise = null; // Reset cachedPromise
      return;
    } catch (error) {
      console.error("Mongoose connection error:", error);
      cachedPromise = null; // Reset cachedPromise
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying Mongoose connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(
          `Failed to connect to Mongoose after ${maxRetries} attempts`
        );
        throw error; // Re-throw the error after max retries
      }
    }
  }
}

export default dbConnect;
