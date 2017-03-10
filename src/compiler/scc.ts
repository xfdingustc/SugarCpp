/// <reference path="sys.ts" />
/// <reference path="commandLineParser.ts" />

namespace sc {
  export function executeCommandLine(args: string[]): void {
    const commandLine = parseCommandLine(args);
    let i = 0;
    while (i < commandLine.fileNames.length) {
      sys.write(commandLine.fileNames[i]);
      i++;
    }
    
  }



}

sc.executeCommandLine(sc.sys.args);