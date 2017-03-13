/// <reference path="sys.ts" />
/// <reference path="core.ts" />
/// <reference path="utilities.ts" />

namespace sc {
  export function createProgram(rootNames: string[]): Program  {
    let program: Program;
    let files: SourceFile[] = [];
    program = {
      getRootFileNames: () => rootNames,
      getSourceFiles: () => files,
      getSyntacticDiagnostics
    }

    return program;
    
    function getSyntacticDiagnostics(sourceFile: SourceFile, cancellationToken: CancellationToken): Diagnostic[] {
      return getDiagnosticsHelper(sourceFile, getSyntacticDiagnosticsForFile, cancellationToken);
    }

    function getDiagnosticsHelper(
        sourceFile: SourceFile, 
        getDiagnostics: (sourceFile: SourceFile, cancellationToken: CancellationToken) => Diagnostic[],
        cancellationToken:CancellationToken): Diagnostic[] {
      if (sourceFile) {
        return getDiagnostics(sourceFile, cancellationToken);
      }

      const allDiagnostics: Diagnostic[] = [];
      forEach(program.getSourceFiles(), sourceFile => {
        if (cancellationToken) {
          cancellationToken.throwIfCancellationRequested();
        }
        addRange(allDiagnostics, getDiagnostics(sourceFile, cancellationToken));
      });
        
    }
    


    function getSyntacticDiagnosticsForFile(sourceFile: SourceFile): Diagnostic[] {
        if (isSourceFileCpp(sourceFile)) {

        }

        return sourceFile.parseDiagnostics;
    }

  }
}