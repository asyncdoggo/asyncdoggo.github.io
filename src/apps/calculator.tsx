import * as React from "jsx-dom"
import { useRef } from "jsx-dom"
import { evaluate } from "mathjs"

const buttons = [
    { text: "C", type: "clear" },
    { text: "CE", type: "clear-entry" },
    { text: "%", type: "operator" },
    { text: "/", type: "operator" },
    { text: "7", type: "number" },
    { text: "8", type: "number" },
    { text: "9", type: "number" },
    { text: "*", type: "operator" },
    { text: "4", type: "number" },
    { text: "5", type: "number" },
    { text: "6", type: "number" },
    { text: "-", type: "operator" },
    { text: "1", type: "number" },
    { text: "2", type: "number" },
    { text: "3", type: "number" },
    { text: "+", type: "operator" },
    { text: "+/-", type: "operator" },
    { text: "0", type: "number" },
    { text: ".", type: "number" },
    { text: "=", type: "evaluate" },
]



export default function Calculator() {

    const textRef = useRef<HTMLParagraphElement>(null)

    const handleButtonClick = (button: any) => {
        const text = textRef.current!.textContent!
        if (button.type === "number") {
            textRef.current!.textContent = text + button.text
        }

        if (button.type === "operator") {
            if (button.text === "+/-") {
                textRef.current!.textContent = (parseFloat(text) * -1) as unknown as string
            } else {
                textRef.current!.textContent = text + button.text
            }
        }

        if (button.type === "clear") {
            textRef.current!.textContent = ""
        }

        if (button.type === "clear-entry") {
            textRef.current!.textContent = text.slice(0, -1)
        }

        if (button.type === "evaluate") {
            try {
                const result = evaluate(text)
                textRef.current!.textContent = result
            } catch (error) {
                textRef.current!.textContent = "Error"
            }
        }
    }


    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="calculator bg-white w-[300px] h-[400px] flex flex-col justify-center items-center">
                <div className="calculator-display w-full h-16 bg-gray-100 flex justify-end items-center px-2">
                    <
                        p className="text-2xl font-mono font-semibold text-gray-800"
                        ref={textRef}
                    >
                    </p>
                </div>
                <div className="calculator-buttons w-full h-full grid grid-cols-4 grid-rows-5 gap-1 p-1">
                    {
                        buttons.map((button) => {
                            return (
                                <button
                                    className="calculator-button bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono font-semibold text-2xl rounded-lg"
                                    onClick={() => handleButtonClick(button)}
                                >{button.text}</button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
