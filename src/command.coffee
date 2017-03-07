# External dependencies.
fs              = require 'fs'
path            = require 'path'
optparse        = require './optparse'
SugarScript     = require "./sugar-script"
{spawn, exec}   = require 'child_process'

BANNER = '''
    Usage: sugar [options] path/to/script.scp -- [args]
'''    

SWITCHES = [
    ['-c', '--compile',     'compile to C++ and save as .cpp files']
    ['-o', '--output [DIR]', 'set the output directly to the "node" binary']
]

printLine = (line) -> process.stdout.write line + '\n'

# Top-level objects shared by all the functions.
opts = {}

exports.run = ->
    printLine 'Fuck!!!'
    parseOptions()
    return compileScript null, opts.arguments[0] if opts.eval


compileScript = (file, input, base = null) ->
    o = opts
    options = compileOptions file, base
    try 
        t = task = {file, input, options}
        SugarScript.emit 'compile', task
        if o.tokens
            printTokens SugarScript.tokens t.input, t.options
        else if o.nodes
            printLine SugarScript.nodes(t.input, t.options).toString().trim()
        else if o.run
            SugarScript.register()
        else if o.join and t.file isnot o.join
            compileJoin()
        else 
            compiled = SugarScript.compile t.input, t.options
            t.output = compiled
            if o.map
                t.output = compiled.cpp
                t.sourceMap = compiled.v3SourceMap

            SugarScript.emit 'success', task   
            if o.print
                printLine t.output.trim()
            else if o.compile or o.map
                writeCpp base, t.file, t.output, options.cppPath, t.sourceMap    
    catch err
        SugarScript.emit 'failure', err, task
        return if SugarScript.listeners('failure').length
        message = err?.stack or "#{err}"
        if o.watch
            printLine message + '\x07'
        else 
            printWarn message
            process.exit 1


parseOptions = ->
    optionParser  = new optparse.OptionParser SWITCHES, BANNER
    o = opts      = optionParser.parse process.argv[2..]
    o.compile     or= !!o.output
    o.run         = not (o.compile or o.print or o.map)
    o.print       = !! (o.print or (o.eval or o.stdio and o.compile))


