/// <reference path="types.ts"/>
/// <reference path="binder.ts"/>

namespace SugarCpp {
    var nextNodeId = 1;
    
    export function createTypeChecker(program: Program): TypeChecker {
        var nodeLinks: NodeLinks[] = [];
        var checker: TypeChecker;


        function getNodeLinks(node: Node): NodeLinks {
            if (!node.id) {
                node.id = nextNodeId++;
            }

            return nodeLinks[node.id] || (nodeLinks[node.id] = {})
        }

        function checkSourceElement(node: Node): void {
            if (!node) {
                return;
            }

           
        }

        function checkSourceFile(node: SourceFile) {
            var links = getNodeLinks(node);
            if (!(links.flags & NodeCheckFlags.TypeChecked)) {
                forEach(node.statements, checkSourceElement)
            }
        }


        function checkProgram() {
            forEach(program.getSourceFiles(), checkSourceFile);
        }

        function getDiagnostics(): Diagnostic[] {
            checkProgram();
            return undefined;
        }

        function initializeTypeChecker() {
            forEach(program.getSourceFiles(), file => {
                bindSourceFile(file);
            });
        }

        initializeTypeChecker();
        checker = {
            getDiagnostics: getDiagnostics,
        }

        return checker;
    }
}