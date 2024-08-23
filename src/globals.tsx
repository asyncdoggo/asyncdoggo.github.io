

export const openApps: {name: string, icon: string, component: Window & typeof globalThis}[] = []

export let currentFocusedApp: string = "" 

export function setCurrentFocusedApp(c: string) {
    currentFocusedApp = c
}


export  function toggleMinimizeWindow(id: string) {
    const windowElement = document.getElementById(id)
    if(windowElement){
        if(windowElement.style.display === 'none'){
            windowElement.style.display = 'block'
        }
        else{
            windowElement.style.display = 'none'
        }
    }
}