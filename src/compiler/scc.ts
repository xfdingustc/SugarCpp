/// <reference path="program.ts" />
/// <reference path="commandLineParser.ts" />

namespace sc {
  export function executeCommandLine(args: string[]): void {
    const commandLine = parseCommandLine(args);
    let cachedProgram: Program;
    let compilerHost: CompilerHost;

    let rootfileNames: string[];
    
    performCompilation();

    function performCompilation() {
      if (!cachedProgram) {
        rootfileNames = commandLine.fileNames;

        compilerHost = createCompilerHost();
      }
      
      compile(rootfileNames, compilerHost);
    }
    
    
  }


  function compile(fileNames: string[], compilerHost: CompilerHost) {
    const program = createProgram(fileNames, compilerHost);
    const exitStatus = compileProgram();
    return {program, exitStatus};

    function compileProgram(): ExitStatus {
      let diagnostics: Diagnostic[];

      diagnostics = program.getSyntacticDiagnostics();
      return ExitStatus.Success;
    }
  }



}

sc.executeCommandLine(sc.sys.args);