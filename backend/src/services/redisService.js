const client = require("../databases/redis");
const { promisify } = require('util');

// Chuyển đổi các phương thức Redis sang dạng Promise
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const incrAsync = promisify(client.incr).bind(client);
const decrAsync = promisify(client.decr).bind(client);

module.exports = {
    getAsync,
    setAsync,
    incrAsync,
    decrAsync
}