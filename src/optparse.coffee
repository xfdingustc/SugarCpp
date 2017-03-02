{repeat} = require './helpers'

exports.OptionParser = class OptionParser
  
    constructor: (rules, @banner) ->
        @rules = buildRules rules


    parse: (args) ->
        options = arguments: []
        skippingArgument = no
        originalArgs = args

buildRules = (rules) ->
    for tuple in rules
        tuple.unshift null if tuple.length < 3
        buildRule tuple...  
        
# Regex matchers for option flags.
LONG_FLAG  = /^(--\w[\w\-]*)/
SHORT_FLAG = /^(-\w)$/
MULTI_FLAG = /^-(\w{2,})/
OPTIONAL   = /\[(\w+(\*?))\]/        

buildRule = (shortFlag, longFlag, description, options = {}) ->
    match     = longFlag.match(OPTIONAL)
    longFlag  = longFlag.match(LONG_FLAG)[1]
    {
      name:         longFlag.substr 2
      shortFlag:    shortFlag
      longFlag:     longFlag
      description:  description
      hasArguments: !!(match and match[1])
      isList:       !!(match and match[2])
    }
    