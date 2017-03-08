{Parser} = require 'jison'


unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/

o = (patternString, action, options) ->
  patternString = patternString.replace /\s{2,}/g, ' '
  patternCount = patternString.split(' ').length
  return [patternString, '$$ = $1;', options] unless action
  action = if match = unwrap.exec action then match[1] else "(#{action}())"

  # All runtime functions we need are defined on "yy"
  action = action.replace /\bnew /g, '$&yy.'
  action = action.replace /\b(?:Block\.wrap|extend)\b/g, 'yy.$&'

  # Returns a function which adds location data to the first parameter passed
  # in, and returns the parameter.  If the parameter is not a node, it will
  # just be passed through unaffected.
  addLocationDataFn = (first, last) ->
    if not last
      "yy.addLocationDataFn(@#{first})"
    else
      "yy.addLocationDataFn(@#{first}, @#{last})"

  action = action.replace /LOC\(([0-9]*)\)/g, addLocationDataFn('$1')
  action = action.replace /LOC\(([0-9]*),\s*([0-9]*)\)/g, addLocationDataFn('$1', '$2')

  [patternString, "$$ = #{addLocationDataFn(1, patternCount)}(#{action});", options]

grammar = 
  Root: [
    o '',                         -> new Block
    o 'Body'
  ]

  Body: [
    o 'Line',                                 -> Block.wrap [$1]
    o 'Body TERMINATOR Line',                 -> $1.push $3
    o 'Body TERMINATOR'
  ]

  Line: [
    o 'Expression'
  ]

  Expression: [
    o 'Value'
    o 'Assign'
  ]

  Block: [
    o 'INDENT OUTDENT',                         -> new Block
    o 'INDENT Body OUTDENT',                    -> $2
  ]

  Identifier: [
    o 'IDENTIFIER',                             -> new IdentifierLiteral $1
  ]

  Literal: [
    o 'AlphaNumeric'
  ]

  AlphaNumeric: [
    o 'NUMBER',                                 -> new NumberLiteral $1
  ]

  Assign: [
    o 'Assignable = Expression',                -> new Assign $1, $3
    o 'Assignable = TERMINATOR Expression',     -> new Assign $1, $4
    o 'Assignable = INDENT Expression OUTDENT', -> new Assign $1, $4
  ]

  # Variables and properties that can be assigned to.
  SimpleAssignable: [
    o 'Identifier',                             -> new Value $1
  ]


  Assignable: [
    o 'SimpleAssignable'
    o 'Literal',                                -> new Value $1
  ]

  Value: [
    o 'Assignable'
  ]


operators = [
  ['left',  '.', '?.',  '::', '?::']
]

tokens = []
for name, alternatives of grammar
  grammar[name] = for alt in alternatives
    for token in alt[0].split ' '
      tokens.push token unless grammar[token]
    alt[1] = "return #{alt[1]}" if name is 'Root'
    alt

exports.parser = new Parser
  tokens      : tokens.join ' '
  bnf         : grammar
  operators   : operators.reverse()
  startSymbol : 'Root'