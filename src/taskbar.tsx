import { useRef } from 'jsx-dom';
import * as React from 'jsx-dom';
import { startApplication } from './desktop';
import { openApps, toggleMinimizeWindow, currentFocusedApp, removeCurrentFocusedApp } from './globals';
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

function closeWindow(appName: string) {        
    const desktop = document.querySelector('.desktop')
    if (desktop) {
        openApps.splice(openApps.findIndex(app => app.name === appName), 1)
        currentFocusedApp === appName && removeCurrentFocusedApp()
        updateTaskBar();
        const inner = document.getElementById(`${appName}_inner`) as any

        if (inner && inner.onCleanUp) {
            inner.onCleanUp()
        }

        desktop.removeChild(document.getElementById(appName)!)
    }
}


export function updateTaskBar() {
    const taskbarApps = document.getElementById('taskbar_apps')
    if (taskbarApps) {
        taskbarApps.innerHTML = ""
        openApps.forEach(app => {
            const appIcon = <div
                title={app.name}
                className="taskbar-app-item px-3 py-2 hover:bg-white/30 rounded-lg transition-all duration-250 cursor-pointer"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleMinimizeWindow(app.name)
                }}
                onContextMenu={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    // find mouse position and open context menu
                    const contextMenu = document.getElementById('context-menu')
                    if (contextMenu) {
                        contextMenu.style.display = 'block'
                        contextMenu.style.left = `${e.clientX}px`
                        contextMenu.style.top = `${-contextMenu.clientHeight}px`
                        contextMenu.setAttribute('data-app', app.name)
                    }
                }}
            >
                <img src={app.icon} alt={app.name} className="h-7 w-7 drop-shadow-sm" />
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
        if (dateDivRef.current) {
            dateDivRef.current.innerHTML = `${date} ${time}`;
        }
    }, 1000);


    return (
        <div
            className="fixed bottom-0 w-full taskbar h-14 bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white flex justify-between items-center backdrop-blur-md"
            id="taskbar_main"
        >
            <div
                className="start flex items-center hover:bg-white/20 h-full px-4 rounded-r-lg transition-colors cursor-pointer"
                ref={profileRef}
                id='show-start-menu'
                onClick={() => {
                    showStartMenu = !showStartMenu
                    handleRenderStartMenu()

                }}
                title="Start Menu"
            >
                <img src={user_icon} alt="user" className="h-6 w-6" />
            </div>
            {
                (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? (
                    <></>) :
                    <StartMenu />
            }


            <div className="w-full h-full px-2 mr-4 open-apps flex gap-x-2 items-center"
                id="taskbar_apps">
            </div>


            <div className="center px-4 flex items-center text-sm font-medium whitespace-nowrap" ref={dateDivRef}>
                {/* Date and time */}
                {new Date().toDateString()} {new Date().toLocaleTimeString()}
            </div>


            <div id="context-menu" className="bg-gray-900/95 fixed border border-gray-700 rounded-lg shadow-xl hidden backdrop-blur-sm z-50">
                
                <div className="context-menu-item p-2 cursor-pointer hover:bg-gray-700 text-white text-sm transition-colors"
                    onClick={() => {
                        const contextMenu = document.getElementById('context-menu')
                        if (contextMenu) {
                            contextMenu.style.display = 'none'
                        }
                        const appName = contextMenu?.getAttribute('data-app')
                        if (appName) {
                            document.getElementById(appName)!.style.width = '100px'
                            document.getElementById(appName)!.style.height = '100px'
                            document.getElementById(appName)!.style.top = '50%'
                            document.getElementById(appName)!.style.left = '50%'
                        }
                    }}
                >
                    Resize

                </div>


                <div className="context-menu-item p-2 cursor-pointer hover:bg-gray-700 text-white text-sm transition-colors"
                    onClick={() => {
                        const contextMenu = document.getElementById('context-menu')
                        if (contextMenu) {
                            contextMenu.style.display = 'none'
                        }
                        const appName = contextMenu?.getAttribute('data-app')
                        if (appName) {
                            toggleMinimizeWindow(appName)
                        }
                    }}
                >
                    Maximize/Minimize
                </div>
                <div className="context-menu-item p-2 cursor-pointer hover:bg-gray-700 text-white text-sm transition-colors"
                    onClick={() => {
                        const contextMenu = document.getElementById('context-menu')
                        if (contextMenu) {
                            contextMenu.style.display = 'none'
                        }
                        const appName = contextMenu?.getAttribute('data-app')
                        if (appName) {
                            closeWindow(appName)
                        }
                    }}
                >
                    Close
                    </div>
            </div>
        </div>
    )
}
// To dismiss the context menu on click outside
document.addEventListener('click', () => {
    const contextMenu = document.getElementById('context-menu')
    if (contextMenu) {
        contextMenu.style.display = 'none'
    }
})

let showStartMenu = false

function handleRenderStartMenu() {
    if (showStartMenu) {
        const startMenu = document.getElementById('start-menu')
        if (startMenu) {
            startMenu.style.display = 'block'
        }
    }
    else {
        const startMenu = document.getElementById('start-menu')
        if (startMenu) {
            startMenu.style.display = 'none'
        }
    }
}


function StartMenu() {

    const startItems = [
        {
            name: "Projects",
            icon: projects_icon,
            component: <FileManager rootFolderName="Projects" />,
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
            component: <FileManager rootFolderName="root" />
        },
        {
            name: "Notes",
            icon: settings,
            component: <Notes />
        },
    ]


    const startMenuRef = useRef<HTMLDivElement>(null);

    document.addEventListener('click', (e) => {
        const show_btn = document.getElementById('show-start-menu')
        if (show_btn && !show_btn.contains(e.target as Node) && showStartMenu) {
            showStartMenu = false
            handleRenderStartMenu()
        }
    })

    return (
        <div
            className="start-menu glass bg-white/80 fixed w-64 rounded-2xl shadow-2xl hidden select-none bottom-[65px] left-2 z-50 overflow-hidden"
            ref={startMenuRef}
            id='start-menu'
        >
            <div
                className="flex items-center p-4 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 w-full cursor-pointer transition-colors font-medium"
                onClick={() => {
                    showStartMenu = false
                    handleRenderStartMenu()
                    startApplication('Profile', settings, <Profile />)
                }}
            >
                <img src={user_white} alt="user" className="h-8 w-8 ml-2 rounded-full" />
                <span className="ml-3 text-gray-800 font-semibold">Ayush Deshpande</span>
            </div>
            <hr className="border border-gray-200" />
            <div className="flex flex-col items-center">
                {startItems.map((item) => (
                    <div
                        className="flex items-center p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 w-full hover:cursor-pointer transition-colors text-gray-800"
                        onClick={() => {
                            showStartMenu = false
                            handleRenderStartMenu()
                            startApplication(item.name, item.icon, item.component, item.width, item.height)
                        }}
                    >
                        <img src={item.icon} alt={item.name} className="h-6 w-6 invert" />
                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                    </div>
                ))}
            </div>

        </div>
    )
}