import * as mexec from './exec';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    core.startGroup(`Node.js and npmjs version`);
    await exec.exec('node', ['-v']);
    await exec.exec('npm', ['version']);
    core.endGroup();

    // for installs through NPM
    const npmInstall = core.getInput('npm-mode');

    // and for installs through the reproduicible build process
    const cliRepoUrl = core.getInput('repo-url');
    const cliRepoBranch = core.getInput('repo-url');
    const cliCloneDir = process.env.GITHUB_HOME + '/.railwayappcli';
    const cliPath = cliCloneDir + '/bin';

    core.startGroup('Installing Railway CLI');
    if (npmInstall == 'true') {
      if (cliRepoUrl && npmInstall == 'true') {
        core.warning(
          'Installation through NPM is found in config, but you want to build from source? Ommit npm-mode on your workflow file.'
        );
      }
      await mexec.exec('npm', ['install', '-g', '@railwayapp/cli'], true).then(res => {
        if (res.stderr != '' && !res.success) {
          throw new Error(res.stderr);
        }
      });
    } else if (cliRepoUrl && !cliRepoBranch) {
      await exec.exec('git', ['clone', cliRepoUrl, cliCloneDir]);
      await mexec.exec(
        'sh',
        [
          '-c',
          '"$(curl -sSL https://gist.githubusercontent.com/AndreiJirohHaliliDev2006/54fb09207e1a1589a4caafb8510a25d7/raw/bb884dfe1463c87940b0afa8b228cec3f321b329/railwayapp-cli-build.sh)"'
        ],
        false
      );
      core.addPath(cliPath);
    } else if (cliRepoUrl && cliRepoBranch) {
      await exec.exec('git', ['clone', '-b', cliRepoBranch, cliRepoUrl, cliCloneDir]);
      await mexec.exec(
        'sh',
        [
          '-c',
          '"$(curl -sSL https://gist.githubusercontent.com/AndreiJirohHaliliDev2006/54fb09207e1a1589a4caafb8510a25d7/raw/bb884dfe1463c87940b0afa8b228cec3f321b329/railwayapp-cli-build.sh)"'
        ],
        false
      );
      core.addPath(cliPath);
    } else {
      await mexec.exec(
        'sudo',
        ['sh', '-c', '"$(curl -sSL https://raw.githubusercontent.com/railwayapp/cli/master/install.sh)"'],
        false
      );
    }
    core.endGroup();

    core.startGroup('Railway CLI install info');
    core.debug('Railway CLI Path: ' + core.findPath('railway'));
    await exec.exec('railway', ['version']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
