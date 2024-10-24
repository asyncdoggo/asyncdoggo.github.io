import * as React from "jsx-dom";
import { waitForElement } from "../globals";
import { asyncRun } from "../blogs/python/workerApi";

export default function PythonREPL() {
    waitForElement('#terminal', () => {
        jQuery(function ($: any) {
            $('#terminal').terminal(async function (command: string, term: any) {
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

        })
    })


    return (
        <div className="w-full h-full">
            <div id="terminal"></div>
        </div>
    )
}