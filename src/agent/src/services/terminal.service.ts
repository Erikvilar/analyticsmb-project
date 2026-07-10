import {exec} from "child_process";
export class TerminalService{execute(c:string){
    return new Promise<string>((r,j)=>exec(c,
        {
        shell:"powershell.exe"
        },
        (e,o,er)=>e ? j (er) :  r(o)))}}