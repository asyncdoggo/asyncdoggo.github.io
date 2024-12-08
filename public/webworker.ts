import { pyodideExpose, PyodideExtras } from "pyodide-worker-runner";
import * as Comlink from "comlink";
import { initPyodide, defaultPyodideLoader } from "pyodide-worker-runner";

let pyodideReadyPromise = defaultPyodideLoader();
let initialized = false;
let synced = false;
const initialize = async (pyodide: any) => {
  if (!initialized) {
    initPyodide(pyodide);
    initialized = true;

    const FS = pyodide.FS;
    FS.mount(FS.filesystems.IDBFS, {
      root: ".",
    }, "/home/pyodide");
    await FS.syncfs(true, (err: any) => {
      if (err) {
        console.error(err);
      } else {
        synced = true;
      }
    });
  }
  return pyodide;
}


const constructJSONForanalyzePath = (obj: any, data: boolean=false) => {
  const tree: any = {};
  let path = obj.path;

  const children: any = []
  for (let key in obj.object.contents) {
    children.push(obj.object.contents[key]);
  }

  return recursiveBuild(children, tree, path, data);
}

const recursiveBuild = (children: any, tree: any, path: string, data: boolean) => {
  for (let i in children) {
    const child = children[i];
    if (child.isFolder) {
      tree[child.name] = {};
      const subTree = recursiveBuild(child.contents, tree[child.name], path + "/" + child.name, data);
      tree[child.name] = {
        name: child.name,
        path: path + "/" + child.name,
        dir: true,
        contents: subTree,
        mode: child.mode,
        readmode: child.readMode,
        usedBytes: child.usedBytes,
      };
    }
    else {
      tree[child.name] = {
        name: child.name,
        path: path + "/" + child.name,
        dir: false,
        contents: data ? child.contents : {},
        mode: child.mode,
        readmode: child.readMode,
        usedBytes: child.usedBytes,

      };
    }
  }
  return tree;
}



Comlink.expose({
  runPython: pyodideExpose(async (extras, code, inline) => {
    const pyodide = await pyodideReadyPromise;
    if (!initialized) {
      await initialize(pyodide);
    }
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
      if (!initialized) {
        await initialize(pyodide);
      }
      const FS = pyodide.FS;
      while (!synced) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      switch (option.action) {
        case "write":
          FS.writeFile(option.args.path, option.args.data, {flags: "w"});
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
        case "rename":
          FS.rename(option.args.oldPath, option.args.newPath);
          break;
        case "tree":
          const data = FS.analyzePath(option.args.path);
          const json = constructJSONForanalyzePath(data);
          return {
            name: 'root',
            contents: json,
            dir: true,
            mode: 0,
            path: '/home/pyodide',
            readmode: 0,
            usedBytes: 0
          }
        case "stat":
          return FS.stat(option.args.path);
        case 'sync':
          FS.syncfs(false, (err: any) => {
            if (err) {
              console.error(err);
            }
          });
          return "syncing";
        case 'download':
          const data_down = FS.analyzePath(option.args.path);
          const json_down = constructJSONForanalyzePath(data_down, true);
          return {
            name: 'root',
            contents: json_down,
            dir: true,
            mode: 0,
            path: '/home/pyodide',
            readmode: 0,
            usedBytes: 0
          }
        default:
          break;
      }
    }
  ),
  waitUntilReady: async () => {
    await pyodideReadyPromise;
    return "ready";
  },
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
