const { exec, spawn } = require("child_process");
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

// "http://raspberrypi.local:3000/weather/test_colors

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/weather", function (req, res) {
  const ssid = req.query.ssid;
  const pass = req.query.pass;

  // const yourscript = exec("fetch-os-api-spec.sh", (error, stdout, stderr) => {
  //   console.log(stdout);
  //   console.log(stderr);
  //   if (error !== null) {
  //     console.log(`exec error: ${error}`);
  //   }
  // });

  res.status(400).send("Welcome to Weather Tube!");

  // res.send({ ssid, pass });
});

app.get("/weather/shutdown", (req, res) => {
  const process = exec("sudo shutdown -h now");

  throw new Error("whoops!");

  res.status(200).send("ok");
});

app.get("/weather/reboot", (req, res) => {
  // perform the reset script here
  const process = exec("sudo reboot");
  res.sendStatus(200);
});

app.get("/weather/restart-program", (req, res) => {
  // running a python file to restart the weather cube script
  // test comment
  const pyProc = spawn("python3", ["/home/admin/Pullcheck/main.py"]);

  pyProc.stdout.on("data", (data) => {
    const buf = Buffer.from(data);
    console.log(buf.toString());
  });

  console.log("test");

  res.sendStatus(200);
});

app.get("/weather/test_colors", (req, res) => {
  // running a python file to restart the weather cube script
  const pyProc = spawn("python3", ["/home/admin/Desktop/test_colors.py"]);

  pyProc.stdout.on("data", (data) => {
    const buf = Buffer.from(data);
    console.log(buf.toString());
  });

  console.log("testing colors");

  res.sendStatus(200);
});

app.get("/weather/landing", (req, res) => {
  // __dirname is /home/admin/weathercubeAPI
  res.sendFile(__dirname + "/index.html");
  // res.status(400).send(__dirname)
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`now listening on localhost:${port}`);
});
