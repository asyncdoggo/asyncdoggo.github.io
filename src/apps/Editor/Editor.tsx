import * as React from 'jsx-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { waitForElementFromRef } from '../../globals';
import { asyncRun, FS, Tree, tree } from '../../utils/pyodide_helper';
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

    let currentFile = '/home/pyodide/main.py';
    let currentFileData = '';
    let currentSelectedFolder = '';

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

    window.addEventListener('keydown', (e) => {

        if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            saveFile(currentFile);
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
                        currentSelectedFolder={currentSelectedFolder}
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
        setCurrentFileData,
        currentSelectedFolder,
    }: {
        setCurrentFile: (file: string) => void,
        setCurrentFileData: (data: string) => void,
        currentSelectedFolder: string,
    }
) {

    let file_tree: Tree | null = null;

    const fileTreeContentRef = React.useRef<HTMLDivElement>(null);

    const deleteFile = async (path: string) => {
        if (path === '/home/pyodide/main.py') {
            alert('Cannot delete main.py');
            return;
        }
        await FS('remove', { path: path });
        // update file_tree

        removeNodeFromTree(path, file_tree!);
        updateFileTree();
    }

    const deleteFolder = async (path: string) => {
        try{
            await FS('rmdir', { path: path });
        }
        catch(e){
            alert('Folder not empty');
            return;
        }
        removeNodeFromTree(path, file_tree!);
        updateFileTree();
    }



    const removeNodeFromTree = (path: string, tree: Tree) => {
        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.path === path) {
                delete tree.contents[key];
                return;
            }
            if (child.dir) {
                removeNodeFromTree(path, child);
            }
        }
    }



    const buildTree = (file_tree: Tree) => {
        if (file_tree.path === '/home/pyodide') {
            return (
                <>
                    {Object.values(file_tree.contents || {}).map((child, index) => (
                        <React.Fragment key={index}>
                            {buildTree(child as Tree)}
                        </React.Fragment>
                    ))}
                </>
            )
        }

        return (
            <div className="file-tree-node w-full flex flex-col justify-center items-start">
                <div className="flex flex-col w-full justify-between">
                    <div className="file-tree-node-name w-full justify-between flex flex-row"
                        onClick={() => {
                            if (file_tree.dir) {
                                currentSelectedFolder = file_tree.path;
                            } else {
                                setCurrentFile(file_tree.path);
                                FS('read', { path: file_tree.path }).then((data: string) => {
                                    setCurrentFileData(data);
                                });
                            }
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            // show context menu
                            const contextMenu = document.getElementById('context-menu-for-file-tree')!;
                            contextMenu.style.display = 'block';
                            contextMenu.style.left = `${e.clientX}px`;
                            contextMenu.style.top = `${e.clientY}px`;
                            contextMenu.onclick = () => {
                                contextMenu.style.display = 'none';
                            }
                            const deleteItem = document.getElementById('context-menu-item-delete')!;
                            deleteItem.setAttribute('data-name', file_tree.path);
                            if (file_tree.dir) {
                                deleteItem.setAttribute('dir', 'true');
                            }
                            else {
                                deleteItem.removeAttribute('dir');
                            }
                        }}
                        
                        >
                        {file_tree.name}
                        {
                            file_tree.dir ?
                                (
                                    <div className="file-tree-node-dropdown" onClick={() => {
                                        const children = document.getElementById(file_tree.path)!;
                                        if (children.style.display === 'none') {
                                            children.style.display = 'block';
                                        } else {
                                            children.style.display = 'none';
                                        }
                                    }}>
                                        ▼
                                    </div>
                                )
                                :
                                (
                                    <button className="file-tree-delete-button" onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFile(file_tree.path);
                                    }}>
                                        ❌
                                    </button>
                                )
                        }
                    </div>

                    {file_tree.dir && (
                        <div
                            className="file-tree-children pl-2"
                            style={{ display: 'none' }}
                            id={file_tree.path}
                        >
                            {Object.values(file_tree.contents || {}).map((child, index) => (
                                <React.Fragment key={index}>
                                    {buildTree(child as Tree)}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const updateFileTree = async () => {
        // build the dom using tree imported from pyodide_helper
        const treeElement = buildTree(file_tree!);
        fileTreeContentRef.current!.innerHTML = '';
        fileTreeContentRef.current!.appendChild(treeElement);
    }

    waitForElementFromRef(fileTreeContentRef, async () => {
        file_tree = await tree;
        updateFileTree();
        currentSelectedFolder = '/home/pyodide';
        setCurrentFile('/home/pyodide/main.py');
        setCurrentFileData(await FS('read', { path: '/home/pyodide/main.py' }));
    });


    const new_file = (filename: string | null) => {
        if (filename === null) {
            filename = prompt('Enter filename: ') || 'main.py';
        }
        FS('write', { path: `${currentSelectedFolder}/${filename}`, data: '' });
        addFileToTree(`${currentSelectedFolder}/${filename}`, file_tree!);
        updateFileTree();
    }

    const addFileToTree = (path: string, tree: Tree, depth: number = 0) => {
        // Find the folder in which the file is to be added
        const filename = path.split('/').pop()!;
        const folderPath = path.split('/').slice(3, -1) // 3 to ignore /home/pyodide(plus empty string at the start) and -1 to ignore the filename



        // base case, if the path is /home/pyodide
        if (currentSelectedFolder === '/home/pyodide') {
            tree.contents[filename] = {
                name: filename,
                path: path,
                dir: false,
                contents: {},
                mode: 0,
                readmode: 0,
                usedBytes: 0,
            };
            return;
        }

        // recursive case
        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.dir) {

                // check for depth to find the correct folder

                if (child.path === currentSelectedFolder) {
                    child.contents[filename] = {
                        name: filename,
                        path: path,
                        dir: false,
                        contents: {},
                        mode: 0,
                        readmode: 0,
                        usedBytes: 0,
                    };
                    return true;
                }
                if (folderPath[depth] === child.name) {
                    if (addFileToTree(path, child, depth + 1)) {
                        return;
                    }
                }
            }

        }
    }


    const addFolderToTree = (path: string, tree: Tree, depth: number = 0) => {
        const foldername = path.split('/').pop()!;
        const folderPath = path.split('/').slice(3, -1) // 3 to ignore /home/pyodide(plus empty string at the start) and -1 to ignore the foldername

        // base case, if the path is /home/pyodide
        if (currentSelectedFolder === '/home/pyodide') {
            tree.contents[foldername] = {
                name: foldername,
                path: path,
                dir: true,
                contents: {},
                mode: 0,
                readmode: 0,
                usedBytes: 0,
            };
            return true;
        }

        // recursive case
        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.dir) {

                // check for depth to find the correct folder

                if (child.path === currentSelectedFolder) {
                    child.contents[foldername] = {
                        name: foldername,
                        path: path,
                        dir: true,
                        contents: {},
                        mode: 0,
                        readmode: 0,
                        usedBytes: 0,
                    };
                    return true;
                }
                if (folderPath[depth] === child.name) {
                    if (addFolderToTree(path, child, depth + 1)) {
                        return;
                    }
                }
            }
        }
    }




    const new_folder = () => {
        const foldername = prompt('Enter folder name: ') || 'new_folder';
        FS('mkdir', { path: `${currentSelectedFolder}/${foldername}` });
        addFolderToTree(`${currentSelectedFolder}/${foldername}`, file_tree!);
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
                <button className=""
                    onClick={() => new_folder()}
                >
                    <img src={new_folder_icon} alt="New Folder" className="w-6 h-6 invert" />
                </button>
            </div>


            <div className="file-tree-content"
                id="file-tree-content"
                ref={fileTreeContentRef}
            >
                loading...
            </div>

            <div id="context-menu-for-file-tree" className="absolute bg-gray-800 text-white p-2 rounded-md"
                style={{ display: 'none' }}
            >
                <div id="context-menu-item-delete"
                    onClick={(e: any) => {
                        // delete file, name is in the data-name attribute                        
                        if (e.target.getAttribute('dir') == 'true'){
                            deleteFolder(e.target.getAttribute('data-name')!);
                        }
                        else{
                            deleteFile(e.target!.getAttribute('data-name')!);
                        }
                    }}
                >Delete</div>
                <div id="context-menu-item-rename">Rename</div>
            </div>

        </div>
    )
}