import * as cp from "child_process";
import * as path from "path";
import * as fs from "fs";
import originalGulp = require("gulp");
import helpMaker = require("gulp-help");
import newer = require("gulp-newer");
import tsc = require("gulp-typescript");
import del = require("del");
import minimist = require("minimist");
import * as os from "os";
import * as sourcemaps from "gulp-sourcemaps"

const cmdLineOptions = minimist(process.argv.slice(2), {
    boolean: ["debug", "inspect", "light", "colors", "lint", "soft"],
    string: ["browser", "tests", "host", "reporter", "stackTraceLimit"],
    alias: {
        d: "debug",
        t: "tests",
        test: "tests",
        r: "reporter",
        color: "colors",
        f: "files",
        file: "files",
        w: "workers",
    },
    default: {
        soft: false,
        colors: process.env.colors || process.env.color || true,
        debug: process.env.debug || process.env.d,
        inspect: process.env.inspect,
        host: process.env.TYPESCRIPT_HOST || process.env.host || "node",
        browser: process.env.browser || process.env.b || "IE",
        tests: process.env.test || process.env.tests || process.env.t,
        light: process.env.light || false,
        reporter: process.env.reporter || process.env.r,
        lint: process.env.lint || true,
        files: process.env.f || process.env.file || process.env.files || "",
        workers: process.env.workerCount || os.cpus().length,
    }
});

function exec(cmd: string, args: string[], complete: () => void = (() => { }), error: (e: any, status: number) => void = (() => { })) {
    console.log(`${cmd} ${args.join(" ")}`);
    // TODO (weswig): Update child_process types to add windowsVerbatimArguments to the type definition
    const subshellFlag = isWin ? "/c" : "-c";
    const command = isWin ? [possiblyQuote(cmd), ...args] : [`${cmd} ${args.join(" ")}`];
    const ex = cp.spawn(isWin ? "cmd" : "/bin/sh", [subshellFlag, ...command], { stdio: "inherit", windowsVerbatimArguments: true } as any);
    ex.on("exit", (code) => code === 0 ? complete() : error(/*e*/ undefined, code));
    ex.on("error", error);
}

function possiblyQuote(cmd: string) {
    return cmd.indexOf(" ") >= 0 ? `"${cmd}"` : cmd;
}

let host = cmdLineOptions["host"];

const isWin = /^win/.test(process.platform);

// Constants
const compilerDirectory = "src2/compiler/";
const scriptsDirectory = "scripts/";
const builtDirectory = "built/";
const builtLocalDirectory = "built/local/";
const compilerFilename = "scc.js";

const gulp = helpMaker(originalGulp);



const builtLocalCompiler = path.join(builtLocalDirectory, compilerFilename);
const serviceFile = path.join(builtLocalDirectory, "sugarCppServices.js")

const tsconfigBase = JSON.parse(fs.readFileSync("src/tsconfig-base.json", "utf-8")).compilerOptions;

function needsUpdate(source: string | string[], dest: string | string[]): boolean {
    if (typeof source === "string" && typeof dest === "string") {
        if (fs.existsSync(dest)) {
            const {mtime: outTime} = fs.statSync(dest);
            const {mtime: inTime} = fs.statSync(source);
            if (+inTime <= +outTime) {
                return false;
            }
        }
    }
    else if (typeof source === "string" && typeof dest !== "string") {
        const {mtime: inTime} = fs.statSync(source);
        for (const filepath of dest) {
            if (fs.existsSync(filepath)) {
                const {mtime: outTime} = fs.statSync(filepath);
                if (+inTime > +outTime) {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        return false;
    }
    else if (typeof source !== "string" && typeof dest === "string") {
        if (fs.existsSync(dest)) {
            const {mtime: outTime} = fs.statSync(dest);
            for (const filepath of source) {
                if (fs.existsSync(filepath)) {
                    const {mtime: inTime} = fs.statSync(filepath);
                    if (+inTime > +outTime) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        }
    }
    else if (typeof source !== "string" && typeof dest !== "string") {
        for (let i = 0; i < source.length; i++) {
            if (!dest[i]) {
                continue;
            }
            if (fs.existsSync(dest[i])) {
                const {mtime: outTime} = fs.statSync(dest[i]);
                const {mtime: inTime} = fs.statSync(source[i]);
                if (+inTime > +outTime) {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        return false;
    }
    return true;
}


function getCompilerSettings(base: tsc.Settings, useBulitcompiler?: boolean): tsc.Settings {
    const copy: tsc.Settings = {};

    for (const key in tsconfigBase) {
        copy[key] = tsconfigBase[key];
    }
    for (const key in base) {
        copy[key] = base[key];
    }

    return copy;
}

// Generate diagnostics
const processDiagnosticMessagesJs = path.join(scriptsDirectory, "processDiagnosticMessages.js");
const processDiagnosticMessagesTs = path.join(scriptsDirectory, "processDiagnosticMessages.ts");
const diagnosticMessagesJson = path.join(compilerDirectory, "diagnosticMessages.json");
const diagnosticInfoMapTs = path.join(compilerDirectory, "diagnosticInformationMap.generated.ts");
const generatedDiagnosticMessagesJSON = path.join(compilerDirectory, "diagnosticMessages.generated.json");
const builtGeneratedDiagnosticMessagesJSON = path.join(builtLocalDirectory, "diagnosticMessages.generated.json");

// processDiagnosticMessages script
gulp.task(processDiagnosticMessagesJs, false, [], () => {
    const settings: tsc.Settings = getCompilerSettings({
        target: "es5",
        declaration: false,
        removeComments: true,
        noResolve: false,
        stripInternal: false,
        outFile: processDiagnosticMessagesJs
    }, /*useBuiltCompiler*/ false);
    return gulp.src(processDiagnosticMessagesTs)
        .pipe(newer(processDiagnosticMessagesJs))
        .pipe(sourcemaps.init())
        .pipe(tsc(settings))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("."));
});

// The generated diagnostics map; built for the compiler and for the "generate-diagnostics" task
gulp.task(diagnosticInfoMapTs, [processDiagnosticMessagesJs], (done) => {
    if (needsUpdate(diagnosticMessagesJson, [generatedDiagnosticMessagesJSON, diagnosticInfoMapTs])) {
        exec(host, [processDiagnosticMessagesJs, diagnosticMessagesJson], done, done);
    }
    else {
        done();
    }
});


// gulp.task("generate-diagnostics", "Generates a diagnostic file in TypeScript based on an input JSON file", [diagnosticInfoMapTs]);
gulp.task("generate-diagnostics", "Generates a diagnostic file in TypeScript based on an input JSON file", []);

gulp.task(builtLocalCompiler, false, [serviceFile], () => {
    const localCompilerProject = tsc.createProject("src2/compiler/tsconfig.json", getCompilerSettings({}, false));
    return localCompilerProject.src()
        .pipe(newer(builtLocalCompiler))
        .pipe(sourcemaps.init())
        .pipe(localCompilerProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(builtLocalDirectory));
});

gulp.task(serviceFile, false, ["generate-diagnostics"], () => {

});

gulp.task("local", "Builds the full compiler", [builtLocalCompiler])
gulp.task("clean", "Cleans the compiler output, declare files, and tests", [], ()=>{
    return del([builtDirectory]);
})

gulp.task("rebuild", "Rebuild the compiler", ["clean", "local"], () => {

});