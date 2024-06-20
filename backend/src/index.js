const express = require("express");
const cors = require("cors");

const app = express();
const api = require("./routes/api");

require("dotenv").config();
require("./config/serverConfig")(app);

const port = 8080;

app.use(cors());

app.use(
    "/api/ver1/",
    api
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})