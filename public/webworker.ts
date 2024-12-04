import {pyodideExpose, PyodideExtras} from "pyodide-worker-runner";
import * as Comlink from "comlink";
import {loadPyodide} from "pyodide";

let pyodideReadyPromise = loadPyodide();


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
    if (extras.interruptBuffer) {  // i.e. if SharedArrayBuffer is available so this could be sent by the client
      pyodide.setInterruptBuffer(extras.interruptBuffer);
    }

    pyodide.setStdout({ batched: (msg: any) => { result += `${msg}\n` } });
    pyodide.setStdin({
      stdin: () => {
       const read = extras.readMessage();
        return read;
      },
    })
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
