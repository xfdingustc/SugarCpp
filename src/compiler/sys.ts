namespace sc {
  export interface System {
    args: string[];
  }

  export let sys: System = (function(){
    let sys: System;
    return sys;
  })();
}