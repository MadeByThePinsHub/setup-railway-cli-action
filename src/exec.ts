// This code is copied from https://github.com/docker/setup-qemu-action/blob/master/src/exec.ts, which licensed
// under Apache 2.0 License, which is compartible with MIT license which we use.
// Learn more at https://qr.ae/pGsN7u.
import * as actionsExec from '@actions/exec';
import {ExecOptions} from '@actions/exec';

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export const exec = async (command: string, args: string[] = [], silent: boolean): Promise<ExecResult> => {
  let stdout: string = '';
  let stderr: string = '';

  const options: ExecOptions = {
    silent: silent,
    ignoreReturnCode: true
  };
  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString();
    },
    stderr: (data: Buffer) => {
      stderr += data.toString();
    }
  };

  const returnCode: number = await actionsExec.exec(command, args, options);

  return {
    success: returnCode === 0,
    stdout: stdout.trim(),
    stderr: stderr.trim()
  };
};
