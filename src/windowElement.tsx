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
        const rect = windowElement.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Disable pointer events on other elements during drag
        document.body.style.pointerEvents = 'none'
        windowElement.style.pointerEvents = 'auto'

        function mouseMoveHandler(e: MouseEvent) {
            let newLeft = e.clientX - x
            let newTop = e.clientY - y

            // Constrain to screen bounds
            if (newLeft < 0) newLeft = 0
            if (newTop < 0) newTop = 0
            if (newLeft + windowElement.offsetWidth > window.innerWidth) {
                newLeft = window.innerWidth - windowElement.offsetWidth
            }
            if (newTop + windowElement.offsetHeight > window.innerHeight) {
                newTop = window.innerHeight - windowElement.offsetHeight
            }

            // Instant position update
            windowElement.style.left = `${newLeft}px`
            windowElement.style.top = `${newTop}px`
        }

        function mouseUpHandler() {
            document.body.style.pointerEvents = 'auto'
            document.removeEventListener('mousemove', mouseMoveHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }

        document.addEventListener('mousemove', mouseMoveHandler, { passive: true })
        document.addEventListener('mouseup', mouseUpHandler, { once: true })
    }



    return (
        <div
            className="app-window fixed top-0 left-0 min-w-[200px] min-h-[200px] bg-white/95 backdrop-blur-lg rounded-xl resize overflow-auto select-none"
            ref={windowRef}
            id={appName}
            style={{ width, height }}
            onMouseDown={() => {
                setCurrentFocusedApp(appName)
            }}
        >
            <div
                className="title-bar flex justify-between items-center p-3 border-b border-gray-200 hover:cursor-move sticky bg-gradient-to-r from-slate-50 to-slate-100 z-10 top-0 rounded-t-xl"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center">
                    <img src={appIcon} alt="app-icon" className="h-5 w-5 flex-shrink-0" />
                    <h1 className="ml-3 text-sm font-semibold text-gray-800">{appName}</h1>
                </div>

                <div className="flex flex-row justify-center items-center gap-1">

                    <button
                        className="minimize w-8 h-8 flex justify-center items-center rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors"
                        onClick={() => toggleMinimizeWindow(appName)}
                        title="Minimize"
                    >
                        <img src={minimize} alt="minimize" className="w-4 h-4" />
                    </button>

                    <button
                        className="maximize w-8 h-8 flex justify-center items-center rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors"
                        onClick={() => toggleMaximizeWindow(appName)}
                        title="Maximize"
                    >
                        <img src={maximize} alt="resize" className="w-4 h-4" />
                    </button>

                    <button className="close-button w-8 h-8 flex justify-center items-center rounded-md hover:bg-red-100 active:bg-red-200 transition-colors"
                        onClick={() => closeWindow(appName)}
                        title="Close"
                    >
                        <img src={closebtn} alt="close" className="w-4 h-4" />
                    </button>

                </div>
            </div>
            <div className="select-text">
                {appComponent}
            </div>
        </div>
    )
}