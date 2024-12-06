import * as React from 'jsx-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { waitForElementFromRef } from '../../globals';
import { asyncRun, FS } from '../../utils/pyodide_helper';
import run_btn from '../../assets/runbtn.svg';
import new_file_icon from '../../assets/new-file.svg';
import new_folder_icon from '../../assets/folder-new.svg';

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

    let currentFile = 'main.py';
    let currentFileData = '';

    const setCurrentFile = (file: string) => {
        currentFile = file;
        document.querySelector('#file-name')!.textContent = file;
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
            monacoEl.current!.style.height = `${startHeight + e.clientY - startY}px`;
            editor?.layout({
                width: editor!.getLayoutInfo().width,
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
            console.log(w);
            
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

    const saveFile = () => {
        const value = editor?.getValue();
        currentFileData = value!;
        showSavedPopup();
        FS('write', { path: `/home/pyodide/${currentFile}`, data: value });
        FS('sync', {});
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            saveFile();
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
        const { result } = await asyncRun(value, false);
        outputBlock.innerText = result;
        loading = false;
        runButton.classList.add('hidden');
    }

    return (
        <>
            <div className="flex flex-col h-full" ref={mainContainer}>
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



function FileTree(
    {
        setCurrentFile,
        setCurrentFileData
    }: {
        setCurrentFile: (file: string) => void,
        setCurrentFileData: (data: string) => void,
    }
) {
    const fileTreeContentRef = React.useRef<HTMLDivElement>(null);


    const deleteFile = (filename: string) => {
        if (filename === 'main.py') {
            alert('Cannot delete main.py');
            return;
        }
        FS('remove', { path: `/home/pyodide/${filename}` });
        updateFileTree();
    }

    const updateFileTree = async () => {
        const res = await FS('list', { path: '/home/pyodide' });
        const fileTreeContent = fileTreeContentRef.current!;
        fileTreeContent.innerHTML = "";

        const ul = <ul></ul>;
        fileTreeContent.appendChild(ul);
        for (const file of res) {
            if (file !== '..' && file !== '.') {
                const li =
                    <li
                        className="cursor-pointer w-full flex flex-row justify-between"
                        onClick={() => {
                            FS('read', { path: `/home/pyodide/${file}` }).then((res) => {
                                setCurrentFile(file);
                                setCurrentFileData(res);
                            });
                        }}
                    >
                        {file}
                        <span className="text-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteFile(file);
                            }
                            }
                        >
                            X
                        </span>
                    </li>;
                ul.appendChild(li);
            }
        }

        // set current file to main.py if nothing exists
        if (res.length === 2) {
            setCurrentFile('main.py');
            setCurrentFileData('');
            new_file('main.py');
        }
    }

    waitForElementFromRef(fileTreeContentRef, updateFileTree);

    const new_file = (filename: string | null) => {
        if (filename === null) {
            filename = prompt('Enter filename: ') || 'main.py';
        }
        FS('write', { path: `/home/pyodide/${filename}`, data: '' });
        updateFileTree();
    }
    return (
        <div
            className="file-tree flex flex-col bg-gray-900 px-4 text-white"
            id="file-tree"
        >
            <div className="file-tree-header">Files</div>
            <div className="file-tree-actions flex flex-row gap-x-2">
                <button className=""
                    onClick={() => new_file(null)}
                >
                    <img src={new_file_icon} alt="New File" className="w-6 h-6 invert" />
                </button>
                <button className="">
                    <img src={new_folder_icon} alt="New Folder" className="w-6 h-6 invert" />
                </button>
            </div>


            <div className="file-tree-content"
                id="file-tree-content"
                ref={fileTreeContentRef}
            >
                loading...
            </div>

        </div>
    )
}