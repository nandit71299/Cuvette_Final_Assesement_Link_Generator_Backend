const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const routes = require("./routes/index");
const dbConfig = require("./config/dbConfig");
const cors = require("cors");

app.get("/", (req, res) => res.send("Hello World!"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConfig()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((err) => console.log(err));

app.use("/api", routes);
