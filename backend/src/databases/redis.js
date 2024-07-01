const { createClient } = require('redis')

const client = createClient({
    password: process.env.redis_password,
    socket: {
        host: process.env.redis_host,
        port: process.env.redis_port
    }
});


client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
})();

module.exports = client