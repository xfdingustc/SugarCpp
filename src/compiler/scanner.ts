namespace sc {

  export interface ErrorCallback {
    (message: DiagnosticMessage, length: number): void;
  }

  export interface Scanner {
    getStartPos(): number;
    getTextPos(): number;
    setText(text: string, start?: number, length?: number): void;
    setOnError(onError: ErrorCallback): void;
  }

  export function createScanner(text?: string, onError?: ErrorCallback, start?: number, length?: number) : Scanner {
    let pos: number;

    let end: number;

    let startPos: number;

    let tokenPos: number;

    let token: SyntaxKind;
    let tokenValue: string;
  

    setText(text, start, length);

    return {
      getStartPos: () => startPos,
      getTextPos:() => pos,
      setText,
      setOnError
    };


    function setText(newText: string, string: number, length: number) {
      text = newText || "";
      end = length === undefined ? text.length : start + length;
      setTextPos(start || 0);
    }

    function setOnError(errorCallback: ErrorCallback) {
      onError = errorCallback;
    }

    function setTextPos(textPos: number) {
      pos = textPos;
      startPos = textPos;
      tokenPos = textPos;
      token = SyntaxKind.Unknown;
      
      tokenValue = undefined;

    }
  }
}