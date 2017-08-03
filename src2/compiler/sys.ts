interface System {
    args: string[];
    newLine: string;
    print(s: string): void;
    readFile(fileName: string): string;
    useCaseSensitiveFileNames: boolean;
}

enum ErrorCodes {
    UnsupportedFileEncoding = 1,
    CannotReadFile = 2,
}

declare var require: any;
declare var process: any;

var sys: System = (function() {
    function getNodeSystem(): System {
        var _fs = require("fs");
        var _os = require("os");
        var platform: string = _os.platform();

        var useCaseSensitiveFileNames = platform !== "win32" && platform !== "win64" && platform !== "darwin";
        return {
            args: process.argv.slice(2),
            newLine: _os.EOL,
            print(s: string): void {
                process.stdout.write(s + sys.newLine);
            },
            readFile(fileName: string): string {
                try {
                    var buffer = _fs.readFileSync(fileName);

                    // Make sure buffer got initialized and that we don't try to read into a completely empty file.
                    if (!buffer || buffer.length === 0) {
                        return "";
                    }

                    switch (buffer[0]) {
                        case 0xFE:
                            if (buffer[1] === 0xFF) {
                                // utf16-be. Reading the buffer as big endian is not supported, so convert it to 
                                // Little Endian first
                                var i = 0;
                                while ((i + 1) < buffer.length) {
                                    var temp = buffer[i];
                                    buffer[i] = buffer[i + 1];
                                    buffer[i + 1] = temp;
                                    i += 2;
                                }
                                return buffer.toString("utf16le", 2);
                            }
                            break;
                        case 0xFF:
                            if (buffer[1] === 0xFE) {
                                // utf16-le
                                return buffer.toString("utf16le", 2);
                            }
                            break;
                        case 0xEF:
                            if (buffer[1] === 0xBB) {
                                // utf-8
                                return buffer.toString("utf8", 3);
                            }
                    }
                
                    return buffer.toString("utf8", 0);
                }
                catch (err) {
                    err.code = ErrorCodes.CannotReadFile;
                    throw err;
                }
            },
            useCaseSensitiveFileNames: useCaseSensitiveFileNames,
        }
    }

    return getNodeSystem();
})();


function getCanonicalFileName(fileName: string): string {
    return sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
}