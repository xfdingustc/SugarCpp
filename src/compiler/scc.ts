/// <reference path="sys.ts" />
namespace sc {
  export function executeCommandLine(args: string[]): void {
    args[0] = "test";
  }


}

sc.executeCommandLine(sc.sys.args);