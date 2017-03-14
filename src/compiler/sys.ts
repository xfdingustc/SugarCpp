/// <reference path="core.ts" />

namespace sc {
  export interface System {
    args: string[];
    write(s: string): void;
    readFile(path: string): string;
  }

  declare var require: any;
  declare var process: any;


  export let sys: System = (function(){
    let sys: System;

    function getNodeSystem(): System {
      const _fs = require("fs");
      const nodeSystem: System = {
        args: process.argv.slice(2),
        write(s: string): void {
          process.stdout.write(s);
        },
        readFile
      }

      function readFile(fileName: string, _encoding?: string): string {
        if (!fileExists(fileName)) {
          return undefined;
        }

        const buffer = _fs.readFileSync(fileName);
        let len = buffer.length;
        if (len >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
          // Big endian UTF-16 byte order mark detected. Since big endian is not supported by node.js,
          // flip all byte pairs and treat as little endian.
          len &= ~1;
          for (let i = 0; i < len; i += 2) {
            const temp = buffer[i];
            buffer[i] = buffer[i + 1];
            buffer[i + 1] = temp;
          }
          return buffer.toString("utf16le", 2);
        }
        if (len >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
          // Little endian UTF-16 byte order mark detected
          return buffer.toString("utf16le", 2);
        }
        if (len >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
          // UTF-8 byte order mark detected
          return buffer.toString("utf8", 3);
        }
        // Default is UTF-8 with no byte order mark
        return buffer.toString("utf8");
      }

      const enum FileSystemEntryKind {
        File, 
        Directory
      }

      function fileSystemEntryExists(path: string, entryKind: FileSystemEntryKind): boolean {
        try {
          const stat = _fs.statSysc(path);
          switch (entryKind) {
            case FileSystemEntryKind.File:
              return stat.isFile();
            case FileSystemEntryKind.Directory:
              return stat.isDirectory();
          }
        }
        catch (e) {
          return false;
        }
      }

      function fileExists(path: string): boolean {
        return fileSystemEntryExists(path, FileSystemEntryKind.File);
      }

      return nodeSystem;
    }

    sys = getNodeSystem();
    return sys;
  })();
}