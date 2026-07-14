import { exec } from "child_process";

export class ShellSession {

    execute(command: string): Promise<string> {

        return new Promise((resolve, reject) => {

            exec(
                command,
                {
                    shell: "powershell.exe"
                },
                (err, stdout, stderr) => {

                    if (err) {
                        reject(new Error(stderr || err.message));
                        return;
                    }

                    resolve(stdout || stderr);

                }
            );

        });

    }

}