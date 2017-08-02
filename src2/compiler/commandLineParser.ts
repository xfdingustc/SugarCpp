/// <reference path="types.ts"/>
namespace SugarCpp {
    export function parseCommandLine(commandLine: string[]): ParsedCommandLine {
        var filenames: string[] = [];
        parseStrings(commandLine);
        return {
            filenames: filenames
        };


        function parseStrings(args: string[]) {
            var i = 0;
            while (i < args.length) {
                var s = args[i++];
                filenames.push(s);
            }
        }
    }
}