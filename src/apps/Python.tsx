import * as React from "jsx-dom";
import { waitForElement } from "../globals";
import { asyncRun } from "../blogs/python/workerApi";

export default function PythonREPL() {

    let resize_observer: ResizeObserver;

    waitForElement('#terminal_python', () => {
        jQuery(function ($: any) {
            const terminal = $('#terminal_python').terminal(async function (command: string, term: any) {
                term.pause();
                try {
                    const { result, error } = await asyncRun(command, {}, true);
                    if (result) {
                        term.echo(result);
                    }
                    if (error) {
                        term.error(error);
                    }
                } catch (e) {
                    term.error(e);
                } finally {
                    term.resume();
                }
            }, {
                greetings: `Python 3.12.1 Pyodide\nType "help", "copyright", "credits" or "license" for more information.`,
                name: 'python_repl',
                prompt: '>>> ',
                height: 400,
                width: '100%',
                enabled: false,
            });


            resize_observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    terminal.resize(entry.contentRect.width, entry.contentRect.height-50);
                }
            });

            resize_observer.observe(document.getElementById('Python')!);
            document.getElementById('Python')!.style.overflow = "hidden";

        })
    })


    return (
        <div className="w-full h-full" id="Python_inner">
            <div id="terminal_python"></div>
        </div>
    )
}