namespace sc {
  export interface System {
    args: string[];
    write(s: string): void;
  }

  declare var process: any;


  export let sys: System = (function(){
    const sys: System = {
      args: process.argv.slice(2),
      write(s: string): void {
        process.stdout.write(s);
      }
    }

    return sys;
  })();
}