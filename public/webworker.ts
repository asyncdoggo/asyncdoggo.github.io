import { pyodideExpose, PyodideExtras } from "pyodide-worker-runner";
import * as Comlink from "comlink";
import { initPyodide, defaultPyodideLoader } from "pyodide-worker-runner";

let pyodideReadyPromise = defaultPyodideLoader();
let initialized = false;

const initialize = async (pyodide: any) => {
  if (!initialized) {
    initPyodide(pyodide);
    initialized = true;

    const FS = pyodide.FS;
    FS.mkdir("/code");
    FS.mount(FS.filesystems.IDBFS, {
      root: ".",
      autoPersist: true,
    }, "/code");
  }
}


initialize(await pyodideReadyPromise).then(() => {
  Comlink.expose({
    runPython: pyodideExpose((extras, code, inline) => {
      return execute(extras, code, inline);
    }),
    FS: pyodideExpose(
      async (
        extras,
        option: {
                action: string,
                args: any
                }
      ) => {
        const pyodide = await pyodideReadyPromise;
        const FS = pyodide.FS;

        switch (option.action) {
          case "write":
            FS.writeFile(option.args.path, option.args.data);
            break;
          case "read":
            return FS.readFile(option.args.path, { encoding: "utf8" });
          case "list":
            return FS.readdir(option.args.path);
          case "remove":
            FS.unlink(option.args.path);
            break;
          case "mkdir":
            FS.mkdir(option.args.path);
            break;
          case "rmdir":
            FS.rmdir(option.args.path);
            break;
          case "exists":
            return FS.analyzePath(option.args.path).exists;
          case "stat":
            return FS.stat(option.args.path);
          case 'sync':
            await FS.syncfs(false, (err: any) => {
              if (err) {
                console.error(err);
              }
            });
            return "synced";
          default:
            break;
        }
      } 
    ),
  });  
});



const execute = async (extras: PyodideExtras, code: string, inline: boolean) => {
  let result = ''
  const pyodide = await pyodideReadyPromise;
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
  try {
    const output = pyodide.runPython(code);
    if (inline && output) {
      result += output.toString();
    }

    let x: any = {};
    const pyVariables = pyodide.globals.toJs();
    for (let key in pyVariables) {
      if (pyVariables[key] !== undefined) {
        if (typeof pyVariables[key] === "number" || typeof pyVariables[key] === "string" || typeof pyVariables[key] === "boolean") {
          x[key] = pyVariables[key];
        }
        else {
          x[key] = pyVariables[key].toString();
        }
      }
    }
    return { result, variables: x };
  }
  catch (e) {
    result += e.toString();
    return { result, variables: {} };
  }


}
