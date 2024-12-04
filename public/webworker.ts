import {pyodideExpose, PyodideExtras} from "pyodide-worker-runner";
import * as Comlink from "comlink";
import { initPyodide, defaultPyodideLoader } from "pyodide-worker-runner";

let pyodideReadyPromise = defaultPyodideLoader();
let initialized = false;

Comlink.expose({
  runPython: pyodideExpose((extras, code) => {
    return execute(extras, code);
  }),
  runInlinePython: pyodideExpose((extras, code) => {
    (extras as any).inline = true;
    return execute(extras, code);
  })
});


const execute = async (extras: PyodideExtras, code: any) => {
  let result = ''

  const pyodide = await pyodideReadyPromise;
  if (!initialized) {
    initPyodide(pyodide);
    initialized = true;
  }
    if (extras.interruptBuffer) {  // i.e. if SharedArrayBuffer is available so this could be sent by the client
      pyodide.setInterruptBuffer(extras.interruptBuffer);
    }
    await pyodide.loadPackagesFromImports(code);
    pyodide.setStdout({ batched: (msg: any) => { result += `${msg}\n` } });
    pyodide.setStdin({
      stdin: () => {
       const read = extras.readMessage();
        return read;
      },
    })


    try{
      const output = pyodide.runPython(code);   
      if ((extras as any).inline && output){
        result += output.toString();
      }
  
      let x: any = {};
      const pyVariables = pyodide.globals.toJs();
      for (let key in pyVariables) {
        if(pyVariables[key] !== undefined) {
          if (typeof pyVariables[key] === "number" || typeof pyVariables[key] === "string" || typeof pyVariables[key] === "boolean") {
            x[key] = pyVariables[key];
          }
          else{
            x[key] = pyVariables[key].toString();
          }        
        }
      }
  
  
      return {result, variables: x}; 
    }
    catch(e){
      result += e.toString();
      return {result, variables: {}};
    }
        
    
  }
