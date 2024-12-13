import * as React from 'jsx-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { waitForElementFromRef } from '../../globals';
import { asyncRun, FS } from '../../utils/pyodide_helper';
import run_btn from '../../assets/runbtn.svg';
import { FileTree } from './FileTree';



export default function Editor() {
    let editor: monaco.editor.IStandaloneCodeEditor | null = null;
    const setEditor = (value: monaco.editor.IStandaloneCodeEditor) => {
        editor = value;
    }
    const monacoEl = React.useRef<HTMLDivElement>(null);
    const mainContainer = React.useRef<HTMLDivElement>(null);
    const outputRef = React.useRef<HTMLDivElement>(null);

    let height = window.innerHeight / 4;

    let loading = false;

    let currentFile = '/home/pyodide/main.py';
    let currentFileData = '';

    const setCurrentFile = (file: string) => {
        currentFile = file;
        document.querySelector('#file-name')!.textContent = file;
        // infer type of file from extension and set language
        let lang = 'python';
        switch (file.split('.').pop()) {
            case 'py':
                lang = 'python';
                break;
            case 'js':
                lang = 'javascript';
                break;
            case 'html':
                lang = 'html';
                break;
            case 'css':
                lang = 'css';
                break;
            case 'json':
                lang = 'json';
                break;
            case 'xml':
                lang = 'xml';
                break;
            case 'yaml':
                lang = 'yaml';
                break;
            case 'md':
                lang = 'markdown';
                break;
            case 'java':
                lang = 'java';
                break;
            case 'c':
                lang = 'c';
                break;
            case 'cpp':
                lang = 'cpp';
                break;
            case 'rs':
                lang = 'rust';
                break;
            case 'sh':
                lang = 'shell';
                break;
            default:
                lang = 'plaintext';
                break;
        }
        editor?.setModel(monaco.editor.createModel(currentFileData, lang));
    }

    const setCurrentFileData = (data: string) => {
        currentFileData = data;
        editor?.setValue(data);
    }

    waitForElementFromRef(monacoEl, () => {
        if (monacoEl && !editor) {
            setEditor(monaco.editor.create(monacoEl.current!, {
                value: currentFileData,
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
                    width: document.getElementById('Editor')!.clientWidth - document.getElementById('file-tree')!.clientWidth,
                    height: height
                });
            });
            obs.observe(document.getElementById('Editor')!);
        }
    })


    const onMouseDownEditor = (e: MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = height;
        const onMouseMove = (e: MouseEvent) => {
            height = startHeight + e.clientY - startY

            if (height < 100) {
                return;
            }

            monacoEl.current!.style.height = `${height}px`;
            editor?.layout({
                width: editor!.getLayoutInfo().width,
                height: height
            });
        }
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    const onMouseDownFileTree = (e: MouseEvent) => {
        e.preventDefault();
        const fileTree = document.getElementById('file-tree')!;
        const startX = e.clientX;
        const startWidth = fileTree.clientWidth;
        const onMouseMove = (e: MouseEvent) => {
            const w = startWidth + e.clientX - startX
            if (w < 100) {
                return;
            }
            if (w > document.getElementById('Editor')!.clientWidth - 100) {
                return;
            }

            fileTree.style.width = `${w}px`;
            monacoEl.current!.style.width = `calc(100% - ${w}px)`;
            document.getElementById('editor-main')!.style.width = `calc(100% - ${w}px)`;
            editor?.layout({
                width: document.getElementById('editor-main')!.clientWidth,
                height: height
            });
        }
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    const saveFile = (path: string) => {
        const value = editor?.getValue();
        currentFileData = value!;
        showSavedPopup();
        FS('write', { path: path, data: value });
        FS('sync', {});
    }


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
        const { result } = await asyncRun(value, false);
        outputBlock.innerText = result;
        loading = false;
        runButton.classList.add('hidden');
    }


    const removeClass = (e: Event) => {
        const contextMenu = document.getElementById('context-menu-for-file-tree')!;
        if (e.target !== contextMenu) {
            contextMenu.style.display = 'none';
        }
    }


    const keyDownListener = (e: KeyboardEvent) => {
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            saveFile(currentFile);
        }
    }


    waitForElementFromRef(mainContainer, () => {
        // listener stuff
        window.addEventListener('keydown', keyDownListener);
        document.addEventListener('click', removeClass);
        (document.getElementById('Editor_inner')! as any).onCleanUp = () => {
            editor?.dispose();
            document.removeEventListener('click', removeClass)
            window.removeEventListener('keydown', keyDownListener)
        }
    })

    return (
        <>
            <div className="flex flex-col h-full" ref={mainContainer}
                id="Editor_inner">
                <div className="flex flex-row px-2 bg-gray-800">
                    <FileTree
                        setCurrentFile={setCurrentFile}
                        setCurrentFileData={setCurrentFileData}
                    />
                    <div className="divider bg-red-900 px-2 h-auto cursor-ew-resize"
                        onMouseDown={onMouseDownFileTree}
                    ></div>
                    <div id='editor-main'>
                        <div className="editor-header bg-gray-900 text-white p-2">
                            <div id="file-name">{currentFile}</div>
                        </div>
                        <div ref={monacoEl} className="flex-grow">
                        </div>
                    </div>
                </div>
                <div className="splitter border hover:cursor-ns-resize min-h-2 bg-blue-900"
                    onMouseDown={onMouseDownEditor}
                ></div>
                <div className="btns flex flex-row gap-x-4 p-2">
                    <div className="run flex flex-row gap-x-4 select-none w-12 m-2 cursor-pointer bg-green-500 text-white text-center p-2"
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

                    <div className="upload flex flex-row gap-x-4 select-none m-2 cursor-pointer bg-blue-500 text-white text-center p-2">
                        <label htmlFor="py_upload" className="">Upload</label>
                        <input type="file" id="py_upload" className="hidden" />
                    </div>

                    <div className="download flex flex-row gap-x-4 select-none m-2 cursor-pointer bg-yellow-500 text-white text-center p-2">
                        <button id='editor_download_button'>Download Zip</button>
                    </div>

                </div>

                <div className="output flex-grow">
                    <div className="output-header">Output</div>
                    <div className="output-content whitespace-pre-wrap h-64 overflow-scroll" ref={outputRef}></div>
                </div>
            </div>
        </>
    )
};


