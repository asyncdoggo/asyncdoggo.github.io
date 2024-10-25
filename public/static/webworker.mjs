import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/dev/full/pyodide.mjs";

let pyodideReadyPromise = loadPyodide();
let pyodideStdout = "";
let pyVariables = {};

self.onmessage = async (event) => {
  // make sure loading is done
  const pyodide = await pyodideReadyPromise;
  const { id, python, context, inline } = event.data;
  // Now load any packages we need, run the code, and send the result back.
  await pyodide.loadPackagesFromImports(python);

  // configure stdout
  pyodideStdout = "";
  pyodide.setStdout({ batched: (msg) => { pyodideStdout += `${msg}\n` } });
  pyodide.std

  
  try {
    // Execute the python code in this context    
    const result = await pyodide.runPythonAsync(python);    
    pyVariables = pyodide.globals.toJs();
    
    let x = {};
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
    if (inline && result){
      pyodideStdout += result.toString();
    }
        
    self.postMessage({ result: pyodideStdout, error:null , id, pyVariables:x });
  } catch (error) {
    self.postMessage({ result:null, error: error.message, id, pyVariables:null });
  }
};