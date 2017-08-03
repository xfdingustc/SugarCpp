namespace SugarCpp {
    export interface TextRange {
        pos: number;
        end: number;
    }

    export enum SyntaxKind {
        Unknown,
    }

    export interface Symbol {
        
    }

    export interface SymbolTable {
        [index: string]: Symbol;
    }

    export interface Node extends TextRange {
        kind: SyntaxKind;
        parent?: Node;
        locals?: SymbolTable;
    }

    export interface Identifier extends Node {
        text: string;
    }

    export interface Declaration extends Node {
        name?: Identifier;
    }

    export interface NodeArray<T> extends Array<T>, TextRange { }

    export interface Statement extends Node {

    }

    export interface Block extends Statement {
        Statement: NodeArray<Statement>
    }

    export interface SourceFile extends Block {
        filename: string;
        symbolCount: number;
    }

    export interface ParsedCommandLine {
        filenames: string[];
    }


    export interface Program {
        getSourceFiles(): SourceFile[];
        getCompilerHost(): CompilerHost;
        getTypeChecker(): TypeChecker;
    }

    export interface CompilerHost {

    }

    export interface TypeChecker {

    }
}