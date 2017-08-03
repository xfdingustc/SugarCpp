/// <reference path="types.ts"/>
/// <reference path="binder.ts"/>

namespace SugarCpp {
    
    export function createTypeChecker(program: Program): TypeChecker {
        var checker: TypeChecker;

        function initializeTypeChecker() {
            forEach(program.getSourceFiles(), file => {
                bindSourceFile(file);
            });
        }

        checker = {

        }

        return checker;
    }
}