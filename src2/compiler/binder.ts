/// <reference path="types.ts"/>
namespace SugarCpp {
    export function bindSourceFile(file: SourceFile) {
        var parent: Node;
        var container: Declaration;
        var symbolCount = 0;
        

        if (!file.locals) {
            file.locals = {};
            container = file;
            bind(file);
            file.symbolCount = symbolCount;
        }


        function bind(node: Node) {
            node.parent = parent;
            switch (node.kind) {
                case SyntaxKind.SourceFile:
                    break;    
            }
        }
    }

}