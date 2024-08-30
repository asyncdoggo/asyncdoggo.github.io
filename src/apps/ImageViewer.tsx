import React from 'jsx-dom'

export default function ImageViewer({ image }: any) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <img src={image} alt="image" className="max-h-full max-w-full" />
        </div>
    )
}