const { exec, spawn } = require("child_process");
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

// "http://raspberrypi.local:3000/weather/test_colors

app.use(express.static(path.join(__dirname, "../dist")));

// set up all of the main api endpoints by requiring this file
require("./routes")(app);

// all URLs not matching a defined route will be relegated to the front-end
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`now listening on localhost:${port}`);
});
