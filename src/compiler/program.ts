/// <reference path="sys.ts" />
/// <reference path="core.ts" />
/// <reference path="utilities.ts" />
/// <reference path="parser.ts" />

namespace sc {
  export function createProgram(rootNames: string[], host?: CompilerHost, oldProgram?: Program): Program  {
    let program: Program;
    let files: SourceFile[] = [];

    let fileProcessingDiagnostics = createDiagnosticCollection();

    host = host || createCompilerHost();

    sys.write("rootNames: " + rootNames);

    if (true/*!tryReuseStructureFromOldProgram()*/) {
      forEach(rootNames, name => processRootFile(name, false));
    }

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

    function processRootFile(fileName: string, isDefaultLib: boolean) {
      processSourceFile(normalizePath(fileName), isDefaultLib);
    }

    function processSourceFile(fileName: string, isDefaultLib: boolean, refFile?: SourceFile, refPos?: number, refEnd?: number) {
      let diagnosticArgument: string[];
      let diagnostic: DiagnosticMessage;


      if (hasExtension(fileName)) {
        sys.write("has extension");
        if (!findSourceFile(fileName)) {
          diagnostic = Diagnostic.F
        }
      }
    }

    function findSourceFile(fileName: string): SourceFile {
      const file = host.getSourceFile(fileName, hostErrorMessage => {

      });
      return file;
    }

  }

  export function createCompilerHost(setParentNodes?: boolean): CompilerHost {
    function getSourceFile(fileName: string, onError?: (message: string) => void): SourceFile {
      let text: string;
      try {
        text = sys.readFile(fileName);
      }
      catch (e) {
        if (onError) {

        }
        text = "";
      }
      sys.write(text);
      return text !== undefined ? createSourceFile(fileName, text, setParentNodes) : undefined;
    }      

    return {
      getSourceFile
    };
  }
}