/// <reference path="sys.ts"/>
/// <reference path="parser.ts"/>

namespace SugarCpp {
    export function executeCommandLine(args: string[]): number {
        var cmds = parseCommandLine(args);
        var program = createProgram(cmds.filenames, createCompileHost());
        var checker = program.getTypeChecker();

        return 1;
    }


    function getSourceFile(filename: string): SourceFile {
        try {
            var text = sys.readFile(filename);
        } catch (error) {
            return undefined;
        }
        
        return createSourceFile(filename, text);
    }

    function createCompileHost(): CompilerHost {
        return {
            getSourceFile: getSourceFile,
            getCanonicalFileName: getCanonicalFileName
        }
    }
}


SugarCpp.executeCommandLine(sys.args);