import * as React from 'jsx-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { waitForElementFromRef } from '../../globals';
import { asyncRun } from '../../utils/workerApi';
import run_btn from '../../assets/runbtn.svg';


export default function Editor() {
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;
    const setEditor = (value: monaco.editor.IStandaloneCodeEditor) => {
        editor = value;
    }
    const monacoEl = React.useRef<HTMLDivElement>(null);
    const mainContainer = React.useRef<HTMLDivElement>(null);
    const outputRef = React.useRef<HTMLDivElement>(null);

    let height = window.innerHeight / 4;
    const setHeight = (value: number) => {
        height = value;
    }

    let loading = false;


    waitForElementFromRef(monacoEl, () => {
        if (monacoEl && !editor) {
            setEditor(monaco.editor.create(monacoEl.current!, {
                value: localStorage.getItem('code') || `print('Hello World')`,
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: false,
                "semanticHighlighting.enabled": true,
                minimap: {
                    enabled: false
                }
            }));

            // return () => editor?.dispose();
            const obs = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const { height } = entry.contentRect;
                    if (height < 100) {
                        return;
                    }
                }


                monacoEl.current!.style.height = `${height}px`;
                editor?.layout({
                    width: window.innerWidth,
                    height: height
                });
            });
            obs.observe(document.getElementById('Editor')!);
        }
    })


    const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = height;
        const onMouseMove = (e: MouseEvent) => {
            monacoEl.current!.style.height = `${startHeight + e.clientY - startY}px`;
            editor?.layout({
                width: window.innerWidth,
                height: startHeight + e.clientY - startY
            });
            setHeight(startHeight + e.clientY - startY);
        }
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }


    window.addEventListener('keydown', (e) => {
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            const value = editor?.getValue();
            localStorage.setItem('code', value!);
            showSavedPopup();
        }
    })

    const showSavedPopup = () => {
        const popup = <div className="popup absolute bg-green-500 text-white p-2 rounded-md top-14 right-10">
            Saved
        </div>;
        monacoEl.current!.appendChild(popup);
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }


    const runScript = async () => {
        if (loading) {
            return;
        }
        loading = true;
        const runButton = document.getElementById('run-button-text')!;
        runButton.classList.remove('hidden');
        const value = editor?.getValue();
        const outputBlock = outputRef.current!;
        outputBlock.innerHTML = "";
        const { result, error } = await asyncRun(value, {}, false);
        outputBlock.innerText = result || error;
        loading = false;
        runButton.classList.add('hidden');
    }


    return (
        <>
            <div className="flex flex-col h-full" ref={mainContainer}>
                <div ref={monacoEl} className="flex-grow">

                </div>
                <div className="splitter border hover:cursor-ns-resize min-h-2 bg-blue-900"
                    onMouseDown={onMouseDown}
                ></div>
                <div className="run-button flex flex-row gap-x-4 select-none w-12 m-2 cursor-pointer bg-green-500 text-white text-center p-2"
                    onClick={runScript}
                >
                    <img src={run_btn} alt="Run" className="w-8 h-8" />
                    <p class="items-center px-4 py-2 font-semibold leading-6 text-sm rounded-md transition ease-in-out duration-150 select-none hidden"
                        id='run-button-text'
                    >
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </p>
                </div>

                <div className="output flex-grow">
                    <div className="output-header">Output</div>
                    <div className="output-content whitespace-pre-wrap h-64 overflow-scroll" ref={outputRef}></div>
                </div>
            </div>
        </>
    )
};