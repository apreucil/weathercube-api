const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../dist")));

// use a router for all api endpoints at this path
app.use("/api", require("./routes"));

// all URLs not matching a defined route will be relegated to the front-end
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Now listening on http://localhost:${port}/`);
});
