
import {PyodideClient} from "pyodide-worker-runner";
import { makeChannel } from "sync-message";

// const myWorker = new MyWorker({name: "python_worker"});
const myWorker = new Worker(new URL("/webworker.ts?worker_file&type=module", import.meta.url), {type: "module"});
const py = new PyodideClient(
    () => myWorker,
    makeChannel(
        {atomics: {bufferSize: 1024}},
    ),
    
);
// const int = setInterval(() => {
//     if (py.state === "awaitingMessage") {
//         py.writeMessage("hello\n");
//         clearInterval(int);
//     }
// }, 1000);

// const x = await py.call(py.workerProxy.runPython, "1+1")
// console.log(x);

// const y = await py.call(py.workerProxy.runInlinePython, "1+1")
// console.log(y);


setInterval(() => {
    if (py.state === "awaitingMessage") {
        py.writeMessage(prompt());
    }
}, 500);


export async function asyncRun(script: any, inline: boolean) {
    const res: {result: string, variables: {}} = await py.call(py.workerProxy.runPython, script, inline);
    return res;
}