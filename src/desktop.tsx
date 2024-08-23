import React, { JSX } from 'jsx-dom';
import Taskbar, { updateTaskBar } from './taskbar';
import { openApps } from './globals';
import Window from './windowElement';
import file_manager from "./assets/file_manager.svg"
import FileManager from './FileManager';


export default function Desktop() {
    return (
      <div className="desktop">
        <div className="Desktop-icons-grid">
            
            <button className="icon" onClick={() => startApplication('File Explorer', file_manager, <FileManager />)}>
                <img src={file_manager} alt="File Explorer" className="h-16 w-16"/>
                <p>File Explorer</p>
            </button>
        </div>
        <Taskbar />
    </div>
    );
}


export function startApplication(appName: string, appIcon: string, appComponent: JSX.Element) {

    if(openApps.find(app => app.name === appName)){
        return
    }
    
    const desktop = document.querySelector('.desktop')
    if(desktop){
         
        desktop.appendChild(<Window appName={appName} appIcon={appIcon} appComponent={appComponent}/>)
        openApps.push({
            name: appName,
            icon: appIcon,
            component: window
        })

        updateTaskBar()
    }

    

}