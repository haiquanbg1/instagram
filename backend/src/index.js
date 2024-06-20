const express = require("express");
const cors = require("cors")

const app = express();
const router = require("./routes/api")

require("dotenv").config();
require("./config/serverConfig")(app);

const port = 8080;

app.use(cors());

app.use("/api/ver1/", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})