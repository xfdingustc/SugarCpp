fs                        = require 'fs'
path                      = require 'path'
{ spawn, exec, execSync } = require 'child_process'
SugarScript               = require './lib/sugar-script/sugar-script'
helpers                   = require './lib/sugar-script/helpers'


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

# Log a message with a color.
log = (message, color, explanation) ->
  console.log color + message + reset + ' ' + (explanation or '')

# Run the SugarCpp test suite
runTests = (SugarScript) ->
  SugarScript.register()    
  startTime = Date.now()
  currentFile = null
  passedTests = 0
  failures = []

  global[name] = func for name, func of require 'assert'

  # convenience aliases.
  global.SugarScript = SugarScript


  # Our test helper function for delimilting different test cases
  global.test = (description, fn) ->
    try 
      fn.test = {description, currentFile}
      fn.call(fn)
      ++passedTests
    catch env
      failures.push
        filename: currentFile
        error: e
        description: description if description?
        source: fn.toString() if fn.toString?

  # When all the tests have run, collect and print errors.
  # If a stacktrace is available, output the compiled function source.
  process.on 'exit', ->
    time = ((Date.now() - startTime) / 1000).toFixed(2)
    message = "passed #{passedTests} tests in #{time} seconds#{reset}"
    return log(message, green) unless failures.length
    log "failed #{failures.length} and #{message}", red
    for fail in failures
      {error, filename, description, source}  = fail
      console.log ''
      log "  #{description}", red if description
      log "  #{error.stack}", red
      console.log "  #{source}" if source
    return      

  # Run every test in the 'test' folder, recording failures
  files = fs.readdirSync 'test'

  for file in files when helpers.isSugar file
    currentFile = filename = path.join 'test', file
    code = fs.readFileSync filename
    try 
      SugarScript.run code.toString(), {filename}
    catch error
      failures.push {filename, error}
  return !failures.length    

    

task 'build', 'build the SugarCpp language from source', build

task 'test', 'run the SugarCpp language test suite', ->
  runTests SugarScript
