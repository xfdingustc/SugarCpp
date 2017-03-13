namespace sc {
  export const enum NodeFlags {
    None = 0,
    ThisNodeHasError = 1 << 0,
    CppFile = 1 << 1,
  }
  export interface ParsedCommandLine {
    fileNames: string[];
  }

  export enum ExitStatus {
    Success = 0
  }

  export interface TextRange {
    pos: number;
    end: number;
  }

  export interface Node extends TextRange {
    flags: NodeFlags;
  }

  export interface Declaration extends Node {

  }

  export interface SourceFile extends Declaration {
    fileName: string;

    parseDiagnostics: Diagnostic[];
  }

  export interface ScriptReferenceHost {
    //getSourceFile(fileName: string): SourceFile;
  }

  export interface CancellationToken {
    isCancellationRequested(): boolean;

    throwIfCancellationRequested(): void;
  }

  export interface Program extends ScriptReferenceHost {
    getRootFileNames(): string[];
    getSourceFiles(): SourceFile[];
    getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): Diagnostic[];
  }

  export interface DiagnosticMessageChain {
    messageText: string;
    category: DiagnosticCategory;
    code: number;
    next?: DiagnosticMessageChain;
  }

  export interface Diagnostic {
    file: SourceFile;
    start: number;
    length: number;
    messageText: string | DiagnosticMessageChain;
    category: DiagnosticCategory;
    code: number;
  }

  export enum DiagnosticCategory {
    Warning,
    Error,
    Message,
  }
}