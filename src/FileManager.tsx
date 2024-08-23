import React, { useRef } from 'jsx-dom';
import { startApplication } from './desktop';
import Notes from './Notes';


const root = {
    name: 'root',
    type: 'folder',
    children: [
        {
            name: 'folder1',
            type: 'folder',
            children: [
                {
                    name: 'file1',
                    type: 'file',
                    content: 'Hello, I am file1'
                },
                {
                    name: 'file2',
                    type: 'file',
                    content: 'Hello, I am file2'
                }
            ]
        },
        {
            name: 'file3',
            type: 'file',
            content: 'Hello, I am file3'
        }
    ]
}

let currentFolder = root



export default function FileManager() {

    return (
        <div className="w-full h-full">
            <div className="file-manager bg-gray-100 w-full h-full flex flex-col justify-center items-center">
                {/* a filemanager title bar with back button and opened folder name */}
                <div 
                className="file-manager-title-bar bg-white p-2 rounded-lg shadow-lg flex justify-between items-center w-full"
                >
                    <button 
                    className="back-button"
                    onClick={() => {
                        if(currentFolder.name === 'root'){
                            return
                        }
                        openFolder(root)
                    }}
                    >
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/circled-left-2.png" alt="back" className="h-6 w-6" />
                    </button>
                    <h1>{currentFolder.name}</h1>
                </div>



                <div 
                className="file-manager-list flex flex-col w-full gap-y-2 justify-start items-start"
                >
                    <FileList />
                </div>
            </div>
        </div>
    )
}


function openFolder(folder: any) {
    currentFolder = folder
    const folderName = document.querySelector('.file-manager-title-bar h1')
    if(folderName){
        folderName.innerHTML = folder.name
    }
    const fileList = document.querySelector('.file-manager-list')
    if(fileList){
        fileList.innerHTML = ""
        fileList.appendChild(<FileList />)
    }
}



function FileList () {
    return (
        <ul>
        {currentFolder.children.map((child: any, index: number) => {
            return (
                <li 
                key={index} 
                className="file-manager-item flex flex-row" 
                onClick={() => {
                    if(child.type === 'folder'){
                        openFolder(child)
                    } else {
                        openFile(child)
                    }
                } }
                >
                    <img src={child.type === 'folder' ? 'https://img.icons8.com/ios-glyphs/30/000000/folder-invoices--v1.png' : 'https://img.icons8.com/ios-glyphs/30/000000/file.png'} alt="file" className="h-6 w-6" />
                    <span>{child.name}</span>
                </li>
            )
        })}
    </ul>
    )
}


function openFile(file: any) {
    startApplication("Notes", 'https://img.icons8.com/ios-glyphs/30/000000/file.png', <Notes content={file.content} />)
}