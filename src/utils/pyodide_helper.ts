
import { PyodideClient } from "pyodide-worker-runner";
import { makeChannel } from "sync-message";

// const myWorker = new MyWorker({name: "python_worker"});
const myWorker = new Worker(new URL("/webworker.ts?worker_file&type=module", import.meta.url), { type: "module" });
const py = new PyodideClient(
    () => myWorker,
    makeChannel(
        { atomics: { bufferSize: 1024 } },
    ),

);

export type Tree = {
    name: string
    path: string,
    dir: boolean,
    contents: { [key: string]: Tree | File | {} };
    [key: string]: any;
    mode: number,
    readmode: number,
    usedBytes: number,
}

export const tree: Promise<Tree> = fetchTree();


setInterval(() => {
    if (py.state === "awaitingMessage") {
        py.writeMessage(prompt());
    }
}, 500);


export async function asyncRun(script: any, inline: boolean) {
    while (py.state !== "idle") {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const res: {result: string, variables: {}} = await py.call(py.workerProxy.runPython, script, inline);
    return res;
}

export async function FS(action: string, args: any) {
    while (py.state !== "idle") {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return await py.call(py.workerProxy.FS, { action, args });
}




async function fetchTree() {
    const tree = await py.call(py.workerProxy.FS, { action: "tree", args: { path: "/home/pyodide" } });    
    return tree;
}