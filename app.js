require("dotenv").config();
const express = require("express");
let cors = require("cors");
const app = express();
const port = process.env.PORT || 3005;

let whitelist = [
  "",
  "http://localhost:3000",
  "https://homeworkdooerpro.com",
  "https://www.homeworkdooerpro.com",
];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("The HDP Server.");
});

app.listen(port, () => {
  console.log(`HDP Node Server listening on port: ${port}`);
});

module.exports = app;
