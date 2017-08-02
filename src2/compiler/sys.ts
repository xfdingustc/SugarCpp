interface System {
    args: string[];
    newLine: string;
    print(s: string): void;
}

declare var require: any;
declare var process: any;

var sys: System = (function() {
    function getNodeSystem(): System {
        var _os = require("os");
        return {
            args: process.argv.slice(2),
            newLine: _os.EOL,
            print(s: string): void {
                process.stdout.write(s + sys.newLine);
            }
        }
    }

    return getNodeSystem();
})();