import Redis from "ioredis";

const redisClient = new Redis({
    password: "garg1234", // Replace with your Redis host
    port: 17961, // Default Redis port
    host: "redis-17961.c244.us-east-1-2.ec2.redns.redis-cloud.com", // Redis password if required
    tls: process.env.REDIS_TLS === "true" ? {} : undefined, // Enable TLS if using managed services like Upstash
});


const clearRedisKeys = async () => {
    try {
        await redisClient.flushall(); // Clears all keys from the Redis database
        console.log("All keys cleared from Redis.");
    } catch (error) {
        console.error("Error clearing Redis keys:", error);
    }
};

// Schedule it to run every 24 hours
setInterval(clearRedisKeys, 24*60*60*1000);

export default redisClient;
