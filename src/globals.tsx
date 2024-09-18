export const openApps: {
    name: string,
    icon: string,

}[] = []

export let currentFocusedApp: string = ""

export const removeCurrentFocusedApp = () => {
    currentFocusedApp = ""
}


export function setCurrentFocusedApp(id: string) {
    if (currentFocusedApp) {
        const f = document.getElementById(currentFocusedApp)
        f!.style.zIndex = "0"
    }
    const windowElement = document.getElementById(id)!
    windowElement.style.zIndex = "800"
    currentFocusedApp = id
}


export function toggleMinimizeWindow(id: string) {
    setCurrentFocusedApp(id)
    const windowElement = document.getElementById(id)
    if (windowElement) {
        if (windowElement.style.display === 'none') {
            windowElement.style.display = 'block'

        }
        else {
            windowElement.style.display = 'none'
        }
    }
}


export function toggleMaximizeWindow(id: string) {
    const windowElement = document.getElementById(id)!

    if (windowElement.style.width === '100%') {
        windowElement.style.width = '400px'
        windowElement.style.height = '400px'
    }
    else {
        windowElement.style.top = '0'
        windowElement.style.left = '0'
        windowElement.style.width = '100%'

        const browserHeight = window.innerHeight
        const taskbarHeight = document.getElementById('taskbar_main')!.clientHeight
        windowElement.style.height = `${browserHeight - taskbarHeight}px`
    }
}



export function waitForElement(selector: string, callback: any) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(() => {
            waitForElement(selector, callback);
        }, 100);
    }
}



export const waitForElementFromRef = (ref:any, callback:any) => {
    const interval = setInterval(() => {        
        if (ref.current) {
            clearInterval(interval);
            callback();
        }
    }, 100);
};