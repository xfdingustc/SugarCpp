/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="checker.ts"/>

namespace SugarCpp {
    export function createProgram(rootNames: string[], host: CompilerHost): Program {
        var program: Program;
        var files: SourceFile[] = [];

        forEach(rootNames, name => processRootFile(name));
        program = {
            getSourceFiles:() => files,
            getCompilerHost: () => host,
            getTypeChecker: () => createTypeChecker(program),
        }
        return program;

        function processRootFile(filename: string) {
            processSourceFile(filename);
        }

        function processSourceFile(filename: string) {

        }
    }


}