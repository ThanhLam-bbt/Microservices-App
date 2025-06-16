const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001;

const userServiceUrl =
  process.env.USER_SERVICE_URL || "http://user-service-svc:3000/user";

app.get("/", async (req, res) => {
  try {
    console.log(`Calling user service at: ${userServiceUrl}`);
    const response = await axios.get(userServiceUrl);
    const user = response.data;
    res.send(`Hello, ${user.name}!`);
  } catch (error) {
    console.error("Error calling user service:", error.message);
    res.status(500).send("Error connecting to the user service.");
  }
});

app.listen(port, () => {
  console.log(`Greeting service listening on port ${port}`);
});
