/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
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

    export function createSourceFile(filename: string, sourceText: string): SourceFile {
        var file: SourceFile;
        var rootNodeFlags: NodeFlags = 0;
        file = <SourceFile>createRootNode(SyntaxKind.SourceFile, 0, sourceText.length, rootNodeFlags);
        file.filename = normalizePath(filename);
        file.text = sourceText;
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
                    filesByName[host.getCanonicalFileName(filename)] = file
                }
            }
            return file;
        }
    }


}