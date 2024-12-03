import * as React from "jsx-dom"
import { JSX, useRef } from "jsx-dom"
import { currentFocusedApp, openApps, removeCurrentFocusedApp, setCurrentFocusedApp, toggleMaximizeWindow, toggleMinimizeWindow } from "./globals"
import { updateTaskBar } from "./taskbar"
import maximize from "./assets/maximize.svg"
import minimize from "./assets/minimize.svg"
import closebtn from "./assets/close.png"



export default function Window(
    { appName,
        appIcon,
        appComponent,
        width = '400px',
        height = '450px',
    }:
        {
            appName: string,
            appIcon: string,
            appComponent: JSX.Element
            width?: string,
            height?: string
        }) {
    // If window already exists in openApps array, return null
    if (openApps.find(app => app.name === appName)) {
        return null
    }

    const windowRef = useRef<HTMLDivElement>(null)

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

            desktop.removeChild(windowRef.current!)
        }
    }


    function handleMouseDown(e: MouseEvent) {
        const windowElement = windowRef.current!
        const x = e.clientX - windowElement.getBoundingClientRect().left
        const y = e.clientY - windowElement.getBoundingClientRect().top

        function mouseMoveHandler(e: MouseEvent) {

            windowElement.style.left = `${e.clientX - x}px`
            windowElement.style.top = `${e.clientY - y}px`
            // Do not allow windowElement to be dragged outside of the screen
            if (windowElement.offsetLeft < 0) {
                windowElement.style.left = '0px'
            }
            if (windowElement.offsetTop < 0) {
                windowElement.style.top = '0px'
            }
            if (windowElement.offsetLeft + windowElement.offsetWidth > window.innerWidth) {
                windowElement.style.left = `${window.innerWidth - windowElement.offsetWidth}px`
            }
            if (windowElement.offsetTop + windowElement.offsetHeight > window.innerHeight) {
                windowElement.style.top = `${window.innerHeight - windowElement.offsetHeight}px`
            }

        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
    }



    return (
        <div
            className="app-window fixed top-0 left-0 min-w-[200px] min-h-[200px] bg-white shadow-lg rounded-lg resize overflow-auto select-none"
            ref={windowRef}
            id={appName}
            style={{ width, height }}
            onMouseDown={() => {
                setCurrentFocusedApp(appName)
            }}
        >
            <div
                className="title-bar flex justify-between items-center p-2 border hover:cursor-move sticky bg-white z-10 top-0"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center">
                    <img src={appIcon} alt="app-icon" className="h-8 w-8" />
                    <h1 className="ml-2">{appName}</h1>
                </div>

                <div className="flex flex-row justify-center items-center">

                    <button
                        className="minimize w-8 h-8 flex justify-center items-center"
                        onClick={() => toggleMinimizeWindow(appName)}
                    >
                        <img src={minimize} alt="minimize" className="w-4" />
                    </button>

                    <button
                        className="maximize w-8 h-8 flex justify-center items-center"
                        onClick={() => toggleMaximizeWindow(appName)}
                    >
                        <img src={maximize} alt="resize" className="w-4" />
                    </button>

                    <button className="close-button w-8 h-8 flex justify-center items-center"
                        onClick={() => closeWindow(appName)}
                    >
                        <img src={closebtn} alt="minimize" className="w-4" />
                    </button>

                </div>
            </div>
            <div className="select-text">
                {appComponent}
            </div>
        </div>
    )
}