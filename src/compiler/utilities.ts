/// <reference path="sys.ts" />

namespace sc {
  export function isSourceFileCpp(file: SourceFile): boolean {
    return isInCppFile(file);
  }

  export function isInCppFile(node: Node): boolean {
    return node && !!(node.flags & NodeFlags.CppFile);
  }
}