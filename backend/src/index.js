const express = require("express");
const cors = require("cors");

const app = express();
const api = require("./routes/api");
const web = require("./routes/web");

require("dotenv").config();
require("./config/serverConfig")(app);

const port = 8080;

app.use(cors());

// web routers
app.use(
    "/",
    web
);

// api routers
app.use(
    "/api/ver1/",
    api
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})