/// <reference path="sys.ts" />

namespace sc {
  export function isSourceFileCpp(file: SourceFile): boolean {
    return isInCppFile(file);
  }

  export function isInCppFile(node: Node): boolean {
    return node && !!(node.flags & NodeFlags.CppFile);
  }

  export function createDiagnosticCollection(): DiagnosticCollection {
    let nonFileDiagnostics: Diagnostic[] = [];

    return {
      add
    };

    function add(diagnostic: Diagnostic): void {
      let diagnostics: Diagnostic[];
      //const fileDiagnostics = createMap<Diagnostic[]>();

      if (diagnostic.file) {
        //diagnostics = fileDia
      }

      diagnostics.push(diagnostic);
      
    }
  }
}