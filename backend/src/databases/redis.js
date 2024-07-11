const { createClient } = require('redis')

const client = createClient({
    host: process.env.redis_host,
    port: process.env.redis_port
});


client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

module.exports = client