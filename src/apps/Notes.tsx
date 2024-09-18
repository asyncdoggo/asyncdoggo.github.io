import React, { useRef } from "jsx-dom";
import { waitForElement } from "../globals";

export default function Notes() {
    return (
        <div
            className="w-full h-full flex flex-col justify-center items-center"
        >
            <NoteTextArea />
        </div>
    )
}

function NoteTextArea() {

    const notesRef = useRef<HTMLTextAreaElement>(null)

    waitForElement("#note-text-area", () => {

    })

    return (
        <textarea
            className="w-full h-[40vh] resize-none outline-none border-none text-lg text-gray-800 font-mono font-semibold overflow-auto select-text rounded-lg shadow-lg"
            id="note-text-area"
            ref={notesRef}
        />
    )

}