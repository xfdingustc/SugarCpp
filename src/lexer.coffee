exports.Lexer = class Lexer
    tokenize: (code, opts = {}) ->
        @indent = 0