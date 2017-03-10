namespace sc {
  export interface System {
    args: string[];
    write(s: string): void;
  }

  export let sys: System = (function(){
    let sys: System;
    return sys;
  })();
}