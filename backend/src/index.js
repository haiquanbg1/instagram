const express = require("express");
const cors = require("cors");
const http = require('http');

const app = express();
const api = require("./routes/api");
const { configureSocketIO } = require("./utils/socket");

require("dotenv").config();
require("./config/serverConfig")(app);

const server = http.createServer(app);
const io = configureSocketIO(server);
const port = 8080;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// api routers
app.use(
    "/api/ver1/",
    api
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})