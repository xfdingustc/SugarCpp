/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="checker.ts"/>

namespace SugarCpp {
    var nodeConstructors = new Array<new () => Node>(SyntaxKind.Count);

    export function getNodeConstructor(kind: SyntaxKind): new () => Node {
        return nodeConstructors[kind] || (nodeConstructors[kind] = objectAllocator.getNodeConstructor(kind));
    }


    function createRootNode(kind: SyntaxKind, pos: number, end: number, flags: NodeFlags): Node {
        var node = new (getNodeConstructor(kind))();
        node.pos = pos;
        node.end = end;
        node.flags = flags;
        return node;
    }

    interface ReferenceComments {

    }

    enum ModifierContext {
        SourceElement,
    }


    export function forEachChild<T>(node: Node, cbNode: (node: Node) => T, cbNodes?: (nodes: Node[]) => T): T {
        function children(nodes: Node[]) {
            if (nodes) {
                if (cbNodes) {
                    return cbNodes(nodes);
                    var result: T;
                    for (var i = 0, len = nodes.length; i < len; i++) {
                        if (result = cbNode(nodes[i])) {
                            break;
                        }
                    }
                    return result;
                }
            }
        }
        if (!node) {
            return;
        }

        switch (node.kind) {
            case SyntaxKind.SourceFile:
                var state = (<Block>node).statements;
                sys.print("statements: " + state.length);
                return children((<Block>node).statements);
        }
    }

    enum ParsingContext {
        SourceElements,
    }

    export function createSourceFile(filename: string, sourceText: string): SourceFile {
        var file: SourceFile;
        var scanner: Scanner;
        var token: SyntaxKind;
        var parsingContext: ParsingContext;

        function getNodePos(): number {
            return scanner.getStartPos();
        }

        function getNodeEnd(): number {
            return scanner.getStartPos();
        }

        function isListElement(kind: ParsingContext): boolean {
            switch (kind) {
                case ParsingContext.SourceElements:
                    return isSourceElement();
            }
        }

        function isListTerminator(kind: ParsingContext): boolean {
            switch (kind) {
                case ParsingContext.SourceElements:
                    return false;
            }
        }

        function parseList<T>(kind: ParsingContext, parseElement: () => T): NodeArray<T> {
            var saveParsingContext = parsingContext;
            parsingContext != 1 << kind;
            var result = <NodeArray<T>>[];
            result.pos = getNodePos();
            while (!isListTerminator(kind)) {
                if (isListElement(kind)) {
                    result.push(parseElement());
                }
            }
            result.end = getNodeEnd();
            parsingContext = saveParsingContext;
            return result;
        }

        function isIdentifier(): boolean {
            return token === SyntaxKind.Identifier || token > SyntaxKind.LastReservedWord;
        }

        function isExpression(): boolean {
            switch (token) {
                default:
                    return isIdentifier();
            }
        }

        function isStatement(): boolean {
            switch (token) {
                default:
                    return isExpression();
            }
        }
        function isDeclaration() {
            switch (token) {

            }
        }

        function isSourceElement(): boolean {
            return isDeclaration() || isStatement();
        }

        function parseStatement(): Statement {
            switch (token) {
                default:
                    return undefined;    
            }
        }

        function parseSourceElement() {
            return parseSourceElementOrModuleElement(ModifierContext.SourceElement)
        }

        function parseSourceElementOrModuleElement(modifierContext: ModifierContext): Statement {
            if (isDeclaration()) {

            }
            var statementStart = scanner.getTokenPos();
            var statement = parseStatement();
            
            return statement;
        }

        function processReferenceComments(): ReferenceComments {
            token = scanner.scan();
            return {
                
            };
        }

        scanner = createScanner(sourceText);

        var rootNodeFlags: NodeFlags = 0;
        file = <SourceFile>createRootNode(SyntaxKind.SourceFile, 0, sourceText.length, rootNodeFlags);
        file.filename = normalizePath(filename);
        file.text = sourceText;
        var referenceComments = processReferenceComments();
        file.statements = parseList(ParsingContext.SourceElements, parseSourceElement)
        return file;
    }



    export function createProgram(rootNames: string[], host: CompilerHost): Program {
        var program: Program;
        var files: SourceFile[] = [];
        var filesByName: Map<SourceFile> = {}

        forEach(rootNames, name => processRootFile(name));
        program = {
            getSourceFiles: () => files,
            getCompilerHost: () => host,
            getTypeChecker: () => createTypeChecker(program),
        }
        return program;

        function getSourceFile(filename: string) {
            filename = host.getCanonicalFileName(filename);
            return hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
        }

        function processRootFile(filename: string) {
            sys.print("processRootFile: " + filename)
            processSourceFile(filename);
        }

        function processSourceFile(filename: string, refFile?: SourceFile, refPos?: number, refEnd?: number) {
            if (refEnd !== undefined && refPos !== undefined) {
                var start = refPos;
                var length = refEnd - refPos;
            }

            findSourceFile(filename, refFile, refPos, refEnd);
        }

        function findSourceFile(filename: string, refFile?: SourceFile, refStart?: number, refLength?: number): SourceFile {
            var file = getSourceFile(filename);
            if (file) {

            } else {
                file = host.getSourceFile(filename);
                if (file) {
                    filesByName[host.getCanonicalFileName(filename)] = file;
                    files.push(file);
                }
            }
            return file;
        }
    }


}