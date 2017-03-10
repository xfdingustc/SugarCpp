/// <reference path="types.ts" />

namespace sc {
  export function parseCommandLine(commandLine: string[]): ParsedCommandLine {
    const fileNames: string[] = [];
    parseStrings(commandLine);
    return {
      fileNames
    }

    function parseStrings(args: string[]) {
      let i = 0;
      while (i < args.length) {
        let s = args[i];
        i++;
        fileNames.push(s);
      }
    }
  }

}