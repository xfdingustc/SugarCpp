namespace SugarCpp {
    export interface Map<T> {
        [index: string]: T;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    export function hasProperty<T>(map: Map<T>, key: string): boolean {
        return hasOwnProperty.call(map, key);
    }

    export function forEach<T, U>(array: T[], callback: (element: T) => U): U {
        var result: U;
        if (array) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (result = callback(array[i])) {
                    break;
                }
            }
            return result;
        }
    }

    export function normalizeSlashes(path: string): string {
        return path.replace(/\\/g, "/");
    }

    // Returns length of path root (i.e. length of "/", "x:/", "//server/share/")
    function getRootLength(path: string): number {
        if (path.charCodeAt(0) === CharacterCodes.slash) {
            if (path.charCodeAt(1) !== CharacterCodes.slash) return 1;
            var p1 = path.indexOf("/", 2);
            if (p1 < 0) return 2;
            var p2 = path.indexOf("/", p1 + 1);
            if (p2 < 0) return p1 + 1;
            return p2 + 1;
        }
        if (path.charCodeAt(1) === CharacterCodes.colon) {
            if (path.charCodeAt(2) === CharacterCodes.slash) return 3;
            return 2;
        }
        return 0;
    }

    export var directorySeparator = "/";
    function getNormalizedParts(normalizedSlashedPath: string, rootLength: number) {
        var parts = normalizedSlashedPath.substr(rootLength).split(directorySeparator);
        var normalized: string[] = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part !== ".") {
                if (part === ".." && normalized.length > 0 && normalized[normalized.length - 1] !== "..") {
                    normalized.pop();
                }
                else {
                    normalized.push(part);
                }
            }
        }

        return normalized;
    }

    export function normalizePath(path: string): string {
        var path = normalizeSlashes(path);
        var rootLength = getRootLength(path);
        var normalized = getNormalizedParts(path, rootLength);
        return path.substr(0, rootLength) + normalized.join(directorySeparator);
    }

    export interface ObjectAllocator {
        getNodeConstructor(kind: SyntaxKind): new () => Node;
    }

    export var objectAllocator: ObjectAllocator = {
        getNodeConstructor: kind => {
            function Node() {

            }

            Node.prototype = {
                kind: kind,
                pos: 0,
                end: 0,
                flags: 0,
                parent: undefined,
            };

            return <any>Node;
        }
    }
}