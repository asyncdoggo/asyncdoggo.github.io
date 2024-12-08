import { FS, Tree } from "../../utils/pyodide_helper";
import * as React from "jsx-dom";

export const buildTree = (
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
                        contextMenu.style.left = `${e.clientX - document.getElementById('Editor')!.getBoundingClientRect().left}px`;
                        contextMenu.style.top = `${e.clientY - document.getElementById('Editor')!.getBoundingClientRect().top}px`;
                        contextMenu.onclick = () => {
                            contextMenu.style.display = 'none';
                        }
                       
                        contextMenu.setAttribute('data-context-menu-path', file_tree.path);
                        contextMenu.setAttribute('data-context-menu-dir', file_tree.dir ? 'true' : 'false');
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
        setCurrentSelectedFolder(file_tree.path.split('/').slice(0, -1).join('/'));        
        
    }

    // remove selected class from all elements
    const selectedElements = document.querySelectorAll('.file-tree-node-name');
    selectedElements.forEach((element) => {
        element.classList.remove('selected');
    });

    // add selected class to the clicked element
    e.currentTarget.classList.add('selected');
}

