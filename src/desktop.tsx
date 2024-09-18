import React, { JSX } from 'jsx-dom';
import Taskbar, { updateTaskBar } from './taskbar';
import { openApps } from './globals';
import Window from './windowElement';
import file_manager_icon from "./assets/file_manager.svg"
import FileManager from './apps/FileManager';
import games_icon from './assets/games.svg';

export default function Desktop() {
    return (
        <div className="desktop">
            <div className="Desktop-icons-grid flex flex-row gap-x-4 p-2">

                <button className="icon" onClick={() => startApplication('File Explorer', file_manager_icon, <FileManager />)}>
                    <img src={file_manager_icon} alt="File Explorer" className="h-16 w-16" />
                    <p>File Explorer</p>
                </button>

                <button className="icon" onClick={() => startApplication('Games', games_icon, <FileManager rootFolderName="Games" />)}>
                    <img src={games_icon} alt="Games" className="h-16 w-16" />
                    <p>Games</p>
                </button>


            </div>
            <Taskbar />
        </div>
    );
}


export function startApplication(
    appName: string,
    appIcon: string,
    appComponent: JSX.Element,
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