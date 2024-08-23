import React from "jsx-dom";


export default function Notes({ content }: any) {
    return (
        <div
            className="w-full h-full flex flex-col justify-center items-center"
        >
            <div className="notes-container p-2 whitespace-pre-wrap h-[400px] overflow-y-auto outline-none"
                contentEditable
            >
                {content}
            </div>
        </div>
    )
}