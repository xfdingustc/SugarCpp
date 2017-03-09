import * as path from "path";
import originalGulp = require("gulp");
import helpMaker = require("gulp-help");
import newer = require("gulp-newer");
import tsc = require("gulp-typescript");

// Constants
const compilerDirectory = "src/compiler/";
const builtDirectory = "built/";
const builtLocalDirectory = "built/local/";
const compilerFilename = "scc.js";

const gulp = helpMaker(originalGulp);



const builtLocalCompiler = path.join(builtLocalDirectory, compilerFilename);
const serviceFile = path.join(builtLocalDirectory, "sugarCppServices.js")


function getCompilerSettings(base: tsc.Settings, useBulitcompiler?: boolean): tsc.Settings {
  const copy: tsc.Settings = {};

  if (useBulitcompiler === true) {
    copy.typescript = require("./built/local/typescript.js");
  }
  else if (useBulitcompiler === false) {
    copy.typescript = require("./lib/typescript.js");
  }
  return copy;
}

gulp.task(builtLocalCompiler, false, [serviceFile], () => {
  // const localCompilerProject = tsc.createProject("src/compiler/tsconfig.json", getCompilerSettings({}, true));
  // return localCompilerProject.src()
  //   .pipe(newer(builtLocalCompiler))
  //   .pipe(localCompilerProject())
  //   .pipe(gulp.dest("."));
});

gulp.task(serviceFile, false, [], () => {

});

gulp.task("local", "Builds the full compiler", [builtLocalCompiler])