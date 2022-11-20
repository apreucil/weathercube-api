const express = require("express");
const morgan = require("morgan");
const { exec, spawn } = require("child_process");
const router = express.Router();

// http://raspberrypi.local:3000/api/test_colors

router.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

router.get("/", (req, res) => {
  const ssid = req.query.ssid;
  const pass = req.query.pass;

  // const yourscript = exec("fetch-os-api-spec.sh", (error, stdout, stderr) => {
  //   console.log(stdout);
  //   console.log(stderr);
  //   if (error !== null) {
  //     console.log(`exec error: ${error}`);
  //   }
  // });

  res.status(200).send("Welcome to Weather Tube!");

  // res.send({ ssid, pass });
});

router.get("/test-colors", (req, res) => {
  // running a python file to restart the weather cube script
  const pyProc = spawn("python3", ["/home/admin/Desktop/test_colors.py"]);

  pyProc.stdout.on("data", (data) => {
    const buf = Buffer.from(data);
    console.log(buf.toString());
  });

  console.log("testing colors");

  res.sendStatus(200);
});

router.get("/restart-program", (req, res) => {
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

router.get("/reboot", (req, res) => {
  // perform the reset script here
  const process = exec("sudo reboot");
  res.sendStatus(200);
});

router.get("/shutdown", (req, res) => {
  const process = exec("sudo shutdown -h now");

  throw new Error("whoops!");

  res.status(200).send("ok");
});

module.exports = router;
