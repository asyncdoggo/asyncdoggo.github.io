import React, { useRef } from 'jsx-dom';
import { startApplication } from '../desktop';
import IframeWindow from '../IframeWindow';
import folder_icon from "../assets/folder.svg"
import link_folder_icon from "../assets/link_folder.svg"
import job_hunter_icon from "../assets/jobhunt.svg"
import resume_icon from "../assets/resume.svg"
import back_icon from "../assets/back.svg"
import tictactoe_icon from "../assets/tictactoe.svg"
import pong_icon from "../assets/pong.svg"
import air_hockey_icon from "../assets/air_hockey.svg"
import TicTacToe from '../games/tictactoe';
import Pong from '../games/pong';
import AirHockey from '../games/airhockey';


const root = {
    name: 'root',
    type: 'folder',
    icon: folder_icon,
    children: [
        {
            name: "Projects",
            type: 'folder',
            icon: folder_icon,
            children: [
                {
                    name: "Job Hunter",
                    type: 'file_html',
                    link: "https://jobhunt-ea01a.web.app",
                    icon: job_hunter_icon
                },
            ]
        },
        {
            name: "Personal",
            type: 'folder',
            icon: folder_icon,
            children: [
                {
                    name: "Resume",
                    type: 'file_html',
                    link: "https://drive.google.com/file/d/1vvJDaZbnTc6ewFNhk3-CrgFdqtXa7Oa7/preview",
                    icon: resume_icon
                },
            ]
        },
        {
            name: "Blogs",
            type: 'redirect',
            icon: link_folder_icon,
            path: "/blogs/",
        },
        {
            name: "Social",
            type: 'folder',
            icon: folder_icon,
            children: [
                {
                    name: "LinkedIn",
                    type: 'link_open',
                    link: "https://www.linkedin.com/in/ayush-deshpande/",
                    icon: link_folder_icon
                },
                {
                    name: "Github",
                    type: 'link_open',
                    link: "https://github.com/asyncdoggo",
                    icon: link_folder_icon
                },
                {
                    name: "Instagram",
                    type: 'link_open',
                    link: "https://www.instagram.com/ayush.arc/",
                    icon: link_folder_icon
                },
            ]
        },
        {
            name: "Games",
            type: 'folder',
            icon: folder_icon,
            children: [
                {
                    name: "Tic Tac Toe",
                    type: 'window_open',
                    icon: tictactoe_icon,
                    component: <TicTacToe />,
                    width: '600px', 
                    height: '600px'
                },
                {
                    name: "Pong",
                    type: 'window_open',
                    icon: pong_icon,
                    component: <Pong />,
                    width: '800px',
                    height: '600px'
                },
                {
                    name: "Air Hockey",
                    type: 'window_open',
                    icon: air_hockey_icon,
                    component: <AirHockey />,
                    width: '600px',
                    height: '800px'
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
            fileList.appendChild(<FileExplorerGrid currentFolder={currentFolder} setCurrentFolder={openFolder} />)
        }
    }
    

    return (
        <div className="w-full h-full">
            <div className="file-manager bg-white w-full h-full flex flex-col justify-center items-center">
                <div 
                className="file-manager-title-bar bg-white p-2 rounded-lg shadow-lg flex justify-start gap-x-4 items-center w-full"
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
                        <img src={back_icon} alt="back" className="h-4 w-4" />
                    </button>
                    <h1>{currentFolder.name}</h1>
                </div>



                <div 
                className="file-manager-list flex flex-col w-full gap-y-2 justify-start items-start"
                ref={fileListRef}
                >
                    <FileExplorerGrid currentFolder={currentFolder} setCurrentFolder={openFolder} />
                </div>
            </div>
        </div>
    )
}


function FileExplorerGrid ({currentFolder, setCurrentFolder}: any) {

        
    
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
            startApplication(child.name, child.icon, child.component, child.width, child.height)
        }
        else if (child.type === 'redirect'){
            window.location.href = child.path
        }
    }


    return (
       <div 
        className="file-explorer-grid w-full p-2 grid grid-cols-4 gap-4"
       >
              {
                currentFolder.children.map((child: any) => {
                    return (
                        <div 
                        className="file-explorer-item flex flex-col items-center justify-center hover:bg-gray-200 rounded-lg px-2 py-2"
                        onClick={() => openFile(child)}
                        >
                            <img src={child.icon} alt="folder" className="h-16 w-16" />
                            <p>{child.name}</p>
                        </div>
                    )
                })
              }
         </div>

    )
}


function openHtmlFile(file: any) {
    startApplication(file.name, 'https://img.icons8.com/ios-glyphs/30/000000/file.png', <IframeWindow src={file.link} />)
}
