/// <reference path="sys.ts"/>

namespace SugarCpp {
    export function executeCommandLine(args: string[]): number {
        var cmds = parseCommandLine(args);
        sys.print(cmds.filenames[0]);
        return 1;
    }
}


SugarCpp.executeCommandLine(sys.args);