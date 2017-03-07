LineMap
-------

A **LineMap** object keeps track of information about original line and column
positions for a single line of output JavaScript code.
**SourceMaps** are implemented in terms of **LineMaps**.

    class LineMap
      constructor: (@line) ->
        @columns = []

      add: (column, [sourceLine, sourceColumn], options={}) ->
        return if @columns[column] and options.noReplace
        @columns[column] = {line: @line, column, sourceLine, sourceColumn}

      sourceLocation: (column) ->
        column-- until (mapping = @columns[column]) or (column <= 0)
        mapping and [mapping.sourceLine, mapping.sourceColumn]
SourceMap
---------

Maps locations in a single generated JavaScript file back to locations in
the original CoffeeScript source file.

This is intentionally agnostic towards how a source map might be represented on
disk. Once the compiler is ready to produce a "v3"-style source map, we can walk
through the arrays of line and column buffer to produce it.

    class SourceMap
      constructor: ->
        @lines = []

Adds a mapping to this SourceMap. `sourceLocation` and `generatedLocation`
are both `[line, column]` arrays. If `options.noReplace` is true, then if there
is already a mapping for the specified `line` and `column`, this will have no
effect.

      add: (sourceLocation, generatedLocation, options = {}) ->
        [line, column] = generatedLocation
        lineMap = (@lines[line] or= new LineMap(line))
        lineMap.add column, sourceLocation, options

Look up the original position of a given `line` and `column` in the generated
code.

      sourceLocation: ([line, column]) ->
        line-- until (lineMap = @lines[line]) or (line <= 0)
        lineMap and lineMap.sourceLocation column