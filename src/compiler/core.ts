/// <reference path="types.ts" />
namespace sc {
  export const version = "0.0.1";
}

namespace sc {


  /** Create a new map. If a template object is provided, the map will copy entries from it. */
  export function createMap<T>(): Map<T> {
    return new MapCtr<T>();
  }

  const MapCtr = typeof Map !== "undefined" && "entries" in Map.prototype ? Map : shimMap();

  // Keep the class inside a function so it doesn't get compiled if it's not used.
  function shimMap(): { new<T>(): Map<T> } {

        class MapIterator<T, U extends (string | T | [string, T])> {
            private data: MapLike<T>;
            private keys: string[];
            private index = 0;
            private selector: (data: MapLike<T>, key: string) => U;
            constructor(data: MapLike<T>, selector: (data: MapLike<T>, key: string) => U) {
                this.data = data;
                this.selector = selector;
                this.keys = Object.keys(data);
            }

            public next(): { value: U, done: false } | { value: never, done: true } {
                const index = this.index;
                if (index < this.keys.length) {
                    this.index++;
                    return { value: this.selector(this.data, this.keys[index]), done: false };
                }
                return { value: undefined as never, done: true }
            }
        }

        return class<T> implements Map<T> {
            private data = createDictionaryObject<T>();
            public size = 0;

            get(key: string): T {
                return this.data[key];
            }

            set(key: string, value: T): this {
                if (!this.has(key)) {
                    this.size++;
                }
                this.data[key] = value;
                return this;
            }

            has(key: string): boolean {
                // tslint:disable-next-line:no-in-operator
                return key in this.data;
            }

            delete(key: string): boolean {
                if (this.has(key)) {
                    this.size--;
                    delete this.data[key];
                    return true;
                }
                return false;
            }

            clear(): void {
                this.data = createDictionaryObject<T>();
                this.size = 0;
            }

            keys() {
                return new MapIterator(this.data, (_data, key) => key);
            }

            values() {
                return new MapIterator(this.data, (data, key) => data[key]);
            }

            entries() {
                return new MapIterator(this.data, (data, key) => [key, data[key]] as [string, T]);
            }

            forEach(action: (value: T, key: string) => void): void {
                for (const key in this.data) {
                    action(this.data[key], key);
                }
            }
        }
    }

  export function forEach<T, U>(array: T[] | undefined, callback: (element: T, index: number) => U | undefined): U | undefined {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const result = callback(array[i], i);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  export function append<T>(to: T[] | undefined, value: T | undefined): T[] | undefined {
    if (value === undefined) {
      return to;
    }

    if (to === undefined) {
      return [value];
    }

    to.push(value);
    return to;
  }

  export function addRange<T>(to: T[] | undefined, from: T[] | undefined): T[] | undefined {
    if (from === undefined) {
      return to;
    }
    for (const v of from) {
      to = append(to, v);
    }
    return to;
  }

  export function getBaseFileName(path: string) {
    if (path === undefined) {
      return undefined;
    }
    const i = path.lastIndexOf(directorySeparator);
    return i < 0 ? path : path.substring(i + 1);
  }

  export function hasExtension(fileName: string): boolean {
    return getBaseFileName(fileName).indexOf(".") >= 0;
  }

  export function lastOrUndefined<T>(array: T[]): T {
    return array && array.length > 0
            ? array[array.length - 1]
            : undefined;
  }

  export function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage, ...args: (string | number)[]): Diagnostic;
  export function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage): Diagnostic {
    const end = start + length;

    // Debug.assert(start >= 0, "start must be non-negative, is " + start);
    // Debug.assert(length >= 0, "length must be non-negative, is " + length);

    if (file) {
      // Debug.assert(start <= file.text.length, `start must be within the bounds of the file. ${start} > ${file.text.length}`);
      // Debug.assert(end <= file.text.length, `end must be the bounds of the file. ${end} > ${file.text.length}`);
    }

    let text: string;
    //let text = getLocaleSpecificMessage(message);

    if (arguments.length > 4) {
      //text = formatStringFromArgs(text, arguments, 4);
    }

    return {
      file,
      start,
      length,

      messageText: text,
      category: message.category,
      code: message.code,
    };
  }

  function Node(this: Node, kind: SyntaxKind, pos: number, end: number) {
    this.id = 0;
    this.kind = kind;
    this.pos = pos;
    this.end = end;
    this.flags = NodeFlags.None;
    this.parent = undefined;
  }

  export function normalizeSlashes(path: string): string {
    return path.replace(/\\/g, "/");
  }

  /**
     * Returns length of path root (i.e. length of "/", "x:/", "//server/share/, file:///user/files")
    */
  export function getRootLength(path: string): number {
    if (path.charCodeAt(0) === CharacterCodes.slash) {
      if (path.charCodeAt(1) !== CharacterCodes.slash) {
        return 1;
      }
      const p1 = path.indexOf("/", 2);
      if (p1 < 0) {
        return 2;
      }
      const p2 = path.indexOf("/", p1 + 1);
      if (p2 < 0) {
        return p1 + 1;
      }
      return p2 + 1;
    }
    if (path.charCodeAt(1) === CharacterCodes.colon) {
      if (path.charCodeAt(2) === CharacterCodes.slash) { 
        return 3;
      }
      return 2;
    }

    if (path.lastIndexOf("file:///", 0) === 0) {
      return "file:///".length;
    }
    const idx = path.indexOf("://");
    if (idx !== -1) {
      return idx + "://".length;
    }
    return 0;
  }

  export const directorySeparator = "/";
  const directorySeparatorCharCode = CharacterCodes.slash;
  function getNormalizedParts(normalizedSlashedPath: string, rootLength: number): string[] {
    const parts = normalizedSlashedPath.substr(rootLength).split(directorySeparator);
    const normalized: string[] = [];
    for (const part of parts) {
      if (part !== ".") {
        if (part === ".." && normalized.length > 0 && lastOrUndefined(normalized) !== "..") {
          normalized.pop();
        } else {
          // A part may be an empty string (which is 'falsy') if the path had consecutive slashes,
          // e.g. "path//file.ts".  Drop these before re-joining the parts.
          if (part) {
            normalized.push(part);
          }
        }
      }
    }

    return normalized;
  }


  export function normalizePath(path: string): string {
    path = normalizeSlashes(path);
    const rootLength = getRootLength(path);
    const root = path.substr(0, rootLength);
    const normalized = getNormalizedParts(path, rootLength);
    if (normalized.length) {
      const joinedParts = root + normalized.join(directorySeparator);
      return pathEndsWithDirectorySeparator(path) ? joinedParts + directorySeparator : joinedParts;  
    } else {
      return root;
    }
  }

  /** A path ending with '/' refers to a directory only, never a file. */
  export function pathEndsWithDirectorySeparator(path: string): boolean {
    return path.charCodeAt(path.length - 1) === directorySeparatorCharCode;
  }

  export interface ObjectAllocator {
    getNodeConstructor(): new (kind: SyntaxKind, pos?: number, end?: number) => Node;
    getTokenConstructor(): new <TKind extends SyntaxKind>(kind: TKind, pos?: number, end?: number) => Token<TKind>;
    getSourceFileConstructor(): new (kind: SyntaxKind.SourceFile, pos?: number, end?: number) => SourceFile;
  }

  export let objectAllocator: ObjectAllocator = {
    getNodeConstructor: () => <any>Node,
    getTokenConstructor: () => <any>Node,
    getSourceFileConstructor: () => <any>Node
  }
}