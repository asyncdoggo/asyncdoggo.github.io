import * as React from "jsx-dom";
import Taskbar, { updateTaskBar } from './taskbar';
import { openApps } from './globals';
import Window from './windowElement';
import file_manager_icon from "./assets/file_manager.svg"
import FileManager from './apps/FileManager';
import games_icon from './assets/games.svg';
import python from './assets/python.svg';
import PythonREPL from "./apps/Python";

export default function Desktop() {
    return (
        <div className="desktop">
            <div className="Desktop-icons-grid flex flex-row gap-x-4 p-4">

                <button className="icon w-24 h-16 flex flex-col justify-center items-center" onClick={() => startApplication('File Explorer', file_manager_icon, <FileManager />)}>
                    <img src={file_manager_icon} alt="File Explorer" className="h-16 w-16" />
                    <p className="text-white">File Explorer</p>
                </button>

                <button className="icon w-24 h-16 flex flex-col justify-center items-center" onClick={() => startApplication('Games', games_icon, <FileManager rootFolderName="Games" />)}>
                    <img src={games_icon} alt="Games" className="h-16 w-16" />
                    <p className="text-white">Games</p>
                </button>

                <button className="icon w-24 h-16 flex flex-col justify-center items-center" onClick={() => startApplication('Python', python, <PythonREPL />, "700px", "450px")}>
                    <img src={python} alt="Python" className="h-16 w-16" />
                    <p className="text-white">Python</p>
                </button>

            </div>
            <Taskbar />
        </div>
    );
}


export function startApplication(
    appName: string,
    appIcon: string,
    appComponent: React.JSX.Element,
    width?: string,
    height?: string,
) {

    if (openApps.find(app => app.name === appName)) {
        return
    }

    const desktop = document.querySelector('.desktop')
    if (desktop) {
        desktop.appendChild(<Window appName={appName} appIcon={appIcon} appComponent={appComponent} width={width} height={height} />)
        openApps.push({
            name: appName,
            icon: appIcon,
        })

        updateTaskBar()
    }



}