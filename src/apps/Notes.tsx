import * as React from "jsx-dom";
import { useRef } from "jsx-dom";

export default function Notes({content}: any) {
    const notesRef = useRef<HTMLTextAreaElement>(null)

    return (
        <div
            className="w-full h-full flex flex-col justify-center items-center"
        >
            <textarea
            className="w-full h-[40vh] resize-none outline-none border-none text-lg text-gray-800 font-mono font-semibold overflow-auto  rounded-lg shadow-lg"
            id="note-text-area"
            ref={notesRef}
            value={content}
            />
        </div>
    )
}