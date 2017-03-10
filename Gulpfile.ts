import * as path from "path";
import * as fs from "fs";
import originalGulp = require("gulp");
import helpMaker = require("gulp-help");
import newer = require("gulp-newer");
import tsc = require("gulp-typescript");
import del = require("del");
import * as sourcemaps from "gulp-sourcemaps"

// Constants
const compilerDirectory = "src/compiler/";
const builtDirectory = "built/";
const builtLocalDirectory = "built/local/";
const compilerFilename = "scc.js";

const gulp = helpMaker(originalGulp);



const builtLocalCompiler = path.join(builtLocalDirectory, compilerFilename);
const serviceFile = path.join(builtLocalDirectory, "sugarCppServices.js")

const tsconfigBase = JSON.parse(fs.readFileSync("src/tsconfig-base.json", "utf-8")).compilerOptions;

function getCompilerSettings(base: tsc.Settings, useBulitcompiler?: boolean): tsc.Settings {
  const copy: tsc.Settings = {};

  for (const key in tsconfigBase) {
    copy[key] = tsconfigBase[key];
  }
  for (const key in base) {
    copy[key] = base[key];
  }

  if (useBulitcompiler === true) {
   // copy.typescript = require("./built/local/typescript.js");
  }
  else if (useBulitcompiler === false) {
   // copy.typescript = require("./lib/typescript.js");
  }
  return copy;
}

gulp.task(builtLocalCompiler, false, [serviceFile], () => {
  const localCompilerProject = tsc.createProject("src/compiler/tsconfig.json", getCompilerSettings({}, false));
  return localCompilerProject.src()
    .pipe(newer(builtLocalCompiler))
    .pipe(localCompilerProject())
    .pipe(gulp.dest(builtLocalDirectory));
});

gulp.task(serviceFile, false, [], () => {

});

gulp.task("local", "Builds the full compiler", [builtLocalCompiler])
gulp.task("clean", "Cleans the compiler output, declare files, and tests", [], ()=>{
  return del([builtDirectory]);
})