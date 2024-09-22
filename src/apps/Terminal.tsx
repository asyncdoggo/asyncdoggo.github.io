import React, { useRef } from "jsx-dom";
import { Terminal } from "@xterm/xterm";
import { waitForElementFromRef } from "../globals";
import { CanvasAddon } from "@xterm/addon-canvas";
import { FitAddon } from "@xterm/addon-fit";

const commands = [
    {
        name: 'help',
        description: 'Get a list of commands'
    },
    {
        name: 'clear',
        description: 'Clear the terminal'
    },
    {
        name: 'echo',
        description: 'Echo the input'
    },
]


export default function TerminalApp() {

    const terminalRef = useRef<HTMLDivElement>(null)

    waitForElementFromRef(terminalRef, () => {
        let commandstring = ''

        const history: string[] = []
        let currentHistoryIndex = 0

        let cursorPos = 0


        const terminal = new Terminal(
            {
                cursorBlink: true,
                cursorStyle: 'underline',
                fontSize: 16,
                fontFamily: 'monospace',
                theme: {
                    background: '#000',
                    foreground: '#fff',
                },
            }
        )
        terminal.open(terminalRef.current!)
        terminal.loadAddon(new CanvasAddon())
        terminal.loadAddon(new FitAddon())


        terminal.writeln("Welcome to the terminal")
        terminal.writeln("Type 'help' to get a list of commands")
        terminal.writeln("Type 'clear' to clear the terminal")

        terminal.write("root> ")

        // terminal.onData((data) => {
        //     terminal.write(data)
        // })

        terminal.onKey(({ key, domEvent }) => {
            if (domEvent.key === 'Enter') {

                commandstring = commandstring.trim()
                const commandList = commandstring.split(' ')
                const command = commandList[0]
                const args = commandList.slice(1)


                terminal.writeln('')
                if (command === 'help') {
                    terminal.writeln('Commands:')
                    commands.forEach(cmd => {
                        terminal.writeln(`${cmd.name}: ${cmd.description}`)
                    })
                }
                else if (command === 'clear') {
                    terminal.clear()
                }
                else if (command === 'echo') {
                    terminal.writeln(args.join(' '))
                }
                else if (command === '') {
                    // terminal.write("root> ")
                }

                else {
                    terminal.writeln(`Command '${command}' not found`)
                }
                if (history[history.length - 1] !== command) {
                    history.push(commandstring)
                    currentHistoryIndex = history.length
                }

                commandstring = ''
                terminal.write("root> ")
            }

            else if (domEvent.key === 'Backspace') {
                if (terminal.buffer.active.cursorX > 6) {
                    commandstring = commandstring.slice(0, -1)
                    terminal.write('\b \b')
                }
            }
            else if (domEvent.key === 'ArrowUp') {
                // If history is empty do not move the cursor
                if (history.length !== 0) {
                    if (currentHistoryIndex > 0) {
                        currentHistoryIndex--
                    }
                    commandstring = history[currentHistoryIndex]
                    terminal.write('\r')
                    terminal.write('root> ')
                    terminal.write(commandstring)
                }
            }
            else if (domEvent.key === 'ArrowDown') {
                // If history is empty do not move the cursor
                if (history.length === 0) {
                    // Do nothing
                }
                else {
                    if (currentHistoryIndex < history.length - 1) {
                        currentHistoryIndex++
                    }
                    commandstring = history[currentHistoryIndex]
                    terminal.write('\r')
                    terminal.write('root> ')
                    terminal.write(commandstring)
                }
            }
            // Handle left and right arrow keys
            else if (domEvent.key === 'ArrowLeft') {
                // Set the cursor position to the left, but do not go beyond the prompt
                if (terminal.buffer.active.cursorX > 6) {
                    terminal.write('\b')
                }
            }
            else if (domEvent.key === 'ArrowRight') {
                // Set the cursor position to the right, but do not go beyond the end of the command
                if (terminal.buffer.active.cursorX < commandstring.length + 6) {
                    terminal.write(commandstring[terminal.buffer.active.cursorX - 6])
                }
            }

            else if (domEvent.key === 'Tab') { } // Do nothing for now

            // Handle ctrl + c
            else if (domEvent.ctrlKey && domEvent.key === 'c') {
                terminal.writeln('^C')
                commandstring = ''
                terminal.write("root> ")
            }



            else {
                cursorPos = terminal.buffer.active.cursorX
                const command_start = commandstring.slice(0, cursorPos - 6)
                const command_end = commandstring.slice(cursorPos - 6)
                terminal.write("\r")
                terminal.write("root> ")
                terminal.write(command_start + key + command_end)
                commandstring = command_start + key + command_end
                terminal.write("\b".repeat(command_end.length))

            }
        })

    })



    return (
        <div className="h-full w-full"
            id="terminal"
            ref={terminalRef}
        >
        </div>
    )
}