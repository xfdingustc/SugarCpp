/// <reference path="sys.ts"/>
/// <reference path="parser.ts"/>

namespace SugarCpp {
    export function executeCommandLine(args: string[]): number {
        var cmds = parseCommandLine(args);
        var program = createProgram(cmds.filenames, createCompileHost());
        var checker = program.getTypeChecker();

        return 1;
    }


    function createCompileHost(): CompilerHost {
        return {

        }
    }
}


SugarCpp.executeCommandLine(sys.args);