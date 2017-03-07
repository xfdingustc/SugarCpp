fs = require 'fs'

printLine = (line) -> process.stdout.write line + '\n'

exports.register = ->
    require './register'

exports.run = ->
    printLine 'Fuck!!'
    command = "dummy"