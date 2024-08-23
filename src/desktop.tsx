import React, { JSX } from 'jsx-dom';
import Taskbar, { updateTaskBar } from './taskbar';
import { openApps } from './globals';
import Window from './windowElement';



export default function Desktop() {
    return (
      <div className="desktop">
        <div className="Desktop-icons-grid">
            
            <button className="icon" onClick={() => startApplication('File Explorer', 'https://cdn-icons-png.flaticon.com/512/732/732221.png', <div>File Explorer</div>)}>
                <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="icon" className="h-12 w-12"/>
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