/// <reference path="program.ts" />
/// <reference path="commandLineParser.ts" />

namespace sc {
  export function executeCommandLine(args: string[]): void {
    const commandLine = parseCommandLine(args);
    let rootfileNames: string[];
    
    performCompilation();

    function performCompilation() {
      rootfileNames = commandLine.fileNames;
      compile(rootfileNames);
    }
    
    
  }


  function compile(fileNames: string[]) {
    const program = createProgram(fileNames);
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