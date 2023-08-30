require("dotenv").config();
const express = require("express");
let cors = require("cors");
const app = express();
const port = process.env.PORT || 3005;
const { openAIClient } = require("./utilities").openAI;

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

app.post("/generateEssay", async (req, res) => {
  console.log("Generating essay.");
  const { notes } = req.body;
  const stringifiedPrompt = `Using the following notes, create an essay about the subject 
    matter of the notes. Only give back an essay based on the notes. Do not include anything 
    else.\n\n\\$notes below\\$\n${notes}`;

  let completion = null;
  try {
    completion = await openAIClient.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: stringifiedPrompt }],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Error generating essay." });
  }

  if (!completion) {
    console.log("completion is:", completion);
    return res.status(500).send({ message: "Error generating essay." });
  }

  console.log(completion.data.choices[0].message);

  res.status(200).send(completion.data.choices[0].message.content);
});

app.listen(port, () => {
  console.log(`HDP Node Server listening on port: ${port}`);
});

module.exports = app;
