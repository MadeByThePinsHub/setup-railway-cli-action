import * as mexec from "./exec";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as which from "which";

async function run(): Promise<void> {
  try {
    core.startGroup(`Node.js and npmjs version`);
    await exec.exec("wget", ["--version"]);
    await exec.exec("npm", ["version"]);
    core.endGroup();

    // for installs through NPM
    const npmInstall = core.getInput("npm-mode");
    const npmPrefix = process.env.GITHUB_WORKSPACE + "/.npm-global";

    // and for installs through the reproduicible build process
    const cliRepoUrl = core.getInput("repo-url");
    const cliRepoBranch = core.getInput("repo-branch");
    const cliClonePath = "/tmp/railwayappcli";
    const cliPath = cliClonePath + "/bin";

    // Rawfiles to our scripts
    const npmGlobalInstallWorkaround =
      "https://raw.githubusercontent.com/MadeByThePinsHub/setup-railway-cli-action/main/scripts/npm-install-global-workaround";
    const buildFromSourceScript =
      "https://raw.githubusercontent.com/MadeByThePinsHub/setup-railway-cli-action/main/scripts/build-from-source";

    core.startGroup("Installing Railway CLI");
    if (npmInstall == "true") {
      if (cliRepoUrl && npmInstall == "true") {
        core.warning(
          "Installation through NPM is found in config, but you want to build from source? Ommit npm-mode on your workflow file."
        );
      }
      await exec.exec("wget", [
        npmGlobalInstallWorkaround,
        "-O",
        "/tmp/npm-install-global-workaround"
      ]);
      await mexec
        .exec("bash", ["/tmp/npm-install-global-workaround"], false)
        .then(res => {
          if (res.stderr != "" && !res.success) {
            throw new Error(res.stderr);
          }
        });
      core.addPath(npmPrefix);
    } else if (cliRepoUrl && cliRepoBranch == "") {
      core.warning(
        "This feature is currently broken, will probably fix soon but contributions are welcome!"
      );
      await exec.exec("wget", [
        buildFromSourceScript,
        "-O",
        "/tmp/railway-build"
      ]);
      await mexec.exec(
        "bash",
        ["/tmp/railway-build", cliClonePath, cliRepoUrl],
        false
      );
      core.addPath(cliPath);
    } else if (cliRepoUrl && cliRepoBranch != "") {
      await exec.exec("wget", [
        buildFromSourceScript,
        "-O",
        "/tmp/railway-build"
      ]);
      await mexec.exec(
        "bash",
        ["/tmp/railway-build", cliClonePath, cliRepoUrl, cliRepoBranch],
        false
      );
      core.addPath(cliPath);
    } else {
      await exec.exec("wget", [
        "-O",
        "/tmp/install-railway-cli",
        "https://raw.githubusercontent.com/railwayapp/cli/master/install.sh"
      ]);
      await mexec.exec("sudo", ["sh", "/tmp/install-railway-cli"], false);
    }
    core.endGroup();

    core.startGroup("Railway CLI install info");
    which("railway", function (er, resolvedPath) {
      // er is returned if no "node" is found on the PATH
      // if it is found, then the absolute path to the exec is returned
      if (er) {
        core.setFailed(er);
      } else {
        core.debug("Railway CLI Path: " + resolvedPath);
      }
    });
    await exec.exec("railway", ["--version"]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
