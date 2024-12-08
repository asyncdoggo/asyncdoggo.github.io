import * as React from 'jsx-dom';
import { waitForElementFromRef } from '../../globals';
import { Tree, FS, tree } from '../../utils/pyodide_helper';

import new_file_icon from '../../assets/new-file.svg';
import new_folder_icon from '../../assets/folder-new.svg';
import { buildTree } from './BuildTree';
import JSZip from 'jszip';

export function FileTree(
    {
        setCurrentFile,
        setCurrentFileData,
        currentFile,
    }: {
        setCurrentFile: (file: string) => void,
        setCurrentFileData: (data: string) => void,
        currentFile: string,
    }
) {

    let file_tree: Tree | null = null;

    let currentSelectedFolder: string = '/home/pyodide';
    const setCurrentSelectedFolder = (folder: string) => {
        currentSelectedFolder = folder
    }

    const fileTreeContentRef = React.useRef<HTMLDivElement>(null);

    const deleteNode = async (path: string, isFolder: boolean) => {
        if (isFolder) {
            try {
                await FS('rmdir', { path: path });
            }
            catch (e) {
                alert('Folder not empty');
                return;
            }
        }
        else {
            if (path === '/home/pyodide/main.py') {
                alert('Cannot delete main.py');
                return;
            }
            try {
                await FS('remove', { path: path });
            }
            catch (e) {
                alert('File not found');
                return;
            }
        }
        removeNodeFromTree(path, file_tree!);
        updateFileTree();
        if (currentFile === path) {
            try {
                const data = await FS('read', { path: '/home/pyodide/main.py' })
                setCurrentFile('/home/pyodide/main.py');
                setCurrentFileData(data);
            }
            catch (e) {
                alert('Something went wrong');
            }
        }
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


    const updateFileTree = async () => {
        // build the dom using tree imported from pyodide_helper
        const treeElement = buildTree(file_tree!, setCurrentSelectedFolder, setCurrentFile, setCurrentFileData);
        fileTreeContentRef.current!.innerHTML = '';
        fileTreeContentRef.current!.appendChild(treeElement);
    }



    const new_file = async (filename: string | null) => {
        if (filename === null) {
            filename = prompt('Enter filename: ') || 'main.py';
        }
        try {
            FS('write', { path: `${currentSelectedFolder}/${filename}`, data: '' });
        }
        catch (e) {
            alert('Error');
            return;
        }
        
        addNodeToTree(`${currentSelectedFolder}/${filename}`, file_tree!, false);
        updateFileTree();
    }

    const new_folder = () => {
        const foldername = prompt('Enter folder name: ') || 'new_folder';
        try {
            FS('mkdir', { path: `${currentSelectedFolder}/${foldername}` });
        }
        catch (e) {
            alert('Folder already exists');
            return
        }
        addNodeToTree(`${currentSelectedFolder}/${foldername}`, file_tree!, true);
        updateFileTree();
    }

    const addNodeToTree = (path: string, tree: Tree, isFolder: boolean) => {
        const filename = path.split('/').pop()!;
        const folderPath = path.split('/').slice(3, -1) // 3 to ignore /home/pyodide(plus empty string at the start) and -1 to ignore the filename

        if (currentSelectedFolder === '/home/pyodide') {
            tree.contents[filename] = {
                name: filename,
                dir: isFolder,
                path: path,
                contents: {},
                mode: 0,
                readmode: 0,
                usedBytes: 0,
            };
            return;
        }

        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.dir) {
                if (child.path === currentSelectedFolder) {
                    child.contents[filename] = {
                        name: filename,
                        dir: isFolder,
                        contents: {},
                        mode: 0,
                        readmode: 0,
                        usedBytes: 0,
                        path: path,
                    };
                    return true;
                }
                if (folderPath[0] === child.name) {
                    if (addNodeToTree(path, child, isFolder)) {
                        return;
                    }
                }
            }
        }
    }

    const renameNodeInTree = (oldPath: string, newPath: string, tree: Tree) => {
        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.path === oldPath) {
                delete tree.contents[key];
                const filename = newPath.split('/').pop()!;
                tree.contents[filename] = {
                    name: filename,
                    dir: child.dir,
                    contents: child.contents,
                    mode: child.mode,
                    readmode: child.readmode,
                    usedBytes: child.usedBytes,
                    path: newPath,
                }
                updateFilePathsInTree(oldPath, newPath, tree);
                return true;
            }
            if (child.dir) {
                if (renameNodeInTree(oldPath, newPath, child)) {
                    return;
                }
            }
        }
    }

    const updateFilePathsInTree = (oldPath: string, newPath: string, tree: Tree) => {
        for (const key in tree.contents) {
            const child = tree.contents[key] as Tree;
            if (child.dir) {
                updateFilePathsInTree(oldPath, newPath, child);
            }
            if (child.path.startsWith(oldPath)) {
                const newChildPath = newPath + child.path.slice(oldPath.length);
                child.path = newChildPath;
            }

        }
    }


    waitForElementFromRef(fileTreeContentRef, async () => {
        file_tree = await tree;

        // If tree is empty, create it
        if (Object.keys(file_tree!.contents).length === 0) {
            try {
                await FS('write', { path: '/home/pyodide/main.py', data: '' });
                file_tree = {
                    "name": "root",
                    "contents": {
                        "main.py": {
                            "name": "main.py",
                            "path": "/home/pyodide/main.py",
                            "dir": false,
                            "contents": null,
                            "mode": 33206,
                            "readmode": 365,
                            "usedBytes": 0
                        },
                    },
                    "dir": true,
                    "mode": 0,
                    "path": "/home/pyodide",
                    "readmode": 0,
                    "usedBytes": 0
                }
            }
            catch (e) {
                alert('Something went wrong');
            }
        }

        updateFileTree();
        try {
            const data = await FS('read', { path: '/home/pyodide/main.py' })
            currentSelectedFolder = '/home/pyodide';
            setCurrentFile('/home/pyodide/main.py');
            setCurrentFileData(data);
        }
        catch (e) {
            alert('Something went wrong');
        }


        document.getElementById('py_upload')!.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target!.result as string;
                try {
                    FS('write', { path: `/home/pyodide/${file.name}`, data });
                    setCurrentFileData(data);
                    setCurrentFile(file.name);
                    addNodeToTree(`/home/pyodide/${file.name}`, file_tree!, false);
                    updateFileTree();

                    // css selector to select the file tree node
                    const selectedElements = document.querySelectorAll('.selected');
                    selectedElements.forEach((element) => {
                        element.classList.remove('selected');
                    });
                    const selector = `[data-name="/home/pyodide/${file.name}"]`;
                    const element = document.querySelector(selector);
                    element?.classList.add('selected');
                    // remove selected class from all elements
                }
                catch (e) {
                    alert('Something went wrong, perhaps a file with the same name already exists');
                }
            }
            reader.readAsText(file);
        });

        document.getElementById("editor_download_button")!.addEventListener('click', async () => {
            const data = await FS('download', { path: '/home/pyodide'});
            // recursively build the file tree and zip it
            const zip = new JSZip();
            buildZip(zip, data);
            zip.generateAsync({ type: "blob" }).then((content) => {
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'project.zip';
                a.click();
                URL.revokeObjectURL(url);
            });

        });

        const buildZip = (zip: JSZip, tree: Tree) => {
            for (const key in tree.contents) {
                const child = tree.contents[key] as Tree;
                if (child.dir) {
                    const folder = zip.folder(child.name);
                    buildZip(folder!, child);
                }
                else {
                    // convert tree.contents from uint8array to string                    
                    const data = new TextDecoder().decode(child.contents as unknown as Uint8Array || new Uint8Array());
                    zip.file(child.name, data);
                }
            }
        }

    });

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
                <div id="context-menu-item-copy"
                    onClick={async (e: any) => {
                        const path = e.target.parentElement.getAttribute('data-context-menu-path')!;
                        await navigator.clipboard.write(
                            [new ClipboardItem({
                                'text/plain': new Blob([JSON.stringify({ path })], { type: 'text/plain' })
                            })]
                        );
                    }}
                >
                    Copy
                </div>

                <div id="context-menu-item-paste"
                    onClick={async (e: any) => {
                        try {

                            const path = e.target.parentElement.getAttribute('data-context-menu-path')!;
                            const copiedPath = JSON.parse(await navigator.clipboard.readText()).path;

                            const data = await FS('read', { path: copiedPath });
                            await FS('write', { path: `${path}/${copiedPath.split('/').pop()}`, data });
                            addNodeToTree(`${path}/${copiedPath.split('/').pop()}`, file_tree!, false);
                            updateFileTree();
                        } catch (e) {
                            alert('No file copied');
                        }
                    }}
                >
                    Paste
                </div>

                <div id="context-menu-item-delete"
                    onClick={(e: any) => {
                        if (e.target.parentElement.getAttribute('data-context-menu-dir') == 'true') {
                            deleteNode(e.target.parentElement.getAttribute('data-context-menu-path')!, true);
                        }
                        else {
                            deleteNode(e.target.parentElement.getAttribute('data-context-menu-path')!, false);
                        }
                    }}
                >
                    Delete
                </div>

                <div id="context-menu-item-rename"
                    onClick={async (e: any) => {
                        const newName = prompt('Enter new name: ') || '';
                        if (newName === '') {
                            return;
                        }
                        const oldPath = e.target.parentElement.getAttribute('data-context-menu-path')!;

                        const newPath = oldPath.split('/').slice(0, -1).join('/') + '/' + newName;
                        try {
                            await FS('rename', { oldPath, newPath });
                            renameNodeInTree(oldPath, newPath, file_tree!);
                            setCurrentSelectedFolder(newPath);
                            updateFileTree();
                        }
                        catch (e) {
                            alert('File or folder with the same name already exists');
                        }
                    }}
                >
                    Rename
                </div>
            </div>

        </div>
    )
}