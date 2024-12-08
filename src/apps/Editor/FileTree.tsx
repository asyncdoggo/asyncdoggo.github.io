import * as React from 'jsx-dom';
import { waitForElementFromRef } from '../../globals';
import { Tree, FS, tree } from '../../utils/pyodide_helper';

import new_file_icon from '../../assets/new-file.svg';
import new_folder_icon from '../../assets/folder-new.svg';

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
            await FS('remove', { path: path });
        }
        removeNodeFromTree(path, file_tree!);
        updateFileTree();
        if(currentFile === path) {
            setCurrentFile('/home/pyodide/main.py');
            setCurrentFileData(await FS('read', { path: '/home/pyodide/main.py' }));
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



    const new_file = (filename: string | null) => {
        if (filename === null) {
            filename = prompt('Enter filename: ') || 'main.py';
        }
        FS('write', { path: `${currentSelectedFolder}/${filename}`, data: '' });
        addNodeToTree(`${currentSelectedFolder}/${filename}`, file_tree!, false);
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

    const new_folder = () => {
        const foldername = prompt('Enter folder name: ') || 'new_folder';
        FS('mkdir', { path: `${currentSelectedFolder}/${foldername}` });
        addNodeToTree(`${currentSelectedFolder}/${foldername}`, file_tree!, true);
        updateFileTree();
    }


    waitForElementFromRef(fileTreeContentRef, async () => {
        file_tree = await tree;

        // If tree is empty, create a new file
        if (Object.keys(file_tree!.contents).length === 0) {
            FS('write', { path: '/home/pyodide/main.py', data: '' });
            file_tree = {
                name: 'main.py',
                dir: false,
                contents: {},
                mode: 0,
                readmode: 0,
                usedBytes: 0,
                path: '/home/pyodide/main.py',
            }
        }

        updateFileTree();
        currentSelectedFolder = '/home/pyodide';
        setCurrentFile('/home/pyodide/main.py');
        setCurrentFileData(await FS('read', { path: '/home/pyodide/main.py' }));


        document.getElementById('py_upload')!.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target!.result as string;
                setCurrentFileData(data);
                setCurrentFile(file.name);
                FS('write', { path: `/home/pyodide/${file.name}`, data });
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
            reader.readAsText(file);
        });

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
                <div id="context-menu-item-delete"
                    onClick={(e: any) => {
                        if (e.target.getAttribute('dir') == 'true') {
                            deleteNode(e.target.getAttribute('data-delete-name')!, true);
                        }
                        else {
                            deleteNode(e.target!.getAttribute('data-delete-name')!, false);
                        }
                    }}
                >Delete</div>
                <div id="context-menu-item-rename">Rename</div>
            </div>

        </div>
    )
}

const fileSelected = (
    file_tree: Tree,
    setCurrentSelectedFolder: (folder: string) => void,
    setCurrentFile: (file: string) => void,
    setCurrentFileData: (data: string) => void,
    e: any
) => {
    if (file_tree.dir) {
        setCurrentSelectedFolder(file_tree.path);
    } else {
        setCurrentFile(file_tree.path);
        FS('read', { path: file_tree.path }).then((data: string) => {
            setCurrentFileData(data);
        });
    }

    // remove selected class from all elements
    const selectedElements = document.querySelectorAll('.file-tree-node-name');
    selectedElements.forEach((element) => {
        element.classList.remove('selected');
    });

    // add selected class to the clicked element
    e.currentTarget.classList.add('selected');
}


const buildTree = (
    file_tree: Tree,
    setCurrentSelectedFolder: (folder: string) => void,
    setCurrentFile: (file: string) => void,
    setCurrentFileData: (data: string) => void,
) => {
    if (file_tree.path === '/home/pyodide') {
        return (
            <>
                {Object.values(file_tree.contents || {}).map((child, index) => (
                    <React.Fragment key={index}>
                        {buildTree(child as Tree, setCurrentSelectedFolder, setCurrentFile, setCurrentFileData)}
                    </React.Fragment>
                ))}
            </>
        )
    }


    return (
        <div className="file-tree-node w-full flex flex-col justify-center items-start">
            <div className="flex flex-col w-full justify-between">
                <div className={"file-tree-node-name w-full justify-between flex flex-row" + (file_tree.path === "/home/pyodide/main.py" ? " selected" : "")}
                    data-name={file_tree.path}
                    onClick={(e) => {
                        fileSelected(
                            file_tree,
                            setCurrentSelectedFolder,
                            setCurrentFile,
                            setCurrentFileData,
                            e
                        )
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
                        deleteItem.setAttribute('data-delete-name', file_tree.path);
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
                            null
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
                                {buildTree(child as Tree, setCurrentSelectedFolder, setCurrentFile, setCurrentFileData)}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
