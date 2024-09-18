import React from 'jsx-dom';


export default function IframeWindow({ src }: any) {
    return (
        <div>
            <a href={src} target="_blank" className="w-full underline hover:cursor-pointer">open in new tab?</a>
            <hr className="w-full" />
            <iframe src={src} className="w-full h-screen"></iframe>
        </div>
    )
}