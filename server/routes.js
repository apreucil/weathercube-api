const express = require("express");
const morgan = require("morgan");
const { exec, spawn } = require("child_process");
const router = express.Router();

router.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));

// constants
const WPA_CONFIG_PATH = "/etc/wpa_supplicant/wpa_supplicant.conf";
const TEST_WPA_CONFIG_PATH = "testfile.txt";

/**
 * Takes raw output from the wifi scanner, and parse it into a list of strings.
 * We can feed this directly to a dropdown on the F.E.
 * 
 * @todo implement me!
 * 
 * @param {string} stdout
 * @returns {string[]}
 */
function parseScanResults(stdout) {
    return stdout
        .replace(/\tSSID\: /mg, "")
        .split("\n")
        .filter(s => s.length);
}

/**
 * Endpoint that triggers a network scan, and responds with a list of networks.
 */
router.get("/scan", (req, res) => {

  try {
    const command = "setupssid.sh";
    exec(command, (error, stdout, stderr) => {

      // error handling
      if (!stdout.length || stderr.length || error !== null) {
        let message = "No networks found";
        if (stderr.length) message = stderr;
        if (error !== null) message = error;

        throw new Error(message);
      }

      /** @todo we need to format stdout and send it to the front end to display */
      const networks = parseScanResults(stdout);
      return res.status(200).send({ networks });
    });
  } catch (error) {
    return res.sendStatus(500);
  }
});

/**
 * Given an ssid (network name) and a passowrd, create a new entry for the wpa supplicant
 * @param {string} ssid
 * @param {string} password
 */
function buildWPAEntry(ssid, password) {
  if (!(ssid && password)) throw new Error("missing required params [ssid | password]");
  return `\nnetwork={\n\tssid=\x22${ssid}\x22\n\tpsk=\x22${password}\x22\n\tkey_mgmt=WPA-PSK\n}`
}

/**
 * Endpoint that takes in a network name and password, and adds a new entry to the wpa_supplicant.conf
 */
router.post('/setup', (req, res) => {
  const { ssid, password } = req.body;

  try {
    // create a new entry with the given params and construct the command
    const entry = buildWPAEntry(ssid, password);
    const command = `echo "${entry}" >> ${WPA_CONFIG_PATH}`;

    // execute the command
    exec(command, (error, stdout, stderr) => {  
      // on any error, throw
      if (error !== null || stderr.length) {
        stderr.length && console.log(`stderr: ${stderr}`);
        error && console.log(`exec error: ${error}`);
        throw new Error(error || stderr);
      }
  
      console.log(`added network ${ssid} to wpa_supplicant`)
      // respond with a generic success
      return res.sendStatus(200);
    })
  } catch (error) {
    // catch the error here and respond with a generic error
    return res.sendStatus(500);
  }
})

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
