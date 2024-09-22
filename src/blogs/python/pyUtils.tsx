import React, { useRef } from "jsx-dom";
import { crosshairCursor, drawSelection, EditorView, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { indentOnInput, indentUnit } from "@codemirror/language";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { waitForElementFromRef } from "../../globals";

declare const loadPyodide: any;

export let pyodide: any;

export function getPyodide() {
    loadPyodide().then((py: any) => {
        pyodide = py
    });
}

getPyodide();

export function InlineCode({code}:any) {
    return (
        <code className="text-red-400 bg-gray-300 px-1">
            {code}
        </code>
    );
}



export function CodeBlock({code}: { code: string }) {
    // Show line numbers too
    return (
            <code className="w-full my-4 py-4 px-2 text-lg font-sans border bg-gray-100 border-gray-500">
                <pre>
                    {code}
                </pre>
            </code>
    );
}


export function CodeExecutionBlock({ expectedOutput }: { expectedOutput: any }) {

    let view: EditorView;

    let pyodideStdout: string = "";

    const editorRef = useRef<HTMLDivElement>(null);

    waitForElementFromRef(editorRef, () => {

        const state = EditorState.create({
            doc: ``,
            extensions: [
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightSpecialChars(),
                history(),
                drawSelection(),
                indentUnit.of("    "),
                EditorState.allowMultipleSelections.of(true),
                indentOnInput(),
                autocompletion(),
                rectangularSelection(),
                crosshairCursor(),
                keymap.of([
                    indentWithTab,
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...completionKeymap
                ]),
                python(),
            ]
        })

        view = new EditorView(
            {
                state,
                parent: editorRef.current!
            }
        )

    })
    let pyVariables: any = {};

    const runCode = () => {
        if (pyodide === null) return
        try {
            const codeToRun = view.state.doc.toString();
            pyodideStdout = "";
            pyodide.setStdout({ batched: (msg: any) => { pyodideStdout += `${msg}\n` } });
            pyodide.runPython(codeToRun);
            outputBlock.current!.innerHTML = pyodideStdout;
            pyVariables = pyodide.globals.toJs();           
        }
        catch (e:any) {
            outputBlock.current!.innerHTML = e;
            pyodideStdout = "";
        }
        finally {
            updateMessage();
        }
    }

    function updateMessage() {
        const message = messageBlock.current;
        if (message === null) return;    

        const successCondition = expectedOutput.stdout === pyodideStdout;

        const variablesMatch = Object.keys(expectedOutput.variables).every((key) => {
            return expectedOutput.variables[key] === pyVariables[key];
        });
        
        message.classList.remove("text-green-500", "text-red-500");
        if (successCondition && variablesMatch) {
            message!.innerHTML = "✔️ Great job!";
            message!.classList.add("text-green-500");
        } else {
            message!.innerHTML = "❌ Try again! The output is not as expected.";
            message!.classList.add("text-red-500");
        }

    }


    const outputBlock = useRef<HTMLDivElement>(null);

    const messageBlock = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full pt-4 flex flex-col">
            <div
                // id="editor"
                ref={editorRef}
                className="w-full h-32 border border-gray-500 text-lg"
            >
            </div>

            <button
                onClick={runCode}
                className="bg-green-500 w-16 text-white p-2 mt-2 hover:bg-green-600">
                Run
            </button>
            <div className="w-full flex flex-col pt-4">
                <p>Output:</p>
                <div
                    ref={outputBlock}
                    className="w-full h-32 border p-2 border-gray-500 text-lg mt-2 overflow-scroll whitespace-pre-wrap"
                >
                </div>
            </div>

            {/* If expected output matches actual output then show a green tick with a message */}
            <p className="w-full"
                ref={messageBlock}
            >
            </p>
        </div>
    );
}