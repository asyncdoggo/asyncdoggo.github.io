import React, { JSX } from 'jsx-dom';
import Taskbar, { updateTaskBar } from './taskbar';
import { openApps } from './globals';
import Window from './windowElement';
import file_manager_icon from "./assets/file_manager.svg"
import FileManager from './apps/FileManager';
import Tictactoe from './games/tictactoe';
import tictactoe_icon from './assets/tictactoe.svg';
import pong_icon from './assets/pong.svg';
import Pong from './games/pong';
import airhockey_icon from './assets/air_hockey.svg';
import AirHockey from './games/airhockey';

export default function Desktop() {
    return (
        <div className="desktop">
            <div className="Desktop-icons-grid flex flex-row gap-x-4 p-2">

                <button className="icon" onClick={() => startApplication('File Explorer', file_manager_icon, <FileManager />)}>
                    <img src={file_manager_icon} alt="File Explorer" className="h-16 w-16" />
                    <p>File Explorer</p>
                </button>
                <button className="icon" onClick={() => startApplication('TicTacToe', tictactoe_icon, <Tictactoe />, '600px', '600px')}>
                    <img src={tictactoe_icon} alt="TicTacToe" className="h-16 w-16" />
                    <p>TicTacToe</p>
                </button>
                <button className="icon" onClick={() => startApplication('Pong', pong_icon, <Pong />, '800px', '600px')}>
                    <img src={pong_icon} alt="Pong" className="h-16 w-16" />
                    <p>Pong</p>
                </button>
                <button className="icon" onClick={() => startApplication('Air Hockey', airhockey_icon, <AirHockey />, '600px', '800px')}>
                    <img src={airhockey_icon} alt="Air Hockey" className="h-16 w-16" />
                    <p>Air Hockey</p>
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
        console.log(appComponent);
        
        
        desktop.appendChild(<Window appName={appName} appIcon={appIcon} appComponent={appComponent} width={width} height={height} />)
        openApps.push({
            name: appName,
            icon: appIcon,
        })

        updateTaskBar()
    }



}