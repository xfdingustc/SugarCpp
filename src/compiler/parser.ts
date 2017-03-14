/// <reference path="core.ts" />
/// <reference path="scanner.ts" />

namespace sc {
  export function createSourceFile(fileName: string, sourceText: string, setParentNodes = false): SourceFile {
    const result = Parser.parseSourceFile(fileName, sourceText, undefined, setParentNodes);
    return result;
  }


  namespace Parser {
    const scanner = createScanner();
    let NodeConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;
    let TokenConstructor: new (kind: SyntaxKind, pos: number, end: number) => Node;
    //let IdentifierConstructor: new(kind: SyntaxKind, pos: number, end: number) => Node;
    let SourceFileConstructor: new(kind: SyntaxKind, pos: number, end: number) => Node;


    let sourceFile: SourceFile;
    let parseDiagnostics: Diagnostic[];
    let syntaxCursor: IncrementalParser.SyntaxCursor;

    let sourceText: string;
    let nodeCount: number;

    //let contextFlag: NodeFlags;

    let parseErrorBeforeNextFinishedNode = false;

    export function parseSourceFile(fileName: string, sourceText: string, syntaxCursor: IncrementalParser.SyntaxCursor, setParentNodes?: boolean): SourceFile {
      initializeState(sourceText, syntaxCursor);
      const result = parseSourceFileWorker(fileName, setParentNodes);
      clearState();
      return result;
    }

    function initializeState(_sourceText: string, _syntaxCursor: IncrementalParser.SyntaxCursor) {
      NodeConstructor = objectAllocator.getNodeConstructor();
      TokenConstructor = objectAllocator.getTokenConstructor();
      SourceFileConstructor = objectAllocator.getSourceFileConstructor();

      sourceText = _sourceText;
      syntaxCursor = _syntaxCursor;


      parseDiagnostics = [];
      nodeCount = 0;

      

      scanner.setText(sourceText);
      scanner.setOnError(scanError);
    }

    function clearState() {
      scanner.setText("");
      scanner.setOnError(undefined);

      sourceFile = undefined;
      syntaxCursor = undefined;
      sourceText = undefined;
    }

    function parseSourceFileWorker(fileName: string, setParentNodes: boolean): SourceFile {
      sourceFile = createSourceFile(fileName);
      //sourceFile.flags = contextFlags;

      if (setParentNodes) {

      }

      return sourceFile;
    }

    function createSourceFile(fileName: string): SourceFile {
      const sourceFile = <SourceFile>new SourceFileConstructor(SyntaxKind.SourceFile, 0, sourceText.length);
      nodeCount++;

      sourceFile.text = sourceText;
      sourceFile.fileName = normalizePath(fileName);
      return sourceFile;
    }

    function parseErrorAtPosition(start: number, length: number, message: DiagnosticMessage, arg0?: any): void {
      // Don't report another error if it would just be at the same position as the last error.
      const lastError = lastOrUndefined(parseDiagnostics);
      if (!lastError || start !== lastError.start) {
        parseDiagnostics.push(createFileDiagnostic(sourceFile, start, length, message, arg0));
      }

      // Mark that we've encountered an error.  We'll set an appropriate bit on the next
      // node we finish so that it can't be reused incrementally.
      parseErrorBeforeNextFinishedNode = true;
    }

    function scanError(message: DiagnosticMessage, length?: number) {
      const pos = scanner.getTextPos();
      parseErrorAtPosition(pos, length || 0, message);
    }
  }

  namespace IncrementalParser {

    interface IncrementalElement extends TextRange {
      parent?: Node;
      length?: number;
      _children: Node[];
    }

    export interface IncrementalNode extends Node, IncrementalElement {
      hasBeenIncrementallyParsed: boolean;
    }

    export interface SyntaxCursor {
      currentNode(position: number): IncrementalNode;
    }
  }
}