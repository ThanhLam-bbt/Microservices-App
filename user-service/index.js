const express = require("express");
const app = express();
const port = 3000;

app.get("/user", (req, res) => {
  console.log("Request received for /user");
  res.json({ id: 1, name: "Alice" });
});

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});
