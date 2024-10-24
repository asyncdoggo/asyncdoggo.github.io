function getPromiseAndResolve() {
  let resolve;
  let promise = new Promise((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

// Each message needs a unique id to identify the response. In a real example,
// we might use a real uuid package
let lastId = 1;
function getId() {
  return lastId++;
}

// Add an id to msg, send it to worker, then wait for a response with the same id.
// When we get such a response, use it to resolve the promise.
function requestResponse(worker: Worker, msg: { context: any; python: any; inline: boolean }) {
  const { promise, resolve}: any = getPromiseAndResolve();
  let id = getId();
  worker.addEventListener("message", function listener(event) {
    if (event.data?.id !== id) {
      return;
    }
    // This listener is done so remove it.
    worker.removeEventListener("message", listener);
    // Filter the id out of the result
    const { new_id, ...rest } = event.data;
    id = new_id;
    resolve(rest);
  });
  worker.postMessage({ id, ...msg });
  return promise;
}

const pyodideWorker = new Worker("/static/webworker.mjs", { type: "module" });

export function asyncRun(script: any, context: {}, inline: boolean) {
  return requestResponse(pyodideWorker, {
    context,
    python: script,
    inline: inline,
  });
}