import React, { useRef } from 'jsx-dom';
import { startApplication } from './desktop';
import { openApps, toggleMinimizeWindow } from './globals';
import settings from "./assets/settings.svg"
import file_manager from "./assets/file_manager.svg"
import FileManager from './apps/FileManager';
import projects_icon from "./assets/projects.svg"
import Profile from './Profile';
import Notes from './apps/Notes';
import user_icon from "./assets/user.svg"
import user_white from "./assets/user_white.svg"
import calculator_icon from "./assets/calculator.svg"
import Calculator from './apps/calculator';

export function updateTaskBar() {
    const taskbarApps = document.getElementById('taskbar_apps')
    if(taskbarApps){
        taskbarApps.innerHTML = ""
        openApps.forEach(app => {
            const appIcon = <div 
            title={app.name}
            className="taskbar-app-item px-2 py-2 hover:bg-gray-200"
            onClick={() => {
                toggleMinimizeWindow(app.name)
            }}
            >
                <img src={app.icon} alt={app.name} className="h-8 w-8"/>
            </div>
            taskbarApps.appendChild(appIcon)
        })
    }
}


export default function Taskbar() {

    const dateDivRef = useRef<HTMLDivElement>(null);

    const profileRef = useRef<HTMLDivElement>(null);

    setInterval(() => {
        const date = new Date().toDateString();
        const time = new Date().toLocaleTimeString();
        if(dateDivRef.current){
            dateDivRef.current.innerHTML = `${date} ${time}`;
        }
    }, 1000);


    return (
        <div 
        className="fixed bottom-0 w-full taskbar h-12 bg-[#e940a5] text-white flex justify-between items-center"
        id="taskbar_main"
        >
            <div 
            className="start flex items-center hover:bg-gray-200 h-full pr-4" 
            ref={profileRef}
            onClick={() => {
                showStartMenu = !showStartMenu
                handleRenderStartMenu()
                
            }}
            >
                <img src={user_icon} alt="user" className="h-8 w-8 ml-2"/>
            </div>  
            <StartMenu/>

            <div className="w-full h-full px-2 mr-4 open-apps flex gap-x-4 items-center" id="taskbar_apps">
            </div>


            <div className="center w-32 flex items-center pr-1" ref={dateDivRef}>
                {/* Date and time */}
                {new Date().toDateString()} {new Date().toLocaleTimeString()}
            </div>

        </div>
    )
}


let showStartMenu = false

function handleRenderStartMenu(){
    if(showStartMenu){
        const startMenu = document.getElementById('start-menu')
        if(startMenu){
            startMenu.style.display = 'block'
        }
    }
    else{
        const startMenu = document.getElementById('start-menu')
        if(startMenu){
            startMenu.style.display = 'none'
        }
    }
}


function StartMenu() {
    
    const startItems = [
        {
            name: "Projects",
            icon: projects_icon,
            component: <FileManager rootFolderName="Projects"/>,
        },
       {
            name: "Calculator",
            icon: calculator_icon,
            component: <Calculator />,
            width: '350px',
            height: '500px',
       },
        {
            name: "File Explorer",
            icon: file_manager,
            component: <FileManager rootFolderName="root"/>
        },
        {
            name: "Notes",
            icon: settings,
            component: <Notes />
        },
    ]


    const startMenuRef = useRef<HTMLDivElement>(null);

    return (
        <div 
        className="start-menu bg-[#a22666] fixed w-64 h-[40vh] border border-gray-300 rounded-lg shadow-lg hidden select-none bottom-[50px]"
        ref={startMenuRef}
        id='start-menu'
        >
            <div 
            className="flex items-center p-2 hover:bg-gray-300 w-full cursor-pointer"
            onClick={() => {
                showStartMenu = false
                handleRenderStartMenu()
                startApplication('Profile', settings, <Profile />)
            }}
            >
                <img src={user_white} alt="user" className="h-8 w-8 ml-2"/>
                <span className="text-white ml-2">Ayush Deshpande</span>
            </div>
            <hr className="border border-gray-300"/>
            <div className="flex flex-col items-center">
                {startItems.map((item) => (
                    <div 
                    className="flex items-center p-2 hover:bg-gray-300 w-full hover:cursor-pointer"
                    onClick={() => {
                        showStartMenu = false
                        handleRenderStartMenu()
                        startApplication(item.name, item.icon, item.component, item.width, item.height)
                    }}
                    >
                        <img src={item.icon} alt={item.name} className="h-8 w-8 invert"/>
                        <span className="ml-2">{item.name}</span>
                    </div>
                ))}
            </div>

        </div>
    )
}