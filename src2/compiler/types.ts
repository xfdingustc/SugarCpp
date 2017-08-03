namespace SugarCpp {
    export interface ParsedCommandLine {
        filenames: string[];
    }


    export interface Program {
        getCompilerHost(): CompilerHost;
        getTypeChecker(): TypeChecker;
    }

    export interface CompilerHost {

    }

    export interface TypeChecker {

    }
}