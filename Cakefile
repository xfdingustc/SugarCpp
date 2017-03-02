fs                        = require 'fs'
path                      = require 'path'
{ spawn, exec, execSync } = require 'child_process'



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
  proc =            spawn 'node', ['bin/coffee'].concat(args)
  proc.stderr.on    'data', (buffer) -> console.log buffer.toString()
  proc.on           'exit', (status) ->
    process.exit(1) if status isnt 0
    cb() if typeof cb is 'function'   

task 'build', 'build the SugarCpp language from source', build
