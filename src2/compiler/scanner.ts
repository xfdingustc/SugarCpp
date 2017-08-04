namespace SugarCpp {
    export interface Scanner {
        getStartPos(): number;
    }

    export function createScanner(text?: string): Scanner {
        var pos: number;
        var len: number;
        var startPos: number;
        var tokenPos: number;
        var token: number;
        var tokenValue: string;


        function setText(newText: string) {
            text = newText || "";
            len = text.length;
            setTextPos(0);
        }

        function setTextPos(textPos: number) {
            pos = textPos;
            startPos = textPos;
            tokenPos = textPos;
            token = SyntaxKind.Unknown;
        }

        setText(text);

        return {
            getStartPos: () => startPos,
        }
    }
}