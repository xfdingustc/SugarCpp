namespace SugarCpp {
    export interface Scanner {
        getStartPos(): number;
        getTokenPos(): number;
        scan(): SyntaxKind;
    }

    var textToToken: Map<SyntaxKind> = {
        "class": SyntaxKind.ClassKeyword,
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isWhiteSpace(ch: number): boolean {
        return ch === CharacterCodes.space
            || ch === CharacterCodes.tab
            || ch === CharacterCodes.verticalTab
            || ch === CharacterCodes.formFeed
            || ch === CharacterCodes.nonBreakingSpace
            || ch === CharacterCodes.ogham
            || ch >= CharacterCodes.enQuad && ch <= CharacterCodes.zeroWidthSpace
            || ch === CharacterCodes.narrowNoBreakSpace
            || ch === CharacterCodes.mathematicalSpace
            || ch === CharacterCodes.ideographicSpace
            || ch === CharacterCodes.byteOrderMark;
    }

    export function createScanner(text?: string): Scanner {
        var pos: number;
        var len: number;
        var startPos: number;
        var tokenPos: number;
        var token: number;
        var tokenValue: string;

        function isIdentifierStart(ch: number): boolean {
            return ch >= CharacterCodes.A && ch <= CharacterCodes.Z
                || ch >= CharacterCodes.a && ch <= CharacterCodes.z
                || ch === CharacterCodes.$ || ch === CharacterCodes._;
        }

        function isIdentifierPart(ch: number): boolean {
            return ch >= CharacterCodes.A && ch <= CharacterCodes.Z
                || ch >= CharacterCodes.a && ch <= CharacterCodes.z
                || ch >= CharacterCodes._0 && ch <= CharacterCodes._9
                || ch === CharacterCodes.$ || ch === CharacterCodes._;
        }

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

        function getIdentifierToken(): SyntaxKind {
            var len = tokenValue.length;
            if (len >= 2 && len <= 11) {
                var ch = tokenValue.charCodeAt(0);
                if (ch >= CharacterCodes.a && ch <= CharacterCodes.z
                    && hasOwnProperty.call(textToToken, tokenValue)) {
                    return token = textToToken[tokenValue];
                }
            }
        }

        function scan(): SyntaxKind {
            startPos = pos;
            while (true) {
                tokenPos = pos;
                if (pos >= len) {
                    return token = SyntaxKind.EndOfFileToken;
                }

                var ch = text.charCodeAt(pos);
                switch (ch) {
                    default:
                        if (isIdentifierStart(ch)) {
                            pos++;
                            while (pos < len && isIdentifierPart(ch = text.charCodeAt(pos))) {
                                pos++;
                            }

                            tokenValue = text.substring(tokenPos, pos);
                            return token = getIdentifierToken();
                        } else if (isWhiteSpace(ch)) {
                            pos++;
                            continue;
                        }

                }
            }
        }

        setText(text);

        return {
            getStartPos: () => startPos,
            getTokenPos: () => tokenPos,
            scan: scan,
        }
    }
}