import { exec, ExecException } from 'child_process';

export const getVersion = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    exec('devproxy --version', (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(`Error getting version: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Error getting version: ${stderr}`);
        return;
      }
      resolve(stdout.trim());
    });
  });
};