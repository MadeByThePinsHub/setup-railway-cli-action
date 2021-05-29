const core = require("@actions/core");
const { Toolkit } = require("actions-toolkit");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// get config first
const cliRepoUrl = core.getInput("repo-url");
const cliRepoBranch = core.getInput("repo-branch");
const installThroughNpmjs = core.getBooleanInput("npm-mode");
const workspace = process.env.GITHUB_WORKSPACE;

/**
 * Execute shell command
 * @param {String} cmd - root command
 * @param {String[]} args - args to be passed along with
 * @borrows https://github.com/MadeByThePinsHub/github-activity-readme/blob/master/index.js#L39-L62
 * @returns {Promise<void>}
 */
const exec = (cmd, args = []) =>
  new Promise((resolve, reject) => {
    const app = spawn(cmd, args, { stdio: "pipe" });
    let stdout = "";
    app.stdout.on("data", (data) => {
      stdout = data;
    });
    app.on("close", (code) => {
      if (code !== 0 && !stdout.includes("Successfully ran command.")) {
        err = new Error(`Invalid status code: ${code}`);
        err.code = code;
        return reject(err);
      }
      return resolve(code);
    });
    app.on("error", reject);
  });

const installFromNpmjs = async () => {
  core.debug("Installing Railway CLI through npmjs");
  await exec("npm", ["install", "@railway/cli", "-g"]);
};

const defaultInstaller = async () => {
  await exec("sudo", [
    "sh",
    "-c",
    "$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)",
  ]);
};

const installFromSource = async () => {
  if (!cliRepoBranch) {
    await exec("git", ["clone", cliRepoUrl, workspace + "/.railwayappcli"]);
  } else {
    await exec("git", [
      "clone",
      "-b",
      cliRepoBranch,
      cliRepoUrl,
      workspace + "/.railwayappcli",
    ]);
  }
  await exec("sh", [
    "-c",
    "$(curl -sSL https://gist.githubusercontent.com/AndreiJirohHaliliDev2006/54fb09207e1a1589a4caafb8510a25d7/raw/61837f8f3a07b3a2429ef2f78524c6bf2aeb63fa/railwayapp-cli-build.sh)",
  ]);
  const cliPath = workspace + "./railwayappcli/bin/railway";
  core.addPath(cliPath);
};

// the main script
const mainScript = async (tools) => {
  if (!cliRepoBranch && cliRepoUrl != "") {
    core.warning(
      "Custom Railway CLI repo URL found, but branch is undefined. Falling back to Git defaults..."
    );
  }

  if (cliRepoUrl != "" && cliRepoBranch != "" && installThroughNpmjs == true) {
    core.error(
      "Installing the Railway CLI through npmjs doesn't work with build-from-source mode."
    );
  }

  if (installThroughNpmjs == true) {
    // Install through NPM
    await installFromNpmjs();
  } else if (cliRepoUrl) {
    await InstallFromSource();
  } else {
    // fall back to this
    await defaultInstaller();
  }
};

// this is where the we can call everything
Toolkit.run(async (tools) => {
  // Install dependencies using this function
  await mainScript();
});
