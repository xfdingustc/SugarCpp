fs                        = require 'fs'
path                      = require 'path'
{ spawn, exec, execSync } = require 'child_process'
{EventEmitter} = require 'events'

printLine = (line) -> process.stdout.write line + '\n'

# ANSI Terminal Colors.
bold = red = green = reset = ''
unless process.env.NODE_DISABLE_COLORS
  bold  = '\x1B[0;1m'
  red   = '\x1B[0;31m'
  green = '\x1B[0;32m'
  reset = '\x1B[0m'

# build file header
header = """
  /**
   * Sugar Compiler 
   */
"""

# Build the SugarCpp language from source
build = (cb) ->
  files = fs.readdirSync 'src'
  files = ('src/' + file for file in files when file.match(/\.(lit)?coffee$/))
  run ['-c', '-o', 'lib/sugar-script'].concat(files), cb


# Run a CoffeeScript through our node/coffee interpreter.
run = (args, cb) ->
  command = ['coffee'].concat(args).join(" ")  
  printLine command
  proc =            exec command
  proc.stderr.on    'data', (buffer) -> console.log buffer.toString()
  proc.on           'exit', (status) ->
    process.exit(1) if status isnt 0
    cb() if typeof cb is 'function'   

task 'build', 'build the SugarCpp language from source', build
