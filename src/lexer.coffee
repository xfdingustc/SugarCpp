helpers     = require './helpers'

exports.Lexer = class Lexer
  tokenize: (code, opts = {}) ->
    @literate   = opts.literate
    @indent     = 0
    @indents    = []
    @tokens     = []

    @chunkLine =
      opts.line or 0
    @chunkColumn = 
      opts.column or 0
    code = @clean code


    i = 0
    while @chunk = code[i..]
      consumed = \
          @identifierToken() or
          @whitespaceToken() or
          @lineToken() or
          @literalToken()

      i += consumed

  clean: (code) ->
    code = code.slice(1) if code.charCodeAt(0) is BOM
    code = code.replace(/\r/g, '').replace TRAILING_SPACES, ''
    helpers.printLine code
    if WHITESPACE.test code
      code = "\n#{code}"
      @chunkLine--
    code = invertLiterate code if @literate
    code  

  identifierToken: ->
    #helpers.printLine @chunk
    #helpers.printLine 'chunkend'
    return 0 unless match = IDENTIFIER.exec @chunk
    helpers.printLine 'Find identifierToken'
    [input, id, colon] = match

    idLength = id.idLength
    poppedToken = undefined

    [..., prev] = @tokens

    input.length

  whitespaceToken: ->
    return 0 unless (match = WHITESPACE.exec @chunk) or 
                    (nline = @chunk.charAt(0) is '\n')
    helpers.printLine 'Find whitespace token'
    [..., prev] = @tokens
    prev[if match then 'spaced' else 'newLine'] = true if prev
    if match then match[0].length else 0

  lineToken: ->
    return 0 unless match = MULTI_DENT.exec @chunk  
    indent = match[0]
    helpers.printLine indent
    
  literalToken: ->
    helpers.printLine @chunk
    if match = OPERATOR.exec @chunk
      [value] = match
    else
      value = @chunk.charAt[0]
    helpers.printLine value
    value.length


# The character code of the nasty Microsoft madness otherwise known as the BOM.
BOM = 65279


# Token matching regexes.
IDENTIFIER = /// ^
  (?!\d)
  ( (?: (?!\s)[$\w\x7f-\uffff] )+ )
  ( [^\n\S]* : (?!:) )?  # Is this a property name?
///

NUMBER     = ///
  ^ 0b[01]+    |              # binary
  ^ 0o[0-7]+   |              # octal
  ^ 0x[\da-f]+ |              # hex
  ^ \d*\.?\d+ (?:e[+-]?\d+)?  # decimal
///i

OPERATOR   = /// ^ (
  ?: [-=]>             # function
   | [-+*/%<>&|^!?=]=  # compound assign / compare
   | >>>=?             # zero-fill right shift
   | ([-+:])\1         # doubles
   | ([&|<>*/%])\2=?   # logic / shift / power / floor division / modulo
   | \?(\.|::)         # soak access
   | \.{2,3}           # range or splat
) ///


WHITESPACE = /^[^\n\S]+/

MULTI_DENT = /^(?:\n[^\n\S]*)+/

TRAILING_SPACES     = /\s+$/