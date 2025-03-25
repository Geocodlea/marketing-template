import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
}

const uri = process.env.MONGO_URI;
const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
};

let clientPromise;

if (!global._mongoClientPromise) {
  // Initialize the connection promise with error handling
  global._mongoClientPromise = connectToMongo();
}
clientPromise = global._mongoClientPromise;

// Function to connect to MongoDB with error handling and logging
async function connectToMongo(maxRetries = 5, retryDelay = 1000) {
  let client;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create a new MongoClient instance for each attempt
      client = new MongoClient(uri, options);

      // Await the connection
      await client.connect();

      // Connection successful
      return client;
    } catch (error) {
      console.error(
        `MongoDB (client) connection attempt ${attempt} failed: ${error.message}`
      );
      console.error(error); // Log the full error object for stack trace

      if (attempt === maxRetries) {
        console.error(
          "Failed to connect to MongoDB (client) after several attempts"
        );
        throw error; // Throw the original error to retain stack trace
      }

      const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
      console.log(`Retrying MongoDB (client) connection in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Export the promise for use in other modules
export default clientPromise;
