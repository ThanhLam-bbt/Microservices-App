const express = require("express");
const axios = require("axios");
const app = express();
const port = 3001;

// URL của user-service. Trong Kubernetes, chúng ta sẽ dùng tên service.
// Để test local, bạn có thể dùng 'http://localhost:3000'
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
