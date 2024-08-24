import React, { useRef } from 'jsx-dom';
import { startApplication } from './desktop';
import Notes from './Notes';
import IframeWindow from './IframeWindow';
import blogs from "./assets/blogs.svg"


const root = {
    name: 'root',
    type: 'folder',
    children: [
        {
            name: "Projects",
            type: 'folder',
            children: [
                {
                    name: "Job Hunter",
                    type: 'file_html',
                    link: "https://jobhunt-ea01a.web.app"
                },
            ]
        },
        {
            name: "Personal",
            type: 'folder',
            children: [
                {
                    name: "Resume",
                    type: 'file_html',
                    link: "https://drive.google.com/file/d/1vvJDaZbnTc6ewFNhk3-CrgFdqtXa7Oa7/preview"
                },
            ]
        },
        {
            name: "Blogs",
            type: 'folder',
            children: [
                {
                    name: "My Blogs",
                    type: 'redirect',
                    path: "/blogs/",
                },
            ]
        },
        {
            name: "Social",
            type: 'folder',
            children: [
                {
                    name: "LinkedIn",
                    type: 'link_open',
                    link: "https://www.linkedin.com/in/ayush-deshpande/"
                },
                {
                    name: "Github",
                    type: 'link_open',
                    link: "https://github.com/asyncdoggo",
                },
                {
                    name: "Instagram",
                    type: 'link_open',
                    link: "https://www.instagram.com/ayush.arc/",
                },
            ]
        }
    ]
}




export default function FileManager({rootFolderName}:any) {

    const titleRef = useRef<HTMLDivElement>(null)
    const fileListRef = useRef<HTMLDivElement>(null)

    let currentFolder: any = root
    if(rootFolderName){
        currentFolder = root.children.find((child: any) => child.name === rootFolderName)
    }
    if (rootFolderName == "root") {
        currentFolder = root
    }

    function openFolder(folder: any) {
        currentFolder = folder
        const folderName = titleRef.current?.querySelector('h1')
        if(folderName){
            folderName.innerHTML = folder.name
        }
        const fileList = fileListRef.current
        if(fileList){
            fileList.innerHTML = ""
            fileList.appendChild(<FileList currentFolder={currentFolder} setCurrentFolder={openFolder} />)
        }
    }
    

    return (
        <div className="w-full h-full">
            <div className="file-manager bg-gray-100 w-full h-full flex flex-col justify-center items-center">
                <div 
                className="file-manager-title-bar bg-white p-2 rounded-lg shadow-lg flex justify-between items-center w-full"
                ref={titleRef}
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
                ref={fileListRef}
                >
                    <FileList currentFolder={currentFolder} setCurrentFolder={openFolder} />
                </div>
            </div>
        </div>
    )
}


// function openFolder(folder: any) {
//     currentFolder = folder
//     const folderName = document.querySelector('.file-manager-title-bar h1')
//     if(folderName){
//         folderName.innerHTML = folder.name
//     }
//     const fileList = document.querySelector('.file-manager-list')
//     if(fileList){
//         fileList.innerHTML = ""
//         fileList.appendChild(<FileList />)
//     }
// }



function FileList ({currentFolder, setCurrentFolder}: any) {

        
    
    function openFile(child: any) {
        if(child.type === 'folder'){
            setCurrentFolder(child)
        } else if (child.type === 'file'){
            openFile(child)
        }
        else if (child.type === 'file_html'){
            openHtmlFile(child)
        }
        else if (child.type === 'link_open'){
            window.open(child.link, '_blank')
        }
        else if (child.type === 'window_open'){
            startApplication(child.name, blogs, <Notes content="My Blogs"/>)
        }
        else if (child.type === 'redirect'){
            window.location.href = child.path
        }
    }


    return (
        <ul>
        {currentFolder.children.map((child: any, index: number) => {
            return (
                <li 
                key={index} 
                className="file-manager-item flex flex-row hover:cursor-pointer"
                onClick={() => openFile(child)}
                >
                    <img src={child.type === 'folder' ? 'https://img.icons8.com/ios-glyphs/30/000000/folder-invoices--v1.png' : 'https://img.icons8.com/ios-glyphs/30/000000/file.png'} alt="file" className="h-6 w-6" />
                    <span>{child.name}</span>
                </li>
            )
        })}
    </ul>
    )
}


function openHtmlFile(file: any) {
    startApplication(file.name, 'https://img.icons8.com/ios-glyphs/30/000000/file.png', <IframeWindow src={file.link} />)
}
